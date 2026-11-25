<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-window" role="dialog" aria-modal="true">
          <button
            type="button"
            class="modal-window__close"
            aria-label="Закрыть"
            @click="$emit('close')"
          >
            ✕
          </button>

          <div v-if="title" class="modal-window__title">{{ title }}</div>
          <p v-if="text" class="modal-window__text">{{ text }}</p>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-20);
}

.modal-window {
  position: relative;
  width: 100%;
  max-width: 540px;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 50px var(--space-30);
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  &__close {
    position: absolute;
    top: 18px;
    right: 20px;
    width: 32px;
    height: 32px;
    font-size: 20px;
    line-height: 1;
    color: var(--color-black);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.6;
    }
  }

  &__title {
    font-size: 28px;
    font-weight: var(--font-weight-semibold);
    color: var(--color-black);
    margin-bottom: var(--space-15);
    line-height: 1.2;
  }

  &__text {
    font-size: var(--fs-18);
    color: var(--color-gray);
    line-height: 1.45;
    max-width: 380px;
    margin: 0 auto;
  }
}

/* Плавное появление */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>