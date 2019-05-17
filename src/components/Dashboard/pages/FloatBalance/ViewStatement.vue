<template>
  <div>
    <div class="card-header bg-white border-0">
      <h4 class="card-title">
        {{ $t('view_statement.listing.title') }}
      </h4>
      <div class="pl-2">
        <p>
          {{ $t('view_statement.listing.tips.line1') }}
          <br>
          {{ $t('view_statement.listing.tips.line2') }}
        </p>
      </div>
      <div class="row align-items-center">
        <div class="col-xs-12 col-md-8">
          <div class="d-flex align-items-center flex-wrap">
            <div class="py-2">
              <div>
                <span class="px-2">{{ $t('view_statement.listing.search_filter.from') }}</span>
                <el-date-picker v-model="fromDate" type="date"
                                placeholder="Pick Starting Date"
                                :picker-options="pickerOptions1">
                </el-date-picker>
              </div>
            </div>
            <div class="py-2">
              <div>
                <span class="px-2">{{ $t('view_statement.listing.search_filter.to') }}</span>
                <el-date-picker
                  v-model="toDate" type="date" placeholder="Pick Ending Date"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-4 button-wrapper " v-if="hasPermission(permission.STATEMENT_DOWNLOAD)">
          <p-button
            type="success"
            round
            @click="download"
            :disabled="tableData.length < 1"
          >
          {{ $t('view_statement.listing.button.download') }}
          </p-button>
          <a ref="downloadEr" style="display: none;"></a>
        </div>
      </div>
      <div class=" w-100 pt-2 ">
        <div class="d-flex align-items-center align-content-center justify-content-end">
          <div class="d-flex align-items-center align-content-center">
            <span class="px-2">{{ $t('view_statement.listing.search_filter.currency') }}</span>
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
                         :key="currency.id">
              </el-option>
            </el-select>
          </div>
          <div class="d-flex align-items-center align-content-center">
            <span class="px-2">{{ $t('view_statement.listing.search_filter.card_program') }}</span>
            <el-select class="select-default"
                       v-if=""
                       size="small"
                       placeholder="Selected A Card Program Code"
                       v-model="cardProgramCode"
            >
              <el-option v-for="card in cardPrograms"
                         class="select-success"
                         :value="card.cardProgCode"
                         :label="card.cardProgCode"
                         :key="card.id">
              </el-option>
            </el-select>
          </div>
          <div class="d-flex align-items-center align-content-center">
            <span class="px-2">{{ $t('view_statement.listing.search_filter.reseller') }}</span>
            <el-select class="select-default"
                       v-if=""
                       size="small"
                       placeholder="Select A Reseller Code"
                       v-model="resellerCode"
            >
              <el-option v-for="reseller in resellers"
                         class="select-success"
                         :value="reseller.resellerCode"
                         :label="reseller.resellerCode"
                         :key="reseller.id">
              </el-option>
            </el-select>
          </div>
          <div class="d-flex align-items-center align-content-center">
              <span class="px-2"></span>
            <p-button @click="viewStatment" type="primary" :disabled="!ready">
              {{ $t('view_statement.listing.button.view_statement') }}
              </p-button>
          </div>
        </div>
      </div>
    </div>
    <div class="card p-2">
      <div class="card-content row">
        <div class="col-sm-12">
          <regular-table striped
                         :headings="tableHeadings"
                         :value="tableData">
            <template slot="balance">
              <tr>
                <td v-for="i in 7" :key="i+'balance start'"></td>
                <td class="">
                  <strong>{{ $t('view_statement.listing.table_header.closing_balance') }}</strong>
                </td>
                <td>
                  <div class="cell" v-html="closingBalance"></div>
                </td>
                <td v-for="i in 0" :key="i+'balance end'"></td>
              </tr>
            </template>
            <template slot="total">
              <tr>
                <td v-for="i in 7" :key="i+'total start'"></td>
                <td>
                  <strong>{{ $t('view_statement.listing.table_header.opening_balance') }}</strong>
                </td>
                <td>
                  <div class="cell" v-html="openingBalance"></div>
                </td>
                <td v-for="i in 0" :key="i+'total end'"></td>
              </tr>
            </template>
          </regular-table>
          <pagination :page-count="totalPages"
                      v-model="page"
                      @perpagechange="onPerpageChange"
                      :perPage="perPage"></pagination>
        </div>
      </div>
    </div>
    <spinner
      v-if="loadingState ==='getting'"
    >
    </spinner>
  </div>
