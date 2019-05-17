<template>
  <div>
    <div :class="{
'ceevo__table--bordered':bordered,
'ceevo__table--responsive':responsive,
'ceevo__table--condensed':true,
  'ceevo__table--striped':striped,
   'ceevo__table-edit':editId ||editAll}"
         class="table__wrapper ceevo__table--auto-height "
    >
      <table class="ceevo__table table" v-if="allData.length > 0">
        <thead>
        <tr>
          <th :key="heading.name" v-for="heading in renderHeadings">
            <div class="ceevo__heading-label"> {{heading.i18n ? $t(heading.i18n) : heading.label}}
              <fade-transition><span v-if="heading.required&&editId" class="required-field-sympol"> *</span></fade-transition>
            </div>
          </th>
          <th :key="heading.name" v-for="heading in addToHeaders">
            <div class="ceevo__heading-label">{{heading.i18n ? $t(heading.i18n) : heading.label}}
            </div>
          </th>
          <th v-for="(itemindex,index) in extraHeadings" :key="index+'extra label'"></th>
        </tr>
        </thead>
        <tbody>
        <slot name="balance"></slot>
        <!--  row is an object [{row ,row }]<- table data-->
        <tr v-for="(row,index) in allData" :key="row.id">
          <th scope="row" v-for="heading in renderHeadings" :key="(row.id ||JSON.stringify(row))+heading.name" :class="{'ceevo__table_selected':row.edit}">
            <div class="cell">
              <template v-if="row.edit && !heading.readOnly">
                <fg-input v-if="!heading.input && (heading.$domAttri ||{}).type !=='number'"
                          size="sm"
                          :disabled="heading.read"
                          @input.native.prevent="handleInputChange(row.id, $event.target.value, heading.name,null,$event.target)"
                          :value="row[heading.name] ? row[heading.name].value: ''"
                          :placeholder="heading.i18n ? $t(heading.i18n) : heading.label"
                          v-bind="(heading.$domAttri ||{})"
                          :addonRightIcon="heading.addonRightIcon"
                          :error="row[heading.name]? (row[heading.name].dirty ? row[heading.name].errors[0] :'') : '' "
                          @focus="dirtifyInput(row.id,heading.name,$event.target.value)">
                </fg-input>
                <decimals-input
                  v-if="!heading.input && (heading.$domAttri ||{}).type === 'number'"
                  :value="row[heading.name] ? row[heading.name].value: ''"
                  @input="handleInputChange(row.id, $event, heading.name,null)"
                  :placeholder="heading.i18n ? $t(heading.i18n) : heading.label"
                  :addonRightIcon="heading.addonRightIcon"
                  :error="row[heading.name]? (row[heading.name].dirty ? row[heading.name].errors[0] :'') : '' "
                  @focus="dirtifyInput(row.id,heading.name,$event.target.value)"
                >
                </decimals-input>
                <template v-if="heading.input === 'select'">
                  <el-select class="select-default"
                             size="small"
                             :placeholder="heading.i18n ? $t(heading.i18n) : heading.label"
                             @input="handleInputChange(row.id, $event, heading.name,true)"
                             :value="row[heading.name] !== void 0 ? row[heading.name].value: '' "
                             @blur="dirtifyInput(row.id,heading.name,$event.target.value)"
                  >
                    <el-option v-for="option in heading.selectKeys"
                               class="select-success"
                               :value="option.value"
                               :label="option.name"
                               :key="option.value + row.id+heading.name +index">
                    </el-option>
                  </el-select>
                </template>
                <el-select v-if="heading.input === 'multiple'" class="select-default"
                           size="small"
                           :placeholder="heading.i18n ? $t(heading.i18n) : heading.label"
                           multiple
                           @input="handleInputChange(row.id, $event, heading.name,true)"
                           :value="row[heading.name] ? row[heading.name].value: '' "
                           collapse-tags
                >
                  <el-option v-for="option in heading.selectKeys"
                             class="select-success"
                             :value="option.value"
                             :label="option.name"
                             :key="option.value + row.id+heading.name +index">
                  </el-option>
                </el-select>
              </template>
              <template v-else>
                <template v-if="heading.mapViewData">
                  <span>  {{row[heading.mapViewData]? row[heading.mapViewData].value : '---' }}</span>
                </template>
                <template v-else>
                  <div class="div-max-length" v-html="handleViewDisplayData(row, heading)"></div>
                </template>
              </template>
            </div>
          </th>
          <!--todo pass the id of the row-->
          <slot :index="{index,id:row.id}"></slot>
        </tr>
        <slot name="total"></slot>
        </tbody>
      </table>
      <div v-else>
        <h4 class="text-center">{{ $t('common.regular_table.no_data') }}
          <br>
        </h4>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>
