<template>
  <div>
    <div>
      <div>
        <div class="card-header bg-white border-0">
          <h4 class="card-title">
            {{ $t('setup_debit.create.title') }}
          </h4>
          <div class="pl-2">
            <p>
              {{ $t('setup_debit.create.tips.line1') }}
            </p>
            <ul>
              <li>{{ $t('setup_debit.create.tips.li1') }}</li>
              <li>{{ $t('setup_debit.create.tips.li2') }}</li>
              <li>{{ $t('setup_debit.create.tips.li3') }}</li>
            </ul>
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
                  @input="handleInput"
                  :editId="editId"
                >
                  <template slot-scope="index">
                    <th>
                      <div class="cell" :key="index.index.id +'uploader'"
                      >
                        <p-button
                          @click="showSoftDocs(index)">
                          {{ $t('setup_debit.create.button.sof') }}
                        </p-button>
                      </div>
                    </th>
                  </template>
                </regular-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <sof-uploader
        v-model="showSoftUploader"
        :soft-docs="softDocs"
        :select-only="true"
        @dataChanged="void 0"
        floatId="new_record"
        @sofDocsSelected="handleSofDocsSelection"
      >
      </sof-uploader>
    </div>
    <div class="pull-right ">
      <p-button round type="primary" @click="handleSettingDebit"
                :disabled="!valid"
      >
        <div class="d-flex align-items-center">
          <loader v-if="loadingState ==='sending'"></loader>
          {{ $t('setup_debit.create.button.save') }}
        </div>
      </p-button>
      <p-button round @click="handleSecondaryAction">
        {{ $t('setup_debit.create.button.cancel') }}
      </p-button>
    </div>
  </div>
