<script setup>
defineProps({
  prodName: {
    type: String,
    default: 'Продукт'
  },
  price: {
    type: Number,
    default: 999
  },
  oldPrice: {
    type: Number,
    default: null
  },
  imageSrc: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'radio'
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<template>
  <div
    class="product_item"
    :class="{ 'is-selected': selected }"
    @click="$emit('select')"
  >
    <div
      class="check"
      :class="[`check--${type}`, { 'is-active': selected }]"
    ></div>

    <img
      v-if="imageSrc"
      class="product_image"
      :src="imageSrc"
      :alt="prodName"
      loading="lazy"
    />

    <div class="product_title">{{ prodName }}</div>

    <div class="product_prices-container">
      <div v-if="oldPrice" class="product_old-price">{{ oldPrice }} ₽</div>
      <div class="product_price">{{ price }} ₽</div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
  .product {
    &_item {
      display: flex;
      align-items: center;
      gap: var(--space-15);
      cursor: pointer;
      width: 100%;
    }

    &_image {
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    &_title {
      flex-grow: 1;
    }

    &_prices-container {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
    }

    &_old-price {
      color: var(--color-gray);
      text-align: end;
      text-decoration: line-through;
    }
  }

</style>