<script>
  import {Input, Option, Select} from 'element-ui'
  import FadeTransition from "vue2-transitions/src/Fade/FadeTransition";
  import {breakInput, defBreakInput, requiredField} from "../../../../utils/formValidations";
  import DecimalsInput from "../../ABAComponents/DecimalsInput/Decimals";
  import {amountFormatAlignRight} from "@/utils/moneyFormat";
  import { inArray } from "@/utils/common"
  
  export default {
    name: 'RegularTable',
    components: {
      DecimalsInput,
      FadeTransition,
      [Input.name]: Input,
      [Option.name]: Option,
      [Select.name]: Select,
    }, 
    data() {
      return {
        allData: [],
        maskedInput: {},
      }
    },

    props: {
      addToHeaders: {
        type: Array,
        default: () => []
      },
      editId: {
        type: String,
      }, uneditableFields: {
        type: Array,
        default: () => []
      },
      extraHeadings: {
        type: Number,
        default: 0
      },
      editAll: {
        type: Boolean,
        default: false
      },
      //  array of objects {label:visual label , name: api name}
      headings: {
        type: Array,
        default: () => []

      },
      // array of objects object[table row name] =>
      value: {
        type: Array,
        default: () => []


      },
      context: {
        type: String,
        default: 'view'
      },
      bordered: {
        type: Boolean,
        default: false
      },
      responsive: {
        type: Boolean,
        default: true
      },
      condensed: {
        type: Boolean,
        default: true
      },
      striped: {
        type: Boolean,
        default: false
      },
      amonutAlignRightFormat: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      parentData: {
        get() {
          if (!(this.value instanceof Array)) return []
          return [...this.value.map(i => {
            if (!this.editId) return {...i, edit: false};
            if (this.editId) return i.id === this.editId ? {...i, edit: true} : {...i, edit: false}
          })]
        },
        set(value) {
          this.value = value
        }
      },
      renderHeadings() {
        return this.headings.map(heading => !!this.uneditableFields
          .find(i => heading.name === i) ?
          {...heading, readOnly: true} : heading)
      }
    }, watch: {
      parentData(newVal) {
        if (!newVal) return;
        if (newVal.length === 0) return this.allData = [];
        this.massageToFormValidation(newVal)
      },
      context(newVal, oldVal) {
        if (newVal === 'edit' && oldVal === 'view') {
          this.$emit('input', {
            value: this.value,
            valid: true
          })
        }
        if (newVal === 'create') {
          this.$emit('input', {
            value: this.value,
            valid: this.verifyTable()
          })
        }
      }, allData(newVal, oldVal) {
        if (newVal.length === oldVal.length) return;
        this.$emit('input', {
          value: this.value,
          valid: this.verifyTable()
        })
      }
    },
    methods: {
      handleViewDisplayData (row, heading) {
        // return row[heading.name] ? heading.mask ?
        //             heading.mask(row[heading.name].value)
        //             :(row[heading.name].value  === '' ||row[heading.name].value === null) ?
        //             '---' :row[heading.name].value
        //             : '---'

        if (row[heading.name]) {
          if (heading.mask) {
            let temp = heading.mask(row[heading.name].value)
            // console.log(heading.name)
            // if (temp !== '---' && this.inArray(heading.name, this.amonutAlignRightFormat)) {
            //   console.log('algin right', heading.name, temp)
            //   temp = amountFormatAlignRight(temp)
            // }
            return temp
          } else {
            if (row[heading.name].value  === '' ||row[heading.name].value === null) {
              return '---'
            } else {
              return row[heading.name].value
            }
          }
        } else {
          return '---'
        }
      },
      handleMassagedVal(key, value) {
        const _thisHeading = this.headings.find(heading => heading.name === key)
        if (!_thisHeading) return value
        if (!_thisHeading.mask) return value
        if (typeof _thisHeading.mask === "function") return _thisHeading.mask(value)
        return value
      }, massageToFormValidation(data) {
        if (this.parentData.length === 0) {
          console.log('empty');
          return this.allData = [];
        }
        const souceOfTruth = this.allData.length > 0 && data.length === this.allData.length ? this.allData : data;

        this.allData = souceOfTruth.map((i, index) => {
          let newDataLabel = {};
          for (const key in i) {
            if (key === 'id' || key === 'edit') {
              newDataLabel[key] = data[index][key]
            } else if (typeof i[key] !== "object") {
              //mask code  @commit e1955e739285782b054048b66a664ef605c50446
              /*can be  found at this revision*/
              /*un commend  the code on @funciton handleInputChange*/
              /*un comment the code at update life cycle*/

              newDataLabel = {
                ...newDataLabel,
                [key]: {
                  value: data[index][key],
                  dirty: false,
                  touched: false,
                  errors: [this.getValidationSate(key, data[index][key])]
                }
              }
            } else {
              newDataLabel = {
                ...newDataLabel,
                [key]: {
                  ...i[key],
                  value: data[index][key]
                }
              }
            }
          }
          return newDataLabel
        })
      }, 
      dirtifyInput(id, fieldName, value, noTEvent) {
        const errors = this.getValidationSate(fieldName, value)
        this.allData = this.allData.map(field => field.id === id ? {
          ...field,
          [fieldName]: {
            ...field[fieldName],
            dirty: true,
            touched: true,
            errors: [errors]
          }
        } : field)
        return errors
      }, 
      getValidationSate(fieldName, value = '') {
        const field = this.headings.find(i => i.name === fieldName);
        if (!field) return ''
        if (!field.required && value === '') return '';
        if (!field.validator) return requiredField(value);
        return requiredField(value) === '' ? this.executeValidators(field.validator, value) : requiredField(value)
      }, 
      executeValidators(validators = [], value, i = 0) {
        if (!(validators instanceof Array)) return validators(value);
        let error = typeof validators[i] === 'function' ? validators[i](value) : '';
        // return i <= validators.length || validators.length === 0 || error === '' ?
        //   error :
        //   this.executeValidators(validators, value, i + 1)

        if (error !== '') {
          return error
        } else if (i < validators.length) {
          return this.executeValidators(validators, value, i + 1)
        } else {
          return ''
        }
      },
      handleInputChange(id, value, fieldName, isSelect, $input) {
        //TODO: enhance the performance
        let {mask, read, brakeAt} = this.renderHeadings.find(i => i.name === fieldName);
        let dirty = false;
        //mask code
        /*  if (mask) {
            if ((value % 1 + '').length < 2) {
              this.maskedInput = $input
            } else {
              this.maskedInput = {};
            }
            value = mask ? mask(value) : value;
          }
  */
        const newValue = this.parentData.map(i => {
          if (i.id === id) {
            if (!isSelect && typeof value !== "boolean") {
              brakeAt = brakeAt || defBreakInput
              value = read ? i[fieldName] : !brakeAt(value) ? i[fieldName] : value
              dirty = isNaN(value) ? value !== i[fieldName] : (+value) !== i[fieldName]
            }
            this.dirtifyInput(id, fieldName, value)
          }
          const {edit, ...newFiled} = i.id === id ?
            {
              ...i,
              [fieldName]: value
            }
            : i;
          return newFiled;
        });
        // is valed
        const valid = this.verifyTable()
        if (isSelect) {
          dirty = true;
        }
        this.$emit('input', {value: newValue, valid, dirty})
      }, verifyTable() {
        let valid = true
        loop1:
          for (const heading of this.renderHeadings) {
            for (const row of this.allData) {
              const erros = row[heading.name] ? row[heading.name].errors ? row[heading.name].errors[0] : '' : ''
              if (!(erros === '')) {
                valid = false;
                break loop1;
              }
            }
          }
        return valid;
      }

    }, updated() {
      /* if (this.maskedInput.value !== void 0) {
         if (this.maskedInput.selectionEnd !== void 0) {
           // if this is the first key store the user made we mask the value
           this.maskedInput.selectionEnd = 1;
           this.maskedInput = {}
         }
       }*/
    }, mounted() {
      if (this.parentData.length === 0) return;
      this.massageToFormValidation(this.parentData)
    }
  }
