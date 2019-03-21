
const data = {
  chiffreAffaire: 10000,
  revenuNet: 0
}

const bareme = {
  tva: { taux: 0.2 },
  impotSocietes: {
    source: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23575",
    tranches: [{
      label: "Taux réduit 15%",
      taux: 0.15,
      min: 0,
      max: 38120,
    },
    {
      label: "Taux réduit 28%",
      taux: 0.28,
      min: 38120,
      max: 500000,
    },
    {
      label: "Taux normal",
      taux: 0.3333,
      min: 500000,
      max: null,
    }]
  },

  pfu: {
    source: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F32963",
    label: 'Prélèvement forfaitaire unique (PFU) ou "flat tax"',
    prelevementSociaux: {
      taux: 0.172
    },
    impotRevenu: {
      taux: 0.128
    }
    // Ou option : abatement de 40%; puis intégration au barème de l'IR.
  },

// https://www.urssaf.fr/portail/home/employeur/calculer-les-cotisations/les-taux-de-cotisations.html
// https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-employeurs/les-taux-de-cotisations-de-droit.html
  smic: 1 521.22,
  pss: 3377,
  assuranceMaladie: {
    note: "Base salaire BRUT",
    segments: [
      {
        label: "<2,5 smics ex-CICE",
        taux: 0.073,
        min: 0,
        max:  3804.42,//2.5 * 1521.22,
        // 2,5 * le smic.
      },
      {
        label: "> 2,5",
        taux: 0.133,
        min: 3804.42,
        max: null
      }
    ]
  },
  assuranceViellesse: {
    note: "Base salaire BRUT",
    employeur: {
      //plafonné et sur la rémunération total
      tranches: [
        {
          label: "Jusqu'au PSS : plafonné + total = 8,55 + 1.90",
          taux: 0.1045,
          min: 0,
          max: 3377,
        },
        {
          label: "Au dela1.90",
          taux: 0.019,
          min: 3377,
          max: null
        }
      ]
    },
    salarie: {
      //plafonné et sur la rémunération total
      tranches: [
        {
          label: "Jusqu'au PSS : plafonné + total = 6,90 + 0,4",
          taux: 0.073,
          min: 0,
          max: 3377,
        },
        {
          label: "Au dela 0,4",
          taux: 0.004,
          min: 3377,
          max: null
        }
      ]
    }
  },
  allocationsFamilliales: {
    note: "Base salaire BRUT",
    segments: [
      {
        label: "<3,5 smics",
        taux: 0.0345,
        min: 0,
        max: 5324.27, //3.5 * 1521.22,
        // 2,5 * le smic.
      },
      {
        label: "> 3,5",
        taux: 0.133,
        min: 5324.27, //3.5 * 1521.22,
        max: null
      }
    ]
  },
  contributionPatronaleDialogueSocial: {
    taux: 0.00016
  },
  fnal: {
    label: "moins de 20 salariés",
    taux: 0.001
  },
  chomage: {
    tranches: [
      {
        label: "Dûe jusqu'à 4 plafond de la sécurité sociale",
        taux: 0.0405,
        min: 0,
        max: 13508 // 4 * pss
      },
      {
        label: "Exonéré au delà de 4 PSS",
        taux: 0,
        min: 13508,
        max: null // 4 * pss
      }
    ]
  },
  ags: {
    tranches: [
      {
        label: "Dûe jusqu'à 4 plafond de la sécurité sociale",
        taux: 0.0015,
        min: 0,
        max: 13508 // 4 * pss
      },
      {
        label: "Exonéré au delà de 4 PSS",
        taux: 0,
        min: 13508,
        max: null // 4 * pss
      }
    ]
  },
  forfaitSocial: {
    taux: 0.2
  },
  retraiteComplementaire: {

  },
  prevoyance: {

  },
}


//   chargesSociales: {
//       securiteSociale: {
//         cotisationSurLaTotaliteDuSalaire: {
//           taux: 0.004
//         },
//         cotisationPlafonee
//       }
//   }
// }

const computeBenefice = (data) => {
  data.benefice = data.chiffreAffaire * (1 - bareme.tva.taux)
}

const computeBeneficeApresIS = (data) => {
  let is = bareme.impotSocietes.tranches.reduce((is, tranche) => {
    if (data.benefice < tranche.min) {
      return is
    } else if (data.benefice >= tranche.max) {
      return is + (tranche.max - tranche.min) * tranche.taux
    } else {
      return is + (data.benefice - tranche.min) * tranche.taux
    }
  }, 0)

  data.beneficeApresIS = data.benefice - is
}

const computeDividendesFlatTax = (data) => {
  data.dividendesNet = data.beneficeApresIS * (1 - bareme.pfu.prelevementSociaux.taux - bareme.pfu.impotRevenu.taux)
}

const computeSalaire = (data) => {
  // Cout = Net + Cot_Sal + Cot_Pat

  // {
  //  Brut = Net + Cot_Sal
  //  Sal = Brut * S_tx_Sal // Z : S_tx_Sal non linéaire !!
  // }
  // =>
  //  Brut = Net / (1 - S_tx_Sal)

  const salaireBrut = 2000

  const computeCoutEntreprise = (data) => {
    const salaireBrut = data.salaireBrut
    let cotisations = computeSegment(salaireBrut, bareme.assuranceMaladie.segments)
    cotisations += computeTranche(salaireBrut, bareme.assuranceViellesse.employeur.tranches)
    cotisations += computeSegment(salaireBrut, bareme.allocationsFamilliales.segments)
    cotisation += salaireBrut * bareme.contributionPatronaleDialogueSocial.taux
    // TODO: accident travail, versement transport
    cotisation += salaireBrut * bareme.fnal.taux

    return salaireBrut + cotisations
  }

  const computeSalaireNet = (data) => {
    const salaireBrut = data.salaireBrut

    let cotisations = computeTranche(salaireBrut, bareme.assuranceViellesse.salarie.tranches)
    // TODO: accidents travail, csg, crds, versement transport
    cotisation += computeTranche(salaireBrut, bareme.chomage.tranches)
    cotisation += salaireBrut * bareme.ags.taux

    return salaireBrut - cotisations
  }

}



const compute = () => {
  computeBenefice(data)
  computeBeneficeApresIS(data)
  computeDividendesFlatTax(data)
  data.revenuNet = data.dividendesNet
}

const render = () => {
  $('#revenuNet').text(data.revenuNet)
}

compute()
render()


// Tools

const computeSegment(base, segments) {
  for (let segment in segments) {
    if (base >= segment.min && (segment.max == null || base < segment.max)) {
      return base * segment.taux
    }
  }
  // TODO: throw error !
  return 0
}

const computeTranche(base, tranches) {
  return tranches.reduce((res, tranche) => {
    if (base < tranche.min) {
      return res
    } else if (base >= tranche.max) {
      return res + (tranche.max - tranche.min) * tranche.taux
    } else {
      return res + (base - tranche.min) * tranche.taux
    }
  }, 0)
}
