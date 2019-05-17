<template>
  <div>
    <div :class="{
'ceevo__table--bordered':bordered,
'ceevo__table--responsive':responsive,
'ceevo__table--condensed':true,
  'ceevo__table--striped':striped }"
         class="table__wrapper ceevo__table--auto-height "
    >
      <table class="ceevo__table table">
        <thead>
        <tr>
          <th :key="heading" v-for="(heading,index) in viewTableHeadings">
            <div class="ceevo__heading-label">{{heading}}
              <FadeTransition><span class="required-field-sympol" v-if="editId"> * </span></FadeTransition>
            </div>
          </th>
          <template v-if="editId">
            <th v-for="(itemindex,index) in extraHeadings" :key="index+'extra label'"></th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td :key="heading +'multiVal'" v-for="(heading,index) in viewTableHeadings">
            <div class="cell">
              <template v-if="editId">
                <slide-y-down-transition>
                  <div class="d-flex justify-content-center align-items-center">
                    <fg-input type="text"
                              size="sm"
                              @input.native.prevent="handleInput($event.target.value,index)"
                              :value="viewTableData[index]"
                              :placeholder="heading"
                              :error="errors[index]"
                              @blur="handleInput($event.target.value,index)"
                    ></fg-input>
                    <div class="p-3 position-relative">
                      <div class="position-absolute ">
                        <AbaButton
                          small
                          squared
                          context="danger"
                          @click="removeField(index)"
                          tooltip="remove"
                          :disabled="viewTableHeadings.length === 1"
                        >
                          <i class="fa  fa-remove "></i>
                        </AbaButton>
                      </div>
                    </div>
                  </div>
                </slide-y-down-transition>
              </template>
              <template v-else>
                {{viewTableData[index]}}
              </template>
            </div>
          </td>
          <slot>
          </slot>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import FadeTransition from "vue2-transitions/src/Fade/FadeTransition";
  import SlideYDownTransition from "vue2-transitions/src/Slide/SlideYDownTransition";
  import {defBreakInput, requiredField} from "../../../../utils/formValidations";
  import AbaButton from "../../ABAComponents/AbaButton";

  export default {
    name: "SingleFieldTable",
    components: {SlideYDownTransition, FadeTransition, AbaButton},
    data() {
      return {
        errors: [],
        renderData: []
      }
    },
    props: {
      filedName: {
        type: String,
      },
      context: {
        type: String,
        default: 'create'
      },
      headingObj: {
        type: Object,
        default: () => ({})
      },
      editId: {
        type: String,
        default: ''
      },
      extraHeadings: {
        type: Number,
        default: 0
      },
      tableData: {
        type: Array,
      },
      striped: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      bordered: {
        type: Boolean,
        default: false
      }, responsive: {
        type: Boolean,
        default: false
      },
    }, computed: {
      viewTableData() {
        const tableData = this.tableData[0]
        return tableData ? tableData[this.filedName] : []
      }, viewTableHeadings() {
        // returns array of values
        const values = (this.tableData.map(row => ({[this.filedName]: row[this.filedName]})) || {[this.filedName]: ['can find field']})
        if (values instanceof Array) {
          const field = values[0];
          if (!field) return [this.$t(this.label)];
          return Object.values(values[0])[0].map((_, index) => this.$t(this.label) + '  ' + (index + 1))

        }
      }, edit() {
        return this.tableData[0].edit;
      }
    }, watch: {
      tableData(newValue, oldValue) {
        const valid = this.verifyTable()
        this.$emit('input', {value: this.tableData, valid})
      }
    }, methods: {
      verifyTable(value, index) {
        value = value || this.tableData.map(i => ({
          ...i,
          [this.filedName]: this.viewTableData.map((_, i) => i === index ? value : _)
        }));
        if (!value[0]) return this.errors = [];
        this.errors = value[0][this.filedName].map((i, _index) => {
          if (!index) {
            if (!this.headingObj.validator) return requiredField(i)
            return requiredField(i) === '' ? this.headingObj.validator(i) : requiredField(i)
          }
          if (_index !== index) return this.errors[_index] || '';

          if (!this.headingObj.validator) return requiredField(i)

          return requiredField(i) === '' ? this.headingObj.validator(i) : requiredField(i)
        });
        return this.errors.reduce((acc, i) => acc && i === '', true)
      }, removeField(index) {
        if (this.viewTableData.length === 1) return;
        const newVal = this.tableData.map(i => ({
          ...i,
          [this.filedName]: this.viewTableData.filter((_, i) => i !== index)
        }))
        console.log(newVal);
        this.$emit('input', {
          value: newVal,
          valid: true,
          dirty:true
        })
      },
      handleInput(value, index) {
        let brakeAt = this.headingObj.brakeAt

        const newVal = this.tableData.map(i => ({
          ...i,
          [this.filedName]: this.viewTableData.map((_, i) => {
            if (i === index && typeof value !== "boolean") {
              brakeAt = brakeAt || defBreakInput;
              value = !brakeAt(value) ? _ : value
            }
            return i === index ?
              value
              : _;
          })
        }))
        const valid = this.verifyTable(newVal, index)
        this.$emit('input', {value: newVal, valid, dirty: true})
      }
    }, updated() {

    }, mounted() {
      const valid = this.verifyTable()
      this.$emit('input', {value: this.tableData, valid})
    }
  }
</script>
<style scoped>
  .ceevo__table .ceevo__heading-label {
    padding: .5rem .6rem;
    font-weight: bold;
  }

  .ceevo__table th {
    width: 220px !important;
    padding: 10px;
  }

  .position-absolute {
    top: 0;
    left: 0;
  }

  .required-field-sympol {
    color: #ff4d57;
  }
</style>
