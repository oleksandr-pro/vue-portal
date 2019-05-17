import permission from '@/constants/permission'
export default [
  {
    name: 'Card Program',
    i18n: 'menu.card_program',
    permission: permission.NAV_CARD_PROGRAM,
    image: 'ic_card.svg',
    icon: 'ti-panel',
    collapsed: true,
    children: [
      {
        name: 'Create card program',
        path: '/card-program/create',
        i18n: 'menu.create_card_program',
        permission: permission.CARD_PROGRAM_EDIT
      },
      {
        name: 'View Card Programs',
        path: '/card-program/view',
        i18n: 'menu.view_card_programs',
        permission: permission.CARD_PROGRAM_VIEW
      }
    ]
  },
  {
    name: 'Reseller',
    i18n: 'menu.reseller',
    permission: permission.NAV_RESELLER,
    icon: 'ti-panel',
    image: 'ic_reseller.svg',
    collapsed: true,
    children: [
      {
        name: 'Create Reseller',
        path: '/reseller/create',
        i18n: 'menu.create_reseller',
        permission: permission.RESELLER_SUBSCRIPTION_EDIT
      },
      {
        name: 'View Reseller',
        path: '/reseller/view',
        i18n: 'menu.view_reseller',
        permission: permission.RESELLER_SUBSCRIPTION_VIEW
      }
    ]
  },
  {
    name: 'Float Balance',
    i18n: 'menu.float_balance',
    permission: permission.NAV_FLOAT_BALANCE,
    image: 'ic_balance.svg',
    icon: 'ti-panel',
    collapsed: true,
    children: [
      {
        name: 'view float account',
        path: '/float-account/view-float-account',
        i18n: 'menu.view_float_account',
        permission: permission.FLOAT_ACCOUNT_VIEW
      },
/*      {
        name: 'view statement',
        path: '/float-account/view-statement'
      },*/
/*      {
        name: 'Setup Debit/Credit',
        path: '/float-account/setup-debit'
      },*/
 /*     {
        name: 'Approve Debit/Credit',
        path: '/float-account/approve-debit'
      },*/
      {
        name: 'Review Debit/Credit',
        path: '/float-account/review-debit',
        i18n: 'menu.review_debit_credit',
        permission: permission.DEBIT_CREDIT_INSTRUCT_VIEW
      },
      {
        name: 'unallocated float',
        path: '/float-account/unallocated-float',
        i18n: 'menu.unallocated_float',
        permission: permission.UNALLOCATED_FLOAT_VIEW
      }
    ]
  },
  {
    name: 'KYC Module',
    i18n: 'menu.kyc_module',
    permission: permission.NAV_RESELLER,
    image: 'ic_kyc_module.svg',
    icon: 'ti-panel',
    collapsed: true,
    children: [
      {
        path: '/kyc/register',
        name: 'KYC Register',
        i18n: 'menu.kyc_register',
        permission: permission.DEBIT_CREDIT_INSTRUCT_VIEW
      },
      {
        path: '/kyc/workflow',
        name: 'KYC Workflow',
        i18n: 'menu.kyc_workflow',
        permission: permission.UNALLOCATED_FLOAT_VIEW
      }
    ]
  },
];
