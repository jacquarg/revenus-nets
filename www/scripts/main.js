
const data = {
  chiffreAffaire: 10000,
  revenuNet: 0,
  salaireBrut: 3564.76,//3179,
}


// https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-employeurs/les-taux-de-cotisations-de-droit.html
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
  smic: 1521.22,
  pss: 3377,
  assuranceMaladie: {
    note: "Base salaire BRUT",
    segments: [
      {
        label: "<2,5 smics ex-CICE",
        taux: 0.073,
        min: 0,
        max: 3804.42,//2.5 * 1521.22,
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
          label: "Au dela 1.90",
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
  atmp: {
    label: "Accidents du travail (AT) et maladies professionnelles (MP)",
    note: "Taux assigné à chaque entreprises par la  Carsat. Cotisation employeur sur la totalité du salaire.",
    taux: 0.009
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
        max: null
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
  csg: {
    note: "Une part de la csg sera déductibles d'impôts sur le revenu. C'est une cotisation salariale. La base de calcul est le salaire BRUT, plus certaines prestations complémentaires de santé et prévoyance. Un abatement de 1,75% est appliqué à la base de calcul, sur les 4 premier PSS",
    taux: 0.092,
    tauxImposable: 0.024,
    tauxNonImposable: 0.068,
    tranches: [
      {
        label: "Abatement de 1,75% en dessous de 4 PSS",
        taux: 0.09039, // 9.20% * (1 - 1,75%) = 9.039%
        min: 0,
        max: 13508 // 4 * pss
      },
      {
        label: "Assiète globale au delà de 4 PSS",
        taux: 0.092,
        min: 13508,
        max: null // 4 * pss
      }
    ],
  },
  crds: {
    note: "Base de calcul identique à la CSG",
    taux: 0.005,
    tranches: [
      {
        label: "Abatement de 1,75% en dessous de 4 PSS",
        taux: 0.0046125, // 0.50% * (1 - 1,75%) = 0.49125%
        min: 0,
        max: 13508 // 4 * pss
      },
      {
        label: "Assiète globale au delà de 4 PSS",
        taux: 0.005,
        min: 13508,
        max: null // 4 * pss
      }
    ]
  },
  versementTransport: {
    note: "Pour entreprises de 11 salariés et plus."
  },
  forfaitSocial: {
    taux: 0.2
  },
  ceg: {
    label: "Contribution d'équilibre général",
    employeur: {
      tranches: [
        {
          label: "Tranche 1: de 0 à 1 PSS",
          taux: 0.0129,
          min: 0,
          max: 3377 // 1 * pss
        },
        {
          label: "Tranche 2 : de 1 à 8 PSS",
          taux: 0.0162,
          min: 3377,
          max: 27016 // 8 * pss
        },
        {
          label: "Exonéré au delà",
          taux: 0,
          min: 27016,
          max: null // 4 * pss
        }
      ]
    },
    salarie: {
      tranches: [
        {
          label: "Tanche 1: de 0 à 1 PSS",
          taux: 0.0086,
          min: 0,
          max: 3377 // 1 * pss
        },
        {
          label: "Tranche 2 : de 1 à 8 PSS",
          taux: 0.0108,
          min: 3377,
          max: 27016 // 8 * pss
        },
        {
          label: "Exonéré au delà",
          taux: 0,
          min: 27016,
          max: null // 4 * pss
        }
      ]
    }
  },
  retraiteComplementaire: {
    label: "Agirc arco",
    employeur: {
      tranches: [
        {
          label: "Tanche 1: de 0 à 1 PSS",
          taux: 0.0472,
          min: 0,
          max: 3377 // 1 * pss
        },
        {
          label: "Tranche 2 : de 1 à 8 PSS",
          taux: 0.1295,
          min: 3377,
          max: 27016 // 8 * pss
        },
        {
          label: "Exonéré au delà",
          taux: 0,
          min: 27016,
          max: null // 4 * pss
        }
      ]
    },
    salarie: {
      tranches: [
        {
          label: "Tanche 1: de 0 à 1 PSS",
          taux: 0.0315,
          min: 0,
          max: 3377 // 1 * pss
        },
        {
          label: "Tranche 2 : de 1 à 8 PSS",
          taux: 0.0864,
          min: 3377,
          max: 27016 // 8 * pss
        },
        {
          label: "Exonéré au delà",
          taux: 0,
          min: 27016,
          max: null // 4 * pss
        }
      ]
    }
  },
  prevoyance: {
    notes: "MM, taux employeur et salariés sur 2 tranches.",
    employeur: {
      tranches: [
        {
          label: "Tanche 1: de 0 à 1 PSS",
          taux: 0.0037,
          min: 0,
          max: 3377 // 1 * pss
        },
        {
          label: "Tranche 2 : de 1 à 8 PSS",
          taux: 0.0057,
          min: 3377,
          max: 27016 // 8 * pss
        },
        {
          label: "Exonéré au delà",
          taux: 0,
          min: 27016,
          max: null // 4 * pss
        }
      ]
    },
    salarie: {
      tranches: [
        {
          label: "Tanche 1: de 0 à 1 PSS",
          taux: 0.0037,
          min: 0,
          max: 3377 // 1 * pss
        },
        {
          label: "Tranche 2 : de 1 à 8 PSS",
          taux: 0.0057,
          min: 3377,
          max: 27016 // 8 * pss
        },
        {
          label: "Exonéré au delà",
          taux: 0,
          min: 27016,
          max: null // 4 * pss
        }
      ]
    },
  },
  soinsSante: {
    notes: "Alptis, forfait.",
    forfait: 43.59,
  },

  csgCrdsNonDeductible: {
    note: "Une part de la csg sera déductibles d'impôts sur le revenu. C'est une cotisation salariale. La base de calcul est le salaire BRUT, plus certaines prestations complémentaires de santé et prévoyance. Un abatement de 1,75% est appliqué à la base de calcul, sur les 4 premier PSS",
    taux: 0.092,
    tauxImposable: 0.024,
    tauxNonImposable: 0.068,
    tranches: [
      {
        label: "Abatement de 1,75% en dessous de 4 PSS",
        taux: 0.0284925, // (0,5% + 2,4%) * (1 - 1,75%) = 2.84925%
        min: 0,
        max: 13508 // 4 * pss
      },
      {
        label: "Assiète globale au delà de 4 PSS",
        taux: 0.029,
        min: 13508,
        max: null // 4 * pss
      }
    ],
  },

  csgDeductible: {
    note: "Une part de la csg sera déductibles d'impôts sur le revenu. C'est une cotisation salariale. La base de calcul est le salaire BRUT, plus certaines prestations complémentaires de santé et prévoyance. Un abatement de 1,75% est appliqué à la base de calcul, sur les 4 premier PSS",
    taux: 0.092,
    tauxImposable: 0.024,
    tauxNonImposable: 0.068,
    tranches: [
      {
        label: "Abatement de 1,75% en dessous de 4 PSS",
        taux: 0.06681, // 6.8% * (1 - 1,75%) = 6.681%
        min: 0,
        max: 13508 // 4 * pss
      },
      {
        label: "Assiète globale au delà de 4 PSS",
        taux: 0.068,
        min: 13508,
        max: null // 4 * pss
      }
    ],
  },


  // Impots revenus
  ir: {
    label: "Impôt sur le revenu",
    tranches: [
      {
        taux: 0,
        min: 0,
        max: 9964
      },
      {
        taux: 0.14,
        min: 9965,
        max: 27519
      },
      {
        taux: 0.3,
        min: 27520,
        max: 73779
      },
      {
        taux: 0.41,
        min: 73780,
        max: 156244
      },
      {
        taux: 0.45,
        min: 156245,
        max: null
      },
    ]
  },
//
//
// Plus de 156 245 €
//
//
// 45 %
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

const computeSalaire = (data) => {}
  // Cout = Net + Cot_Sal + Cot_Pat

  // {
  //  Brut = Net + Cot_Sal
  //  Sal = Brut * S_tx_Sal // Z : S_tx_Sal non linéaire !!
  // }
  // =>
  //  Brut = Net / (1 - S_tx_Sal)

  // const salaireBrut = 2000÷

  const computeCoutEntreprise = (data) => {
    const salaireBrut = data.salaireBrut
    let cotisations = computeSegment(salaireBrut, bareme.assuranceMaladie.segments)
    cotisations += computeTranche(salaireBrut, bareme.assuranceViellesse.employeur.tranches)
    cotisations += computeSegment(salaireBrut, bareme.allocationsFamilliales.segments)

    console.log(`Costisations patronales SS: ${cotisations}`)


    cotisations += salaireBrut * bareme.contributionPatronaleDialogueSocial.taux

    cotisations += computeTranche(salaireBrut, bareme.ags.tranches)
    cotisations += salaireBrut * bareme.atmp.taux
    cotisations += computeTranche(salaireBrut, bareme.chomage.tranches)
    cotisations += salaireBrut * bareme.fnal.taux
    cotisations += computeTranche(salaireBrut, bareme.ceg.employeur.tranches)
    cotisations += computeTranche(salaireBrut, bareme.retraiteComplementaire.employeur.tranches)
    cotisations += computeTranche(salaireBrut, bareme.prevoyance.employeur.tranches)
    cotisations += bareme.soinsSante.forfait

    console.log(`Costisations patronales : ${cotisations}`)
    return salaireBrut + cotisations
  }

  const computeSalaireNet = (data) => {
    const salaireBrut = data.salaireBrut
    let cotisations = computeTranche(salaireBrut, bareme.assuranceViellesse.salarie.tranches)

    console.log(`Costisations salariales SS: ${cotisations}`)


    cotisations += computeTranche(salaireBrut, bareme.prevoyance.salarie.tranches)
    cotisations += computeTranche(salaireBrut, bareme.ceg.salarie.tranches)
    cotisations += computeTranche(salaireBrut, bareme.retraiteComplementaire.salarie.tranches)

    // TODO: csg crds, inclure d'autre élément patronaux dans la base de calcul ?
    let baseCSG = salaireBrut
    // TODO: à factoriser !
    baseCSG += computeTranche(salaireBrut, bareme.prevoyance.employeur.tranches)
    baseCSG += bareme.soinsSante.forfait

    cotisations += computeTranche(baseCSG, bareme.csg.tranches)
    cotisations += computeTranche(baseCSG, bareme.crds.tranches)

    console.log(`Costisations salariales : ${cotisations}`)
    return salaireBrut - cotisations
  }

  const computeSalaireNetImposable = (data) => {
    const salaireBrut = data.salaireBrut
    const salaireNet = data.salaireNet

    let netImposable = salaireNet
    let cotisations = 0
    cotisations += computeTranche(salaireBrut, bareme.prevoyance.employeur.tranches)
    cotisations += computeTranche(salaireBrut, bareme.prevoyance.salarie.tranches)
    cotisations += bareme.soinsSante.forfait

    // cotisations += computeTranche(salaireBrut, bareme.retraiteComplementaire.salarie.tranches)
// cotisations += computeTranche(salaireBrut, bareme.ceg.salarie.tranches)

    let baseCSG = salaireBrut
    // TODO: à factoriser !
    baseCSG += computeTranche(salaireBrut, bareme.prevoyance.employeur.tranches)
    baseCSG += bareme.soinsSante.forfait
    cotisations += computeTranche(baseCSG, bareme.csgCrdsNonDeductible.tranches)

    console.log(`Costisations net imposable : ${cotisations}`)
    return salaireNet + cotisations
  }

const computeSalaireNetImposable2 = (data) => {
    const salaireBrut = data.salaireBrut

    let netImposable = data.salaireBrut
    netImposable -= computeTranche(salaireBrut, bareme.assuranceViellesse.salarie.tranches)


    // netImposable -= computeTranche(salaireBrut, bareme.prevoyance.salarie.tranches)
    netImposable -= computeTranche(salaireBrut, bareme.ceg.salarie.tranches)
    netImposable -= computeTranche(salaireBrut, bareme.retraiteComplementaire.salarie.tranches)

    // TODO: csg crds, inclure d'autre élément patronaux dans la base de calcul ?
    let baseCSG = salaireBrut
    // TODO: à factoriser !
    baseCSG += computeTranche(salaireBrut, bareme.prevoyance.employeur.tranches)
    baseCSG += bareme.soinsSante.forfait

    netImposable -= computeTranche(baseCSG, bareme.csgDeductible.tranches)

    netImposable += bareme.soinsSante.forfait
    netImposable += computeTranche(salaireBrut, bareme.prevoyance.employeur.tranches)

    // console.log(`Costisations net imposable : ${cotisations}`)
    return netImposable
}


const compute = () => {
  computeBenefice(data)
  computeBeneficeApresIS(data)
  computeDividendesFlatTax(data)
  data.revenuNet = data.dividendesNet

  data.salaireNet = computeSalaireNet(data)
  data.coutEntreprise = computeCoutEntreprise(data)
  data.netImposable = computeSalaireNetImposable2(data)
  console.log(data.netImposable)
}

const render = () => {
  $('#revenuNet').text(data.revenuNet)
  $('#salaireNet').text(data.salaireNet)
  $('#salaireBrut').text(data.salaireBrut)
  $('#coutEntreprise').text(data.coutEntreprise)
}

compute()
render()

///////////////////////////////////////////////////////////
// Tools

function computeSegment(base, segments) {
  for (let segment of segments) {
    if (base >= segment.min && (segment.max == null || base < segment.max)) {
      return base * segment.taux
    }
  }
  // TODO: throw error !
  return 0
}

function computeTranche(base, tranches) {
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
