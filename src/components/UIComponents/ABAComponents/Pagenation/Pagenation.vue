<template>
  <nav>
    <div :class="{
    empty_pagenition:pageCount <= 1 ||( currentPage > pageCount )
    }">
      <p-pagination :page-count="pageCount" @input="pageChangeHandler" :value="currentPage"></p-pagination>
    </div>
    <div class="page-sizer">
      <div class="d-flex align-items-center align-content-center ">
        <span class="px-2">{{ $t('common.pagenation.page_size') }}</span>
        <el-select class="select-default"
                   v-if=""
                   size="small"
                   placeholder="selected a card program"
                   :value="perPage"
                   @input="handlePerPageChange"
        >
          <el-option v-for="page in 4"
                     class="select-success"
                     :value="page === 1 ? page*5 : (page)*5"
                     :label="page === 1 ? page*5 : (page)*5"
                     :key="page+'page__size'">
          </el-option>
        </el-select>
      </div>
      <div class="py-1" :class="{
    empty_pagenition:pageCount <= 1
    }">
        <small> {{ PagingCalculation(currentPage, pageCount, perPage) }}</small>
      </div>
    </div>
  </nav>
</template>
<script>
  import {Select, Option} from "element-ui";
  import PPagination from "../../Pagination";

  export default {
    name: "Pagination",
    props: {
      pageCount: {
        type: Number,
        default: 0
      },
      value: {
        type: [Number, String],
        default: 0
      },
      perPage: {
        type: Number,
        default: 10
      }
    },

    computed: {
      currentPage() {
        return this.value + 1
      },
    },
    components: {
      PPagination,
      [Option.name]: Option,
      [Select.name]: Select,
    },
    methods: {
      pageChangeHandler(page) {
        console.log(page);
        this.$emit('input', page - 1)
      },
      handlePerPageChange(ev) {
        this.$emit('perpagechange', ev)
      },
      PagingCalculation(currentPage, pageCount, perPage) {
        let start = 0
        let end = 0

        if (currentPage === 1) {
          start = pageCount >= 1 ? 1 : 0
          end = currentPage * perPage
        } else if (currentPage > 1) {
          start = (currentPage - 1) * perPage + 1
          end = currentPage * perPage
        } else {
          // nothing to do
        }
        return this.$t('common.pagenation.page_result', {start: start, end: end})
      }
    },

  }
</script>
<style scoped>
  nav {
    padding: 1rem 0 .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .el-select {
    width: 80px;
    overflow: hidden;
  }

  .el-select input {
    border-radius: .4rem !important;
    border: 1px solid #DDDDDD !important;

    &:hover {
      border: 1px solid #000 !important;
    }
  }

  .page-sizer {
    position: absolute;
    right: 3rem;
    top: 1rem;
  }

  .empty_pagenition {
    visibility: hidden;
  }
</style>
