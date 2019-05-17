<template>
  <el-tooltip :content="tooltip"
              :open-delay="300"
              placement="bottom">
    <button class="aba__button  " :disabled="disabled" @click="handleClick" :class="{
  clicked:clicked,
  ['btn-'+context]:customeColor === '',
  [customeColor]:true,
  small:small,
  noRond:squared,
  disabled:disabled
  }">
      <transition name="fade" timeout="300">
        <div class="aba__button-effect  " v-if="clicked">
        </div>
      </transition>
      <slot>
      </slot>
    </button>
  </el-tooltip>
</template>
<script>
  import {Tooltip} from 'element-ui'
  import Vue from 'vue';

  Vue.use(Tooltip)
  export default {
    name: "AbaButton",
    data() {
      return {
        clicked: false
      }
    },
    props: {
      small: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      squared: {
        type: Boolean,
        default: false
      },
      context: {
        type: String,
        default: 'default'
      },
      ariaLabel: {
        type: String,
        default: ''
      },
      tooltip: {
        type: String,
        default: ''
      },
      customeColor: {
        type: String,
        default: ''

      },
    },
    methods: {
      handleClick($event) {
        this.clicked = true;
        setTimeout(_ => this.clicked = false, 400)
        this.$emit('click', $event)
      }
    }
  }
</script>
<style scoped lang="scss">
  .aba__button {
    outline: none;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14);
    position: relative;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    padding: .4rem;
    width: 2.4rem;
    height: 2.4rem;
    overflow: hidden;
    transition: all ease-in-out .33s;

    &:hover {
      box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14) !important;


    }

    &.clicked {
      box-shadow: 2px 3px 10px 0px rgba(41, 41, 41, .2);

    }

    color: #fff;
  }

  .aba__button-effect {
    top: 0;
    left: 0;
    position: absolute;
    background: rgba(255, 255, 255, .4);
    z-index: 44;
    width: 100%;
    height: 100%;

  }

  .small {
    width: 29px;
    height: 29px;
    padding: 0;
    font-weight: 300;
    text-align: center;

  }

  .noRond {
    border-radius: 1px !important;
  }

  .disabled {
    cursor: not-allowed;
  }
</style>
