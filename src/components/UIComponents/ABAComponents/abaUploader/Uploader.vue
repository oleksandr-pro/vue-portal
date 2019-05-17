<template>
  <div class="aba__fileuploader-wrapper">
    <p-button
      v-if="!value"
      nativeType="file"
      type="primary"
      aria-label="chose a file"
      @click="handleChoseFile('inputFile'+index)"
    >
      <i class="fa fa-upload"></i> Upload
    </p-button>
    <div v-else class="w-100 d-flex align-items-center">
      <div class="col-8" v-if="value.name">
        <el-tooltip :content="value.name"
                    :open-delay="300"
                    placement="bottom">
          <span> {{value.name.length > 14 ? value.name.slice(0,14) + '...': value.name}}</span>
        </el-tooltip>
      </div>
      <div class="col-4">
        <p-button
          icon link round
          @click.native="removeFile"
        ><i class="fa fa-remove"></i></p-button>
      </div>
    </div>
    <input
        class="hiddenInput"
      :ref="'inputFile'+index"
        @change="onFileChose($event)"
      type="file"
    />
  </div>
</template>
<script>
  import PButton from "../../Button";


  export default {
    name: "Uploader",
    components: {PButton},
    props: {
      value: {
        type: File
      },
      index: {
        type: String,
        default: ''
      }
    }, methods: {
      onFileChose($event) {
        this.$emit('input', $event.target.files[0])
      }, handleChoseFile(inputRef) {
        this.$refs[inputRef].click()
      },
      removeFile() {
        console.log('remvoe');
        this.$emit('input', null)
      }
    }

  }
</script>
<style scoped>
  .aba__fileuploader-wrapper {
    width: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hiddenInput {
    opacity: 0;
    width: 1px;
    display: none;
  }
</style>
