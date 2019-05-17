<template>
  <div class="custome__decimals-wrapper form-group "
       :class="[
       {'with_addone':addonRightIcon},
       {'has-danger': error && dirty},
       {'input-group-focus': focused},
       {'has-success': hasSuccess}]"
  >
    <input type="text"
           class=" custome__decimals-input form-control "
           @input="handleInput"
           @keydown="handleKeyboard"
           :value="value"
           @focus="onFocus"
           @blur="onBlur"
           v-bind="$attrs"
           aria-describedby="addon-right addon-left"
    />
    <collapse-transition :duration="300">
      <div class="text-danger invalid-feedback aba__form--error" style="display: block;" v-if="error && dirty ">
        {{ error }}
      </div>
    </collapse-transition>
    <button class="custome_input-controllers-up" tabindex="-1" @click="handleController('add')"><i class="el-icon-caret-top"></i></button>
    <button class="custome_input-controllers-down" tabindex="-1" @click="handleController('remove')"><i class="el-icon-caret-bottom"></i></button>
    <span class="decials__input-addone" v-if="addonRightIcon">
      <i class="fa " :class="addonRightIcon"></i>
    </span>
  </div>
</template>
<script>
  import CollapseTransition from "vue2-transitions/src/Collapse/CollapseTransition";

  export default {
    name: "DecimalsInput",
    components: {CollapseTransition},
    props: {
      value: {
        type: [String, Number],
        default: ''
      }, error: {
        type: String,
        default: ''
      },
      addonRightIcon: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        start: 0,
        end: 0,
        input: null,
        focused: false
      }
    }, computed: {
      hasSuccess() {
        return this.hadError && this.touched && !this.error
      },
    }, methods: {
      onFocus(value) {
        this.focused = true;
        this.dirty = true;

        this.$emit('focus', value);
      },
      onBlur(value) {
        this.focused = false;
        this.$emit('blur', value);
      },
      handleController(action) {
        this.dirty = true;
        this.touched = true;

        if (action === 'add') return this.$emit('input', (+this.value + .1).toFixed(2))
        // if (action === 'remove') return this.$emit('input', (+this.value - .1).toFixed(2))

        if (action === 'remove') {
          let temp = (+this.value - .1)
          if (temp < 0) { // negative Numbers are not allowed
            temp = 0
          }
          return this.$emit('input', temp.toFixed(2))
        }
      },
      handleKeyboard($event) {
        this.input = $event.target;
        switch ($event.key) {
          case 'ArrowDown':
            this.dirty = true;

            this.$emit('input', (+this.value - .1).toFixed(2))
            this.start = this.input.selectionStart;
            this.end = this.input.selectionEnd;
            break;
          case 'ArrowUp':
            this.dirty = true;

            this.$emit('input', (+this.value + .1).toFixed(2))
            this.start = this.input.selectionStart;
            this.end = this.input.selectionEnd;
            break;
          default:
            void 0
        }
      },
      handleInput($event) {
        this.input = $event.target;
        this.dirty = true;
        console.log($event.target.value);
        if (isNaN($event.target.value)) return this.$emit('input', this.value);
        let input = this.input;
        let value = (+$event.target.value).toFixed(2);
        if (+value === 0) {
          this.$emit('input', '')
        } else if (value < 0) { // negative Numbers are not allowed
          this.$emit('input', value.substring(value.indexOf('-') + 1))
        } else {
          console.log(value);
          this.$emit('input', value)
        }

        this.start = input.selectionStart;
        this.end = input.selectionEnd;
      }
    }, updated() {
      if (this.value !== '' && this.value) {
        const [_number, _decimals] = (this.value + '').split('.');
        if (_number !== void 0 && _decimals === void 0) {
          this.$emit('input', (+this.value).toFixed(2))
          console.log('first one is true');
        } else if (_decimals && _decimals.length <= 1) {
          this.$emit('input', (+this.value).toFixed(2))
        }
      }
      if (this.start && this.end && this.input) {
        this.input.setSelectionRange(this.start, this.end);
      }
    }, mounted() {
      if (this.value !== '' && this.value) {
        const [_number, _decimals] = (this.value + '').split('.');
        if (_number !== void 0 && _decimals === void 0) {
          this.$emit('input', (+this.value).toFixed(2))
          console.log('first one is true');
        } else if (_decimals && _decimals.length <= 1) {
          this.$emit('input', (+this.value).toFixed(2))
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .custome_input-controllers-up,
  .custome_input-controllers-down {
    height: 14px;
    width: 12px;
    font-size: 12px;
    padding: 0;
    line-height: 0;
    position: absolute;
    right: 10px;
    opacity: 0;
    transition: all ease .4s;
    border: none;
    background:transparent;

    .with_addone & {
      right: 30px;

    }
  }

  .decials__input-addone {
    position: absolute;
    right: 0;
    top: 0;
    border-left: 1px solid rgba(34, 34, 34, .2);
    line-height: 25px;
    height: 100%;
    padding: 5px;
  }

  .custome_input-controllers-up {
    top: 4px;
  }

  .custome_input-controllers-down {
    bottom: 4px;
  }

  .custome__decimals-wrapper {
    position: relative;
    padding: 0;

    &:hover {
      .custome_input-controllers-up,
      .custome_input-controllers-down {
        opacity: 1;
      }
    }
  }

  .custome__decimals-input {
    display: inline-block;
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