</script>
<style lang="scss">
  .ceevo__table .el-select {
    width: 170px !important;
    /*border-radius: .4rem;*/
    padding: 0 .1rem;
    overflow: hidden;
  }

  .ceevo__table tbody .cell .el-select input {
    border-radius: .4rem !important;
    border: 1px solid #DDDDDD !important;

    &:hover {
      border: 1px solid #000 !important;

    }
  }

  .ceevo__table .cell {
    font-weight: normal;
    min-width: 120px;
    padding: 5px;

    .ceevo__table-edit & {
      padding: .2rem 5px 1rem;
    }

    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
  }

  .ceevo__table .ceevo__heading-label {
    padding: .5rem .6rem;
    font-weight: bold;
  }

  .ceevo__table th {
    width: 220px !important;
    padding: 10px;
  }

  .ceevo__table_selected {
    /*background-color: #bcfdff;*/
  }

  .ceevo__table .form-group {
    margin: 0 !important;
    position: relative;

    .aba__form--error {
      position: absolute;
      bottom: -.9rem;
    }

    input {
      padding: .375rem .75rem !important;
    }

    select::placeholder,
    input::placeholder {
      text-transform: capitalize;
    }
  }

  .required-field-sympol {
    color: #ff4d57;
  }
  .div-max-length {
    width: 100%
  }
</style>
