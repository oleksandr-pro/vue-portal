<template>
  <div>
    <div class="card-header bg-white border-0">
      <h4 class="card-title">Search Invoices</h4>
      <div class="row align-items-stretch invoices-search-header">
        <div class="col-12 col-md-6 row align-items-center no-gutters">
          <div class="col-12">Issued Date</div>
          <div class="col-2"></div>
          <div class="col-5 d-flex align-items-center">
            <span class="px-2">From</span>
            <el-date-picker v-model="issuedDateFrom" type="date"
                            placeholder="Pick Starting Date"
                            :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
          <div class="col-5 d-flex align-items-center">
            <span class="px-2">To</span>
            <el-date-picker v-model="issuedDateTo" type="date"
                            placeholder="Pick Starting Date"
                            :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </div>
        <div class="col-12 col-md-6 row bg-sucess  align-items-center">
          <div class="col-6">
            <fg-input label="invoice#" v-model="invoiceNumber" placeholder="Invoice number.."></fg-input>
          </div>
          <div class="col-6">
            <fg-input label="currency code" v-model="currencyCode" placeholder="currency code.."></fg-input>
          </div>
        </div>
        <div class="col-12 row">
          <div class="col-12">
            <div class="pull-right">
              <p-button @click="searchInoices"    type="primary">search for invoices</p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card p-2">
      <div class="card-content row">
        <div class="col-sm-12">
          <regular-table striped
                         :headings="tableHeadings"
                         :value="invoices">
            <template slot-scope="index">
              <p-button
                @click="viewInvoiceDetails(index)"
                :key="index.index.index+index.index.id+'edit'"
                type="primary"
                link=""
              >
                Edit
              </p-button>
            </template>
          </regular-table>
          <div class="w-100">
            <pagination :page-count="totalPages"
                        v-model="page"
                        @perpagechange="onPerpageChange"
                        :perPage="perPage"></pagination>
          </div>
        </div>
      </div>
    </div>
    <spinner v-if="loading"></spinner>
  </div>
</template>
<script>
  import {DatePicker, Select, TimeSelect} from "element-ui";
  import Vue from 'vue'
  import {SHOW_TOAST_MESSAGE} from "../../../../store/types";
  import {formatDate} from "../../../../utils/Date";
  import Button from "../../../UIComponents/Button";
  import RegularTable from "../../../UIComponents/CeevoTables/RegularTable/RegularTable";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";

  import Spinner from "../../../UIComponents/Spinner";

  export default {
    name: "SearchInvoices",
    components: {
      Pagination,
      Spinner,
      RegularTable,
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,

    },
    data() {
      return {
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
        tableHeadings: [
          {label: 'Invoice#', name: 'invoiceNumber'},
          {label: 'Currency', name: 'currencyCode'},
          {label: 'Issued Date', name: 'issuedDate'},
        ],
        page: 0,
        perPage: 10,
        totalPages: 0,
        currencyCode: 'EUR',
        invoiceNumber: '',
        issuedDateFrom: '',
        issuedDateTo: '',
        loading: false,
        invoices: [],
        query: {}
      }
    }, methods: {
      onPerpageChange(perPage) {
        const newPage = (this.page * this.perPage) / perPage
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        this.perPage = perPage;
        this.handleQuery({perPage})
        if (this.page === page) {
          return this.searchInoices();
        }
        this.page = page
        this.searchInoices()
      }, viewInvoiceDetails({index: {invoiceNumber}}) {
        this.$router.push({
          path: '/reseller/details',
          query: {
            invoice_number: '1234234',
            per_page: 5,
            page: 0
          }
        })
      },
      async searchInoices() {
        if (!(this.currencyCode && this.invoiceNumber && this.issuedDateFrom && this.issuedDateTo)) return;
        try {
          this.loading = true;
          const {data} = await Vue.prototype.$http.get(`/invoices?
        currency_code=${this.currencyCode}
        &invoice_number=${this.invoiceNumber}
       &issued_date_from=${formatDate(this.issuedDateFrom)}
       &issued_date_to=${formatDate(this.issuedDateTo)}
        &page=${this.page}
        &per_page=${this.perPage}`.replace(/ /g, ''))
          this.loading = false;
          this.invoices = data.invoices || []
          if (data.invoices === null || data.invoices.length === 0) this.$store.dispatch(SHOW_TOAST_MESSAGE, {
            message: 'There are no invoices for the search criteria selected.',
            status: 'info'
          })
          if (!data.pageMeta) return;
          this.totalPages = data.pageMeta.totalPages
        } catch (e) {
          this.loading = false;
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: 'There was an error searching for the invoices. Please try again, If the problem persists please contact Technical Support', status: 'danger'})
        }
      }, handleQuery({currencyCode, invoiceNumber, issuedDateFrom, issuedDateTo, page, perPage}) {
        issuedDateFrom = (issuedDateFrom || this.issuedDateFrom) ? formatDate(issuedDateFrom || this.issuedDateFrom) : '';
        issuedDateTo = (issuedDateTo || this.issuedDateTo) ? formatDate(issuedDateTo || this.issuedDateTo) : '';
        this.query = {
          invoice_number: invoiceNumber || this.invoiceNumber,
          issued_date_from: issuedDateFrom,
          issued_date_to: issuedDateTo,
          per_page: perPage,
          currency_code: currencyCode || this.currencyCode,
          page,
        }
      }
    }, watch: {
      currencyCode(currencyCode) {this.handleQuery({currencyCode})},
      invoiceNumber(invoiceNumber) {this.handleQuery({invoiceNumber})},
      issuedDateTo(issuedDateTo) {this.handleQuery({issuedDateTo})},
      issuedDateFrom(issuedDateFrom) {this.handleQuery({issuedDateFrom})},
      page(page) {this.handleQuery({page})},
      query(newQuery) {
        this.$router.push({
          path: this.$route.path,
          query: Object.keys(newQuery)
            .reduce((acc, key) => newQuery[key] ?
              {...acc, [key]: newQuery[key]}
              : acc,
              {})

        })
      },
    }, mounted() {
      const {
        invoice_number,
        issued_date_from,
        issued_date_to,
        per_page,
        currency_code,
        page,
      } = this.$route.query;
      this.invoiceNumber = invoice_number || '';
      this.issuedDateFrom = issued_date_from || '';
      this.issuedDateTo = issued_date_to || '';
      this.perPage = per_page || this.perPage;
      this.currencyCode = currency_code || 'EUR';
      this.page = page || this.page;
      this.searchInoices();
    },
  }
</script>
<style scoped>
  .invoices-search-header .form-group {
    margin: 0 !important;
  }
</style>
