<template>
  <div>
    <div class="section-header d-flex justify-content-between">
      <h4 class="card-title display-inline text-capitalize">
        {{ $t('reseller.create.title', {action: context}) }}
      </h4>
    </div>
    <div class="pl-2" v-if="context ==='create'">
      <p>
        {{ $t('reseller.create.tips.create.line1') }}
      </p>
    </div>
    <div class="pl-2" v-if="context ==='view'">
      <p>
        {{ $t('reseller.create.tips.view.line1') }}
      </p>
      <ul>
          <li>{{ $t('reseller.create.tips.view.li1') }}</li>
          <li>{{ $t('reseller.create.tips.view.li2') }}</li>
        </ul>
    </div>
    <div class="pl-2" v-if="context ==='edit'">
      <p>
        {{ $t('reseller.create.tips.edit.line1') }}
      </p>
      <ul>
          <li>{{ $t('reseller.create.tips.edit.li1') }}</li>
          <li>{{ $t('reseller.create.tips.edit.li2') }}</li>
        </ul>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="col-sm-12 tabel-wrapper">
          <regular-table striped
                         :context="context"
                         :headings="tableHeadingsPack.main"
                         @input="listenToInput($event,'main')"
                         :editId="editId"
                         key="main"
                         :value="cardReseller">
          </regular-table>
        </div>
        <hr>
        <div class="col-sm-12 tabel-wrapper py-1">
          <regular-table striped
                         :context="context"
                         :headings="tableHeadingsPack.secondary"
                         @input="listenToInput($event,'secondary')"
                         :editId="editId"
                         key="secondary"
                         :value="cardReseller"
                         :amonutAlignRightFormat="secondLine">
          </regular-table>
        </div>
        <hr>
        <div class="col-sm-12 tabel-wrapper py-1">
          <regular-table striped
                         :context="context"
                         :headings="tableHeadingsPack.third"
                         @input="listenToInput($event,'third')"
                         :editId="editId"
                         key="secondary"
                         :value="cardReseller"
                         :amonutAlignRightFormat="thirdLine">
          </regular-table>
        </div>
        <br>
        <div class="col-sm-12">
          <slide-y-down-transition>
            <p v-if="edit || context ==='create'">
              <span class="required-field-sympol">
                <b>*</b>
              </span> 
              {{ $t('reseller.create.common.required_fields') }}</p>
          </slide-y-down-transition>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="pull-right ">
          <p-button round type="primary"
                    :disabled="!(context ==='view' || (isValid && context!== 'view' && dirty ))"
                    @click="handlePrimaryAction"
                    v-if="hasPermission(permission.RESELLER_SUBSCRIPTION_EDIT)"
                    >
            <div class="d-flex">
              <Loader v-if="loadingState === 'sending'"></Loader>
              {{ $t(context === 'view' ? 'reseller.create.button.edit' : 'reseller.create.button.save') }}
            </div>
          </p-button>
          <p-button round @click="secondaryAction">{{ $t('reseller.create.button.cancel') }}</p-button>
        </div>
      </div>
    </div>
    <Spinner v-if="loadingState === 'getting'">
    </Spinner>
  </div>
