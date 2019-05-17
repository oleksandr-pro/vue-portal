<template>
  <div>
    <div class="bg-white">
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <h4 class="card-title display-inline">{{ $t('invoice.listing.title') }}</h4>
          <div class="pl-2">
            <p>
              {{ $t('invoice.listing.tips.line1') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row align-items-center tabel-wrapper">
      <div class="col-12">
        <in-voice-toolbar
          :fromDate="fromDate"
          :toDate="toDate"
          :resellerCode="resellerCode"
          :cardProgramData="cardProgramsData"
          :cardProgCode="cardProgramCode"
          :resellers="rsellerData"
          :buttonDisabled="!(!!resellerCode && !!fromDate && !!toDate)"
          @fromDateChange="handleFromDate"
          @toDateChange="handleToDate"
          @resellerIdChange="resellerIdChange"
          @CardProgCodeChange="handleCardProgramCode"
          @currencyCodeChange="handleCurrencyChange"
          :currencies="supportedCurrencies"
          :currencyCode="currencyCode"
          @buttonClick="getInvoices">
        </in-voice-toolbar>
      </div>
    </div>
    <br>
    <div class="card">
      <div class="card-header">
      </div>
      <div class="card-content">
        <RegularTable
          striped
          :headings="tableHeadings"
          :value="allInvoices"
          @input="listenToInput"
          :uneditableFields="[]"
        >
        <!--
          <template slot="total">
            <tr>
              <th colspan="5"></th>
              <th>Sum</th>
              <th>
                <div class="cell">{{sum}}</div>
              </th>
            </tr>
          </template>
          -->
        </RegularTable>
        <Pagination :page-count="totalPages" v-model="page"
                    @perpagechange="onPerpageChange"
                    :perPage="perPage">
        </Pagination>
      </div>
    </div>
    <!--
    <div class="w-100 ">
      <div class="pull-right">
        <p-button type="success">generate invoices</p-button>
      </div>
    </div>
    -->
    <Spinner v-if="loadingState ==='getting_invoices'">
    </Spinner>
  </div>
</template>
<script>
  import {Button, Input, Option, Select, DatePicker} from 'element-ui'
  import {mapActions, mapGetters} from 'vuex'

  import {
    GET_ALL_CARD_PROGRAM,
    GET_ALL_RESELLER_SUBSCRIPTIONS,
    GET_INVOICES_BY_SELLERID,
    GETTER_ALL_CARDS,
    GETTER_INVOICES_BY_SELLERID,
    GETTER_LOADINGSTATE_RESELLER
  } from "../../../../store/types";
  import {formatDate} from "../../../../utils/Date";
  // import {formatedMoney} from "../../../../utils/inputMasks";
  import {moneyFormatAppendCurrency} from "../../../../utils/moneyFormat";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from "../../../UIComponents/CeevoTables/RegularTable/RegularTable";
  import Modal from "../../../UIComponents/Modal";
  import Spinner from "../../../UIComponents/Spinner";
  import InVoiceToolbar from "./inVoiceToolbar";

  export default {
    name: "CardPrograms",
    components: {
      Pagination,
      Spinner,
      InVoiceToolbar,
      Modal,
      PButton,
      RegularTable,
      [Input.name]: Input,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,
      [DatePicker.name]: DatePicker,

    },
    data() {
      return {
        tableHeadings: [
          //! gold old invoices api
          {label: 'CPC', name: 'cardProgCode', i18n: 'invoice.listing.table_header.card_prog_code'},
          {label: 'RC', name: 'resellerCode', i18n: 'invoice.listing.table_header.reseller_code'},
          {label: 'Reseller Name', name: 'resellerName', i18n: 'invoice.listing.table_header.reseller_name'},
          {label: 'time stamp', name: 'timestamp', i18n: 'invoice.listing.table_header.timestamp'},
          {label: 'charge type', name: 'chargeType', i18n: 'invoice.listing.table_header.charge_type'},
          {label: 'description', name: 'itemDesc', i18n: 'invoice.listing.table_header.item_desc'},
          {label: 'amount', name: 'itemAmount', i18n: 'invoice.listing.table_header.item_amount'},

        ],
        allInvoices: [],
        showModal: true,
        resellerId: '',
        resellerCode: "",
        currencyCode: 'EUR',
        page: 0,
        perPage: 10,
        totalPages: 0,
        cardProgramCode: '',
        fromDate: '',
        toDate: '',
        sum: '',
        query: {}
      }
    },
    computed: {
      ...mapGetters({
        allInvoicesData: GETTER_INVOICES_BY_SELLERID,
        loadingState: GETTER_LOADINGSTATE_RESELLER,
      }),
      rsellerData() {
        return (this.$store.state.reseller.resellerSubscriptions || []).reduce((acc, i) =>
            acc.find(accI => accI.resellerCode === i.resellerCode) ? acc : [...acc, i]
          , []).map(({id, resellerCode, resellerId}) => ({
          resellerId,
          resellerCode, id
        }))
      },supportedCurrencies(){
        return (this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, i) => !!acc.find(({code}) => i.defCurrency === code)
            ? acc
            : [...acc, {
              id: i.id + 'curr',
              code: i.defCurrency
            }]
            , [])
      },
      cardProgramsData() {
        return (this.$store.state.cardProgram.allCardPrograms || []).reduce((acc, i) =>
            acc.find(accI => accI.cardProgCode === i.cardProgCode) ? acc : [...acc, i]
          , []).map(({id, cardProgCode}) => ({id, cardProgCode}))
      }
    },
    methods: {
      ...mapActions({
        getAllInvoiceDataBYResellerId: GET_INVOICES_BY_SELLERID,
        getAllResellerSubscription: GET_ALL_RESELLER_SUBSCRIPTIONS,
        getAllCardPrograms: GET_ALL_CARD_PROGRAM
      }),
      handleToDate(toDate) {
        this.toDate = toDate;
        this.handleQuery({toDate})
      },
      handleFromDate(fromDate) {
        this.fromDate = fromDate;
        this.handleQuery({fromDate})

      },
      listenToInput(value) {
        void 0;
      }, resellerIdChange(resellerCode) {
        this.resellerCode = resellerCode;
        this.handleQuery({resellerCode})
      }, handleCurrencyChange(currencyCode) {
        this.currencyCode = currencyCode;
        this.handleQuery({currencyCode})

      },
      handleCardProgramCode(cardProgramCode) {
        this.cardProgramCode = cardProgramCode
        this.handleQuery({cardProgramCode})

      }, handleQuery({cardProgramCode, currencyCode, resellerCode, fromDate, toDate, page, perPage} = {}) {
        fromDate = (fromDate || this.fromDate) ? formatDate(fromDate || this.fromDate) : '';
        toDate = (toDate || this.toDate) ? formatDate(toDate || this.toDate) : '';
        this.query = {
          card_program_code: cardProgramCode || this.cardProgramCode,
          reseller_code: resellerCode || this.resellerCode,
          from_date: fromDate,
          to_date: toDate,
          per_page: perPage,
          form_date: fromDate,
          currency_code: currencyCode || this.currencyCode,
          page
        }

        this.getInvoices()
      },
      getInvoices() {
        if (this.resellerCode && this.fromDate && this.toDate) {
          this.getAllInvoiceDataBYResellerId({
            resellerCode: this.resellerCode,
            cardProgramCode: this.cardProgramCode,
            page: this.page,
            perPage: this.perPage,
            currencyCode: this.currencyCode,
            toDate: formatDate(this.toDate),
            fromDate: formatDate(this.fromDate)
          });
        }
      }, onPerpageChange(perPage) {
        const newPage = (this.page * this.perPage) / perPage
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        this.perPage = perPage;
        this.handleQuery({perPage})

        if (this.page === page) {
          return this.getInvoices();
        }
        this.page = page

      },
    }, watch: {
      page(page) {
        this.handleQuery({page})
      },
      allInvoicesData(newVal) {
        this.allInvoices = ([...newVal.invoiceItems] || []).map(invoice => ({
          ...invoice,
          timestamp:formatDate(invoice.timestamp,true),
          itemAmount:moneyFormatAppendCurrency(invoice.itemAmount, this.currencyCode)
        }));
        this.sum = moneyFormatAppendCurrency(newVal.sum, this.currencyCode);
        if (!newVal.pageMeta) return;
        this.totalPages = newVal.pageMeta.totalPages || 0;
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
      },
      fromDate(fromDate) {
        if (this.resellerId && fromDate && this.toDate) {
          this.getAllInvoiceDataBYResellerId({resellerId: this.resellerId, toDate: this.toDate, fromDate});

        }

      },
      toDate(toDate) {
        if (this.resellerId && this.fromDate && toDate) {
          this.getAllInvoiceDataBYResellerId({resellerId: this.resellerId, toDate, fromDate: this.fromDate});
        }

      }
    }, mounted() {
      const {
        card_program_code,
        reseller_code,
        from_date,
        to_date,
        per_page,
        page,
      } = this.$route.query;
      this.getAllResellerSubscription();
      this.getAllCardPrograms();
      this.resellerCode = reseller_code || this.resellerCode;
      this.cardProgramCode = card_program_code || this.cardProgramCode;
      this.fromDate = from_date || this.fromDate;
      this.toDate = to_date || this.toDate;
      this.page = page || this.page;
      this.perPage = per_page || this.perPage;
      this.handleQuery()
    }
  };
</script>
<style scoped>
  .section-header {
    padding: .5rem 2rem 1rem;
  }

  .section-header h4 {
    margin: 0;
  }

  .section-header button {
    margin: 0;
  }

  .card-content .tabel-wrapper {
    margin: 10px 0;
  }

  .no-data {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .no-data .txt {
    font-size: 27px;
    color: #aaa;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .no-data .btn {
    max-width: 300px;
  }
</style>
