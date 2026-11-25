<script setup>
defineProps({
  text: {
    type: String,
    default: 'Кнопка'
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    class="button"
    :type="type"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>

<style lang="scss" scoped>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--color-green);
  border-radius: var(--br-10);
  color: var(--color-white);  
  font-size: var(--fs-20);
  max-height: 56px;
  padding: 25px 14px;
  overflow: hidden;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover {
    box-shadow: 10px 10px 12px 0px #34A84880;
  }
  &:active {
    box-shadow: 10px 10px 12px 0px #21612C80 inset;
  } 

  &_tab {    
    padding: 10px 20px;    
    line-height: 100%;
    border: 2px solid var(--color-gold);    
    border-radius: var(--br-25);
    background: none;
    color: var(--color-gold);
    border: 2px solid var(--color-gold);
    font-weight: var(--font-weight-semibold);

    &:hover,
    &:active {
      box-shadow: none;
    } 

    &.active {
      background: var(--color-gold);
      color: var(--color-white);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>