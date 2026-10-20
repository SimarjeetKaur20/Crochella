import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, SiteConfig } from '../types'
import { SAMPLE_PRODUCTS, DEFAULT_SITE_CONFIG } from '../data/products'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface ProductStore {
  products: Product[]
  siteConfig: SiteConfig
  isLoading: boolean
  fetchProducts: () => Promise<void>
  fetchConfig: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateConfig: (config: Partial<SiteConfig>) => Promise<void>
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: SAMPLE_PRODUCTS,
      siteConfig: DEFAULT_SITE_CONFIG,
      isLoading: false,

      fetchProducts: async () => {
        if (!isSupabaseConfigured) {
          set({ products: SAMPLE_PRODUCTS })
          return
        }
        set({ isLoading: true })
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        if (data && data.length > 0) {
          set({ products: data as Product[] })
        }
        set({ isLoading: false })
      },

      fetchConfig: async () => {
        if (!isSupabaseConfigured) return
        const { data } = await supabase.from('site_config').select('*')
        if (data) {
          const config: Partial<SiteConfig> = {}
          data.forEach((row: { key: string; value: string }) => {
            (config as Record<string, unknown>)[row.key] = row.value
          })
          set({ siteConfig: { ...DEFAULT_SITE_CONFIG, ...config } })
        }
      },

      addProduct: async (product) => {
        const newProduct: Product = {
          ...product,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        if (isSupabaseConfigured) {
          await supabase.from('products').insert(newProduct)
        }
        set((s) => ({ products: [newProduct, ...s.products] }))
      },

      updateProduct: async (id, updates) => {
        const updated = { ...updates, updated_at: new Date().toISOString() }
        if (isSupabaseConfigured) {
          await supabase.from('products').update(updated).eq('id', id)
        }
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }))
      },

      deleteProduct: async (id) => {
        if (isSupabaseConfigured) {
          await supabase.from('products').delete().eq('id', id)
        }
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
      },

      updateConfig: async (config) => {
        if (isSupabaseConfigured) {
          const entries = Object.entries(config).map(([key, value]) => ({ key, value: String(value) }))
          await supabase.from('site_config').upsert(entries, { onConflict: 'key' })
        }
        set((s) => ({ siteConfig: { ...s.siteConfig, ...config } }))
      },
    }),
    { name: 'crochella-products', version: 2, partialize: (s) => ({ siteConfig: s.siteConfig }) }
  )
)
