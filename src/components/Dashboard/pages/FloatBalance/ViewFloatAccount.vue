<template>
  <div>
    <div class="card-header bg-white border-0">
      <div class="d-flex w-100 align-items-center flex-wrap">
        <div class="w-100 ">
          <h4>
            {{ $t('view_float_account.listing.title') }}
          </h4>
        </div>
        <div class="pl-2">
          <p>
            {{ $t('view_float_account.listing.tips.line1') }}
          </p>
          <ul>
            <li>{{ $t('view_float_account.listing.tips.li1') }}</li>
            <li>{{ $t('view_float_account.listing.tips.li2') }}</li>
            <li>{{ $t('view_float_account.listing.tips.li3') }}</li>
            <li>{{ $t('view_float_account.listing.tips.li4') }}</li>
            <li>{{ $t('view_float_account.listing.tips.li5') }}</li>
          </ul>
        </div>
        <div class=" w-100 pt-2 ">
          <div class="d-flex align-items-center align-content-center justify-content-end">
            <div class="d-flex align-items-center align-content-center">
              <span class="px-2">{{ $t('view_float_account.listing.search_filter.currency') }}</span>
              <el-select class="select-default"
                         v-if=""
                         size="small"
                         placeholder="selected a currency"
                         v-model="currencyCode"
              >
                <el-option v-for="currency in supportedCurrencies"
                           class="select-success"
                           :value="currency.code"
                           :label="currency.code"
                           :key="currency.id +'currency'">
                </el-option>
              </el-select>
            </div>
            <div class="d-flex align-items-center align-content-center">
              <span class="px-2">{{ $t('view_float_account.listing.search_filter.reseller_status') }}</span>
              <el-select class="select-default"
                         v-if=""
                         size="small"
                         placeholder="selected a currency"
                         v-model="resellerStatus"
              >
                <el-option v-for="resellerState in resellerStatusEnum"
                           class="select-success"
                           :value="resellerState.value"
                           :label="resellerState.name"
                           :key="resellerState.value +'resellerState'">
                </el-option>
              </el-select>
            </div>
            <div class="d-flex align-items-center align-content-center">
              <span class="px-2">{{ $t('view_float_account.listing.search_filter.card_program') }}</span>
              <el-select class="select-default"
                         v-if=""
                         size="small"
                         placeholder="Selected A Card Program"
                         v-model="cardProgramCode"
              >
                <el-option v-for="cardprogram in cardPrograms"
                           class="select-success"
                           :value="cardprogram.cardProgCode"
                           :label="cardprogram.value || cardprogram.cardProgCode"
                           :key="cardprogram.id">
                </el-option>
              </el-select>
            </div>
            <div class="d-flex align-items-center align-content-center">
              <span class="px-2">{{ $t('view_float_account.listing.search_filter.reseller') }}</span>
              <el-select class="select-default"
                         v-if=""
                         size="small"
                         placeholder="Selected A Reseller code"
                         v-model="resellerCode"
              >
                <el-option v-for="reseller in resellers"
                           class="select-success"
                           :value="reseller.resellerCode"
                           :label="reseller.value || reseller.resellerCode "
                           :key="reseller.id">
                </el-option>
              </el-select>
            </div>
            <div class="d-flex align-items-center align-content-center">
              <span class="px-2"></span>
              <p-button @click="getAllFloats" type="primary"
                        :disabled="!ready"
              > 
              {{ $t('view_float_account.listing.button.view') }}
              </p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="card">
        <div class="card-content row">
          <div class="col-sm-12">
            <regular-table
              striped
              :headings="tableHeadings"
              :value="tableData"
              :addToHeaders="[{name:'hasPendingDebitOrCredit' ,label:'Pending', i18n: 'view_float_account.listing.table_header.has_pending_debit_or_credit'}]"
            >
              <template slot-scope="index">
                <th>
                  <div class="cell" :class="{
                  'bg-success':getBendingDebitStat(index) === 'yes',
                  'bg-danger':getBendingDebitStat(index) === 'no',
                  }">
                    {{getBendingDebitStat(index)}}
                  </div>
                </th>
                <th v-if="hasPermission(permission.STATEMENT_VIEW)">
                  <div class="cell">
                    <p-button
                      
                      type="primary"
                      link
                      @click="viewStatement(index)"
                    >
                    {{ $t('view_float_account.listing.button.view_statement') }}
                    </p-button>
                  </div>
                </th>
                <th v-if="hasPermission(permission.DEBIT_CREDIT_INSTRUCT_EDIT)">
                  <div class="cell">
                    <p-button
                      type="primary"
                      link
                      @click="setupDebit(index)"
                    >
                    {{ $t('view_float_account.listing.button.setup') }}
                    </p-button>
                  </div>
                </th>
                <th v-if="hasPermission(permission.DEBIT_CREDIT_INSTRUCT_APPROVE)">
                  <div class="cell">
                    <p-button
                      type="primary"
                      link
                      @click="approveDebit(index)"
                    >
                    {{ $t('view_float_account.listing.button.approve') }}
                    </p-button>
                  </div>
                </th>
                <th v-if="hasPermission(permission.RESELLER_INVOICE_VIEW)">
                  <div class="cell">
                    <p-button
                      type="primary"
                      link
                      @click="viewInvoices(index)"
                    >
                    {{ $t('view_float_account.listing.button.view_invoice') }}
                    </p-button>
                  </div>
                </th>
              </template>
            </regular-table>
            <Pagination :page-count="totalPages"
                        v-model="page"
                        @perpagechange="onPerpageChange"
                        :perPage="perPage"></Pagination>
          </div>
        </div>
      </div>
    </div>
    <Spinner v-if="loadingState ==='getting'">
    </Spinner>
  </div>
