const listing = {
  title: `view resellers`,
  tips: {
    line1: `Choose from the resellers below which one you want to look at. You can show more than 10 results per page by clicking on the Page Size`,
    line2: `The options for each program are:`,
    li1: `View Invoice - If a Reseller program is using Invoices to pay any fees associated with the card program then here is where you can view the Invoice for those fees`,
    li2: `View Reseller – To view the attributes of that Reseller program on the system`,
    li3: `Edit Reseller – To be able to edit any attribute of that Reseller program`
  },
  table_header: {
    card_program_id: 'CPC',
    reseller_code: 'RC',
    reseller_name: 'Reseller Name'
  },
  button: {
    view_invoice: `View Invoice`,
    view_reseller: `View Reseller`,
    edit_reseller: `Edit Reseller`
  },
  no_data: {
    message: `Its seems you didn't add anything yet!`,
    button: `Create Card Reseller`
  }
}

const create = {
  title: `{action} reseller subscription`,
  tips: {
    create: {
      line1: `Before creating a new Reseller, ensure that you have the RSF Form available and confirm the following steps before creating a new Reseller.`
    },
    edit: {
      line1: `Before editing a reseller please ensure you have the resellers consent to perform changes`,
      li1: `All fields with a Red Asterisk are mandatory`,
      li2: `Once finished Editing please press 'SAVE' Or if you wish to exit without any changes please press 'CANCEL'`
    },
    view: {
      line1: `Please ensure all choices are correct for the reseller`,
      li1: `To change any attribute of a reseller please click on 'Edit'`,
      li2: `To leave without any changes please click on 'Cancel'`
    }
  },
  common: {
    required_fields: `Required fields`
  },
  button: {
    edit: 'EDIT',
    save: 'SAVE',
    cancel: 'Cancel'
  },
  table_header: {
    card_program_id: 'CPC',
    reseller_code: 'RC',
    reseller_name: 'Reseller Name',
    unique_float: 'Unique Float',
    alert_contact: 'Alert Contact',
    status: 'Status',
    load_fee: 'Load Fee',
    load_fee_pct: 'Load Fee Percentage',
    load_fee_cap: 'Load Fee Roof',
    load_fee_bill_method: 'Charged To',
    app_fee: 'Application Fee',
    app_fee_bill_method: 'Charged To',
    monthly_fee: 'Monthly Fee',
    monthly_fee_bill_method: 'Charged To',
    api_fee: 'API Fee',
    api_fee_bill_method: 'Charged To'
  },
  result_modal: {
    message: {
      create: 'created new card reseller sub successfully',
      edit: 'edited successfully'
    },
    copy: 'Any changes will be discarded',
    main_button: 'OK'
  },
  discard_modal: {
    message: 'discard changes?',
    copy: 'Any changes will be discarded',
    main_button: 'Ok',
    secondary_button: 'No'
  },
  confirm_modal: {
    message: {
      create: 'Do you want to create new reseller subscription?',
      edit: 'Do you want to save the changes'
    },
    copy: {
      create: '',
      edit: 'You will not be able to recover the changes!'
    },
    main_button: 'Yes',
    secondary_button: 'No'
  },
  toast: {
    error: 'Please ensure you complete all fields correctly.'
  }
}

export default {
  listing,
  create
}