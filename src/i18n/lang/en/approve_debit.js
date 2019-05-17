const listing = {
  title: `Approve Debit/Credit`,
  tips: {
    line1: `Here you can Approve or Decline a Debit or Credit that has been sent to the Float Account`
  },
  search_filter: {
    card_program: `Card Program`
  },
  table_header: {
    card_prog_code: `CPC`,
    reseller_code: `RC`,
    reseller_name: `Reseller Name`,
    submit_user: `Setup By`,
    entry_type: `Charge Type`,
    entry_desc: `Description`,
    amount: `Float Amount`,
    with_sof: `Has sof docs`
  },
  button: {
    approve: `Approve`,
    decline: `Decline`,
    sof: `SOF`
  },
  confirm_modal: {
    approve: {
      message: `Confirm approval of float adjustment`,
      copy: `any changes will be discarded`,
      main_button: `Approve`,
      secondary_button: `Cancel`
    },
    decline: {
      message: `Reason for declining float`,
      copy: `any changes will be discarded`,
      main_button: `Confirm`,
      secondary_button: `Cancel`
    }
  },
  toast: {
    approve: {
      success: `Approved successfully`,
      fail: `Approval failed`
    },
    decline: {
      success: `declined successfully`,
      fail: `There is an error, the system has failed to decline this Debit. Please try again. If the problem persists contact Technical Support`
    }
    
    
  }
}

export default {
  listing
}