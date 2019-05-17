<template>
  <div>
    <div class="card-header border-0 bg-white">
      <h4 class="card-title">
        {{ $t('approve_debit.listing.title') }}
      </h4>
      <div class="pl-2">
        <p>
          {{ $t('approve_debit.listing.tips.line1') }}
        </p>
      </div>
    </div>
    <div class="w-100 d-flex">
      <div class="ml-auto">
        <div class="d-flex align-items-center align-content-center">
          <span class="px-2">{{ $t('approve_debit.listing.search_filter.card_program') }}</span>
          <el-select class="select-default"
                     v-if=""
                     size="small"
                     placeholder="selected a card program"
                     v-model="cardProgramId"
          >
            <el-option v-for="card in cardPrograms "
                       class="select-success"
                       :value="card.id"
                       :label="card.cardProgCode"
                       :key="card.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-content row">
        <div class="col-sm-12">
          <div class="p-3">
            <regular-table
              striped
              :headings="tableHeadings"
              :value="tableData"
              :extraHeadings="1"
            >
              <template slot-scope="index">
                <th :key="index.index.id">
                  <div class="cell">
                    <p-button type="success" link @click="handleApprove(index.index.id)">
                      {{ $t('approve_debit.listing.button.approve') }}
                    </p-button>
                    <span class="p-1"></span>
                    <p-button type="primary" link @click="handleDecline(index.index.id)">
                      {{ $t('approve_debit.listing.button.decline') }}
                    </p-button>
                    <span class="p-1"></span>
                    <p-button @click="showSoftDocs(index)">
                      {{ $t('approve_debit.listing.button.sof') }}
                    </p-button>
                  </div>
                </th>
              </template>
            </regular-table>
            <Pagination :page-count="pageCount" v-model="page"
                        @perpagechange="onPerpageChange"
                        :perPage="perPage">
            </Pagination>
          </div>
        </div>
      </div>
    </div>
    <sof-uploader
      v-model="showSoftUploader"
      :soft-docs="softDocs"
      :floatId="selectedFloatId"
      @dataChanged="handleSofDataChange"
    >
    </sof-uploader>
    <spinner
      v-if="loadingState === 'getting'"></spinner>
  </div>
