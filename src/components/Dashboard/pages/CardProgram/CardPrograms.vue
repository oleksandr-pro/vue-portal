<template>
  <div>
    <div class="card-header bg-white">
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <h4 class="card-title display-inline">
            {{ $t('card_program.listing.title') }}
          </h4>
          <div class="pl-2">
            <p>
              {{ $t('card_program.listing.tips.line1') }}
              <br/>
              {{ $t('card_program.listing.tips.line2') }}
            </p>
            <ul>
              <li>{{ $t('card_program.listing.tips.li1') }}</li>
              <li>{{ $t('card_program.listing.tips.li2') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-content row">
        <div class="col-sm-12  tabel-wrapper">
          <div class="p-1">
            <regular-table
              striped
              :headings="tableHeadings"
              :value="allCardPrograms"
              @input="listenToInput"
              :editAll="editAll"
              :editId="editId"
              :uneditableFields="uneditableFields"
            >
              <template slot-scope="index">
                <th>
                  <div class="cell">
                    <!-- <AbaButton
                       context="primary"
                       :key="index.index.index+index.index.id"
                       @click="editCardProgram(index)"
                       tooltip="edit card program"

                     >
                       <i class="fa  fa-pencil"></i>
                     </AbaButton>-->
                    <p-button
                      @click="editCardProgram(index)"
                      :key="index.index.index+index.index.id+'edit'"
                      type="primary"
                      link=""
                      v-if="hasPermission(permission.CARD_PROGRAM_EDIT)"
                    >
                      {{ $t('card_program.listing.button.edit') }}
                    </p-button>
                    <span class="px-1"></span>
                    <!--       <AbaButton
                             context="primary"
                             :key="index.index.index+index.index.id"
                             @click="viewDetailedCardProgram(index)"
                             tooltip="view card program"
                           >
                             <i class="fa  fa-eye"></i>
                           </AbaButton>-->
                    <p-button
                      @click="viewDetailedCardProgram(index)"
                      :key="index.index.index+index.index.id+'view'"
                      type="primary"
                      link=""
                      v-if="hasPermission(permission.CARD_PROGRAM_VIEW)"
                    >
                      {{ $t('card_program.listing.button.view') }}
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
    <transition name="fade" mode="out-in">
      <div class="row">
        <div class="col-md-12  ">
          <div class="pull-right ">
            <!-- 
            <p-button round :type="editId || editAll ?'primary':'success'" @click="handleEditAction">
              <div class="d-flex align-items-center">
                <Loader v-if="loadingState ==='sending'"></Loader>
                {{editId || editAll ? 'SAVE':'Download'}}
              </div>
            </p-button>
            -->
            <!--
            <p-button round :type="editId || editAll ? 'secondary' :'primary'" @click="handleSecondaryAction">
              {{editId || editAll ?'cancel' :'back'}}
            </p-button>
            -->
          </div>
        </div>
      </div>
    </transition>
    <template
      v-if="loadingState ==='getting'"
    >
      <Spinner
      ></Spinner>
    </template>
  </div>
</template>
<script>
  import { permissionMixin } from '@/mixins/permission'
  import {Button} from 'src/components/UIComponents';
  import {mapActions, mapGetters} from 'vuex'
  import {
    ADD_CARD_PROGRAM,
    EDIT_CARD_PROGRAM,
    GET_ALL_CARD_PROGRAM, GET_ALL_CARD_PROGRAM_LIST,
    GETTER_ALL_CARD_PROGRAM_LIST,
    GETTER_ALL_CARDS,
    GETTER_LOADINGSTATE_CARD_PROGRAM
  } from '../../../../store/types';
  import createCSVData, {fileDownlaodFromEncodedURI} from "../../../../utils/createCSVData";
  import AbaButton from "../../../UIComponents/ABAComponents/AbaButton";
  import Pagination from "../../../UIComponents/ABAComponents/Pagenation/Pagenation";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import Loader from "../../../UIComponents/Loader";
  import PPagination from "../../../UIComponents/Pagination";
  import Spinner from "../../../UIComponents/Spinner";

  export default {
    name: 'CardPrograms',
    mixins: [permissionMixin],
    components: {
      Pagination,
      PPagination,
      AbaButton,
      Loader,
      Spinner,
      PButton, RegularTable,
      [Button.name]: Button
    },
    data() {
      return {
        tableHeadings: [
          //main
          {label: 'psf Ref', name: 'psfRef', i18n: 'card_program.listing.table_header.psf_ref'},
          {label: 'issuer Inst', name: 'issuerInst', i18n: 'card_program.listing.table_header.issuer_inst'},
          {label: 'PM Inst', name: 'pmInst', i18n: 'card_program.listing.table_header.pm_inst'},
          {label: 'PO Inst', name: 'poInst', i18n: 'card_program.listing.table_header.po_inst'},
          {label: 'CPC', name: 'cardProgCode', i18n: 'card_program.listing.table_header.card_prog_code'},
          {label: 'card program description', name: 'cardProgDesc', i18n: 'card_program.listing.table_header.card_prog_desc'},
        ],
        editAll: false,
        editId: '',
        editedData: null,

        allCardPrograms: [],
        uneditableFields: [],
        page: 0,
        perPage: 10,
        totalPages: 0
      }
    },
    computed: {
      ...mapGetters({
        cardData: GETTER_ALL_CARD_PROGRAM_LIST,
        loadingState: GETTER_LOADINGSTATE_CARD_PROGRAM
      }),
    },
    watch: {
      cardData(newVal) {
        this.allCardPrograms = [...(newVal.cardProgramList || [])]
        if (!newVal.pageMeta) return;
        this.totalPages = newVal.pageMeta.totalPages || 0;

      }, page(newVal) {
        this.getCardList()
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
        getAllCardPrograms: GET_ALL_CARD_PROGRAM_LIST,
        editSingleCard: EDIT_CARD_PROGRAM,
        createACardProgram: ADD_CARD_PROGRAM
      }), getCardList() {
        this.$router.push({
          path: `/card-program/view`, query: {
            page: this.page,
            per_page: this.perPage
          }
        })

        this.getAllCardPrograms({
          page: this.page,
          perPage: this.perPage,
        });
      },
      editCardProgram({index: {id}}) {
        this.$router.history.push({
          path: `/card-program/card/${id}`,
          query: {
            edit: true
          }
        })
      }, viewDetailedCardProgram({index: {id}}) {
        this.$router.history.push({
          path: `/card-program/card/${id}`,
          query: {
            edit: false
          }
        })
      },
      handleEditAction() {
        if (this.editAll || this.editId && this.loadingState === 'ideal') return this.saveEdition();
        // download
        this.getCSVfile();
        // this.editAll = true;
      }, saveEdition() {
        // on edit ?
        if (this.loadingState === 'sending') return;

        if (this.editId !== '') {
          // on edit for faiure creating new card
          //massage data -> remove edit prop
          const {id, edit, ...body} = this.allCardPrograms.find(i => i.id === this.editId);
          if (this.editId === 'card_program_new_row') {
            // create
            this.createACardProgram({body});

            return;
          } else {

            //massage data -> remove edit prop
            // edit single card
            this.editSingleCard({body, id})
          }
        } else {
          // editing multiple cards unhandled by the api
          alert('editing multiple cards unhandled by the api currently')
        }
      },
      handleSecondaryAction() {
        if (this.editAll || this.editId) {
          this.editAll = false;
          this.editId = '';
          // this.allCardPrograms = [...this.cardData];
          // return;
        }
      },
      listenToInput({value}) {
        this.allCardPrograms = value;
      }, 
      getCSVfile() {
        console.log('getCSVfile')
        const csvString = createCSVData(this.tableHeadings, this.cardData.cardProgramList)
        const encodedUri = encodeURI(csvString);
        fileDownlaodFromEncodedURI(encodedUri, 'cardProgram');
      }, 
      onPerpageChange(ev) {
        const newPage = (this.page * this.perPage) / ev
        const page = Math.floor(isFinite(newPage) ? newPage : 0);
        this.perPage = ev;
        if (this.page === page) {
          return this.getCardList();
        }
        this.page = page
        this.getCardList()

      }
    },
    mounted() {
      const {page, per_page} = this.$route.query
      this.perPage = +per_page || this.perPage;
      this.page = +page || this.page;
      if (!page && !per_page) {
        this.$router.push({
          path: `/card-program/view`, query: {
            page: this.page,
            per_page: this.perPage
          }
        })
      }
      this.getCardList()
    }
  }
</script>
<style scoped>
  .display-inline {
    display: inline;
  }

  .card-header {
    padding-bottom: 2rem;
  }

  .card-content .tabel-wrapper {
    margin-top: 10px;
  }

  .actionsWrapper {
    padding-top: 1rem;
    text-align: right;
  }

  @media (max-width: 620px) {
    .actionsWrapper {
      padding-top: 1rem;
      text-align: right;
    }
  }

  .card-header {
    border: none !important;
  }
</style>
