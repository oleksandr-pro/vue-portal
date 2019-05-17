const listing = {
  title: `View Float Account/Invoice`,
  tips: {
    line1: `Here you can view the following:`,
    li1: `Pending – If there are Debit or Credit waiting to be approved for the Float Account`,
    li2: `View Statement - View the Balance of the Float Account`,
    li3: `Setup - Debit or Credit the Float Account`,
    li4: `Approve – Approve or Decline Credit or Debit to Float Account`,
    li5: `View Invoice – If the Reseller has chosen to pay by Invoice`
  },
  search_filter: {
    currency: `Currency`,
    reseller_status: `Reseller Status`,
    card_program: `Card Program`,
    reseller: `Reseller`
  },
  button: {
    view: `View`,
    view_statement: `View Statement`,
    setup: `Setup`,
    approve: `Approve`,
    view_invoice: `View Invoice`
  },
  table_header: {
    card_prog_code: `CPC`,
    reseller_code: `RC`,
    reseller_name: `Reseller Name`,
    amount: `Float Amount`,
    reseller_status: `status`,
    has_pending_debit_or_credit: `Pending`
  }
}
export default {
  listing
}