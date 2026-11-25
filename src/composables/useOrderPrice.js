import { ref, computed } from 'vue'
import { VALID_COUPONS } from '@/data/products'

export function useOrderPrice({ selectedProduct, selectedAddons, selectedPresents }) {
  const appliedCoupon = ref(null)
  const couponError = ref(false)

  const totalPrice = computed(() => {
    const mainPrice = selectedProduct.value?.price || 0
    const presentsPrice = selectedPresents.value.reduce((sum, p) => sum + p.price, 0)
    const addonsPrice = selectedAddons.value.reduce((sum, a) => sum + a.price, 0)
    let sum = mainPrice + presentsPrice + addonsPrice

    if (appliedCoupon.value) {
      if (appliedCoupon.value.type === 'percent') {
        sum = Math.round(sum * (1 - appliedCoupon.value.value / 100))
      } else if (appliedCoupon.value.type === 'fixed') {
        sum = Math.max(0, sum - appliedCoupon.value.value)
      }
    }
    return sum
  })

  const totalOldPrice = computed(() => {
    const mainOld = selectedProduct.value?.oldPrice ?? selectedProduct.value?.price ?? 0
    const presentsOld = selectedPresents.value.reduce((sum, p) => sum + (p.oldPrice ?? p.price), 0)
    const addonsOld = selectedAddons.value.reduce((sum, a) => sum + (a.oldPrice ?? a.price), 0)
    return mainOld + presentsOld + addonsOld
  })

  const discountPercent = computed(() => {
    if (totalOldPrice.value <= totalPrice.value || totalOldPrice.value === 0) return 0
    return Math.round(((totalOldPrice.value - totalPrice.value) / totalOldPrice.value) * 100)
  })

  function applyCoupon(code) {
    const found = VALID_COUPONS[code.toUpperCase()]
    if (!found) {
      couponError.value = true
      appliedCoupon.value = null
      return false
    }
    appliedCoupon.value = { code: code.toUpperCase(), ...found }
    couponError.value = false
    return true
  }

  function resetCoupon() {
    appliedCoupon.value = null
    couponError.value = false
  }

  function formatPrice(value) {
    return value.toLocaleString('ru-RU')
  }

  return {
    appliedCoupon,
    couponError,
    totalPrice,
    totalOldPrice,
    discountPercent,
    applyCoupon,
    resetCoupon,
    formatPrice
  }
}