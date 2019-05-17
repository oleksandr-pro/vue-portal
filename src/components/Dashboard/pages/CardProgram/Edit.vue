<template>
  <form @submit.prevent="handleEditing">
    <fg-input v-model="card.alertContact" addon-left-icon="nc-icon nc-single-02" placeholder="alertContact.."></fg-input>
    <fg-input v-model="card.apiFee" addon-left-icon="nc-icon nc-single-02" placeholder="apiFee.."></fg-input>
    <fg-input v-model="card.apiFeeBillMethod" addon-left-icon="nc-icon nc-single-02" placeholder="apiFeeBillMethod.."></fg-input>
    <fg-input v-model="card.appFee" addon-left-icon="nc-icon nc-single-02" placeholder="appFee.."></fg-input>
    <fg-input v-model="card.appFeeBillMethod" addon-left-icon="nc-icon nc-single-02" placeholder="appFeeBillMethod.."></fg-input>
    <fg-input v-model="card.cardPrinterCode" addon-left-icon="nc-icon nc-single-02" placeholder="cardPrinterCode.."></fg-input>
    <fg-input v-model="card.cardProgCode" addon-left-icon="nc-icon nc-single-02" placeholder="cardProgCode.."></fg-input>
    <fg-input v-model="card.cardProgDesc" addon-left-icon="nc-icon nc-single-02" placeholder="cardProgDesc.."></fg-input>
    <fg-input v-model="card.defCurrency" addon-left-icon="nc-icon nc-single-02" placeholder="defCurrency.."></fg-input>
    <fg-input v-model="card.issuerInst" addon-left-icon="nc-icon nc-single-02" placeholder="issuerInst.."></fg-input>
    <fg-input v-model="card.loadFee" addon-left-icon="nc-icon nc-single-02" placeholder="loadFee.."></fg-input>
    <fg-input v-model="card.loadFeeCap" addon-left-icon="nc-icon nc-single-02" placeholder="loadFeeCap.."></fg-input>
    <fg-input v-model="card.loadFeePct" addon-left-icon="nc-icon nc-single-02" placeholder="loadFeePct.."></fg-input>
    <fg-input v-model="card.loadFeebillMethod" addon-left-icon="nc-icon nc-single-02" placeholder="loadFeebillMethod.."></fg-input>
    <fg-input v-model="card.monthlyFee" addon-left-icon="nc-icon nc-single-02" placeholder="monthlyFee.."></fg-input>
    <fg-input v-model="card.monthlyFeeBillMethod" addon-left-icon="nc-icon nc-single-02" placeholder="monthlyFeeBillMethod.."></fg-input>
    <fg-input v-model="card.pmInst" addon-left-icon="nc-icon nc-single-02" placeholder="pmInst.."></fg-input>
    <fg-input v-model="card.poInst" addon-left-icon="nc-icon nc-single-02" placeholder="poInst.."></fg-input>
    <fg-input v-model="card.psfRef" addon-left-icon="nc-icon nc-single-02" placeholder="psfRef.."></fg-input>
    <p-button nativeType="submit">Edit</p-button>
  </form>
</template>
<script>
  import {mapActions} from'vuex'
  import {EDIT_CARD_PROGRAM} from "../../../../store/types";
  export default {
    name: 'Edit',
    data() {
      return {
        id:null,
        card: {
          alertContact: "",
          apiFee: 0.1,
          apiFeeBillMethod: "",
          appFee: 1,
          appFeeBillMethod: "",
          cardPrinterCode: "",
          cardProgCode: "",
          cardProgDesc: "",
          defCurrency: "",
          issuerInst: "",
          kycClassifier: [
            "FDD"
          ],
          loadFee: 0.5,
          loadFeeCap: 1,
          loadFeePct: 1,
          loadFeebillMethod: "",
          matrixPID: [
            "EMU001"
          ],
          monthlyFee: 3,
          monthlyFeeBillMethod: "",
          pmInst: "",
          poInst: "",
          psfRef: ""
        }
      }
    },
    methods:{
    ...mapActions({
      editCardProgram:EDIT_CARD_PROGRAM
    }),
      handleEditing(){
      this.editCardProgram({body:this.card,id:this.id})
      }
    },
    mounted() {
       this.id = this.$route.params.id;
      this.card = this.$store.state.cardProgram.allCardPrograms.find(card => card.id === this.id)
    }
  }
</script>
<style scoped>
</style>
