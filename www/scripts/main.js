
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

  chargesSociales: {
      securiteSociale: {
        cotisationSurLaTotaliteDuSalaire: {
          taux: 0.004
        },
        cotisationPlafonee
      }
  }
}

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
