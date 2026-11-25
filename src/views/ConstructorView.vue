<template>
    <section class="section b-constructor">        
        <div class="container">
            <div class="b-constructor__container">
                
                <div class="section__header">
                    <div class="section__title h1">Оформление заказа</div>
                    <div class="section__introtext">Мы перезвоним Вам и уточним детали доставки</div>
                </div>

                <div class="b-constructor__blocks">
                    <aside class="b-constructor__left-block">
                        <div class="b-constructor__top-buttons">
                            <Button 
                                :class="selectedOption === 'control' ? 'button_tab active' : 'button_tab'" 
                                text="с блоком управления"
                                @click="selectTab('control')"
                            />
                            <Button 
                                :class="selectedOption === 'no-ten' ? 'button_tab active' : 'button_tab'"
                                text="без ТЭНа"
                                @click="selectTab('no-ten')"
                            />
                        </div>

                        <div class="b-constructor__products">
                            <ProductItem
                                v-for="item in filteredProducts"
                                :key="item.id"
                                type="radio"
                                :selected="selectedProductId === item.id"
                                :prod-name="item.name"
                                :image-src="item.image"
                                :price="item.price"
                                :old-price="item.oldPrice || null"
                                @select="selectedProductId = item.id"
                            />
                        </div>

                        <form class="b-constructor__form order-form" @submit.prevent="handleSubmit">
                            <div class="b-constructor__form-inputs">
                                <BaseInput
                                    v-model.trim="form.name"
                                    name="name"
                                    placeholder="Имя"
                                    required
                                />
                                <BaseInput
                                    v-model.trim="form.phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Телефон"
                                    required
                                />
                            </div>

                            <!-- Кнопка и поле купона -->
                            <div class="b-constructor__form-coupon">
                                <button
                                    type="button"
                                    class="b-constructor__form-coupon-toggle"
                                    @click="toggleCouponBlock"
                                >
                                    Есть купон?
                                </button>

                                <div v-if="isCouponOpen" class="b-constructor__form-coupon-row">
                                    <BaseInput
                                        v-model.trim="form.coupon"
                                        name="coupon"
                                        placeholder="Номер купона"
                                        :disabled="Boolean(appliedCoupon)"
                                        @keyup.enter.prevent="onApplyCoupon"
                                    />

                                    <Button
                                        v-if="!appliedCoupon"
                                        type="button"
                                        class="b-constructor__form-coupon-btn"
                                        text="Применить"
                                        @click="onApplyCoupon"
                                    />

                                    <Button
                                        v-else
                                        type="button"
                                        class="b-constructor__form-coupon-btn b-constructor__form-coupon-btn--reset"
                                        text="Отменить"
                                        @click="onResetCoupon"
                                    />
                                </div>
                                <p v-if="couponError" class="b-constructor__form-coupon-error">
                                    Купон не найден
                                </p>
                            </div>


                            <!-- Блок итоговой цены -->
                            <div class="b-constructor__form-prices">
                                <span class="b-constructor__form-price-current h2 font-title">{{ formatPrice(totalPrice) }} ₽</span>
                                <span v-if="totalOldPrice > totalPrice" class="b-constructor__form-price-old">
                                {{ formatPrice(totalOldPrice) }} ₽
                                </span>
                                <span v-if="discountPercent > 0" class="b-constructor__form-discount">
                                -{{ discountPercent }}%
                                </span>
                            </div>

                            <!-- Чекбокс рассрочки -->
                            <label class="b-constructor__form-installment">
                                <input
                                v-model="form.isInstallment"
                                type="checkbox"
                                class="b-constructor__form-checkbox-native"
                                />
                                <span class="b-constructor__form-checkbox-box check check--checkbox"></span>
                                <span class="b-constructor__form-installment-text">Хочу купить в рассрочку</span>
                            </label>

                            <!-- Скрытый инпут комментария -->
                            <input type="hidden" name="comment" :value="hiddenComment" />

                            <!-- Чекбокс согласия -->
                            <label class="b-constructor__form-privacy">
                                <input
                                v-model="form.isAgreed"
                                type="checkbox"
                                class="b-constructor__form-checkbox-native"
                                required
                                />
                                <span class="b-constructor__form-checkbox-box check check--checkbox"></span>
                                <span class="b-constructor__form-privacy-text">
                                Даю согласие на обработку персональных данных в соответствии с условиями политики
                                конфиденциальности. Подтверждаю ознакомление и согласие с условиями Публичной оферты.
                                </span>
                            </label>

                            <!-- Кнопка отправки -->
                            <Button
                                type="submit"
                                class="b-constructor__form-submit"
                                :text="isLoading ? 'Отправка...' : 'Заказать'"
                                :disabled="!form.isAgreed || isLoading"
                            />
                        </form>
                    </aside>
                    <aside class="b-constructor__center-block">
                        <!-- Картинка выбранного основного автоклава -->
                        <img
                            v-if="selectedProduct"
                            class="b-constructor__product-image"
                            :src="selectedProduct.image"
                            :alt="selectedProduct.name"
                        />

                        <!-- Картинки выбранных доп. товаров на своих фиксированных местах -->
                        <TransitionGroup name="addon-pop">
                            <img
                            v-for="addon in selectedAddons"
                            :key="addon.id"
                            class="b-constructor__addon-image"
                            :class="`b-constructor__addon-image--${addon.id}`"
                            :src="addon.image"
                            :alt="addon.name"
                            />
                        </TransitionGroup>
                    </aside>
                    <aside class="b-constructor__right-block">
                        <div class="b-constructor__title-addons">Подарки:</div>
                        <div class="b-constructor__products">
                            <ProductItem
                                v-for="present in presents"
                                :key="present.id"
                                type="checkbox"
                                :selected="selectedPresentsIds.includes(present.id)"
                                :prod-name="present.name"
                                :image-src="present.image"
                                :price="present.price"
                                :old-price="present.oldPrice || null"
                                @select="togglePresent(present.id)"
                            />
                        </div>
                        <div class="b-constructor__title-addons">Дополнительные товары:</div>
                        <div class="b-constructor__products">
                            <ProductItem
                                v-for="addon in addonProducts"
                                :key="addon.id"
                                type="checkbox"
                                :selected="selectedAddonIds.includes(addon.id)"
                                :prod-name="addon.name"
                                :image-src="addon.image"
                                :price="addon.price"
                                :old-price="addon.oldPrice || null"
                                @select="toggleAddon(addon.id)"
                            />
                        </div>
                        
                    </aside>
                </div>
                
            </div>
        </div>

        <BaseModal
            :is-open="isSuccessModalOpen"
            title="Благодарим за заказ!"
            text="Менеджер уже получил Ваше обращение, он свяжется с Вами в течение 10 минут"
            @close="isSuccessModalOpen = false"
        />
    </section>  
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Button from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ProductItem from '@/components/b-constructor/ProductItem.vue'
import { presents, addonProducts } from '@/data/products'
import { useOrderSelection } from '@/composables/useOrderSelection'
import { useOrderPrice } from '@/composables/useOrderPrice'

