<template>
  <div>
    <div class=" d-flex justify-content-between"
         :class="{
    ['section-header']:context ==='create',
    ['pb-3']:context !=='create',
    }"
    >
      <h4 class="card-title display-inline  text-capitalize">
        {{ $t('card_program.create.title', {action: context}) }}
      </h4>
    </div>
    <div class="pl-2" v-if="context ==='create'">
      <p>
        {{ $t('card_program.create.tips.create.line1') }}
        <br/>
        {{ $t('card_program.create.tips.create.line2') }}
      </p>
      <ul>
        <li>{{ $t('card_program.create.tips.create.li1') }}</li>
        <li>{{ $t('card_program.create.tips.create.li2') }}</li>
      </ul>
    </div>
    <div class="pl-2" v-if="context ==='view'">
      <p>
        {{ $t('card_program.create.tips.view.line1') }}
      </p>
      <ul>
        <li>{{ $t('card_program.create.tips.view.li1') }}</li>
        <li>{{ $t('card_program.create.tips.view.li2') }}</li>
      </ul>
    </div>
    <div class="pl-2" v-if="context ==='edit'">
      <p>
        {{ $t('card_program.create.tips.edit.line1') }}
      </p>
      <ul>
        <li>{{ $t('card_program.create.tips.edit.li1') }}</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="col-sm-12 tabel-wrapper mb-1">
          <div class="py-1">
            <regular-table striped
                           :showValidFeedBack="showValidFeedBack"
                           :context="context"
                           :headings="tableHeadingsPack.main"
                           @input="listenToInput($event,'main')"
                           :editId="editId"
                           :value="tableViewData">
            </regular-table>
          </div>
        </div>
        <hr>
        <div class="col-sm-12 tabel-wrapper mb-1">
          <div class="py-1">
            <regular-table striped
                           :showValidFeedBack="showValidFeedBack"
                           :context="context"
                           :headings="tableHeadingsPack.middle"
                           @input="listenToInput($event,'middle')"
                           :editId="editId"
                           :value="tableViewData"
                           :amonutAlignRightFormat="secondLine">
            </regular-table>
          </div>
        </div>
        <hr>
        <div class="col-sm-12 tabel-wrapper mb-1">
          <div class="py-1">
            <regular-table striped
                           :showValidFeedBack="showValidFeedBack"
                           :context="context"
                           @input="listenToInput($event,'fees')"
                           :headings="tableHeadingsPack.fees"
                           :editId="editId"
                           :value="tableViewData"
                           :amonutAlignRightFormat="thirdLine">
            </regular-table>
          </div>
        </div>
        <hr>
        <div class="col-sm-12 tabel-wrapper mb-1">
          <div class="py-1">
            <SingleFieldTable
              :tableData="tableViewData"
              filedName="kycClassifier"
              @input="listenToInput($event,'kycClassifier')"
              striped bordered
              label="card_program.create.table_header.kyc_classifier"
              :showValidFeedBack="showValidFeedBack"
              :context="context"
              :extraHeadings="1"
              :editId="editId"
              :headingObj="tableHeadingsPack.kycClassifier[0]"
            >
              <template v-if="this.context !== 'view'">
                <td>
                  <div class="cell">
                    <AbaButton
                      context="primary"
                      @click="createNewField('kycClassifier')"
                      tooltip="add new kyc"
                    >
                      <i class="fa  fa-plus"></i>
                    </AbaButton>
                  </div>
                </td>
              </template>
            </SingleFieldTable>
          </div>
        </div>
        <hr>
        <div class="col-sm-12 tabel-wrapper">
          <div class="py-1">
            <SingleFieldTable
              :tableData="tableViewData"
              filedName="matrixPID"
              :context="context"
              label="card_program.create.table_header.matrix_pid"
              @input="listenToInput($event,'matrixPID')"
              striped bordered
              :showValidFeedBack="showValidFeedBack"
              :extraHeadings="1"
              :editId="editId"
              :headingObj="tableHeadingsPack.matrixPID[0]"
            >
              <template v-if="this.context !== 'view'">
                <td>
                  <div class="cell">
                    <AbaButton
                      context="primary"
                      @click="createNewField('matrixPID')"
                      tooltip="create new matrixPID"
                    >
                      <i class="fa  fa-plus"></i>
                    </AbaButton>
                  </div>
                </td>
              </template>
            </SingleFieldTable>
          </div>
          <br>
          <slide-y-down-transition>
            <p v-if="edit || context ==='create'">
              <span class="required-field-sympol">
                <b>*</b>
              </span> 
              {{ $t('card_program.create.common.required_fields') }}
            </p>
          </slide-y-down-transition>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12  ">
        <div class="pull-right ">
          <p-button round type="primary" @click="handlePrimaryAction"
                    :disabled="!(context ==='view' || (isValid && context!== 'view' && dirty ))"
                    v-if="hasPermission(permission.CARD_PROGRAM_EDIT)"
          >
            <div class="d-flex align-items-center">
              <loader v-if="loadingState ==='sending'"></loader>
              {{ $t(this.context === 'view' ? 'card_program.create.button.edit' : 'card_program.create.button.save') }}
            </div>
          </p-button>
          <p-button round @click="secondaryAction"> {{ $t(context === 'view' ? 'card_program.create.button.back' : 'card_program.create.button.cancel') }} </p-button>
        </div>
      </div>
    </div>
    <template
      v-if="loadingState ==='getting'"
    >
      <Spinner
      ></Spinner>
    </template>
  </div>