</template>
<script>
  import { permissionMixin } from '@/mixins/permission'
  import {DatePicker, Option, Select, Table, TableColumn, TimeSelect} from 'element-ui'

  import {Button} from 'src/components/UIComponents';
  /* eslint-disable indent */
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex';
  import {
    GET_ALL_CARD_PROGRAM,
    GET_ALL_FLOATS,
    GET_ALL_RESELLER_SUBSCRIPTIONS,
    GET_SUPPORTED_CURRENCIES, GET_VIEW_STATEMENT,
    GETTER_ALL_CARDS,
    GETTER_FLOATS,
    GETTER_LOADINGSTATE_FLOAT_BALANCE,
    GETTER_SUPPORTED_CURRENCIES, GETTER_VIEW_STATEMENT
  } from "../../../../store/types";
  import {formatDate} from "../../../../utils/Date";
  // import {formatedMoney} from "../../../../utils/inputMasks";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import Spinner from "../../../UIComponents/Spinner";
  import {moneyFormatAppendCurrency} from "../../../../utils/moneyFormat";
  import {b64toBlob} from "../../../../utils/createCSVData";

  Vue.use(Table)
  Vue.use(TableColumn)
  export default {
    name: 'ApproveDebit',
    mixins: [permissionMixin],
    components: {
      Pagination,
      Spinner,
      PButton,
      RegularTable,
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,

    },
    data() {
      return {
        fromDate: '',
        toDate: '',
        pickerOptions1: {
          shortcuts: [{
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
            {
              text: 'Yesterday',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: 'A week ago',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            },
          ]
        },
        dialog: false,
        tableHeadings: [
          {label: 'CPC', name: 'cardProgCode', i18n: 'view_statement.listing.table_header.card_prog_code'},
          {label: 'RC', name: 'resellerCode', i18n: 'view_statement.listing.table_header.reseller_code'},
          {label: 'Reseller Name', name: 'resellerName', i18n: 'view_statement.listing.table_header.reseller_name'},
          {label: 'Time Stamp', name: 'timestamp', i18n: 'view_statement.listing.table_header.timestamp'},
          {label: 'User', name: 'user', i18n: 'view_statement.listing.table_header.user'},
          {label: 'Charge Types', name: 'chargeType', i18n: 'view_statement.listing.table_header.charge_type'},
          {label: 'Description', name: 'itemDesc', i18n: 'view_statement.listing.table_header.item_desc'},
          {label: 'Amount', name: 'itemAmount', i18n: 'view_statement.listing.table_header.item_amount'},
          {label: 'Balance', name: 'itemBalance', i18n: 'view_statement.listing.table_header.item_balance'},
        ],
        tableData: [],
        cardProgramCode: '',
        currencyCode: 'EUR',
        perPage: 10,
        page: 0,
        totalPages: 0,
        resellerCode: 'EUR',
        closingBalance: 0,
        openingBalance: 0,
        query: {}
      }
    }, computed: {
      ...mapGetters({
        allFloats: GETTER_FLOATS,
        cardPrograms: GETTER_ALL_CARDS,
        loadingState: GETTER_LOADINGSTATE_FLOAT_BALANCE,
        statement: GETTER_VIEW_STATEMENT
      }),
      ready() {
        return (
          this.cardProgramCode !== '' &&
          this.resellerCode !== '' &&
          this.currencyCode !== '' &&
          this.fromDate !== '' &&
          this.page !== void 0 &&
          this.perPage !== '' &&
          this.toDate !== '' &&
          this.loadingState !== 'getting'
        )
      },
      resellers() {
        return (this.$store.state.reseller.resellerSubscriptions || [])
          .reduce((acc, i) => !!acc.find(({resellerId}) => i.resellerId === resellerId)
            ? acc
            : [...acc, i]
            , [])

      }, supportedCurrencies() {
        return (this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, i) => !!acc.find(({code}) => i.defCurrency === code)
            ? acc
            : [...acc, {
              id: i.id + 'curr',
              code: i.defCurrency
            }]
            , [])
      },
      cardPrograms() {
        return (this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, i) => !!acc.find(({cardProgCode}) => i.cardProgCode === cardProgCode)
            ? acc
            : [...acc, i]
            , [])
      }
    }, watch: {
      statement(newVal) {
        if (!newVal) return;
        this.tableData = (newVal.statementResultList || []).map(i => ({
          ...i,
          itemAmount:  moneyFormatAppendCurrency(i.itemAmount, this.currencyCode),
          itemBalance: moneyFormatAppendCurrency(i.itemBalance, this.currencyCode),
          timestamp: formatDate(i.timestamp, true)
        }))
        this.openingBalance = moneyFormatAppendCurrency(newVal.openingBalance, this.currencyCode)
        this.closingBalance = moneyFormatAppendCurrency(newVal.closingBalance, this.currencyCode)
        if (!newVal.pageMeta) return
        this.totalPages = newVal.pageMeta.totalPages;
      },
      query(newQuery) {
        this.$router.push({
          path: this.$route.path,
          query: Object.keys(newQuery)
            .reduce((acc, key) => (newQuery[key] !== void 0 && newQuery[key] !== '') ?
              {...acc, [key]: newQuery[key]}
              : acc,
              {})

        })
        this.viewStatment()
      },
      toDate(toDate) {
        this.handleQuery({toDate})
      },
      fromDate(fromDate) {
        this.handleQuery({fromDate})

      },
      cardProgramCode(cardProgramCode) {
        this.handleQuery({cardProgramCode})
      },
      resellerCode(resellerCode) {
        this.handleQuery({resellerCode})
      },
      currencyCode(currencyCode) {
        this.handleQuery({currencyCode})
      },
      page(page) {
        this.handleQuery({page})
        this.viewStatment()
      },
    },

    methods: {
      ...mapActions({
        getFloats: GET_ALL_FLOATS,
        getAllCards: GET_ALL_CARD_PROGRAM,
        getAllResellers: GET_ALL_RESELLER_SUBSCRIPTIONS,
        getStatment: GET_VIEW_STATEMENT,
      }),
      handleQuery({cardProgramCode, currencyCode, resellerCode, fromDate, toDate, page, perPage}) {
        fromDate = (fromDate || this.fromDate) ? formatDate(fromDate || this.fromDate) : '';
        toDate = (toDate || this.toDate) ? formatDate(toDate || this.toDate) : '';
        this.query = {
          card_program_code: cardProgramCode || this.cardProgramCode,
          reseller_code: resellerCode || this.resellerCode,
          from_date: fromDate,
          to_date: toDate,
          per_page: perPage || this.perPage,
          currency_code: currencyCode || this.currencyCode,
          page: page || this.page,
        }
      }, onPerpageChange(perPage) {
        const newPage = (this.page * this.perPage) / perPage
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        this.perPage = perPage;
        this.handleQuery({perPage})

        if (this.page === page) {
          return this.viewStatment();
        }
        this.page = page
        this.viewStatment()
      },
      viewStatment() {
        if (!this.ready) return;
        this.getStatment({
          cardProgramCode: this.cardProgramCode,
          resellerCode: this.resellerCode,
          currencyCode: this.currencyCode,
          fromDate: formatDate(this.fromDate),
          page: this.page,
          perPage: this.perPage,
          toDate: formatDate(this.toDate),
        })
      },
      download() {
        this.$http.get(`/cardprograms/${this.cardProgramCode}/resellers/${this.resellerCode}/statement/download`, {
          from_date: formatDate(this.fromDate),
          to_date: formatDate(this.toDate),
          currency_code: this.currencyCode
        }).then((response) => {
          const data = response.data
          const $ancoreElement = this.$refs.downloadEr;
          const blobURI = URL.createObjectURL(b64toBlob(data.encodedFile, data.contentType, data.fileSize))
          $ancoreElement.setAttribute("href", blobURI);
          $ancoreElement.setAttribute("download", data.fileName);
          $ancoreElement.click();
        })
      }
    },
    async mounted() {
      this.getAllCards();
      this.getAllResellers()

      const {
        card_program_code,
        reseller_code,
        from_date,
        to_date,
        per_page,
        currency_code,
        page,
      } = this.$route.query;
      this.cardProgramCode = card_program_code || '';
      this.resellerCode = reseller_code || '';
      this.fromDate = from_date || '';
      this.toDate = to_date || this.toDate;
      this.perPage = per_page || this.perPage;
      this.currencyCode = currency_code;
      this.page = page || this.page;
    }
  }
</script>
<style scoped>
  .p-2 {
    padding: 1rem .5rem 2rem;
  }

  .balance__label {
    font-weight: bold;
  }

  .button-wrapper {
    text-align: right;
  }

  .card-header {
    padding: 0 2rem 2rem;
  }

  .margin {
    margin: 1.5rem 0 0;
  }

  .el-select {
    width: 130px;
    overflow: hidden;
  }

  .el-select input {
    border-radius: .4rem !important;
    border: 1px solid #DDDDDD !important;

    &:hover {
      border: 1px solid #000 !important;

    }
  }
</style>