// --- выбор товаров ---
const {
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
} = useOrderSelection()

// --- расчёты ---
const {
  appliedCoupon,
  couponError,
  totalPrice,
  totalOldPrice,
  discountPercent,
  applyCoupon,
  resetCoupon,
  formatPrice
} = useOrderPrice({ selectedProduct, selectedAddons, selectedPresents })

// --- форма ---
const form = reactive({
  name: '',
  phone: '',
  coupon: '',
  isInstallment: false,
  isAgreed: false
})

const isCouponOpen = ref(false)
const isSuccessModalOpen = ref(false)
const isLoading = ref(false)


const hiddenComment = computed(() => form.isInstallment ? 'Купить в рассрочку' : '')

function toggleCouponBlock() {
  isCouponOpen.value = !isCouponOpen.value
  if (!isCouponOpen.value) {
    resetCoupon()
    form.coupon = ''
  }
}

function onApplyCoupon() {
  if (applyCoupon(form.coupon)) {
    // успешно применён — можно оставить как есть
  }
}

function onResetCoupon() {
  resetCoupon()
  form.coupon = ''
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.isAgreed = false
  form.isInstallment = false
  isCouponOpen.value = false
  resetCoupon()
  form.coupon = ''
  resetSelection()
}

async function handleSubmit() {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))

    const payload = {
      name: form.name,
      phone: form.phone,
      coupon: isCouponOpen.value ? form.coupon : '',
      comment: hiddenComment.value,
      product: selectedProduct.value,
      presents: selectedPresents.value,
      addons: selectedAddons.value,
      totalPrice: totalPrice.value
    }
    console.log('Данные заказа для отправки:', payload)

    isSuccessModalOpen.value = true
    resetForm()
  } finally {
    isLoading.value = false
  }
}

