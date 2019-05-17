<template>
  <div>
    <modal :show="value"
           footerClasses="justify-content-center"
           type="notice">
      <h5 slot="header" class="modal-title aba_sofUplaoder-header">
        {{ $t('sof_uploader.title') }}
      </h5>
      <template>
        <div class="aba__softuploader-wrapper">
          <!-- listing images -->
          <ul v-if="!selectOnly">
            <li v-for="softDoc of softDocs" :key="softDoc.id">
              <div class="row">
                <div class="col-8">
                  {{softDoc.fileName}}
                </div>
                <!--     <div class="col-2">
                            <AbaButton
                                  context="danger"
                                  @click="deleteDoc(softDoc.id)"
                                  tooltip="delete"
                                  :disabled="deleting.indexOf(softDoc.id) >= 0"
                                >
                                  <i class="fa  fa-trash" v-if="deleting.indexOf(softDoc.id) < 0"></i>
                                  <Loader v-else></Loader>
                                </AbaButton>
                </div>-->
                <div class="col-2">
                  <AbaButton
                    context="primary"
                    @click="download(softDoc)"
                    :tooltip="$t('sof_uploader.tooltip.download')"
                    :disabled="downloading.indexOf(softDoc.id) >= 0"
                  >
                    <i class="fa  fa-download" v-if="downloading.indexOf(softDoc.id) < 0"></i>
                    <Loader v-else></Loader>
                  </AbaButton>
                </div>
                <div class="col-2">
                  <AbaButton
                    context="primary"
                    @click="viewFile(softDoc)"
                    :tooltip="$t('sof_uploader.tooltip.view_file')"
                    :disabled="viewing.indexOf(softDoc.id) >= 0"
                  >
                    <i class="fa  fa-eye" v-if="viewing.indexOf(softDoc.id) < 0"></i>
                    <Loader v-else></Loader>
                  </AbaButton>
                </div>
              </div>
            </li>
          </ul>
          <!-- listing images -->

          <!-- display preview image -->
          <div v-if="onUploadSofDocs[floatId] && onUploadSofDocs[floatId].length > 0 && softDocs.length > 0">
            <br>
            <hr>
          </div>
          <ul class="d-flex">
            <li v-for="softDoc of onUploadSofDocs[floatId]" :key="softDoc.name" :title="softDoc.name" class="aba__softuploader-onuploadfile card" :style="{
               background:'no-repeat center center / contain',
               backgroundImage:  softDoc.name.slice(-3) === 'pdf' ? pdfSympol : `url('${softDoc.data}')`,

            }">
              <div class="aba__softuploader-filename d-flex justify-content-center align-items-center">
                <div class="w-100">{{softDoc.name.length > 16 ?
                  softDoc.name.slice(0,10)+'.'+softDoc.name.slice(-3):softDoc.name }}
                </div>
              </div>
              <!--
              <AbaButton
                context="danger"
                class="aba_sofdocUploader-onupload-delete"
                @click="removeOnUplaodfile(softDoc.name)"
                tooltip="cancel"
                :disabled="uploading"
              >
                <i class="fa  fa-remove"></i>
              </AbaButton>
              -->
            </li>
          </ul>
          <!-- display preview image -->

          <div class="aba__softuploader-fab">
            <input type="file" :ref="'aba_sof_file_uploader'"
                   class="hiddenInput"
                   @change="onFileChose($event)"
                   multiple
                   accept="application/pdf,image/jpeg ,image/png"
                   v-if="uploadReady"
            />
            <AbaButton
              v-if="!readOnly"
              context="primary"
              @click="triggerFileChooser"
              :tooltip="$t('sof_uploader.tooltip.add_new_sof_doc')"
            >
              <i class="fa  fa-plus"></i>
            </AbaButton>
          </div>
          <!--        <div class="aba__softuploader-upload">
                    <zoom-center-transition>
                      <AbaButton
                        v-if="onUploadSofDocs.length > 0"
                        context="primary"
                        @click="startUploading"
                        tooltip="upload files"
                      >
                        <i class="fa  fa-cloud-upload"></i>
                      </AbaButton>
                    </zoom-center-transition>
                  </div>-->
        </div>
        <a ref="downloadEr"></a>
      </template>
      <div slot="footer" class=" aba_sofdocUploader-footer w-100  px-4">
        <div class="d-flex  align-items-center justify-content-end dg-danger w-100 h-100">
          <zoom-center-transition>
            <div v-if="onUploadSofDocs[floatId] && onUploadSofDocs[floatId].length > 0 ">
              <p-button class="btn btn-round btn-primary"
                :disabled="uploading"
                type="success" @click.native="startUploading">
                <div class="d-flex align-items-center justify-content-center">
                  <i class="fa  fa-cloud-upload" v-if="!uploading && !selectOnly"></i>
                  <Loader v-if="uploading && !selectOnly"></Loader>
                  <span class="px-1">{{uploading ?'Uploading': selectOnly ? `&nbsp;&nbsp;${$t('sof_uploader.button.ok')}&nbsp;&nbsp; ` : $t('sof_uploader.button.upload')}}</span>
                </div>
              </p-button>
            </div>
          </zoom-center-transition>
          <span class="px-2"></span>
          <div>
            <p-button type="default" @click.native="closeModel" class="btn btn-round btn-default">&nbsp;{{ $t('sof_uploader.button.cancel') }}&nbsp;</p-button>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import Vue from 'vue';
  import ZoomCenterTransition from "vue2-transitions/src/Zoom/ZoomCenterTransition";
  import {SHOW_TOAST_MESSAGE} from "../../../../store/types";
  import {b64toBlob} from "../../../../utils/createCSVData";
  import {toBase64} from "../../../../utils/fileToBase64.js";
  import PButton from "../../Button";
  import Loader from "../../Loader";
  import Modal from "../../Modal";
  import AbaButton from "../AbaButton";

  export default {
    name: "SofUploader",
    components: {Loader, ZoomCenterTransition, AbaButton, PButton, Modal},
    props: {
      softDocs: {
        type: Array,
        default: []
      },
      selectOnly: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      floatId: {
        type: String,
        default: ''
      }, value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        deleting: [],
        uploading: false,
        downloading: [],
        downloadedFiles: [],
        viewing: [],
        viewSub: [],
        downloadSub: [],
        uploadReady: true,
        rowFiles: {},
        onUploadSofDocs: {},
        pdfSympol:
          `url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHZpZXdCb3g9IjAgMCA0OSA2NCIgd2lkdGg9IjQ5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogI2NiMDYwNjsKICAgICAgfQoKICAgICAgLmNscy0xLCAuY2xzLTIsIC5jbHMtMyB7CiAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNmYjhkOGQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogI2ZmZjsKICAgICAgfQogICAgPC9zdHlsZT48L2RlZnM+PGc+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDkuMDAwLDE2Ljg0MiBMNDkuMDAwLDU4Ljk0NyBDNDkuMDAwLDYxLjczOCA0Ni43MzAsNjQuMDAwIDQzLjkzMSw2NC4wMDAgTDUuMDY5LDY0LjAwMCBDMi4yNjksNjQuMDAwIC0wLjAwMCw2MS43MzggLTAuMDAwLDU4Ljk0NyBMLTAuMDAwLDUuMDUzIEMtMC4wMDAsMi4yNjIgMi4yNjksLTAuMDAwIDUuMDY5LC0wLjAwMCBMMzIuMTAzLC0wLjAwMCBMNDkuMDAwLDE2Ljg0MiBaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNDkuMDAwLDE1Ljg5OSBMNDkuMDAwLDE3Ljk5NSBMMzUuMTg3LDE3Ljk5NSBDMzIuMzI3LDE3Ljk5NSAzMS4wMDgsMTUuNjc1IDMxLjAwOCwxMi44MTQgTDMxLjAwOCwtMC4wMDAgTDMzLjEwMCwtMC4wMDAgTDQ5LjAwMCwxNS44OTkgWiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTM3LjYwNiwzNC4wNDcgQzM3LjE3MCwzMy45MDMgMzYuNzUwLDMzLjgzMCAzNi4zNDUsMzMuODMwIEMzNS44ODUsMzMuODMwIDM1LjU2OSwzMy45MjUgMzUuMzk2LDM0LjExNSBDMzUuMjI0LDM0LjMwNSAzNS4xMzgsMzQuNjQxIDM1LjEzOCwzNS4xMjQgTDM1LjEzOCwzNi4wNDcgTDM3LjA3MSwzNi4wNDcgTDM3LjA3MSwzNy45MDEgTDM1LjEzOCwzNy45MDEgTDM1LjEzOCw0NS41MzYgTDMyLjc5Niw0NS41MzYgTDMyLjc5NiwzNy45MDEgTDMxLjU4OSwzNy45MDEgTDMxLjU4OSwzNi4wNDcgTDMyLjc5NiwzNi4wNDcgTDMyLjc5NiwzNS4xMjQgQzMyLjc5NiwzMy45NDggMzMuMDg4LDMzLjA5OCAzMy42NzIsMzIuNTczIEMzNC4yNTYsMzIuMDQ4IDM1LjEzNCwzMS43ODYgMzYuMzA4LDMxLjc4NiBDMzYuODU5LDMxLjc4NiAzNy40NDMsMzEuODYxIDM4LjA2MCwzMi4wMTIgTDM3LjYwNiwzNC4wNDcgWk0yNy43OTYsNDQuNjEzIEMyNy4zNjAsNDQuOTgxIDI2LjkwMCw0NS4yNzQgMjYuNDE2LDQ1LjQ5MSBDMjUuOTMyLDQ1LjcwOCAyNS4zODIsNDUuODE2IDI0Ljc2NSw0NS44MTYgQzIzLjU2Nyw0NS44MTYgMjIuNjUwLDQ1LjM4NSAyMi4wMTUsNDQuNTIzIEMyMS4zNzksNDMuNjYwIDIxLjA2Miw0Mi40NDIgMjEuMDYyLDQwLjg2OCBDMjEuMDYyLDM5LjI1OCAyMS40MTEsMzguMDA3IDIyLjExMCwzNy4xMTQgQzIyLjgwOSwzNi4yMjIgMjMuNzkwLDM1Ljc3NSAyNS4wNTUsMzUuNzc1IEMyNS41MDMsMzUuNzc1IDI1Ljk2MiwzNS44NjcgMjYuNDM0LDM2LjA1MSBDMjYuOTA2LDM2LjIzNSAyNy4yOTcsMzYuNDY5IDI3LjYwNSwzNi43NTIgTDI3LjYwNSwzMi4wNjYgTDI5Ljk0NywzMi4wNjYgTDI5Ljk0Nyw0NS41MzYgTDI3Ljc5Niw0NS41MzYgTDI3Ljc5Niw0NC42MTMgWk0yNy42MDUsMzguNjc5IEMyNy4zNTcsMzguNDU2IDI3LjA1MCwzOC4yNTggMjYuNjg0LDM4LjA4NiBDMjYuMzE4LDM3LjkxNSAyNS45NDQsMzcuODI5IDI1LjU2MywzNy44MjkgQzI0LjkzNCwzNy44MjkgMjQuNDI5LDM4LjA5OSAyNC4wNDgsMzguNjM4IEMyMy42NjYsMzkuMTc4IDIzLjQ3NiwzOS45MDkgMjMuNDc2LDQwLjgzMiBDMjMuNDc2LDQxLjc0MyAyMy42MzIsNDIuNDU3IDIzLjk0Myw0Mi45NzYgQzI0LjI1NSw0My40OTUgMjQuNzM3LDQzLjc1NCAyNS4zOTEsNDMuNzU0IEMyNS43NzgsNDMuNzU0IDI2LjE3Myw0My42NjUgMjYuNTc1LDQzLjQ4NyBDMjYuOTc3LDQzLjMwOSAyNy4zMjEsNDMuMDkwIDI3LjYwNSw0Mi44MzEgTDI3LjYwNSwzOC42NzkgWk0xNy41OTUsNDUuMjAxIEMxNy4wMjAsNDUuNjExIDE2LjMzNCw0NS44MTYgMTUuNTM1LDQ1LjgxNiBDMTQuNDgyLDQ1LjgxNiAxMy41ODQsNDUuNDg4IDEyLjg0MCw0NC44MzAgTDEyLjg0MCw0OS4xMDkgTDEwLjQ5OCw0OS4xMDkgTDEwLjQ5OCwzNi4wNDcgTDEyLjY1OCwzNi4wNDcgTDEyLjY1OCwzNi45NzggQzEzLjA5NCwzNi42MDQgMTMuNTUyLDM2LjMxMCAxNC4wMzMsMzYuMDk2IEMxNC41MTQsMzUuODgyIDE1LjA2NiwzNS43NzUgMTUuNjg5LDM1Ljc3NSBDMTYuODkzLDM1Ljc3NSAxNy44MTAsMzYuMTk3IDE4LjQzOSwzNy4wNDIgQzE5LjA2OCwzNy44ODYgMTkuMzgzLDM5LjExMyAxOS4zODMsNDAuNzIzIEMxOS4zODMsNDEuNzQzIDE5LjIyOSw0Mi42NDEgMTguOTIwLDQzLjQxOSBDMTguNjExLDQ0LjE5NyAxOC4xNzAsNDQuNzkxIDE3LjU5NSw0NS4yMDEgWk0xNi40ODgsMzguNjAyIEMxNi4xNjcsMzguMDg2IDE1LjY4OSwzNy44MjkgMTUuMDU0LDM3LjgyOSBDMTQuNjczLDM3LjgyOSAxNC4yODEsMzcuOTE4IDEzLjg3OSwzOC4wOTUgQzEzLjQ3NiwzOC4yNzMgMTMuMTMwLDM4LjQ5MiAxMi44NDAsMzguNzUxIEwxMi44NDAsNDIuOTAzIEMxMy4wODgsNDMuMTI3IDEzLjM5NSw0My4zMjQgMTMuNzYxLDQzLjQ5NiBDMTQuMTI3LDQzLjY2OCAxNC41MDMsNDMuNzU0IDE0Ljg5MSw0My43NTQgQzE1LjUzMiw0My43NTQgMTYuMDM5LDQzLjQ4MSAxNi40MTEsNDIuOTM1IEMxNi43ODMsNDIuMzg5IDE2Ljk2OSw0MS42NjQgMTYuOTY5LDQwLjc2MCBDMTYuOTY5LDM5LjgzNyAxNi44MDgsMzkuMTE4IDE2LjQ4OCwzOC42MDIgWiIvPjwvZz48L3N2Zz4=')`

      }
    },
    methods: {
      closeModel() {
        this.$emit('input', false)
      },
      async onFileChose(ev) {
        if (ev.target.files.length < 1) return;
        // get uploaded files
        const tempArr = this.rowFiles[this.floatId] ? this.rowFiles[this.floatId] : []
        const filesArray = [...tempArr, ...Array.from(ev.target.files).filter(file => tempArr.find(_file => _file.name === file.name) === void 0)];
        this.rowFiles[this.floatId] = filesArray.filter(file => file.size <= 1024 * 1024 * 5);
        this.getonUploadSofDocs()

        if (this.rowFiles[this.floatId].length < filesArray.length) {
          const defectFiles = filesArray.filter(file => file.size > 1024 * 1024 * 5).reduce((acc, {name}, index, {length}) =>
            acc + `${index > 0 && length > 1 ? ', ' : ''}` + name, '')
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: this.$t('sof_uploader.toast.error_max_size'), status: 'danger'})
        }

        this.clear()
      }, 
      async getonUploadSofDocs() {
        const files = []
        for (const file of this.rowFiles[this.floatId]) {
          const {size, name, type} = file;
          const data = await toBase64(file)
          files.push({data, size, name, type});
        }
        // this.onUploadSofDocs[this.floatId] = files;
        this.$set(this.onUploadSofDocs, this.floatId, files)
      },
      triggerFileChooser() {
        this.$refs['aba_sof_file_uploader'].click()
      }, 
      removeOnUplaodfile(fileName) {
        this.rowFiles[this.floatId] = this.rowFiles[this.floatId].filter(i => i.name !== fileName)
        this.getonUploadSofDocs()
      }, 
      async startUploading() {

        if (this.selectOnly) {
          this.$emit('sofDocsSelected', [...this.onUploadSofDocs[this.floatId]])
          return this.closeModel();
        }
        try {
          this.uploading = true;
          const onUPloadFiles = [...this.onUploadSofDocs[this.floatId]];
          await Promise.all(onUPloadFiles.map(({data, type}) => {
              let dataArr = data.split(',')
           return   Vue.prototype.$http.post(`/floats/${this.floatId}/sofdocs`, {
                content: dataArr[1],
                mimeType: type
              }, {
                timeout: 60000
              })
            }
          ))
          console.log('uploaded');
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: this.$t('sof_uploader.toast.success_upload_file'), status: 'success'})
          this.$emit('dataChanged')
          this.uploading = false;
          console.log(onUPloadFiles, this.rowFiles[this.floatId]);
          this.rowFiles[this.floatId] = this.rowFiles[this.floatId].filter(({name}) => !onUPloadFiles.find(i => i.name === name));
          console.log(this.rowFiles[this.floatId], onUPloadFiles);
          this.getonUploadSofDocs()
        } catch ({response}) {
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: this.$t('sof_uploader.toast.error_upload_file'), status: 'danger'})
          this.uploading = false;
        }
      }, 
      async deleteDoc(id) {
        try {
          this.deleting = [...this.deleting, id];

          await Vue.prototype.$http.delete(`/floats/${this.floatId}/sofdocs/${id}`)
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: this.$t('sof_uploader.toast.success_delete_upload_file'), status: 'success'})
          this.$emit('dataChanged')
          this.deleting = this.deleting.filter(i => id === i)

        } catch ({response}) {
          this.deleting = this.deleting.filter(i => id === i)
          this.$store.dispatch(SHOW_TOAST_MESSAGE, {message: this.$t('sof_uploader.toast.error_delete_upload_file'), status: 'danger'})

        }
      },
      async download({id, uploadId, fileName}) {
        const $ancoreElement = this.$refs.downloadEr;
        const onView = this.viewing.find(i => i.id == id)
        if (onView) return [...this.downloadSub, id]
        this.downloading = [...this.downloading, id]
        const {blob: _blob, mimeType} = await this.getFiles({id, uploadId, fileName});
        this.downloadSub = this.downloadSub.filter((i) => i !== id)
        const blobURI = URL.createObjectURL(_blob);
        $ancoreElement.setAttribute("href", blobURI);
        $ancoreElement.setAttribute("download", fileName);
        $ancoreElement.click();
        if (this.viewSub.indexOf(id) > -1) this.viewFile({id, uploadId, fileName})
        this.downloading = this.downloading.filter(i => id === i.id);
      },
      async viewFile({id, uploadId, fileName}) {
        const onDownload = this.downloading.find(i => i.id == id)
        this.viewing = [...this.viewing, id]
        // subscribe tow downloading to view files after download
        if (onDownload) return [...this.viewSub, id]
        try {
          const {base64, mimeType, fileName} = await this.getFiles({id, uploadId, fileName});

          this.viewSub = this.viewSub.filter(i => i !== id)
          if (this.downloadSub.indexOf(id) > -1) this.download({id, uploadId, fileName})
          const _w = window.open()
          _w.document.write(`
          <!DOCTYPE html>
         <head>
         <style>
         img{
         display:block;
         margin: auto;
         max-width: 100%;
         }
         html,body{
         padding: 0;
         margin: 0;
         }
      iframe{
      width: 100vw;
      height:100vh;
      }

</style>

        </head>
          </body>

          ${mimeType.toLowerCase().indexOf('pdf') > 0 ? `

          <iframe width='w100%' height='100%' src='data:${mimeType};base64,${encodeURI(base64)}'></iframe> ` : `<img src="data:${mimeType};base64,${base64}" alt="${fileName}"/>`}

          </body>
          `
          )

        } catch (e) {
          console.log(e);
        }
        this.viewing = this.viewing.filter(i => id === i.id);
      },
      async getFiles({id, uploadId, fileName}) {
        try {
          let _blob = this.downloadedFiles.find(i => i.id === id)
          if (_blob) return _blob;
          const {data} = await Vue.prototype.$http.get(`/floats/${this.floatId}/sofdocs/${id}`)
          if (data) {
            const {content, fileName, id, mimeType} = data;
            console.log(content, 'sof file');
            _blob = b64toBlob(content, mimeType, 512);
            const file = {id, blob: _blob, fileName, mimeType, base64: content}
            this.downloadedFiles = [...this.downloadedFiles, file]
            return file
          }


        } catch (e) {
          console.log(e);
        }


      }, clear() {
        this.uploadReady = false
        this.$nextTick(() => {
          this.uploadReady = true
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .aba__softuploader-wrapper {
    min-height: 200px;
    position: relative;
    padding-bottom: 3rem;
  }

  .aba__softuploader-fab {
    position: absolute;
    bottom: .2rem;
    right: .2rem;

  }

  .aba__softuploader-upload {
    position: absolute;
    bottom: .2rem;
    right: 3.6rem;
  }

  .hiddenInput {
    opacity: 0;
    width: 1px;
    display: none;
  }

  .aba_sofdocUploader-footer {
    height: 50px;
    overflow: hidden;

  }

  .aba_sofdocUploader-footer .btn {
    height: 40px;
    padding: 10px;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  .aba_sofdocUploader-onupload-delete {
    position: absolute;
    top: 0;
    transform: translate3d(50%, -50%, 0);
    z-index: 777777;
    width: 20px;
    height: 20px;
    padding: 1px;
    font-size: 11px;
    right: 0;
    transition: all ease-in-out .33s;
    opacity: 0;


  }

  .aba__softuploader-filename {
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    background-color: rgba(0, 0, 0, .78);
    color: #f9f9f9;
    font-size: 13px;
    bottom: 0;
    text-align: center;
  }

  .aba__softuploader-onuploadfile {
    width: 110px;
    position: relative;
    list-style: none;
    height: 100px;
    margin: 3px;
    border-radius: .1px;

    &:hover {
      .aba_sofdocUploader-onupload-delete {
        opacity: 1;
      }
    }
  }
  li {
    padding-top:.2rem;
    padding-bottom:.2rem;
  }
</style>