</template>
<script>
  import { permissionMixin } from '@/mixins/permission'
  import SlideYDownTransition from "vue2-transitions/src/Slide/SlideYDownTransition";
  import {mapActions, mapGetters} from "vuex";
  import {AbaModalEvents} from "../../../../main";
  import {
    ADD_RESELLER_SUBSCRIPTION,
    EDIT_RESELLER_SUBSCRTION_BY_ID,
    GET_ALL_CARD_PROGRAM, GET_RESELLER_SUBSCRTION_BY_ID,
    GETTER_ALL_CARDS,
    GETTER_LOADINGSTATE_RESELLER, GETTER_RESELLER_SUBSCRIPTION, SET_MODAL_TYPE, SHOW_TOAST_MESSAGE
  } from "../../../../store/types";
  import swal from 'sweetalert2'

  import createNewRowFromHeadings from "../../../../utils/createNewRowFromHeadings";
  import {breakInput, exactNumber, limitedCharNumber, mustBeAnEmail, shouldBeNumber, verifySpecialCharacter} from "../../../../utils/formValidations";
  import {decimals} from "../../../../utils/inputMasks";
  import Button from "../../../UIComponents/Button";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from "../../../UIComponents/CeevoTables/RegularTable/RegularTable";
  import Loader from "../../../UIComponents/Loader";
  import Spinner from "../../../UIComponents/Spinner";

  export default {
    name: "Create",
    mixins: [permissionMixin],
    components: {
      SlideYDownTransition,
      Spinner,
      Loader,
      PButton, RegularTable,
      [Button.name]: Button
    },
    data() {
      return {
        secondLine: ['loadFee', 'loadFeePct', 'loadFeeCap', 'appFee'],
        thirdLine: ['monthlyFee', 'apiFee'],
        edit: false,
        dirty: false,
        tableHeadingsPack: {
          main: [
            {
              label: 'CPC', 
              name: 'cardProgramID', 
              i18n: 'reseller.create.table_header.card_program_id',
              input: 'select',
              mapViewData: 'cardProgCode',
              required: true,
              selectKeys: [
                {name: '', value: null}
              ],
            },
            {
              label: 'RC', 
              name: 'resellerCode',
              i18n: 'reseller.create.table_header.reseller_code',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(5)
              ],
              brakeAt: breakInput(5)
            },
            {
              label: 'Reseller Name', 
              name: 'resellerName',
              i18n: 'reseller.create.table_header.reseller_name',
              required: true,
              validator: [
                verifySpecialCharacter,
                limitedCharNumber(0, 20)
              ],
              brakeAt: breakInput(20)
            },
            {
              label: 'Unique Float', 
              name: 'uniqueFloat',
              i18n: 'reseller.create.table_header.unique_float',
              required: true,
              input: 'select', 
              selectKeys: [{name: 'yes', value: true}]
            },
            {
              label: 'alert Contact', 
              name: 'alertContact',
              i18n: 'reseller.create.table_header.alert_contact',
              required: true,
              validator: [mustBeAnEmail],
              brakeAt: breakInput(64)
            },

            {
              label: 'Status', 
              name: 'status',
              i18n: 'reseller.create.table_header.status',
              required: true,
              input: 'select',
              selectKeys: [
                //  {name: '', value: null},
                {name: 'Active', value: 'ACTIVE'},
                {name: 'Closed', value: 'CLOSED'},
                {name: 'Pending Approval', value: 'PENDING'}
              ]
            },
          ],
          secondary: [
            {
              label: 'load Fee', 
              name: 'loadFee',
              i18n: 'reseller.create.table_header.load_fee',
              mask: decimals(2), 
              validator: [shouldBeNumber],
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            {
              label: 'load fee percentage', 
              name: 'loadFeePct',
              i18n: 'reseller.create.table_header.load_fee_pct',
              mask: decimals(2), validator: [shouldBeNumber],
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8),
              required: false,
            },
            {
              label: 'load fee roof', 
              name: 'loadFeeCap',
              i18n: 'reseller.create.table_header.load_fee_cap',
              mask: decimals(2), validator: [shouldBeNumber],
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            {
              label: 'Charged To', 
              name: 'loadFeebillMethod',
              i18n: 'reseller.create.table_header.load_fee_bill_method', 
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'ACCOUNT', value: 'ACCOUNT'},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'INVOICE', value: 'INVOICE'}]
            },
            /*application*/
            {
              label: 'application fee', 
              name: 'appFee',
              i18n: 'reseller.create.table_header.app_fee', 
              mask: decimals(2), 
              validator: [shouldBeNumber],
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)

            },
            //application fee bill method
            {
              label: 'Charged To', 
              name: 'appFeeBillMethod', 
              i18n: 'reseller.create.table_header.app_fee_bill_method', 
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'ACCOUNT', value: 'ACCOUNT'},
                {name: 'INVOICE', value: 'INVOICE'}]
            },
            /*monthly fees*/
          ],
          third: [
            {
              label: 'monthly fee', 
              name: 'monthlyFee',
              i18n: 'reseller.create.table_header.monthly_fee',
              mask: decimals(2), 
              validator: [shouldBeNumber],
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)

            },
            //monthly fee bill method
            {
              label: 'Charged To', 
              name: 'monthlyFeeBillMethod', 
              i18n: 'reseller.create.table_header.monthly_fee_bill_method',
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'ACCOUNT', value: 'ACCOUNT'},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'INVOICE', value: 'INVOICE'}]
            },
            /*api fees*/
            {
              label: 'api fee', 
              name: 'apiFee', 
              i18n: 'reseller.create.table_header.api_fee',
              mask: decimals(2), 
              validator: [shouldBeNumber],
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },

            {
              label: 'Charged To', 
              name: 'apiFeeBillMethod', 
              i18n: 'reseller.create.table_header.api_fee_bill_method',
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'INVOICE', value: 'INVOICE'}
              ]
            },
          ]
        },
        editAll: false,
        editId: '',
        cardReseller: [],
        context: 'create',
        valid: {
          main: false,
          secondary: false,
          third: false,
        }

      };
    }, computed: {
      ...mapGetters({
        cardData: GETTER_ALL_CARDS,
        loadingState: GETTER_LOADINGSTATE_RESELLER,
      }),
      resellerData() {
        const resellerSub = this.$store.state.reseller.resellerSubscription;
        if (!resellerSub) return void 0;
        return !this.$route.params.id ? resellerSub : {
          ...resellerSub,
          ['cardProgCode']: (this.$store.state.cardProgram.allCardPrograms.find(cardProgram => cardProgram.id === resellerSub.cardProgramID) ||
            {cardProgCode: null}).cardProgCode
        }
      },
      creationResponseState() { return this.$store.state.UiModule.responseState[ADD_RESELLER_SUBSCRIPTION]},
      editionResponseState() { return this.$store.state.UiModule.responseState[EDIT_RESELLER_SUBSCRTION_BY_ID]},
      isValid() {
        return Object.keys(this.valid).reduce((acc, i) => acc && this.valid[i], true)
      }
    }, watch: {
      cardData(newVal) {
        this.chagneCardProgramOptions(newVal);
      },
      creationResponseState(newVal, oldVal) {
        if (!oldVal) return this.sweetAlertHandler(newVal)
        if (newVal.timeStamp === oldVal.timeStamp) return;
        this.sweetAlertHandler(newVal)
      },
      editionResponseState(newVal, oldVal) {
        if (newVal.timeStamp === oldVal.timeStamp) return;
        this.sweetAlertHandler(newVal)
      },
      resellerData(newVal) {
        if (!newVal) return;
        this.cardReseller = [newVal]
      }, editId(newVal, oldVal) {
        if (this.context === 'view' && newVal) {
          this.context = 'edit'
        }
      }, $route(newVal, oldVal) {
        const {id} = newVal.params;
        if (!id) {
          this.context = 'create'
          this.cardReseller = [createNewRowFromHeadings([
              ...this.tableHeadingsPack.main,
              ...this.tableHeadingsPack.secondary, ...this.tableHeadingsPack.third],
            'Reseller_new_row')];
          this.editId = 'Reseller_new_row';

        }
      }
    },
    methods: {
      ...mapActions({
        addReseller: ADD_RESELLER_SUBSCRIPTION,
        getAllCardPrograms: GET_ALL_CARD_PROGRAM,
        editReseller: EDIT_RESELLER_SUBSCRTION_BY_ID,
        getResellerSubscripiton: GET_RESELLER_SUBSCRTION_BY_ID,
        showModal: SET_MODAL_TYPE
      }),
      chagneCardProgramOptions(cardPrograms = []) {
        this.tableHeadingsPack.main = this.tableHeadingsPack.main.map(i => {
          if (i.name === 'cardProgramID') {
            return {
              ...i,
              selectKeys: cardPrograms.map(cardProgram => ({name: cardProgram.cardProgCode, value: cardProgram.id}))
            }
          } else {
            return i;
          }
        })
      },
      sweetAlertHandler(newVal) {
        if (newVal.state === true) {
          const key = this.context + 'handleSecondaryAction' + 'reseller';

          this.showModal({
            type: 'normal',
            message: this.context === 'create' ? this.$t('reseller.create.result_modal.message.create') : this.$t('reseller.create.result_modal.message.edit'),
            copy: this.$t('reseller.create.result_modal.copy'),
            mainButton: this.$t('reseller.create.result_modal.main_button'),
            key
          })

          AbaModalEvents.$on(key, response => {
            if (response.ok) {
              this.$router.push('/reseller/view')
            } else {
              this.dirty = false;

            }
            AbaModalEvents.$off(key)
          })
        }
      }, listenToInput({value, valid, dirty}, table) {
        this.cardReseller = value;
        console.log('value', value);
        this.dirty = this.dirty || !!dirty;
        this.valid = {
          ...this.valid,
          [table]: valid
        };
      }, secondaryAction() {
        console.log('secondary');
        if (this.context === 'view' || (this.context !== 'view' && !this.dirty)) {
          this.$router.push('/reseller/view')
        } else {
          const key = this.context + 'reseller';
          this.showModal({
            type: 'normal',
            message: this.$t('reseller.create.discard_modal.message'),
            copy: this.$t('reseller.create.discard_modal.copy'),
            mainButton: this.$t('reseller.create.discard_modal.main_button'),
            secondaryButton: this.$t('reseller.create.discard_modal.secondary_button'),
            key
          })
          AbaModalEvents.$on(key, response => {
            AbaModalEvents.$off(key)
            if (response.ok) this.$router.push('/reseller/view')
          })
        }
      }, handlePrimaryAction() {
        if (this.context === 'view') {
          this.editId = this.$route.params.id;
          this.$router.push({
            path: this.$route.path,
            query: {
              edit: true
            }
          })
          this.edit = true;

          return;
        }
        if (!this.valid) return this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: this.$t('reseller.create.toast.error'), status: 'danger'})

        const key = this.context + 'handlePrimaryAction' + 'reseller';
        this.showModal({
          type: 'normal',
          message: `  ${this.context === 'create' ? 'Do you want to create new reseller subscription ' : ' Do you want to save the changes  '} ?`,
          copy: `${this.context === 'create' ? this.$t('reseller.create.confirm_modal.copy.create') : this.$t('reseller.create.confirm_modal.copy.edit') }`,
          mainButton: this.$t('reseller.create.confirm_modal.main_button'),
          secondaryButton: this.$t('reseller.create.confirm_modal.secondary_button'),
          key
        })
        AbaModalEvents.$on(key, response => {
          AbaModalEvents.$off(key)

          if (response.ok) {
            // on edit ?

            if (this.editId !== '' && this.loadingState === 'ideal') {
              // on edit for faiure creating new card
              //massage data -> remove edit prop
              const {id, edit, cardProgCode, resellerId, ...body} = this.cardReseller.find(i => i.id === this.editId);
              console.log(body, 'from dest');
              if (this.editId === 'Reseller_new_row') {
                // create
                // todo fix redirect
                this.addReseller({body})
                return;
              } else {
                //massage data -> remove edit prop
                // edit single card
                this.editReseller({body, id})
              }
            }
          }

        })
      }
    }, mounted() {
      this.getAllCardPrograms();
      const {id,} = this.$route.params;
      const {edit} = this.$route.query;
      this.edit = edit;
      if (id) {
        if (edit) {

          this.context = 'edit';
          this.editId = id;
        } else {
          this.context = 'view';
        }
        // get the reseller subscription by id
        if (this.context !== 'create') {
          this.getResellerSubscripiton(id)

        }
      }
      if (this.context === 'create') {


        this.cardReseller = [createNewRowFromHeadings([...this.tableHeadingsPack.main,
          ...this.tableHeadingsPack.secondary, ...this.tableHeadingsPack.third], 'Reseller_new_row')];
        this.editId = 'Reseller_new_row';
        this.chagneCardProgramOptions(this.cardData)
      }
    }
  };
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

  .required-field-sympol {
    color: #ff4d57;
  }
</style>