</script>

<style lang="scss" scoped>
.b-constructor {
    &__container {
        background: var(--color-white);
        padding: var(--space-30) var(--space-25);
        border-radius: 20px;
    }

    &__blocks {
        display: grid;
        grid-template-columns: 1fr 446px 1fr;
        gap: var(--space-40);
    }

    &__left-block {
        display: flex;
        flex-direction: column;
        gap: var(--space-15);
    }

    &__top-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--space-20);
    }

    &__products {
        display: flex;
        flex-direction: column;
        gap: var(--space-15);
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: var(--space-15);

        &-inputs {
            display: flex;
            flex-direction: column;
            gap: var(--space-15);
        }

        &-coupon {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: var(--space-15);
        }

        &-coupon-toggle {
            color: var(--color-gold);
            text-decoration: underline;
            font-size: var(--fs-20);
            &:hover {
                text-decoration: none;
            }
        }
        &-coupon-row {
            display: flex;
            align-items: center;
            gap: var(--space-15);

            .button {
                height: 45px;
                background-color: var(--color-light-gray);
                color: var(--color-text);
                box-shadow: 0px 2px 4px 0px #00000033;
                &:hover {                    
                    box-shadow: 0px 4px 6px 0px #0000004D inset;
                }

            }
        }
        &-coupon-error {
            font-size: var(--fs-14);
            color: var(--color-red);
        }
        &-prices {
            display: flex;
            align-items: center;
            gap: var(--space-10);
            justify-content: center;
        }
        &-price-old {
            text-decoration: line-through;
            color: #003A66;
        }
        &-discount {
            padding: 5px 10px;
            background-color: var(--color-red);
            font-weight: var(--font-weight-semibold);
            line-height: 100%;
            border-radius: 5px;
            color: var(--color-white);
        }
        &-installment {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-10);
            cursor: pointer;

            input {
                position: absolute;
                z-index: -1;
                opacity: 0;
            }
            .check {
                color: var(--color-orange);
            }
        }

        &-privacy {
            display: flex;
            gap: var(--space-10);
            cursor: pointer;

            input {
                position: absolute;
                z-index: -1;
                opacity: 0;
            }
        }
        &-privacy-text {
            font-size: var(--fs-14);
            line-height: 120%;
        }
    }

    &__center-block {
        position: relative;
        width: 100%;
        min-height: 540px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Главныq товар по центру */
    &__product-image {
        position: relative;
        z-index: 2;
        max-width: 400px;
        max-height: 448px;
        object-fit: contain;
        pointer-events: none;
    }

    /* Общие стили для доп. товаров вокруг */
    &__addon-image {
        position: absolute;
        z-index: 3;
        object-fit: contain;
        pointer-events: none;

        /* 1: Зажимы для крышек СКО (слева внизу) */
        &--1 {
            bottom: 80px;
            left: 0;
            width: auto;
        }

        /* 2: Крышки вакуумные с насосом (сверху по центру) */
        &--2 {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
        }

        /* 3: Крышки винтовые (справа вверху) */
        &--3 {
            top: 40px;
            right: 0;
            width: auto;
        }

        /* 4: Крышки СКО (справа внизу) */
        &--4 {
            bottom: 80px;
            right: 0;
            width: auto;
        }

        /* 5: Набор реторт-пакетов (слева вверху) */
        &--5 {
            top: 40px;
            left: 0;
            width: auto;
        }

        /* 6: Прокладка силикон (снизу по центру) */
        &--6 {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
        }
    }

    &__right-block {
        display: flex;
        flex-direction: column;
        gap: var(--space-20);
    }

    &__title-addons {
        font-weight: var(--font-weight-semibold);
        line-height: 100%;
    }
}

.addon-pop-enter-active,
.addon-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.addon-pop-enter-from,
.addon-pop-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

</style>