<template>
  <div class="dnd__wrapper " :class="{
  dnd__draggedOver:over,
  dnd__ready:state=== 'ready',
  dnd__selected:state==='selected',
  dnd__error:state==='invalid'
  }">
    <input type="file" accept="image/jpeg, image/png," class="hiddenInput" :ref="id+'inputFile'" @change="handleFileChoosed"/>
    <fade-transition>
      <div class="overlay"
           v-if="over"
      ></div>
    </fade-transition>
    <div class="dnd__container">
      <div class="dnd__state-indecator d-flex justify-content-center align-items-center " @click="trigerInput"
           @drag="dndHanlder"
           @dragstart="dndHanlder"
           @dragend="dndHanlder"
           @dragover="dndHanlder"
           @drop="dndHanlder"
           @dragleave="dndHanlder"
           @dragenter="dndHanlder"
           :style="{
         background:'no-repeat center center / contain',
            backgroundColor:'#fff',
               backgroundImage: state === 'selected' ? `url(${file})` : null,
           }"
      >
        <div class="dnd_upload-icon fa cloud-upload " :class="{
        'fa-cloud-upload':state === 'ready' && over,
        'fa-plus-square':state ==='ready'&& !over,
        'fa-exchange':state ==='selected'&& over
        }">
        </div>
        <div class="dnd__uploader-message">
          {{message}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import FadeTransition from "vue2-transitions/src/Fade/FadeTransition";
  import {toBase64} from "../../../utils/fileToBase64.js";

  export default {
    name: "DragAndDropFileChooser",
    components: {FadeTransition},
    data() {
      return {
        state: 'ready', // consumed invalid
        over: false, // true -> dragged over
        drag: false,
        message: 'drop files to upload',
        file: null
      }
    }, props: {
      id: {
        description: 'file chooser id',
        value: String,
        default: (Date.now() * Math.random()) + ''
      },
      readyMessage: {
        value: String,
        default: 'drop files to upload'
      }
    }, methods: {
      trigerInput() {
        // trigger input file
        this.$refs[this.id + 'inputFile'].click()
      }, async selectedFile(file) {
        this.file = await toBase64(file);
      }, validateFile(files) {

        if (files.length > 1) {
          this.state = 'invalid'
          this.message = 'only one file is allowed'
        } else {
          const file = files[0];
          if (file.type === 'image/png' || file.type === 'image/jpeg') {
            console.log(file.size);
            if (file.size <= 5 * 1024 * 1024) {
              this.state = 'selected'
              this.message = ''
              this.selectedFile(file)
            } else {
              this.state = 'invalid'
              this.message = 'please select file that is 5MB max'
            }
          } else {
            this.state = 'invalid'
            this.message = 'please select only images (PNG or JPEG)'
          }
        }
      }, handleFileChoosed({target}) {
        const files = target.files;
        this.validateFile(files)
      }, dndHanlder(e) {
        e.preventDefault();
        e.stopPropagation();
        switch (e.type) {
          case "dragstart":
          case"dragenter":
          case"dragover":
            return this.over = true
          case "drop": {
            const files = e.dataTransfer.files;
            this.validateFile(files)
            this.over = false
            this.drag = false;

            return void 0
          }
          case "dragleave":
            return this.over = false
          default :
            void 0
        }

      }
    }, mounted() {
      this.message = this.readyMessage;
    }
  }
</script>
<style scoped lang="scss">
  .dnd__wrapper {
    width: 100%;
  }

  .dnd__container {
    padding-top: 63%;
    width: 100%;
    height: 0;
    position: relative;
  }

  .dnd__state-indecator {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border: 1px dashed #757575;
    border-radius: .4rem;
    width: 100%;
    background-color: #fff;
    transition: all ease .3s;

    .dnd__selected & {
      border-color: #00C853;
    }

    .dnd__draggedOver & {
      background-color: #B3E5FC;
      border-color: #1976D2;
    }

    .dnd__error & {
      border-color: #D50000;
    }
  }

  .dnd_upload-icon {
    color: #42A5F5;
    font-size: 7rem;
    height: 7rem;
    width: 7rem;
    text-align: center;
  }

  .hiddenInput {
    opacity: 0;
    position: relative;
    height: 1px;
    width: 1px;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, .4);
  }

  .dnd__uploader-message {
    position: absolute;
    bottom: 2rem;
    width: 100%;
    text-align: center;
    text-transform: capitalize;
  }
</style>
