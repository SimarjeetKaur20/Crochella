import { create } from 'zustand'
import type { Order, FulfillmentStatus, CartItem } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// What the caller passes to placeOrder
export interface PlaceOrderPayload {
  customerName: string
  mobile: string
  email?: string
  deliveryAddress: { street: string; city: string; state: string; pinCode: string }
  notes?: string
  paymentMethod: 'cod' | 'razorpay'
  razorpayPaymentId?: string
  items: CartItem[]
  subtotal: number
  shippingFee: number
  total: number
}

interface OrderStore {
  orders: Order[]
  isLoading: boolean
  fetchOrders: () => Promise<void>
  placeOrder: (payload: PlaceOrderPayload) => Promise<string>
  updateOrderStatus: (id: string, status: FulfillmentStatus) => Promise<void>
  updatePaymentStatus: (id: string, paymentStatus: Order['paymentStatus'], paymentId?: string) => Promise<void>
}

const generateOrderNumber = () => {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `CRCH-${d}-${rand}`
}

export const useOrderStore = create<OrderStore>()((set) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    if (!isSupabaseConfigured) return
    set({ isLoading: true })
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      // Map DB snake_case → camelCase
      const mapped: Order[] = data.map(mapDbToOrder)
      set({ orders: mapped })
    }
    set({ isLoading: false })
  },

  placeOrder: async (payload) => {
    const orderNumber = generateOrderNumber()
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    // Build OrderItems from CartItems
    const items = payload.items.map((ci) => ({
      productId: ci.product.id,
      name: ci.product.name,
      image: ci.product.images[0] ?? '',
      price: ci.product.discounted_price ?? ci.product.price,
      quantity: ci.quantity,
      selectedColor: ci.selected_color,
      selectedSize: ci.selected_size,
      customizationNote: ci.customization_note,
    }))

    const order: Order = {
      id,
      orderNumber,
      customerName: payload.customerName,
      mobile: payload.mobile,
      email: payload.email,
      deliveryAddress: payload.deliveryAddress,
      notes: payload.notes,
      items,
      subtotal: payload.subtotal,
      shippingFee: payload.shippingFee,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'razorpay' ? 'paid' : 'pending',
      razorpayPaymentId: payload.razorpayPaymentId,
      fulfillmentStatus: 'order-received',
      createdAt: now,
      updatedAt: now,
    }

    if (isSupabaseConfigured) {
      // Persist to Supabase using snake_case columns
      const dbRow = mapOrderToDb(order)
      const { data, error } = await supabase.from('orders').insert(dbRow).select().single()
      if (error) throw new Error(error.message)
      if (data) {
        const saved = mapDbToOrder(data)
        set((s) => ({ orders: [saved, ...s.orders] }))
        return saved.orderNumber
      }
    }

    set((s) => ({ orders: [order, ...s.orders] }))
    return orderNumber
  },

  updateOrderStatus: async (id, status) => {
    const now = new Date().toISOString()
    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ fulfillment_status: status, updated_at: now }).eq('id', id)
    }
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, fulfillmentStatus: status, updatedAt: now } : o
      ),
    }))
  },

  updatePaymentStatus: async (id, paymentStatus, paymentId) => {
    const now = new Date().toISOString()
    if (isSupabaseConfigured) {
      await supabase.from('orders').update({
        payment_status: paymentStatus,
        razorpay_payment_id: paymentId,
        updated_at: now,
      }).eq('id', id)
    }
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, paymentStatus, razorpayPaymentId: paymentId, updatedAt: now } : o
      ),
    }))
  },

}))

// ── DB mapping helpers ──────────────────────────────────────────────────────

function mapDbToOrder(row: Record<string, unknown>): Order {
  const items = ((row.items as unknown[]) ?? []).map((i: unknown) => {
    const it = i as Record<string, unknown>
    return {
      productId: (it.product_id ?? it.productId ?? '') as string,
      name: (it.product_name ?? it.name ?? '') as string,
      image: (it.product_image ?? it.image ?? '') as string,
      price: (it.price ?? 0) as number,
      quantity: (it.quantity ?? 1) as number,
      selectedColor: (it.selected_color ?? it.selectedColor) as string | undefined,
      selectedSize: (it.selected_size ?? it.selectedSize) as string | undefined,
      customizationNote: (it.customization_note ?? it.customizationNote) as string | undefined,
    }
  })
  const addr = (row.delivery_address ?? row.deliveryAddress ?? {}) as Record<string, unknown>
  return {
    id: row.id as string,
    orderNumber: (row.order_number ?? row.orderNumber ?? '') as string,
    customerName: (row.customer_name ?? row.customerName ?? '') as string,
    mobile: (row.customer_phone ?? row.mobile ?? '') as string,
    email: (row.customer_email ?? row.email) as string | undefined,
    deliveryAddress: {
      street: (addr.street ?? '') as string,
      city: (addr.city ?? '') as string,
      state: (addr.state ?? '') as string,
      pinCode: (addr.pin_code ?? addr.pinCode ?? addr.pincode ?? '') as string,
    },
    notes: (row.order_notes ?? row.notes) as string | undefined,
    items,
    subtotal: (row.subtotal ?? 0) as number,
    shippingFee: (row.shipping_fee ?? row.shippingFee ?? 0) as number,
    total: (row.total ?? 0) as number,
    paymentMethod: (row.payment_method ?? row.paymentMethod ?? 'cod') as Order['paymentMethod'],
    paymentStatus: (row.payment_status ?? row.paymentStatus ?? 'pending') as Order['paymentStatus'],
    razorpayOrderId: (row.razorpay_order_id ?? row.razorpayOrderId) as string | undefined,
    razorpayPaymentId: (row.razorpay_payment_id ?? row.razorpayPaymentId) as string | undefined,
    fulfillmentStatus: (row.fulfillment_status ?? row.fulfillmentStatus ?? 'order-received') as Order['fulfillmentStatus'],
    createdAt: (row.created_at ?? row.createdAt ?? new Date().toISOString()) as string,
    updatedAt: (row.updated_at ?? row.updatedAt ?? new Date().toISOString()) as string,
  }
}

function mapOrderToDb(o: Order): Record<string, unknown> {
  return {
    id: o.id,
    order_number: o.orderNumber,
    customer_name: o.customerName,
    customer_phone: o.mobile,
    customer_email: o.email,
    delivery_address: {
      street: o.deliveryAddress.street,
      city: o.deliveryAddress.city,
      state: o.deliveryAddress.state,
      pin_code: o.deliveryAddress.pinCode,
    },
    order_notes: o.notes,
    items: o.items.map((i) => ({
      product_id: i.productId,
      product_name: i.name,
      product_image: i.image,
      price: i.price,
      quantity: i.quantity,
      selected_color: i.selectedColor,
      selected_size: i.selectedSize,
      customization_note: i.customizationNote,
    })),
    subtotal: o.subtotal,
    shipping_fee: o.shippingFee,
    total: o.total,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    razorpay_order_id: o.razorpayOrderId,
    razorpay_payment_id: o.razorpayPaymentId,
    fulfillment_status: o.fulfillmentStatus,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  }
}
