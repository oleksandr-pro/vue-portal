<template>
  <div>
    <div class="card-header bg-white border-0">
      <h4 class="card-title">xxxx details</h4>
      <!--  <div class="row align-items-stretch invoices-search-header">
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
                <p-button @click="viewInvoices"    type="primary">search for invoices</p-button>
              </div>
            </div>
          </div>
        </div>-->
    </div>
    <div class="card p-2">
      <div class="card-content row">
        <div class="col-sm-12">
          <regular-table striped
                         :headings="tableHeadings"
                         :value="invoices">
            <template slot="total">
              <tr>
                <th colspan="8"></th>

                <th>Sum</th>
                <th>
                  <div class="cell">{{sum}}</div>
                </th>
              </tr>
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
    name: "Invoicesdetails",
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
        tableHeadings: [
          {label: 'CPC', name: 'cardProgCode'},
          {label: 'RC', name: 'resellerCode'},
          {label: 'Reseller Name', name: 'resellerName'},
          {label: 'Time Stamp', name: 'timestamp'},
          {label: 'Charge Type', name: 'chargeType'},
          {label: 'Description', name: 'itemDesc'},
          {label: 'Currency', name: 'itemCurrency'},
          {label: 'Amount', name: 'itemAmount'},
        ],
        page: 0,
        perPage: 10,
        totalPages: 0,
        invoiceNumber: '',
        sum: 0,
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
          return this.viewInvoices();
        }
        this.page = page
        this.viewInvoices()
      },
      async viewInvoices() {
        if (!this.invoiceNumber) return;
        try {
          this.loading = true;
          const {data} = await Vue.prototype.$http.get(`/invoices/${this.invoiceNumber}}/details?
        &page=${this.page}
        &per_page=${this.perPage}`.replace(/ /g, ''))
          this.loading = false;
          this.invoices = data.invoices || []
          this.sum = data.sum || 0;
          if (data.invoices === null || data.invoices.length === 0) this.$store.dispatch(SHOW_TOAST_MESSAGE, {
            message: 'There are no invoices for this reseller within the search criteria selected. ',
            status: 'info'
          })
          if (!data.pageMeta) return;
          this.totalPages = data.pageMeta.totalPages
        } catch (e) {
          this.loading = false;
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: 'There was an error searching for invoices. Please ensure the dates are coorect and try again, If the problem persists please contact Technical Support', status: 'danger'})
        }
      }, handleQuery({page, perPage}) {
        this.query = {
          invoice_number: this.invoiceNumber,
          per_page: perPage,
          page,
        }
      }
    }, watch: {
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
        per_page,
        page,
      } = this.$route.query;
      if (!invoice_number) {
        this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: 'Please enter valid search criteria before submitting your request.', status: 'danger'})
        this.$router.push('/reseller/search')
      }
      this.invoiceNumber = invoice_number || '';
      this.perPage = per_page || this.perPage;
      this.page = page || this.page;
      this.viewInvoices();
    },
  }
</script>
<style scoped>
  .invoices-search-header .form-group {
    margin: 0 !important;
  }
</style>