</template>
<script>
  import {Select, Option} from "element-ui";
  import {mapActions, mapGetters} from 'vuex';
  import Vue from 'vue';
  import {
    GET_ALL_CARD_PROGRAM, GET_ALL_RESELLER_SUBSCRIPTIONS,
    GET_PENDING_FLOATS_BYCARDID, GET_REVIEWED_FLOATS_BYCARDID, GETTER_ALL_CARDS, GETTER_LOADINGSTATE_FLOAT_BALANCE,
    GETTER_PENDING_FLOATS,
    GETTER_RESELLER_SUBSCRIPTION, GETTER_RESELLER_SUBSCRIPTIONS, GETTER_REVIEWD_FLOATS,
    SET_MODAL_TYPE, SHOW_TOAST_MESSAGE
  } from '../../../../store/types';
  // import {formatedMoney} from "../../../../utils/inputMasks";
  import {moneyFormatAppendCurrency} from "../../../../utils/moneyFormat";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import SofUploader from "../../../UIComponents/ABAComponents/SofUploader/SofUploader";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import {AbaModalEvents} from '../../../../main';
  import Spinner from "../../../UIComponents/Spinner";

  export default {
    name: 'ApproveDebit',
    components: {
      Pagination,
      SofUploader,
      Spinner,
      PButton, RegularTable,
      [Option.name]: Option,
      [Select.name]: Select,
    },
    data() {
      return {
        dialog: false,
        approve: false,
        tableHeadings: [
          // todo :  get card program code by card program id (populate)
          {label: 'CPC', name: 'cardProgCode', i18n: 'approve_debit.listing.table_header.card_prog_code'},
          {label: 'RC', name: 'resellerCode', i18n: 'approve_debit.listing.table_header.reseller_code'},
          {label: 'reseller name', name: 'resellerName', i18n: 'approve_debit.listing.table_header.reseller_name'},
          {label: 'Setup By', name: 'submitUser', i18n: 'approve_debit.listing.table_header.submit_user'},
          {label: 'charge type', name: 'entryType', i18n: 'approve_debit.listing.table_header.entry_type'},
          {label: 'Description', name: 'entryDesc', i18n: 'approve_debit.listing.table_header.entry_desc'},

          // {label: 'Currency', name: 'currency'},
          {label: 'float amount', name: 'amount', i18n: 'approve_debit.listing.table_header.amount'},
          {label: 'Has sof docs', name: 'withSof', i18n: 'approve_debit.listing.table_header.with_sof'},
          // {label: 'status', name: 'status'},

        ],
        tableData: [],
        cardProgramId: '',
        currency: '',
        selectedFloatId: '',
        softDocs: [],
        page: 0,
        perPage: 10,
        showSoftUploader: false
      }
    },
    computed: {
      ...mapGetters({
        pendingFloats: GETTER_PENDING_FLOATS,
        resellers: GETTER_RESELLER_SUBSCRIPTIONS,
        loadingState: GETTER_LOADINGSTATE_FLOAT_BALANCE
      }),
      cardPrograms() {
        // return (this.$store.state.cardProgram.allCardPrograms || [])
        //   .reduce((acc, i) => !!acc.find(({cardProgCode}) => i.cardProgCode === cardProgCode)
        //     ? acc
        //     : [...acc, i]
        //     , [])

        return (this.$store.state.cardProgram.allCardPrograms || []).filter((data) => {
          return data.defCurrency === this.currency
        })
      },
      pageCount() {
        const pageMeta = this.pendingFloats.pageMeta;

        return pageMeta ? this.tableData.length == 0 ? 0 : pageMeta.totalPages : 0
      },
    },
    methods: {
      ...mapActions({
        getPendingFloats: GET_PENDING_FLOATS_BYCARDID,
        showModal: SET_MODAL_TYPE,
        getAllCards: GET_ALL_CARD_PROGRAM,
        getResellers: GET_ALL_RESELLER_SUBSCRIPTIONS,

      }),
      showSoftDocs({index: {id}}) {
        const {sofDocs} = this.tableData.find(({id: floatId}) => id === floatId)
        this.selectedFloatId = id;
        this.softDocs = sofDocs || [];
        this.showSoftUploader = true;
      }, onPerpageChange(ev) {
        this.perPage = ev;
      },
      massageFloats() {
        if (!(this.cardPrograms.length > 0 &&
          this.resellers.length > 0 &&
          this.pendingFloats
        )) return;
        const {cardProgCode} = this.cardPrograms.find(({id}) => id === this.cardProgramId);
        this.tableData = (this.pendingFloats['floatAccountEntryResultList'] || []).map(float => {
          const {resellerName, resellerCode} = this.resellers.find(({cardProgramID}) => float.cardProgId === cardProgramID);
          return {
            ...float,
            resellerName,
            resellerCode,
            cardProgCode,
            withSof: (float.sofDocs && float.sofDocs.length > 0) ? 'yes' : 'no',
            amount: moneyFormatAppendCurrency(float.amount, float.currency || 'EUR')
          }
        })
      },
      handleUpdatePendingFloats() {
        if (this.cardProgramId) {
          this.$router.push({
            path: `/float-account/approve-debit`,
            query: {
              card_program_id: this.cardProgramId,
              page: this.page,
              per_page: this.perPage,
              currency: this.currency,
            }
          })

        }
        console.log(this.cardProgramId);
        this.getPendingFloats({
          cardProgramId: this.cardProgramId,
          page: this.page,
          perPage: this.perPage
        })
      },
      handleApprove(id) {
        const key = Date.now() + 'approve'
        this.showModal({
          type: 'normal',
          message: this.$t('approve_debit.listing.confirm_modal.approve.message'),
          copy: this.$t('approve_debit.listing.confirm_modal.approve.copy'),
          mainButton: this.$t('approve_debit.listing.confirm_modal.approve.main_button'),
          secondaryButton: this.$t('approve_debit.listing.confirm_modal.approve.secondary_button'),
          key
        })

        AbaModalEvents.$on(key, response => {
          if (response.ok) {
            Vue.prototype.$http.put(`/floats/${id}`, {
              status: 'APPROVE'
            }).then(_ => {
              this.$store.dispatch(SHOW_TOAST_MESSAGE,
                {message: this.$t('approve_debit.listing.toast.approve.success'), status: 'success'})
              this.handleUpdatePendingFloats()
            }).catch(err => {
              console.log(err);
              this.$store.dispatch(SHOW_TOAST_MESSAGE,
                {message: this.$t('approve_debit.listing.toast.approve.fail'), status: 'danger'})
            })
          }
          AbaModalEvents.$off(key)
        })

      },
      handleDecline(id) {
        const key = Date.now() + 'decline'
        this.showModal({
          type: 'withTextarea',
          message: this.$t('approve_debit.listing.confirm_modal.decline.message'),
          copy: this.$t('approve_debit.listing.confirm_modal.decline.copy'),
          mainButton: this.$t('approve_debit.listing.confirm_modal.decline.main_button'),
          secondaryButton: this.$t('approve_debit.listing.confirm_modal.decline.secondary_button'),
          key
        })

        AbaModalEvents.$on(key, async response => {
          if (response.ok) {
            Vue.prototype.$http.put(`/floats/${id}`, {
              "reason": response.message,
              "status": "DECLINE"
            }).then(_ => {
              this.$store.dispatch(SHOW_TOAST_MESSAGE,
                {message: this.$t('approve_debit.listing.toast.decline.success'), status: 'success'})
              this.handleUpdatePendingFloats()

            }).catch(err => {
              console.log(err);
              this.$store.dispatch(SHOW_TOAST_MESSAGE,
                {message: this.$t('approve_debit.listing.toast.decline.fail'), status: 'danger'})
            })
          }
          AbaModalEvents.$off(key)
        })
      }, handleSofDataChange() {
        this.handleUpdatePendingFloats()

      }
    },
    watch: {
      cardProgramId(newVal, _) {
        this.handleUpdatePendingFloats()

      }, cardPrograms(newVal, oldVal) {
        if (newVal.length === oldVal.length) return;
        this.massageFloats()

      }, resellers(newVal, oldVal) {
        if (newVal.length === oldVal.length) return;

        this.massageFloats()
      },

      perPage(newVal, oldVal) {
        const newPage = (this.page * oldVal) / newVal
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        console.log(newVal, oldVal, newPage, page);
        console.log(this.page === page, this.page, page);
        if (this.page === page) {
          return this.handleUpdatePendingFloats();

        }

        this.page = page

      }, page() {
        this.handleUpdatePendingFloats()
      }
      , pendingFloats() {
        this.massageFloats()
      },
      showSoftUploader(newVal) {
        if (!newVal) this.selectedFloatId = '';
      }, tableData(newVal) {
        if (this.selectedFloatId) {
          const {sofDocs} = this.tableData.find(({id: floatId}) => this.selectedFloatId === floatId)
          this.softDocs = sofDocs || [];
        }
      }
    },
    mounted() {
      this.getAllCards()
      this.getResellers()
      const {page, per_page, card_program_id, currency} = this.$route.query
      if (card_program_id !== 'undefined' && card_program_id) {
        this.page = +page || this.page;
        this.perPage = +per_page || this.perPage;
        this.cardProgramId = card_program_id || this.cardProgramId;
        this.currency = currency || this.currency
        this.$router.push({
          path: `/float-account/approve-debit`,
          query: {
            card_program_id: this.cardProgramId,
            page: this.page,
            per_page: this.perPage,
            currency: this.currency
          }
        })
      }

    }
  }
</script>
<style scoped lang="scss">
  .p-2 {
    padding: 1rem .5rem 2rem;
  }

  /* .ceevo_approve_alert {
       .card-title {
         text-align: center;
         font-weight: bold;
         margin-bottom: 2rem;
       }
       .ceevo_approve_actions {
         position: relative;
         text-align: center;
         margin: 1rem auto;
       }
       .reason-for-deline {
         padding: 3rem 0;
       }
     }*/
  .el-select {
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
