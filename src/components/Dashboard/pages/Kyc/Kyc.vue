<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="kyc__section">
          <h3 class="kyc__section-header">Program info</h3>
          <div class="kyc__section-body">
            <div class="kyc__section-block">
              <div class="row" v-for="record of programInfo">
                <div class="col-6 col-md-4 ">
                  {{record.label}}
                </div>
                <div class="col-6  col-md-4 ">
                  {{record.name}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="kyc__section">
          <h3 class="kyc__section-header">particulars</h3>
          <div class="kyc__section-body">
            <div class="kyc__section-block">
              <h5>Basic Info</h5>
              <div class="row no-gutters">
                <div class="col-12 col-md-6 px-1">
                  <fg-input placeholder="Title"></fg-input>
                </div>
                <div class="col-md-6 px-1 d-md-none d-lg-block d-md-block d-xl-block"></div>
              </div>
              <div class="row no-gutters">
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="First Name"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Second Name"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="maiden Name"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Last Name"></fg-input>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="gender"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="DOB"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Email"></fg-input>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Mobile Number"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Home Number"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Work Number"></fg-input>
                </div>
              </div>
            </div>
            <div class="kyc__section-block">
              <h5>Address</h5>
              <div class="row no-gutters">
                <div class="col-12 p-1">
                  <fg-input placeholder="Address Line 1"></fg-input>
                </div>
                <div class="col-12 p-1">
                  <fg-input placeholder="Address Line 2"></fg-input>
                </div>
                <div class="col-12 p-1">
                  <fg-input placeholder="Address Line 3"></fg-input>
                </div>
                <div class="col-12 col-md-6 px-1">
                  <fg-input placeholder="City"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Post Code"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Region"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Region"></fg-input>
                </div>
              </div>
            </div>
            <div class="kyc__section-block">
              <h5>Overide Address</h5>
              <div class="row no-gutters">
                <div class="col-12 p-1">
                  <fg-input placeholder="Address Line 1"></fg-input>
                </div>
                <div class="col-12 p-1">
                  <fg-input placeholder="Address Line 2"></fg-input>
                </div>
                <div class="col-12 p-1">
                  <fg-input placeholder="Address Line 3"></fg-input>
                </div>
                <div class="col-12 col-md-6 px-1">
                  <fg-input placeholder="City"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Post Code"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Region"></fg-input>
                </div>
                <div class="col-12 col-md-3 px-1">
                  <fg-input placeholder="Region"></fg-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="kyc__section">
          <h3 class="kyc__section-header">KYC History</h3>
          <div class="kyc__section-body">
            <div class="kyc__section-block">
              <div class="row">
                <div class="col-12">
                  <div class="card p-2">
                    <regular-table
                      striped
                      :headings="tableHeadings"
                      :value="kycHistory"
                    >
                    </regular-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="kyc__section">
          <h3 class="kyc__section-header">Application Info</h3>
          <div class="kyc__section-body">
            <div class="kyc__section-block">
              <div class="row" v-for="record of applicationInfo">
                <div class="col-6 col-md-4 ">
                  {{record.label}}
                </div>
                <div class="col-6  col-md-4 ">
                  {{record.name}}
                </div>
              </div>
            </div>
            <div class="kyc__section-block">
              <div class="row">
                <div class="col-12">
                  <drag-and-drop-file-chooser id="id_picture"
                                              readyMessage="Upload ID"
                  ></drag-and-drop-file-chooser>
                </div>
              </div>
            </div>
            <div class="kyc__section-block"
            >
              <div class="row">
                <div class="col-12">
                  <drag-and-drop-file-chooser
                    readyMessage="Upload Proof of address"
                    id="proof_of_address"></drag-and-drop-file-chooser>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="kyc__section">
          <h3 class="kyc__section-header">Card Info</h3>
          <div class="kyc__section-body">
            <div class="kyc__section-block">
              <div class="row">
                <div class="col-6 col-md-4 ">Matrix PID</div>
                <div class="col-6 col-md-4 ">dropdown</div>
              </div>
              <div class="row">
                <div class="col-6 col-md-4 ">Fourth Line</div>
                <div class="col-6 col-md-4 ">Transact24</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
    </div>
    <div class="d-flex my-4 justify-content-center">
      <div>
        <p-button round>Cancel App</p-button>
        <span class="px-2"></span>
        <p-button round type="success">Verify KYC</p-button>
      </div>
    </div>
  </div>
</template>
<script>
  import DecimalsInput from "../../../UIComponents/ABAComponents/DecimalsInput/Decimals";
  import PButton from "../../../UIComponents/Button";
  import RegularTable from "../../../UIComponents/CeevoTables/RegularTable/RegularTable";
  import DragAndDropFileChooser from "../../../UIComponents/DragAndDropFileChooser/DragAndDropFileChooser";

  export default {
    name: "Kyc",
    components: {DecimalsInput, RegularTable, PButton, DragAndDropFileChooser},
    data() {
      return {
        programInfo: [
          {name: 'issuerInstCode', label: 'Issuer Inst Code'},
          {name: 'pmInstCode', label: 'PM Inst Code'},
          {name: 'poInstCode', label: 'PO Inst Code'},
          {name: 'resellerCode', label: 'RC'},
          {name: 'defaultCurrency', label: 'Default Currency'},
          {name: 'freeProfile', label: 'Free Profile'},
        ],
        applicationInfo: [
          {name: 'accountRef', label: 'Account Ref'},
          {name: 'status', label: 'Status'},
          {name: 'verificationAttempts', label: 'verification Attempts'},
          {name: 'KYCLevel', label: 'KYC Level'},
          {name: 'customerId', label: 'Customer ID'},
        ],
        tableHeadings: [
          {name: 'documentName', label: 'Document Name'},
          {name: 'date', label: 'Date'},
          {name: 'status', label: 'Status'},
          {name: 'reason', label: 'Reason'},
        ],
        kycHistory: [
          {id: 'mihasdfj21-23434', documentName: 'pos 132', date: '24-2-2019', status: 'rejected', reason: 'lorem lorem'},
          {id: 'mihafj21-23434', documentName: 'post 234', date: '24-3-2019', status: 'rejected', reason: 'lorem lorem'}
        ]
      }
    }
  }
</script>
<style scoped lang="scss">
  .kyc__section {
    &:first-child {
      margin-top: 1rem;
    }

    margin-bottom: 2rem;
  }

  .kyc__section-body {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .kyc__section-block {
    margin-bottom: 2rem;
  }
</style>
