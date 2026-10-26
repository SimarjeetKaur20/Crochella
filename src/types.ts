export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: ProductCategory
  price: number
  discounted_price?: number
  images: string[]
  colors: string[]
  sizes: string[]
  stock_quantity: number
  sku: string
  preparation_time: string
  customization_options: string
  is_available: boolean
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  created_at: string
  updated_at: string
}

export type ProductCategory =
  | 'crochet-bags'
  | 'crochet-coasters'
  | 'table-mats'
  | 'crochet-flowers'
  | 'custom-creations'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'crochet-bags': 'Crochet Bags',
  'crochet-coasters': 'Crochet Coasters',
  'table-mats': 'Table Mats & Thaal Posh',
  'crochet-flowers': 'Crochet Flowers',
  'custom-creations': 'Custom Creations',
}

export interface CartItem {
  product: Product
  quantity: number
  selected_color?: string
  selected_size?: string
  customization_note?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  mobile: string
  email?: string
  deliveryAddress: DeliveryAddress
  notes?: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  paymentMethod: 'razorpay' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  fulfillmentStatus: FulfillmentStatus
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  selectedColor?: string
  selectedSize?: string
  customizationNote?: string
}

export interface DeliveryAddress {
  street: string
  city: string
  state: string
  pinCode: string
}

export type FulfillmentStatus =
  | 'order-received'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  'order-received': 'Order Received',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export interface SiteConfig {
  whatsapp_number: string
  instagram_url: string
  email: string
  shipping_fee: number
  free_shipping_above: number
  razorpay_enabled: boolean
  cod_enabled: boolean
  announcement_text: string
}