</template>
<script>
  import {Button} from 'src/components/UIComponents';
  import swal from 'sweetalert2'
  import SlideYDownTransition from "vue2-transitions/src/Slide/SlideYDownTransition";
  import {mapActions, mapGetters} from 'vuex'
  import {AbaModalEvents} from "../../../../main";
  import {
    ADD_CARD_PROGRAM,
    EDIT_CARD_PROGRAM,
    GET_CARD_PROGRAM_BYID,
    GETTER_ACTIVE_CARD,
    GETTER_LOADINGSTATE_CARD_PROGRAM, SET_MODAL_TYPE,
    SHOW_TOAST_MESSAGE
  } from '../../../../store/types';
  import createNewRowFromHeadings from "../../../../utils/createNewRowFromHeadings";
  import {breakInput, exactNumber, limitedCharNumber, mustBeAnEmail, mustBeAValidISOcurrency, shouldBeNumber, verifySpecialCharacter} from "../../../../utils/formValidations";
  import {decimals} from "../../../../utils/inputMasks";
  import AbaButton from "../../../UIComponents/ABAComponents/AbaButton";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from '../../../UIComponents/CeevoTables/RegularTable/RegularTable'
  import SingleFieldTable from "../../../UIComponents/CeevoTables/SingeFieldTable/SingleFieldTable";
  import Loader from "../../../UIComponents/Loader";
  import Spinner from "../../../UIComponents/Spinner";
  import { permissionMixin } from '@/mixins/permission'

  export default {
    name: "Create",
    mixins: [permissionMixin],
    components: {
      SlideYDownTransition,
      AbaButton,
      SingleFieldTable,
      Spinner,
      Loader,
      PButton, RegularTable,
      [Button.name]: Button
    },
    data() {
      return {
        secondLine: ['loadFee', 'loadFeePct', 'loadFeeCap'],
        thirdLine: ['appFee', 'monthlyFee', 'apiFee'],
        edit: false,
        dirty: false,
        tableHeadingsPack: {
          main: [
            {
              label: 'psf Ref', 
              name: 'psfRef', 
              i18n: 'card_program.create.table_header.psf_ref',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(7)
              ],
              brakeAt: breakInput(7)

            },
            {
              label: 'issuer Inst', 
              name: 'issuerInst', 
              i18n: 'card_program.create.table_header.issuer_inst',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(5)
              ],
              brakeAt: breakInput(5)
            },
            {
              label: 'PM Inst', 
              name: 'pmInst', 
              i18n: 'card_program.create.table_header.pm_inst',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(5)
              ],
              brakeAt: breakInput(5)
            },
            {
              label: 'PO Inst', 
              name: 'poInst', 
              i18n: 'card_program.create.table_header.po_inst',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(5)
              ],
              brakeAt: breakInput(5)
            },
            {
              label: 'CPC', 
              name: 'cardProgCode', 
              i18n: 'card_program.create.table_header.card_prog_code',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(5)
              ],
              brakeAt: breakInput(5)
            },
            {
              label: 'card program description', 
              name: 'cardProgDesc', 
              i18n: 'card_program.create.table_header.card_prog_desc',
              required: true,
              validator: limitedCharNumber(0, 40),
              brakeAt: breakInput(40)
            },
          ],
          middle: [
            {
              label: 'Bureau inst code', 
              name: 'cardPrinterCode', 
              i18n: 'card_program.create.table_header.card_printer_code',
              required: true,
              validator: [
                verifySpecialCharacter,
                exactNumber(5)
              ],
              brakeAt: breakInput(5)
            },
            {
              label: 'default currency', 
              name: 'defCurrency', 
              i18n: 'card_program.create.table_header.def_currency',
              required: true,
              validator: [mustBeAValidISOcurrency],
              brakeAt: breakInput(3)
            },
            {
              label: 'alert contact e-mail', 
              name: 'alertContact', 
              i18n: 'card_program.create.table_header.alert_contact',
              required: true,
              validator: [mustBeAnEmail], $domAttri: {type: 'email'},
              brakeAt: breakInput(64)
            },
            {
              label: 'load fee', 
              name: 'loadFee', 
              i18n: 'card_program.create.table_header.load_fee', 
              validator: shouldBeNumber,
              mask: decimals(2),
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            {
              label: 'load fee %', 
              name: 'loadFeePct', 
              i18n: 'card_program.create.table_header.load_fee_pct', 
              addonRightIcon: 'fa-percent fa',
              validator: shouldBeNumber,
              mask: decimals(2),
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            {
              label: 'load fee roof', 
              name: 'loadFeeCap', 
              i18n: 'card_program.create.table_header.load_fee_cap',
              validator: [shouldBeNumber],
              mask: decimals(2),
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            {
              label: 'Charged To', 
              name: 'loadFeebillMethod', 
              i18n: 'card_program.create.table_header.load_fee_bill_method',
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'ACCOUNT', value: 'ACCOUNT'},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'INVOICE', value: 'INVOICE'},
              ]
            },
          ],
          fees: [{
            label: 'application fee', 
            name: 'appFee', 
            i18n: 'card_program.create.table_header.app_fee', 
            validator: shouldBeNumber,
            mask: decimals(2),
            $domAttri: {step: '0.01', type: 'number'},
            brakeAt: breakInput(8)
          },
            //application fee bill method
            {
              label: 'Charged To', 
              name: 'appFeeBillMethod', 
              i18n: 'card_program.create.table_header.app_fee_bill_method', 
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'ACCOUNT', value: 'ACCOUNT'},

                {name: 'INVOICE', value: 'INVOICE'}]
            },
            {
              label: 'monthly fee', 
              name: 'monthlyFee', 
              i18n: 'card_program.create.table_header.monthly_fee', 
              validator: shouldBeNumber,
              mask: decimals(2),
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            //monthly fee bill method
            {
              label: 'Charged To', 
              name: 'monthlyFeeBillMethod', 
              i18n: 'card_program.create.table_header.monthly_fee_bill_method', 
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'ACCOUNT', value: 'ACCOUNT'},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'INVOICE', value: 'INVOICE'}]
            },
            {
              label: 'api fee', 
              name: 'apiFee', 
              i18n: 'card_program.create.table_header.api_fee', 
              validator: shouldBeNumber,
              mask: decimals(2),
              $domAttri: {step: '0.01', type: 'number'},
              brakeAt: breakInput(8)
            },
            {
              label: 'Charged To', 
              name: 'apiFeeBillMethod', 
              i18n: 'card_program.create.table_header.api_fee_bill_method', 
              input: 'select',
              selectKeys: [
                {name: '', value: null},
                {name: 'FLOAT', value: 'FLOAT'},
                {name: 'INVOICE', value: 'INVOICE'}
              ]
            },
          ],
          kycClassifier: [
            {
              label: 'kyc classifier', 
              name: 'kycClassifier', 
              multiVal: true,
              validator: exactNumber(3),
              brakeAt: breakInput(3),
              required: true,
            },],
          matrixPID: [{
            label: 'matrix PID', 
            name: 'matrixPID', 
            multiVal: true,
            validator: exactNumber(6),
            brakeAt: breakInput(6),
            required: true,

          },]

        },
        tableViewData: [],
        showValidFeedBack: false,
        editId: '',
        valid: {
          main: false,
          middle: false,
          fees: false,
          matrixPID: false,
          kycClassifier: false,
        },
        context: 'create' // create view edit
      };
    }, computed: {
      ...mapGetters({
        loadingState: GETTER_LOADINGSTATE_CARD_PROGRAM,
        activeCard: GETTER_ACTIVE_CARD,

      }),
      creationResponseState() { return this.$store.state.UiModule.responseState[ADD_CARD_PROGRAM]},
      editionResponseState() { return this.$store.state.UiModule.responseState[EDIT_CARD_PROGRAM]},
      isValid() {
        return Object.keys(this.valid).reduce((acc, i) => acc && this.valid[i], true)
      },
    }, watch: {
      activeCard(newVal) {
        this.tableViewData = [newVal];
      },
      creationResponseState(newVal, oldVal) {
        if (!oldVal) return this.sweetAlertHandler(newVal)
        if (newVal.timeStamp === oldVal.timeStamp) return;
        this.sweetAlertHandler(newVal)
      },
      editionResponseState(newVal, oldVal) {
        if (!oldVal) return this.sweetAlertHandler(newVal)
        if (newVal.timeStamp === oldVal.timeStamp) return;
        this.sweetAlertHandler(newVal)
      }, editId(newVal, oldVal) {
        if (this.context === 'view' && newVal) {
          this.context = 'edit'
        }
      }, $route(newVal, oldVal) {
        const {id, read_only} = newVal.params;
        if (!id) {
          this.context = 'create';
          this.tableViewData = [createNewRowFromHeadings([
            ...this.tableHeadingsPack.main,
            ...this.tableHeadingsPack.fees,
            ...this.tableHeadingsPack.middle,
            ...this.tableHeadingsPack.matrixPID,
            ...this.tableHeadingsPack.kycClassifier,
          ], 'card_program_new_row')]
          this.editId = 'card_program_new_row';
        }


      }
    },
    methods: {
      ...mapActions({
        createACardProgram: ADD_CARD_PROGRAM,
        getActiveCard: GET_CARD_PROGRAM_BYID,
        editSingleCard: EDIT_CARD_PROGRAM,
        showModal: SET_MODAL_TYPE
      }),
      createNewField(filed) {
        if (this.context === 'view') return;
        this.tableViewData = this.tableViewData.map(i => ({
          ...i,
          [filed]: [...i[filed], '']
        }))
      },
      sweetAlertHandler(newVal) {
        if (newVal.state === true) {
          const key = this.context + 'handleSecondaryAction' + 'cardPorgram';

          this.showModal({
            type: 'normal',
            message: this.context === 'create' ? 'created new card program successfully' : 'The changes are updated. ',
            copy: 'any changes will be discarded',
            mainButton: 'Ok',
            key
          })

          AbaModalEvents.$on(key, response => {
            if (response.ok) {
              this.$router.push('/card-program/view')

            } else {
              this.dirty = false;
            }
            AbaModalEvents.$off(key)
          })
        }

      },
      secondaryAction() {
        // edit or create ask before leaving
        // view ->
        if (this.context === 'view' || (this.context !== 'view' && !this.dirty)) {
          this.$router.push({
            path: '/card-program/view',
            query: {
              edit: false
            }
          })

        } else {
          const key = this.context + 'handleSecondaryAction' + 'cardPorgram';
          this.showModal({
            type: 'normal',
            message: `Are you sure you want to exit the card program ${this.context} function?`,
            copy: 'any changes will be discarded',
            mainButton: 'Yes',
            secondaryButton: `No`,
            key
          })
          AbaModalEvents.$on(key, response => {
            if (response.ok) {
              this.$router.push('/card-program/view')

            }
            AbaModalEvents.$off(key)
          })
          //ask

        }

      },
      listenToInput({value, valid, dirty}, tableName) {
        this.tableViewData = value;
        this.dirty = this.dirty || !!dirty
        this.valid = {
          ...this.valid,
          [tableName]: valid
        };
      },
      handlePrimaryAction() {
        // on edit ?
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
        if (!this.valid) {
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: 'Please ensure you complete all fields correctly.', status: 'danger'})
          return;
        }

        const key = this.context + 'handlePrimaryAction' + 'cardPorgram' +Date.now();
        this.showModal({
          type: 'normal',
          message: `  ${this.context === 'create' ? 'Are you sure you will create new card program ' : 'Do you want to save the changes'} ?`,
          copy: `${this.context === 'create' ? '' : 'You will not be able to recover the changes!'}`,
          mainButton: `YES`,
          secondaryButton: 'NO',
          key
        })
        AbaModalEvents.$on(key, response => {
          if (response.ok) {
            if (this.editId !== '' && this.loadingState === 'ideal') {
              // on edit for faiure creating new card
              //massage data -> remove edit prop
              const {id, edit, ...body} = this.tableViewData.find(i => i.id === this.editId);
              if (this.editId === 'card_program_new_row') {
                // create
                this.createACardProgram({body}).then(isSuccess => {
                  if (isSuccess) {
                    this.$router.push({
                      path: `/card-program/view`
                    })
                  }
                });
                return;
              } else {
                // this.editId = '';
                //massage data -> remove edit prop
                // edit single card
                this.editSingleCard({body, id})
              }
            }

          }
          AbaModalEvents.$off(key)
        })

      }
    }, mounted() {
      try {
        const {id} = this.$route.params;
        const {edit} = this.$route.query
        this.edit = !!edit;
        if (id) {
          if (!edit) {
            this.context = 'view';
          } else {
            this.context = 'edit';
            this.editId = id;
          }
          // get the card Program by id
          this.getActiveCard(id);
        }
        if (this.context === 'create') {
          this.tableViewData.push(createNewRowFromHeadings([
            ...this.tableHeadingsPack.main,
            ...this.tableHeadingsPack.fees,
            ...this.tableHeadingsPack.middle,
            ...this.tableHeadingsPack.matrixPID,
            ...this.tableHeadingsPack.kycClassifier,
          ], 'card_program_new_row'));
          this.editId = 'card_program_new_row';
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
</script>
<style scoped>
  .section-header {
    padding-bottom: .5rem;
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

  .actionsWrapper button {
    margin-left: 10px;
  }

  @media (max-width: 620px) {
    .actionsWrapper {
      padding-top: 1rem;
      text-align: right;
    }
  }

  .refreshButton {
    background-color: #d8d8d8;
    color: #ffffff;
    position: absolute;
    right: 4rem;
  }

  .refreshButton:hover {
    background-color: #d3d3d3 !important;
  }

  .required-field-sympol {
    color: #ff4d57;
  }
</style>
