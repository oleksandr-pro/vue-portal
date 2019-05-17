const listing = {
  title: `Review Debit/Credit`,
  tips: {
    line1: `Here you can review any Debit or Credit added to the Float Account`,
    li1: `Enter the correct dates and Card program (fields marked with * are Mandatory)`
  },
  search_filter: {
    from: `From`,
    to: `To`,
    card_program: `Card Program`,
    reseller: `Reseller`
  },
  table_header: {
    card_prog_code: `CPC`,
    reseller_code: `RC`,
    reseller_name: `Reseller Name`,
    created_by: `Setup By`,
    review_user: `Decision By`,
    entry_type: `Charge Type`,
    review_date: `Review Date`,
    entry_desc: `Description`,
    amount: `Amount`,
    status: `Action`,
    comment: `comment`,
    sof_doc: `SOF DOC`
  },
  button: {
    sof: 'SOF',
    download: 'Download'
  }
}

export default {
  listing
}