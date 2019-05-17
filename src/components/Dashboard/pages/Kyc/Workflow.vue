<template>
  <div class="">
    <div class="filter row">
      <h3 class="col-12 t-bold">Filter</h3>
      <div class="col-12 col-xs-8 col-md-6 col-lg-5">
        <div class="item row">
          <div class="label-start col-4">Client</div>
          <div class="col-8">
            <div class="select ">
              <el-select class="select-default border-gray"
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
        <div class="item row">
          <div class="label-start col-4">Date</div>
          <div class="col-8">
            <div class="date">
              <el-date-picker v-model="fromDate" type="date"
                              placeholder="From"
                              :picker-options="pickerOptions1">
              </el-date-picker>
              <el-date-picker v-model="toDate" type="date"
                              placeholder="To"
                              :picker-options="pickerOptions1">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="item row">
          <div class="label-start col-4" >Type</div>
          <div class="col-8">
          <div class="select">
            <el-select class="select-default border-gray"
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
        <div class="item row">
          <div class="col-4">Oldest first</div>
          <div class="col-8">
          <div >
            <span >Yes</span>
            <span class="px-2"></span>
            <p-switch v-model="oldFirst" type="success"></p-switch>
            <span class="px-2"></span>
            <span>No</span>
          </div>
          </div>
        </div>
        <div class="item row">
          <div class="col-4">Number of jobs</div>
          <div class="col-8">
            256
          </div>
        </div>
        <div class="item row">
          <div class="label-start col-4">Start Workflow</div>
          <div class="col-8">
          <div class="justify-content-center">
            <p-button class="start-button"
              type="primary"
            >
              Go
            </p-button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="filter row">
      <h3 class="col-12 t-bold">Listing</h3>
      <div class="card">
        <div class="card-content row">
          <div class="col-sm-12">
          <regular-table
            striped
            bordered
            :headings="tableHeadings"
            :value="allClients"
            @input="listenToInput"
            :editAll="editAll"
            :editId="editId"
            :uneditableFields="uneditableFields"
          >
            <template slot-scope="index">
              <th>
                <div class="cell">
                  <p-button
                    :key="index.index.index+index.index.id+'edit'"
                    type="primary"
                    link=""
                  >
                    Action
                  </p-button>
                </div>
              </th>
            </template>
          </regular-table>
          <!--  <Pagination :page-count="10" v-model="currentPage" perpagechange="onPerpageChange" :perPage="perPage"></Pagination>-->
          <Pagination :page-count="totalPages" v-model="page"
                      @perpagechange="onPerpageChange"
                      :perPage="perPage">
          </Pagination>
        </div>
      </div>
      </div>
    </div>

  </div>

</template>
<script>
  import {mapActions, mapGetters} from 'vuex';
  import {DatePicker, Option, Select, TimeSelect} from "element-ui";
  import {Switch} from "../../../UIComponents";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable';
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import {GETTER_All_CLIENTS_LIST,GETTER_All_CLIENTS} from "../../../../store/types";

  export default {
    name: "Workflow",
    components: {
      RegularTable,
      Pagination,
      [Option.name]: Option,
      [Select.name]: Select,
      [Switch.name]: Switch,
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
    },
    data() {
      return {
        tableHeadings: [
          {label: '', name: 'date'},
          {label: 'KYC Received', name: 'kyc_received'},
          {label: 'Name', name: 'name'},
          {label: 'App Ref', name: 'app_ref'},
          {label: 'Client Ref', name: 'client_ref'},
          {label: 'App Status', name: 'app_status'},
          {label: 'ID', name: 'id_key'},
          {label: 'POA', name: 'poa'},
          {label: 'Screen', name: 'screen'},

        ],
        editAll: false,
        editId: '',
        editedData: null,
        allClients: [],
        uneditableFields: [],
        totalPages: 0,
        perPage: 10,
        page:0,
        toDate: '',
        fromDate: '',
        oldFirst: true,
        resellerCode: 'ALL',
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
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date)
              }
            },
            {
              text: 'A week ago',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date)
              }
            },
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        clientData: GETTER_All_CLIENTS_LIST,
      }),

      resellersMenu() {
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

    watch: {
      clientData(newVal) {

        this.allClients = [...(newVal.clients || [])];
        console.log('clients', this.allClients );
        if (!newVal.pageMeta) return;
        this.totalPages = newVal.pageMeta.totalPages || 0;
      }, page(newVal) {
        this.getAllClients()
      },
      loadingState(newVal, oldVal) {
        if (oldVal === 'sending' && newVal === 'ideal') {
          this.editAll = false;
          this.editId = '';
        }
      },
    },

    methods: {
      ...mapActions({
        getAllClients: GETTER_All_CLIENTS_LIST,
      }),
      getAllClientsList() {
        this.$router.push({
          path: `/kyc/workflow`, query: {
            page: this.page,
            per_page: this.perPage
          }
        })
        this.getAllClients({
          page: this.page,
          perPage: this.perPage}
        )
      },
      listenToInput({value}) {
        this.allClients = value;
      },
      onPerpageChange(ev) {
        const newPage = (this.page * this.perPage) / ev;
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        this.perPage = ev;
        if (this.page === page) {
          return this.getAllClientsList();
        }
        this.page = page;
        this.getAllClientsList()

      }
    },
    mounted() {
      const {page, per_page} = this.$route.query
      this.perPage = +per_page || this.perPage;
      this.page = +page || this.page;
      if (!page && !per_page) {
        this.$router.push({
          path: `/kyc/workflow`, query: {
            page: this.page,
            per_page: this.perPage
          }
        })
      }
      this.getAllClientsList()
    }
  }
</script>
<style scoped lang="scss">

  .item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    font-weight: 800;

    .label-start {

      transform: translateY(25%);
    }

    .select {
      width: 300px;

      .el-select {
        width: 100%;
      }
      .el-input {
        .el-input__inner {
          border-radius: 0 !important;
          border-width: 1px !important;
          height: 40px !important;
        }
      }
    }
    .date{
      div {
        width: 140px !important;
        &:first-child {
          margin-right: 17px !important;
        }
      }

    }
    .start-button {
      padding: 10px 70px;
      border-radius: 30px;
    }
  }

  .filter .t-bold {
    font-weight: bold;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #5bd684;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #5bd684;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

</style>