</template>
<script>
  import { permissionMixin } from '@/mixins/permission'
  import {Button, Input, Option, Select} from 'element-ui'
  import {mapActions, mapGetters} from 'vuex'
  import {
    GET_ALL_CARD_PROGRAM,
    GET_ALL_FLOATS, GET_ALL_RESELLER_SUBSCRIPTIONS, GET_SUPPORTED_CURRENCIES,
    GETTER_ALL_CARDS,
    GETTER_FLOATS,
    GETTER_LOADINGSTATE_FLOAT_BALANCE, GETTER_RESELLER_SUBSCRIPTIONS,
    GETTER_SUPPORTED_CURRENCIES
  } from '../../../../store/types';
  // import {decimals, formatedMoney} from "../../../../utils/inputMasks";
  import {moneyFormatAppendCurrency} from "../../../../utils/moneyFormat";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import Spinner from "../../../UIComponents/Spinner";

  export default {
    name: 'ViewFloatAccount',
    mixins: [permissionMixin],
    components: {
      Pagination,
      PButton,
      Spinner, RegularTable, [Input.name]: Input,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,
    },
    data() {
      return {
        tableHeadings: [
          {label: 'CPC', name: 'cardProgCode', i18n: 'view_float_account.listing.table_header.card_prog_code'},
          {label: 'RC', name: 'resellerCode', i18n: 'view_float_account.listing.table_header.reseller_code'},
          {label: 'reseller name', name: 'resellerName', i18n: 'view_float_account.listing.table_header.reseller_name'},
          // unknown fields name
          {
            label: 'float amount', name: 'amount', i18n: 'view_float_account.listing.table_header.amount'
          },
          {label: 'status', name: 'resellerStatus', i18n: 'view_float_account.listing.table_header.reseller_status'},
        ],
        tableData: [],
        cardProgramCode: '',
        currencyCode: 'EUR',
        page: 0,
        perPage: 10,
        totalPages: 0,
        resellerCode: '',
        query: {},
        resellerStatus: 'All',
        resellerStatusEnum: [
          {name: 'Any', value: 'All'},
          {name: 'Active', value: 'ACTIVE'},
          {name: 'Closed', value: 'CLOSED'},
          {name: 'Pending Approval', value: 'PENDING_APPROVAL'},
        ]
      }
    },
    computed: {
      ...mapGetters({
        allFloats: GETTER_FLOATS,
        allCardPrograms: GETTER_ALL_CARDS,
        loadingState: GETTER_LOADINGSTATE_FLOAT_BALANCE,
        allResellers: GETTER_RESELLER_SUBSCRIPTIONS
      }), 
      ready() {
        return (
          this.cardProgramCode !== '' &&
          this.currencyCode !== '' &&
          this.page !== void 0 &&
          this.perPage !== void 0 &&
          this.resellerCode !== '')
      },
      supportedCurrencies() {
        return [{
          id: 'all__currencies__',
          code: 'ALL'
        }, ...(this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, {id, defCurrency}) => acc
            .find(({code}) => code === defCurrency) ? acc : [...acc, {
            id: id + 'curr',
            code: defCurrency
          }], [])
        ]
      },
      resellers() {
        return (this.$store.state.reseller.resellerSubscriptions || [])
          .reduce((acc, i) => !!acc.find(({resellerId}) => i.resellerId === resellerId)
            ? acc
            : [...acc, i]
            , [{id: 'all', value: '', resellerCode: 'All'}])

      },
      cardPrograms() {
        return (this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, i) => !!acc.find(({cardProgCode}) => i.cardProgCode === cardProgCode)
            ? acc
            : [...acc, i]
            , [{id: 'all', value: '', cardProgCode: 'All'}])
      }

    }, watch: {
      allFloats(newData) {
        this.tableData = (newData["viewFloatResultList"] || []).map(i => ({...i, amount: moneyFormatAppendCurrency(i.amount, i.currency)}));
        if (!newData.pageMeta) return;
        this.totalPages = newData.pageMeta.totalPages;
      }, 
      page(page) {
        // this.getResellerData()
        this.handleQuery({page})
      },
      currencyCode(currencyCode) {
        this.handleQuery({currencyCode})
      },
      resellerCode(resellerCode) {
        this.handleQuery({resellerCode})
      },
      cardProgramCode(cardProgramCode) {
        this.handleQuery({cardProgramCode})
      }, 
      resellerStatus(resellerStatus) {
        this.handleQuery({resellerStatus})
      },
      query(newQuery) {
        this.$router.push({
          path: this.$route.path,
          query: Object.keys(newQuery)
            .reduce((acc, key) => (newQuery[key] !== void 0 || newQuery[key] !== '') ?
              {...acc, [key]: newQuery[key]}
              : acc,
              {})

        })
        this.getAllFloats();
      },
      cardProgram(cardProgram) {
        this.getAllFloats()
        this.handleQuery({cardProgram})
      },
    },
    methods: {
      ...mapActions({
        getFloats: GET_ALL_FLOATS,
        getAllCards: GET_ALL_CARD_PROGRAM,
        getSupportedCurrencies: GET_SUPPORTED_CURRENCIES,
        getAllResellers: GET_ALL_RESELLER_SUBSCRIPTIONS
      }),
      viewStatement({index: {index}}) {
        const floatAccount = this.tableData[index];
        if (!floatAccount) return
        const {cardProgCode, resellerCode, currency} = floatAccount

        this.$router.push({
          path: '/float-account/view-statement',
          query: {
            card_program_code: cardProgCode,
            currency_code: currency,
            reseller_code: resellerCode
          }
        })
      }, setupDebit({index: {index}}) {
        //Card Program Code, Reseller Code, Reseller Name, Username, Currency
        const floatAccount = this.tableData[index];
        if (!floatAccount) return
        const {cardProgCode, resellerCode, resellerName, currency, cardProgId} = floatAccount
        // const card = this.allCardPrograms.find(card => card.cardProgCode === cardProgCode)
        const resellerSub = this.allResellers.find(reseller => reseller.resellerCode === resellerCode)
        /*    this.$router.push({
              path: '/float-account/setup-debit',
              query: {
                card_program_id: card.id || '',
                reseller_id: resellerSub.resellerId || '',
                currency: currency,
              }
            })  */
        this.$router.push({
          path: '/float-account/setup-debit',
          query: {
            card_program_code: cardProgCode,
            reseller_code: resellerCode,
            currency: currency,
            reseller_name: resellerName,
            // card_program_id: card.id || '',
            card_program_id: cardProgId,
            reseller_id: resellerSub.resellerId || '',
          }
        })

      }, viewInvoices({index: {index}}) {
        const floatAccount = this.tableData[index];
        console.log(floatAccount);
        if (!floatAccount) return
        const {cardProgCode, resellerCode} = floatAccount

        this.$router.push({
          path: '/reseller/invoice',
          query: {
            card_program_code: cardProgCode,
            reseller_code: resellerCode
          }
        })

      }, approveDebit({index: {index}}) {
        const floatAccount = this.tableData[index];
        // console.log(floatAccount);
        if (!floatAccount) return
        // const {cardProgCode} = floatAccount
        // const card = this.cardPrograms.find(card => card.cardProgCode === cardProgCode)

        // this.$router.push({
        //   path: '/float-account/approve-debit',
        //   query: {
        //     card_program_id: card.id || ''
        //   }
        // })
        const { cardProgId, currency } = floatAccount
        this.$router.push({
          path: '/float-account/approve-debit',
          query: {
            card_program_id: cardProgId,
            currency: currency
          }
        })
      },
      handleQuery({cardProgramCode, resellerCode, resellerStatus,currencyCode, fromDate, toDate, page, perPage}) {
        this.query = {
          card_program_code: cardProgramCode || this.cardProgramCode,
          reseller_code: resellerCode || this.resellerCode,
          from_date: fromDate,
          page,
          reseller_status:resellerStatus || this.resellerStatus,
          currency_code: currencyCode || this.currencyCode,
          per_page: perPage
        }
      },
      onPerpageChange(perPage) {
        const newPage = (this.page * this.perPage) / perPage
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        this.perPage = perPage;
        this.handleQuery({perPage})

        if (this.page === page) {
          return this.getAllFloats();
        }
        this.page = page
        this.getAllFloats()
      }, getBendingDebitStat(index) {
        if (this.tableData.length !== 0) {
          const recoredIndex = index !== void 0 && index.index !== void 0 ? index.index.index : false;
          if (recoredIndex === false) return 'false'
          return this.tableData[recoredIndex].hasPendingDebitOrCredit ? 'yes' : 'no'
        }
      },
      getAllFloats() {
        if (!this.ready) return;

        this.getFloats({
          cardProgramCode: this.cardProgramCode,
          currencyCode: this.currencyCode,
          page: this.page,
          perPage: this.perPage,
          resellerCode: this.resellerCode,
          resellerStatus: this.resellerStatus
        })
      }
    },
    mounted() {
      this.getAllCards();
      this.getAllResellers();
      const {
        card_program_code,
        reseller_code,
        from_date,
        page,
        reseller_status,
        currency_code,
        per_page,
      } = this.$route.query;

      this.cardProgramCode = card_program_code || 'ALL';
      this.resellerCode = reseller_code || 'ALL';
      this.fromDate = from_date || '';
      this.page = page || this.page;
      this.currencyCode = currency_code || 'EUR';
      this.perPage = per_page || this.perPage;
      this.resellerStatus = reseller_status || this.resellerStatus;
      this.getAllFloats();
      this.tableData = this.allFloats["viewFloatResultList"];
    }
  }
</script>
<style scoped>
  .el-select {
    width: 100px;
    overflow: hidden;
  }

  .el-select input {
    border-radius: .4rem !important;
    border: 1px solid #DDDDDD !important;

    &:hover {
      border: 1px solid #000 !important;

    }
  }

  .ceevo__table__cell--nopadding {
    display: none !important;
  }
</style>
