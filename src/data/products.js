// src/data/products.js

export const products = [
  { id: 1, name: 'Автоклав “Крестьянка”, 8 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999 },
  { id: 2, name: 'Автоклав “Крестьянка”, 15 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999 },
  { id: 3, name: 'Автоклав “Крестьянка”, 20 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999 },
  { id: 4, name: 'Автоклав “Крестьянка”, 26 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999 },
  { id: 5, name: 'Автоклав “Крестьянка1”, 8 литров', image: '/images/img_26l.webp', price: 9999, noTen: true },
  { id: 6, name: 'Автоклав “Крестьянка1”, 15 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999, noTen: true },
  { id: 7, name: 'Автоклав “Крестьянка1”, 20 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999, noTen: true },
  { id: 8, name: 'Автоклав “Крестьянка1”, 26 литров', image: '/images/img_26l.webp', price: 9999, oldPrice: 99999, noTen: true }
]

export const presents = [
  { id: 1, name: '6 подарков', image: '/images/present.webp', price: 99999, oldPrice: 99999 }
]

export const addonProducts = [
  { id: 1, name: 'Зажимы для крышек СКО, 7 шт.', image: '/images/zazhimi.webp', price: 99999, oldPrice: 99999 },
  { id: 2, name: 'Крышки вакуумные с насосом, 9 шт.', image: '/images/vakuumnie.webp', price: 99999, oldPrice: 99999 },
  { id: 3, name: 'Крышки винтовые (Крышки твист-офф), 10 шт.', image: '/images/vintovie.webp', price: 99999, oldPrice: 99999 },
  { id: 4, name: 'Крышки СКО, 50 шт.', image: '/images/sko.webp', price: 99999, oldPrice: 99999 },
  { id: 5, name: 'Набор реторт-пакетов, 10 шт.', image: '/images/retort-packets.webp', price: 99999, noTen: true },
  { id: 6, name: 'Прокладка для автоклава силикон', image: '/images/prokladka.webp', price: 99999, oldPrice: 99999, noTen: true }
]

export const VALID_COUPONS = {
  SALE10: { type: 'percent', value: 10 },
  BONUS500: { type: 'fixed', value: 500 }
}