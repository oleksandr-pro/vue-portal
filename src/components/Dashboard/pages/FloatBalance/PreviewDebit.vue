<template>
  <div>
    <div class="card-header border-0 bg-white">
      <h4 class="card-title">
        {{ $t('preview_debit.listing.title') }}
      </h4>
      <div class="pl-2">
        <p>
          {{ $t('preview_debit.listing.tips.line1') }}
        </p>
        <ul>
          <li>{{ $t('preview_debit.listing.tips.li1') }}</li>
        </ul>
      </div>
    </div>
    <div class="w-100 d-flex">
      <div class="d-flex align-items-center flex-wrap">
        <div class="py-2">
          <div>
            <span class="px-2">{{ $t('preview_debit.listing.search_filter.from') }}</span>
            <el-date-picker v-model="fromDate" type="date"
                            placeholder="Pick Starting Date"
                            :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </div>
        <div class="py-2">
          <div>
            <span class="px-2">{{ $t('preview_debit.listing.search_filter.to') }}</span>
            <el-date-picker
              v-model="toDate" type="date" placeholder="Pick Ending Date"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="ml-auto d-flex">
        <div class="d-flex align-items-center align-content-center">
          <span class="px-2">
            <span class="required-field-sympol" style="">*</span>
            {{ $t('preview_debit.listing.search_filter.card_program') }}
          </span>
          <el-select class="select-default"
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
        <div class="d-flex align-items-center align-content-center" v-if="!$oAuth.isReseller()">
          <span class="px-2">
            {{ $t('preview_debit.listing.search_filter.reseller') }}
          </span>
          <el-select class="select-default"
                     size="small"
                     placeholder="selected a card program"
                     v-model="resellerCode"
          >
            <el-option v-for="reseller in resellersMenu "
                       class="select-success"
                       :value="reseller.resellerCode"
                       :label="reseller.resellerCode"
                       :key="reseller.id"
                       >
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
              :addToHeaders="[{name:'softDocss' ,label:'softDoc', i18n: 'preview_debit.listing.table_header.sof_doc'}]"
            >
              <template slot-scope="index">
                <th>
                  <div class="cell">
                    <p-button
                      @click="showSoftDocs(index)"
                      v-if="showSoftDocs(index,true)"
                    >
                      {{ $t('preview_debit.listing.button.sof') }}
                    </p-button>
                    <div class="cell" v-else>--</div>
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
    <transition name="fade" mode="out-in">
      <div class="row">
        <div class="col-md-12  ">
          <div class="pull-right ">
            
            <p-button round type="success" @click="download" :disabled="tableData.length < 1">
              <div class="d-flex align-items-center">
                {{ $t('preview_debit.listing.button.download') }}
              </div>
            </p-button>
            <a ref="downloadEr" style="display: none;"></a>
          </div>
        </div>
      </div>
    </transition>
    <spinner v-if="loadingState ==='getting'">
    </spinner>
    <sof-uploader
      v-model="showSoftUploader"
      :soft-docs="softDocs"
      :floatId="selectedFloatId"
      :readOnly="true"
    >
    </sof-uploader>
  </div>
