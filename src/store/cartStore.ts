import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity: number, color?: string, size?: string, note?: string) => void
  removeItem: (productId: string, color?: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  subtotal: () => number
}

const getItemKey = (productId: string, color?: string, size?: string) =>
  `${productId}|${color || ''}|${size || ''}`

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity, color, size, note) => {
        const key = getItemKey(product.id, color, size)
        set((state) => {
          const existing = state.items.find(
            (i) => getItemKey(i.product.id, i.selected_color, i.selected_size) === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i.product.id, i.selected_color, i.selected_size) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [
              ...state.items,
              { product, quantity, selected_color: color, selected_size: size, customization_note: note },
            ],
            isOpen: true,
          }
        })
      },

      removeItem: (productId, color, size) => {
        const key = getItemKey(productId, color, size)
        set((state) => ({
          items: state.items.filter(
            (i) => getItemKey(i.product.id, i.selected_color, i.selected_size) !== key
          ),
        }))
      },

      updateQuantity: (productId, quantity, color, size) => {
        const key = getItemKey(productId, color, size)
        if (quantity <= 0) {
          get().removeItem(productId, color, size)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            getItemKey(i.product.id, i.selected_color, i.selected_size) === key
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.discounted_price ?? i.product.price
          return sum + price * i.quantity
        }, 0),
    }),
    { name: 'crochella-cart', version: 2 }
  )
)
