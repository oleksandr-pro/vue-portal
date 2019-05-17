const listing = {
  title: `Card Programs`,
  tips: {
    line1: `Choose from the card programs below which one you want to look at. You can show more than 10 results per page by clicking on the Page Size`,
    line2: `The options for each program are:`,
    li1: `Edit – To be able to edit any attribute of that card program`,
    li2: `View – To view the attributes of that card program`
  },
  button: {
    edit: `Edit`,
    view: `View`
  },
  table_header: {
    psf_ref: `psf Ref`,
    issuer_inst: `issuer Inst`,
    pm_inst: `PM Inst`,
    po_inst: `PO Inst`,
    card_prog_code: `CPC`,
    card_prog_desc: `Card Program Description`
  }
}

const create = {
  title: `{action} Card Program`,
  tips: {
    create: {
      line1: `Before creating a new card program, ensure that you have the Prepaid Setup Form available`,
      line2: `and confirm the following steps before creating a new card program.`,
      li1: `PSF is signed by Program Manager, Issuer and Processor`,
      li2: `Confirm Inst codes used in the PSF are registered on the system (see inst code setup form)`
    },
    edit: {
      line1: `Before editing a card program please ensure you have the card programs owners consent to perform changes`,
      li1: `All fields with a Red Asterisk are mandatory`
    },
    view: {
      line1: `Please ensure all choices are correct for you program`,
      li1: `To change any attribute of a card program please click on 'Edit'`,
      li2: `To leave without any changes please click on 'Back'`
    }
  },
  common: {
    required_fields: `Required fields`
  },
  table_header: {
    psf_ref: `psf Ref`,
    issuer_inst: `issuer Inst`,
    pm_inst: `PM Inst`,
    po_inst: `PO Inst`,
    card_prog_code: `CPC`,
    card_prog_desc: `card program description`,
    card_printer_code: `Bureau inst code`,
    def_currency: `default currency`,
    alert_contact: `alert contact e-mail`,
    load_fee: `load fee`,
    load_fee_pct: `load fee %`,
    load_fee_cap: `load fee roof`,
    load_fee_bill_method: `Charged To`,
    app_fee: `application fee`,
    app_fee_bill_method: `Charged To`,
    monthly_fee: `monthly fee`,
    monthly_fee_bill_method: `Charged To`,
    api_fee: `api fee`,
    api_fee_bill_method: `Charged To`,
    kyc_classifier: `KYC class`,
    matrix_pid: `matrix PID`
  },
  button: {
    back: `Back`,
    cancel: `Cancel`,
    edit: `Edit`,
    save: `Save`
  }
}

export default {
  listing,
  create
}