const listing = {
  title: `Reseller's Invoice`,
  tips: {
    line1: `Choose the dates that you wish to see the Invoice for on the desired Reseller and the system will show you if there is any data for Invoices for that period`
  },
  table_header: {
    card_prog_code: `CPC`,
    reseller_code: `RC`,
    reseller_name: `Reseller Name`,
    timestamp: `Time Stamp`,
    charge_type: `Charge Type`,
    item_desc: `Description`,
    item_amount: `Amount`
  }
}

const search_filter = {
  label: {
    card_program_code: `Card Program Code:`,
    reseller_code: `Reseller Code:`,
    currency_code: `Currency Code:`,
    from: `From`,
    to: `To`
  },
  button: {
    search: `Search`
  }
}

export default {
  listing,
  search_filter
}