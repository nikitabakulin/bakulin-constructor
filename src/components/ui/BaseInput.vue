<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// Форматирование телефона по шаблону +7 (999) 999-99-99
function formatPhone(rawValue) {
  let digits = rawValue.replace(/\D/g, '')
  if (!digits) return ''

  // Если пользователь начал с 8 или 7 — считаем это кодом страны +7
  if (digits[0] === '8' || digits[0] === '7') {
    digits = digits.slice(1)
  } else if (digits[0] === '9') {
    // Если сразу начал с 9 (например, 912...), оставляем как начало номера после +7
  }

  // Ограничиваем 10 цифрами после +7
  digits = digits.slice(0, 10)

  let formatted = '+7'
  if (digits.length > 0) {
    formatted += ' (' + digits.slice(0, 3)
  }
  if (digits.length >= 4) {
    formatted += ') ' + digits.slice(3, 6)
  }
  if (digits.length >= 7) {
    formatted += '-' + digits.slice(6, 8)
  }
  if (digits.length >= 9) {
    formatted += '-' + digits.slice(8, 10)
  }

  return formatted
}

function onInput(event) {
  let value = event.target.value

  if (props.type === 'tel') {
    value = formatPhone(value)
    event.target.value = value
  }

  emit('update:modelValue', value)
}

// Подставляем "+7 (" при первом клике в пустое поле телефона
function onFocus(event) {
  if (props.type === 'tel' && !props.modelValue) {
    const initial = '+7 ('
    event.target.value = initial
    emit('update:modelValue', initial)
  }
}

// Если пользователь ушёл из поля, оставив только "+7 (", очищаем, чтобы вернулся placeholder
function onBlur(event) {
  if (props.type === 'tel' && props.modelValue.replace(/\D/g, '').length <= 1) {
    event.target.value = ''
    emit('update:modelValue', '')
  }
}
</script>

<template>
  <input
    class="base-input"
    :type="type"
    :name="name"
    :value="modelValue"
    :placeholder="type === 'tel' && !placeholder ? '+7 (___) ___-__-__' : placeholder"
    :required="required"
    :disabled="disabled"
    :maxlength="type === 'tel' ? 18 : undefined"
    :pattern="type === 'tel' ? '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}' : undefined"
    :title="type === 'tel' ? 'Введите номер телефона полностью: +7 (999) 999-99-99' : undefined"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<style lang="scss" scoped>
.base-input {
  width: 100%;
  height: 46px;
  padding: var(--space-10) var(--space-30);
  background-color: #EFF3F5B2;
  backdrop-filter: blur(12px);
  border: 1px solid transparent;

  border-radius: var(--br-25);
  font-size: var(--fs-18);
  color: var(--color-text-color);
  outline: none;
  transition: border-color var(--transition-base), background-color var(--transition-base);

  &::placeholder {
    color: var(--color-gray);
    opacity: 1;
  }

  &:hover:not(:disabled) {
    border-color: var(--color-gray);
  }

  &:focus {
    background-color: var(--color-white);
    border-color: var(--color-gray);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>