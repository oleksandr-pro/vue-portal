<template>
  <div>
    <div class="card-header bg-white">
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <h4 class="card-title display-inline">
            You do not have permission, please contact the administrator
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'empty'
  }
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

  .card-header {
    border: none !important;
  }
</style>
