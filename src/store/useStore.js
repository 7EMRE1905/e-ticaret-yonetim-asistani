import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: 'Teknoloji', emoji: '💻' },
  { id: 'cat_2', name: 'Oto Aksesuar', emoji: '🚗' },
  { id: 'cat_3', name: 'Ev & Yaşam', emoji: '🏠' },
  { id: 'cat_4', name: 'Hediyelik Eşya', emoji: '🎁' },
  { id: 'cat_5', name: 'Giyim', emoji: '👕' },
];

const DEFAULT_CHECKLIST = [
  { id: 'chk_1', text: 'Shopier hesabı aç', done: false },
  { id: 'chk_2', text: 'Instagram ve TikTok hesaplarını oluştur', done: false },
  { id: 'chk_3', text: 'Güvenilir toptancı / tedarikçi bul', done: false },
  { id: 'chk_4', text: 'Toptancıdan numune ürün al ve kaliteyi test et', done: false },
  { id: 'chk_5', text: 'Ürün tanıtım videosu ve fotoğrafları çek', done: false },
  { id: 'chk_6', text: 'Kargo poşeti ve ambalaj malzemesi temin et', done: false },
  { id: 'chk_7', text: 'Fiyat listesini ve kâr marjını hesapla', done: false },
  { id: 'chk_8', text: 'İlk 5 ürünü platforma ekle', done: false },
  { id: 'chk_9', text: 'Ortaklık sözleşmesi hazırla', done: false },
  { id: 'chk_10', text: 'İlk satışı gerçekleştir 🎉', done: false },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      categories: DEFAULT_CATEGORIES,
      products: [],
      sales: [],
      wholesalers: [],
      checklist: DEFAULT_CHECKLIST,
      settings: {
        partner1: 'Yetkili Kişi',
        partner2: '',
        shipping: 0,
        firma: {
          name: 'Benim Mağazam',
          phone: '',
          email: '',
          address: '',
          vkn: '',
          vd: '',
          ig: '',
          tiktok: '',
          logo: 'M',
        },
      },

      // Actions - Categories
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, data) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      // Actions - Products
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      changeStock: (id, delta) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
          ),
        })),

      // Actions - Sales
      addSale: (sale) =>
        set((state) => {
          const product = state.products.find((p) => p.id === sale.productId);
          if (!product) return state;
          
          const updatedProducts = state.products.map((p) =>
            p.id === sale.productId ? { ...p, stock: Math.max(0, p.stock - sale.qty) } : p
          );

          return {
            sales: [...state.sales, sale],
            products: updatedProducts,
          };
        }),
      deleteSale: (id) =>
        set((state) => {
          const sale = state.sales.find((s) => s.id === id);
          if (sale) {
            // Restore stock
            const updatedProducts = state.products.map((p) =>
              p.id === sale.productId ? { ...p, stock: p.stock + sale.qty } : p
            );
            return {
              sales: state.sales.filter((s) => s.id !== id),
              products: updatedProducts,
            };
          }
          return state;
        }),

      // Actions - Wholesalers
      addWholesaler: (wholesaler) =>
        set((state) => ({ wholesalers: [...state.wholesalers, wholesaler] })),
      updateWholesaler: (id, data) =>
        set((state) => ({
          wholesalers: state.wholesalers.map((w) => (w.id === id ? { ...w, ...data } : w)),
        })),
      deleteWholesaler: (id) =>
        set((state) => ({
          wholesalers: state.wholesalers.filter((w) => w.id !== id),
        })),

      // Actions - Guide/Checklist
      toggleChecklist: (id) =>
        set((state) => ({
          checklist: state.checklist.map((c) =>
            c.id === id ? { ...c, done: !c.done } : c
          ),
        })),

      // Actions - Settings
      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),
      updateFirma: (data) =>
        set((state) => ({
          settings: {
            ...state.settings,
            firma: { ...state.settings.firma, ...data },
          },
        })),

      // System
      importData: (data) => set(() => data),
      resetData: () =>
        set(() => ({
          categories: DEFAULT_CATEGORIES,
          products: [],
          sales: [],
          wholesalers: [],
          checklist: DEFAULT_CHECKLIST,
          settings: {
            partner1: 'Yetkili Kişi',
            partner2: '',
            shipping: 0,
            firma: {
              name: 'Benim Mağazam',
              phone: '',
              email: '',
              address: '',
              vkn: '',
              vd: '',
              ig: '',
              tiktok: '',
              logo: 'M',
            },
          },
        })),
    }),
    {
      name: 'uygun-sepety-storage', // Key for localStorage
    }
  )
);
