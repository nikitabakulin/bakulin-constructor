import { ref, computed } from 'vue'
import { products, presents, addonProducts } from '@/data/products'

export function useOrderSelection() {
  const selectedOption = ref('control')
  const selectedProductId = ref(1)
  const selectedAddonIds = ref([])
  const selectedPresentsIds = ref([])

  const filteredProducts = computed(() => {
    return selectedOption.value === 'no-ten'
      ? products.filter(item => item.noTen)
      : products.filter(item => !item.noTen)
  })

  const selectedProduct = computed(() => {
    return products.find(p => p.id === selectedProductId.value) || null
  })

  const selectedAddons = computed(() => {
    return addonProducts.filter(a => selectedAddonIds.value.includes(a.id))
  })

  const selectedPresents = computed(() => {
    return presents.filter(p => selectedPresentsIds.value.includes(p.id))
  })

  function selectTab(tab) {
    selectedOption.value = tab
    const first = filteredProducts.value[0]
    if (first) selectedProductId.value = first.id
  }

  function toggleAddon(id) {
    const i = selectedAddonIds.value.indexOf(id)
    i === -1 ? selectedAddonIds.value.push(id) : selectedAddonIds.value.splice(i, 1)
  }

  function togglePresent(id) {
    const i = selectedPresentsIds.value.indexOf(id)
    i === -1 ? selectedPresentsIds.value.push(id) : selectedPresentsIds.value.splice(i, 1)
  }

  function resetSelection() {
    selectedAddonIds.value = []
    selectedPresentsIds.value = []
    selectedProductId.value = filteredProducts.value[0]?.id ?? 1
  }

  return {
    selectedOption,
    selectedProductId,
    selectedAddonIds,
    selectedPresentsIds,
    filteredProducts,
    selectedProduct,
    selectedAddons,
    selectedPresents,
    selectTab,
    toggleAddon,
    togglePresent,
    resetSelection
  }
}