</template>
<script>
  import {DatePicker, Option, Select, TimeSelect} from "element-ui";
  import {mapActions, mapGetters} from 'vuex';
  import {
    GET_ALL_CARD_PROGRAM,
    GET_ALL_RESELLER_SUBSCRIPTIONS,
    GET_REVIEWED_FLOATS_BYCARDID,
    GETTER_ALL_CARDS,
    GETTER_LOADINGSTATE_FLOAT_BALANCE,
    GETTER_RESELLER_SUBSCRIPTIONS,
    GETTER_REVIEWD_FLOATS
  } from '../../../../store/types';
  import {formatDate} from "../../../../utils/Date";
  // import {formatedMoney} from "../../../../utils/inputMasks";
  import {moneyFormatAppendCurrency} from "../../../../utils/moneyFormat";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import SofUploader from "../../../UIComponents/ABAComponents/SofUploader/SofUploader";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import Spinner from "../../../UIComponents/Spinner";
  import {b64toBlob} from "../../../../utils/createCSVData";
  
  export default {
    name: 'ApproveDebit',
    components: {
      Pagination,
      SofUploader,
      Spinner,
      PButton, RegularTable,
      [Option.name]: Option,
      [Select.name]: Select,
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
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
        dialog: false,
        approve: false,
        pageNum: 0,
        pageSize: 10,
        query: {},
        tableHeadings: [
          {label: 'CPC', name: 'cardProgCode', i18n: 'preview_debit.listing.table_header.card_prog_code'},
          {label: 'RC', name: 'resellerCode', i18n: 'preview_debit.listing.table_header.reseller_code'},
          {label: 'reseller name', name: 'resellerName', i18n: 'preview_debit.listing.table_header.reseller_name'},
          {label: 'setup by', name: 'createdBy', i18n: 'preview_debit.listing.table_header.created_by'},
          {label: 'decision by', name: 'reviewUser', i18n: 'preview_debit.listing.table_header.review_user'},
          {label: 'charge type', name: 'entryType', i18n: 'preview_debit.listing.table_header.entry_type'},
          {label: 'Review Date', name: 'reviewDate', i18n: 'preview_debit.listing.table_header.review_date'},
          {label: 'Description', name: 'entryDesc', i18n: 'preview_debit.listing.table_header.entry_desc'},
          {label: 'amount', name: 'amount', i18n: 'preview_debit.listing.table_header.amount'},
          {label: 'action', name: 'status', i18n: 'preview_debit.listing.table_header.status'},
          {label: 'comment', name: 'comment', i18n: 'preview_debit.listing.table_header.comment'},
        ],
        tableData: [],
        cardProgramId: '',
        selectedFloatId: '',
        softDocs: [],
        showSoftUploader: false,
        page: 0,
        perPage: 10,
        totalPages: 0,
        fromDate: '',
        resellerCode: 'ALL',
        toDate: ''
      }
    }, computed: {
      ...mapGetters({
        reviewedFloats: GETTER_REVIEWD_FLOATS,
        resellers: GETTER_RESELLER_SUBSCRIPTIONS,
        loadingState: GETTER_LOADINGSTATE_FLOAT_BALANCE,
        allCardPrograms: GETTER_ALL_CARDS
      }),
      cardPrograms() {
        return (this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, i) => !!acc.find(({cardProgCode}) => i.cardProgCode === cardProgCode)
            ? acc
            : [...acc, i]
            , [])
      }, resellersMenu() {
        return (this.$store.state.reseller.resellerSubscriptions || [])
          .reduce((acc, i) => !!acc.find(({resellerCode}) => i.resellerCode === resellerCode)
            ? acc
            : [...acc, i]
            , [{
              resellerCode: 'ALL',
              id: '____reseller__id'
            }])
      }
    },
    methods: {
      ...mapActions({
        getAllCards: GET_ALL_CARD_PROGRAM,
        getReviewFloats: GET_REVIEWED_FLOATS_BYCARDID,
        getResellers: GET_ALL_RESELLER_SUBSCRIPTIONS,
      }), onPerpageChange(ev) {
        this.perPage = ev;
      },
      showSoftDocs({index: {id}}, $return = false) {
        const {sofDocs} = this.tableData.find(({id: floatId}) => id === floatId)
        if ($return) return (sofDocs && sofDocs.length > 0)
        this.softDocs = sofDocs || [];
        this.selectedFloatId = id;
        this.showSoftUploader = true;
      }, 
      handleQuery({cardProgramId, currencyCode, resellerCode, fromDate, toDate, page, perPage} = {}) {
        if (!this) return;
        fromDate = (fromDate || this.fromDate) ? formatDate(fromDate || this.fromDate) : '';
        toDate = (toDate || this.toDate) ? formatDate(toDate || this.toDate) : '';
        this.query = {
          card_program_id: cardProgramId || this.cardProgramId,
          reseller_code: resellerCode || this.resellerCode,
          per_page: perPage || this.perPage,
          page: page || this.page,
          fromDate,
          toDate,
        }
      },
      massageFloats() {
        if (!(this.allCardPrograms.length > 0 &&
          this.resellers.length > 0 &&
          this.reviewedFloats
        )) return;
        console.log('massaged');
        const {cardProgCode} = this.cardPrograms.find(({id}) => id === this.cardProgramId);
        this.tableData = this.reviewedFloats['reviewedFloatAccountEntryResultList']
          .map(float => {
            const {resellerName, resellerCode} = this.resellers.find(({resellerId}) => float.resellerId === resellerId);
            const {cardProgCode} = this.allCardPrograms.find(({id}) => float.cardProgId === id);
            return {
              ...float,
              amount: moneyFormatAppendCurrency(float.amount, float.currency),
              resellerName,
              resellerCode,
              cardProgCode,
              withSof: (float.sofDocs && float.sofDocs.length > 0) ? 'yes' : 'no',

            }
          })
      },
      handleGettingReviewedFloats() {
        if (!this.cardProgramId) return;
        this.getReviewFloats({
          cardProgramId: this.cardProgramId,
          page: this.page,
          perPage: this.perPage,
          // the date picker will return jan 1970 if the user chosed to reove the selected date
          toDate: formatDate(this.toDate ,false,true),
          fromDate: formatDate(this.fromDate,false,true),
          resellerCode: this.$oAuth.isReseller() ? this.$oAuth.getCurrentResellerCode() : this.resellerCode,
        })
      },
      download() {
        let requestObj = {}
        if (this.resellerCode !== 'ALL') {
          requestObj.reseller_code = this.$oAuth.isReseller() ? this.$oAuth.getCurrentResellerCode() : this.resellerCode
        }

        if (formatDate(this.fromDate,false,true) !== '') {
          requestObj.from_date = formatDate(this.fromDate,false,true)
        }

        if (formatDate(this.toDate ,false,true) !== '') {
          requestObj.to_date = formatDate(this.toDate ,false,true)
        }

        this.$http.get(`/cardprograms/${this.cardProgramId}/floats/reviewed/export`, requestObj).then((response) => {
          const data = response.data
          const $ancoreElement = this.$refs.downloadEr;
          const blobURI = URL.createObjectURL(b64toBlob(data.encodedFile, data.contentType, data.fileSize))
          $ancoreElement.setAttribute("href", blobURI);
          $ancoreElement.setAttribute("download", data.fileName);
          $ancoreElement.click();
        })
      }

    }, watch: {
      cardProgramId(cardProgramId) {
        this.handleQuery({cardProgramId})
      }, fromDate(fromDate) {
        this.handleQuery({fromDate})

      }, toDate(toDate) {
        this.handleQuery({toDate})
      }
      , query(newQuery) {
        this.$router.push({
          path: this.$route.path,
          query: Object.keys(newQuery)
            .reduce((acc, key) => (newQuery[key] !== void 0 && newQuery[key] !== '') ?
              {...acc, [key]: newQuery[key]}
              : acc,
              {})

        })
        this.handleGettingReviewedFloats()
      },
      reviewedFloats(newVal) {
        this.massageFloats()
        if (!newVal.pageMeta) return;
        this.totalPages = newVal.pageMeta.totalPages
      }, allCardPrograms(newVal, oldVal) {
        if (newVal.length === oldVal.length) return;
        this.massageFloats()

      }, resellers(newVal, oldVal) {
        if (newVal.length === oldVal.length) return;
        this.massageFloats()
      }, resellerCode(resellerCode) {
        this.handleQuery({resellerCode})
      },
      perPage(newVal, oldVal) {
        const newPage = (this.page * oldVal) / newVal
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        console.log(this.page === page, this.page, page);
        if (this.page === page) {
          return this.handleGettingReviewedFloats();

        }

        this.page = page

      },
      page() {
        this.handleGettingReviewedFloats()
      },
    },
    mounted() {
      this.getAllCards()
      this.getResellers()
      const {
        page
        , per_page,
        card_program_id,
        reseller_code,
        from_date,
        to_date,
      } = this.$route.query
      this.page = +page || this.page;
      this.perPage = +per_page || this.perPage;
      this.cardProgramId = card_program_id || this.cardProgramId;
      this.resellerCode = reseller_code || this.resellerCode;
      this.toDate = to_date || this.toDate;
      this.fromDate = from_date || this.fromDate;
    }
  }
</script>
<style scoped lang="scss">
  .p-2 {
    padding: 1rem .5rem 2rem;
  }


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
