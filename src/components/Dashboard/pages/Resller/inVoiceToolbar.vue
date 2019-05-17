<template>
  <div class="d-flex w-100 align-items-center flex-wrap">
    <div class="mt-2 mb-2 d-flex mr-auto align-items-center w-100">
      <div class="d-flex align-items-center span-blod">
        <span class="px-2 nowrap">{{ $t('invoice.search_filter.label.card_program_code') }}</span>
        <span class="span-margin-right">{{ cardProgCode }}</span>
      </div>
      &nbsp;&nbsp;&nbsp;
      <div class="d-flex mr-2 align-items-center span-blod">
        <span class="px-2">{{ $t('invoice.search_filter.label.reseller_code') }}</span>
        <span class="span-margin-right">{{ resellerCode }}</span>
      </div>
    </div>

    <div class="mt-2 mb-2 w-50 d-flex align-items-center justify-content-start w-100">
      <div class="d-flex align-items-center span-blod">
        <span class="px-2">{{ $t('invoice.search_filter.label.currency_code') }}</span>
        <span class="span-margin-right">{{ currencyCode }}</span>
      </div>
    </div>

    <div class="mt-2 mb-2 d-flex mr-auto align-items-center">
      <div class="from-date">
          <span class="px-2">{{ $t('invoice.search_filter.label.from') }}</span>
          <el-date-picker
            @input="handleFromDate"
            :value="fromDate"
            type="date"
            placeholder="From Date"
          >
          </el-date-picker>
      </div>
      <div class="to-date">
        <span class="px-2">{{ $t('invoice.search_filter.label.to') }}</span>
        <el-date-picker
          @input="handleToDate"
          :value="toDate"
          type="date"
          placeholder="To Date"
        ></el-date-picker>
      </div>
    </div>
    
    <!-- button -->
    <div class="d-flex ml-auto pr-2 align-items-center btn-invoices-content">
      <div>
        <p-button @click="buttonClick" type="primary" :disabled="buttonDisabled">
          {{ $t('invoice.search_filter.button.search') }}
        </p-button>
      </div>
    </div>
    <!-- button -->
  </div>
</template>
<script>
  import {Button, DatePicker, Input, Option, Select} from 'element-ui';
  import PButton from "../../../UIComponents/Button";
  import RegularTable from "../../../UIComponents/CeevoTables/RegularTable/RegularTable";
  import Modal from "../../../UIComponents/Modal";
  import InVoiceToolbar from "./inVoiceToolbar";

  export default {
    name: "inVoiceToolbar",
    components: {
      InVoiceToolbar,
      Modal,
      PButton,
      RegularTable,
      [Input.name]: Input,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,
      [DatePicker.name]: DatePicker,

    },
    props: ['toDate','currencies' ,'currencyCode','fromDate', 'resellerCode', 'resellers', 'cardProgramData', 'cardProgCode', 'buttonDisabled'],
    methods: {
      handleToDate($event) {
        this.$emit('toDateChange', $event.toISOString())
      },
      handleFromDate($event) {
        this.$emit('fromDateChange', $event.toISOString())
      },handleCurrency($event){
        this.$emit('currencyCodeChange', $event)
      },
      handleResellerId($event) {
        this.$emit('resellerIdChange', $event)
      }, hadleCardPrgram($event) {
        this.$emit('CardProgCodeChange', $event)
      },
      buttonClick() {
        this.$emit('buttonClick')
      }
    }
  }
</script>
<style scoped>

  .el-select {
    width: 130px;
    overflow: hidden;
  }

  .el-select input {
    border-radius: .4rem !important;
    border: 1px solid #DDDDDD !important;

    /* unknown */
    /* &:hover {
      border: 1px solid #000 !important;
    }
    &::placeholder{
      text-transform: capitalize;
    } */
  }
  .nowrap{
    white-space: nowrap;
  }
  @media screen and (max-width: 620px) {
    .d-flex,.from-date,.to-date{display: inline-grid !important;width: 100% !important; margin-bottom:5px;}
    .btn-invoices-content{margin-left: 0 !important;}
    .el-date-editor, .el-select{width:100% !important;}
  }

  .span-blod{
    border: 1px solid
  }
  .span-margin-right{
    margin-right: 6px;
  }
</style>