</template>
<script>
  import {Table, TableColumn} from 'element-ui'
  import Vue from 'vue'
  import {AbaModalEvents} from "../../../../main";
  import {mapActions, mapGetters} from 'vuex'
  import {
    ADD_FLOAT_ENTRY,
    GET_ALL_CARD_PROGRAM,
    GET_ALL_FLOATS,
    GET_ALL_RESELLER_SUBSCRIPTIONS,
    GETTER_ALL_CARDS,
    GETTER_FLOATS,
    GETTER_LOADINGSTATE_FLOAT_BALANCE, GETTER_RESELLER_SUBSCRIPTIONS, SET_MODAL_TYPE, SHOW_TOAST_MESSAGE
  } from '../../../../store/types';
  import createNewRowFromHeadings from "../../../../utils/createNewRowFromHeadings";
  import {breakInput, mustBeAValidISOcurrency, shouldBeNumber} from "../../../../utils/formValidations";
  import {decimals} from "../../../../utils/inputMasks";
  import Uploader from "../../../UIComponents/ABAComponents/abaUploader/Uploader";
  import SofUploader from "../../../UIComponents/ABAComponents/SofUploader/SofUploader";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import Loader from "../../../UIComponents/Loader";
  import Spinner from "../../../UIComponents/Spinner";

  Vue.use(Table)
  Vue.use(TableColumn)
  export default {
    name: 'SetupDebit',
    components: {PButton, SofUploader, Uploader, Loader, Spinner, RegularTable},
    data() {
      return {
        tableHeadings: [
          {
            label: 'CPC', 
            name: 'cardProgCode', 
            i18n: 'setup_debit.create.table_header.card_prog_code', 
            read: true,
          },
          {
            label: 'RC', 
            name: 'resellerCode', 
            i18n: 'setup_debit.create.table_header.reseller_code', 
            read: true,
          },
          {
            label: 'reseller name', 
            name: 'resellerName', 
            i18n: 'setup_debit.create.table_header.reseller_name', 
            read: true,
          },
          // unknown fields name
          {
            label: 'user', 
            name: 'user', 
            i18n: 'setup_debit.create.table_header.user',
            read: true,

          },
          {
            label: 'Charge Type', 
            name: 'entryType', 
            i18n: 'setup_debit.create.table_header.entry_type',
            input: 'select',
            selectKeys: [
              {name: 'Credit', value: 'CREDIT'},
              {name: 'Debit', value: 'DEBIT'},
            ],
            required: true,
          },
          {
            label: 'currency', 
            name: 'currency',
            i18n: 'setup_debit.create.table_header.currency',
            read: true,
            validator: [mustBeAValidISOcurrency],
            brakeAt: breakInput(3),
          },
          {
            label: 'description', 
            name: 'entryDesc',
            i18n: 'setup_debit.create.table_header.entry_desc',
            required: true,
            brakeAt:breakInput(40)
          },
          {
            label: 'amount', 
            name: 'amount',
            i18n: 'setup_debit.create.table_header.amount',
            validator: shouldBeNumber,
            mask: decimals(2),
            $domAttri: {step: '0.01', type: 'number'},
            brakeAt: breakInput(8),
            required: true,
          },
        ],
        tableData: [],
        editId: '',
        cardProgramCode: '',
        resellerCode: '',
        resellerName: '',
        currency: '',
        valid: false,
        dirty: false,
        showSoftUploader: false,
        files: {},
        selectedFloatId: '',
        softDocs: [],
        dataToSend: {
          resellerId: ''
        }
      }
    },
    computed: {
      ...mapGetters({

        loadingState: GETTER_LOADINGSTATE_FLOAT_BALANCE,
      }),
      creationResponseState() { return this.$store.state.UiModule.responseState[ADD_FLOAT_ENTRY]},

      cardPrograms() {
        return (this.$store.state.cardProgram.allCardPrograms || [])
          .reduce((acc, i) => !!acc.find(({cardProgCode}) => i.cardProgCode === cardProgCode)
            ? acc
            : [...acc, i]
            , [])
      },
      resellerSubscriptions() {
        return (this.$store.state.reseller.resellerSubscriptions || [])
          .reduce((acc, i) => !!acc.find(({resellerId}) => i.resellerId === resellerId)
            ? acc
            : [...acc, i]
            , [])
      }
    }, watch: {
      resellerSubscriptions(newVal) {
        this.handleResellerMenuItems(newVal)
      }, cardPrograms(newVal) {
        this.tableHeadings = this.tableHeadings.map(i => i.name === 'cardProgId' ? {
          ...i, selectKeys: newVal.map(({id, cardProgCode}) =>
            ({name: cardProgCode, value: id}))
        } : i)
      }, creationResponseState(newVal, oldVal) {
        if (!oldVal) return this.alert(newVal)
        if (newVal.timeStamp === oldVal.timeStamp) return;
        this.alert(newVal)
      },/*
      'dataToSend.resellerId'(newVal) {
        const {resellerName} = this.resellerSubscriptions.find(({resellerId}) => resellerId == newVal) || {resellerName: ''};
        this.tableData = [{...this.tableData[0], resellerName: resellerName}]
      },*/
      tableData(newVal, oldVal) {
        /* if (!newVal[0]) return;
         if (newVal[0].cardProgId === oldVal[0].cardProgId) return;
         this.handleResellerMenuItems(this.resellerSubscriptions);*/
      }
    },
    methods: {
      ...mapActions({
        getFloats: GET_ALL_FLOATS,
        getAllCards: GET_ALL_CARD_PROGRAM,
        getAllResellerSubscription: GET_ALL_RESELLER_SUBSCRIPTIONS,
        setUpDebit: ADD_FLOAT_ENTRY,
        showModal: SET_MODAL_TYPE
      }), showSoftDocs({index: {id}}) {
        this.selectedFloatId = id;
        this.showSoftUploader = true;
      }, handleSofDocsSelection(ev) {
        this.softDocs = ev.map(({data: content, type: mimeType}) => ({
          content, mimeType
        }))
      }, alert(newVal) {
        if (newVal.state === true) {
          const key = 'handleresponsestate' + 'createreseller';

          this.showModal({
            type: 'normal',
            message: 'The changes are saved ',
            copy: 'any changes will be discarded',
            mainButton: 'Ok',
            key
          })

          AbaModalEvents.$on(key, response => {
            if (response.ok) {
              this.$router.push('/float-account/view-float-account')

            } else {
              this.dirty = false;
            }
            AbaModalEvents.$off(key)
          })
        }
      },
      handleResellerMenuItems(newVal) {
        console.log(newVal, '');
        this.tableHeadings = this.tableHeadings.map(i => i.name === 'resellerId' ? {
          ...i, selectKeys: newVal.filter(i => {
            if (!this.tableData[0]) return true;
            const cardProgId = this.tableData[0].cardProgId;
            return cardProgId ? cardProgId === i.cardProgramID : true;
          }).map(({id, resellerCode, resellerId}) =>
            ({name: resellerCode, value: resellerId}))
        } : i)

      },
      handleInput({value, valid, dirty}) {
        this.tableData = value;
        /*
             const resellerId = this.tableData[0].resellerId;
             const selectKey = this.tableHeadings.find(i => i.name === 'resellerId')['selectKeys']
             this.tableData[0].resellerId = selectKey.find(({value}) => value === resellerId) ?
               resellerId && this.tableData[0].resellerId
               : selectKey.length === 0 ? resellerId && this.tableData[0].resellerId : ''*/
        this.valid = valid;
        this.dirty = this.dirty || !!dirty;
        const {
          id,
          doc,
          user,
          cardProgCode,
          resellerCode,
          resellerName,
          ...dataToSend
        } = value[0];
        this.dataToSend = dataToSend
      }, handleSecondaryAction() {
        if (!this.dirty) return this.$router.push('/float-account/view-float-account')
        const key = 'handle_secodary_aciton_set_up_debit';
        this.showModal({
          type: 'normal',
          message: 'Discard Changes',
          copy: 'any changes will be discarded',
          mainButton: 'Ok',
          secondaryButton: 'no',
          key
        })
        AbaModalEvents.$on(key, response => {
          if (response.ok) {
            this.$router.push('/float-account/view-float-account')

          }
          AbaModalEvents.$off(key)

        })
      },
      handleSettingDebit() {
        // TODO fix it here
        const key = 'handle_main_aciton_set_up_debit';

        this.showModal({
          type: 'normal',
          message: 'Setup new debit ?',
          copy: 'any changes will be discarded',
          mainButton: 'Ok',
          secondaryButton: 'No',
          key
        })
        AbaModalEvents.$on(key, response => {
          if (response.ok) {


            const {cardProgId, ...body} = this.dataToSend;
            console.log(body);
            if (this.loadingState === 'sending') return;
            if (!this.valid) return this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: 'Please ensure you complete all fields correctly.', status: 'danger'})
            console.log(this.softDocs, 'sof docs doc');
            this.setUpDebit({id: cardProgId, body, sofDocs: this.softDocs})
          }
          AbaModalEvents.$off(key)

        })
      }, handleChoseFile(file, id) {
        console.log(file);
        this.files = {
          ...this.files,
          [id]: file
        }
      }
    },
    mounted() {
      this.getAllResellerSubscription();
      this.getAllCards();
      this.editId = 'setup_debit_new_row'
      let {
        card_program_code,
        reseller_code,
        currency,
        reseller_name,
        user,
        card_program_id,
        reseller_id,
      } = this.$route.query;
      console.log(reseller_name, 'reseller name');
      this.tableData = [{
        ...createNewRowFromHeadings(this.tableHeadings, 'setup_debit_new_row'),
        cardProgCode: card_program_code,
        resellerCode: reseller_code,
        currency: currency,
        resellerName: reseller_name,
        resellerId: reseller_id,
        cardProgId: card_program_id,
        user: user || this.$oAuth.getUserInfo().fullName || ''
      }]
    }
  }
</script>
<style scoped>
  .bg-denger {
    background-color: #05980e;
    display: block;
    color: #fff;
  }

  .ceevo__table__cell--nopadding {
    display: none !important;
  }

  .hiddenInput {
    opacity: 0;
    width: 1px;
  }
</style>
