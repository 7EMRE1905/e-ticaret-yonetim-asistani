import { create } from 'zustand';
import * as actions from '@/app/actions';

const DEFAULT_CHECKLIST = [
  { id: '1', text: 'Instagram İşletme hesabı açıldı', done: false },
  { id: '2', text: 'Logo tasarımı tamamlandı', done: false },
  { id: '3', text: 'Shopier mağazası açıldı ve onaylandı', done: false },
  { id: '4', text: 'Kargo anlaşmaları incelendi', done: false },
  { id: '5', text: 'Toptancılarla görüşüldü ve ilk ürün seçildi', done: false },
  { id: '6', text: 'İlk ürünün fotoğraf/videosu çekildi', done: false },
  { id: '7', text: 'İlk ürün sisteme (stok) eklendi', done: false },
];

export const useStore = create((set, get) => ({
  categories: [],
  products: [],
  sales: [],
  wholesalers: [],
  platforms: [],
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
  isInitialized: false,

  // Initialize from DB
  initStore: async () => {
    try {
      const data = await actions.getInitialData();
      
      // Parse settings from DB format to Store format
      const settingsDb = data.settings;
      const parsedSettings = {
        partner1: settingsDb.partner1,
        partner2: settingsDb.partner2 || '',
        shipping: settingsDb.shipping,
        firma: {
          name: settingsDb.firmaName,
          phone: settingsDb.firmaPhone,
          email: settingsDb.firmaEmail,
          address: settingsDb.firmaAddress,
          vkn: settingsDb.firmaVkn,
          vd: settingsDb.firmaVd,
          ig: settingsDb.firmaIg,
          tiktok: settingsDb.firmaTiktok,
          logo: settingsDb.firmaLogo,
        }
      };

      set({
        categories: data.categories,
        products: data.products,
        sales: data.sales,
        wholesalers: data.wholesalers,
        platforms: data.platforms || [],
        settings: parsedSettings,
        isInitialized: true
      });
    } catch (error) {
      console.error("Failed to init store:", error);
    }
  },

  // Actions - Categories
  addCategory: async (category) => {
    set((state) => ({ categories: [...state.categories, category] }));
    await actions.addCategory(category);
  },
  updateCategory: async (id, data) => {
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
    await actions.updateCategory(id, data);
  },
  deleteCategory: async (id) => {
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
    await actions.deleteCategory(id);
  },

  // Actions - Products
  addProduct: async (product) => {
    // Remove createdAt if it exists to let Prisma handle it
    const { createdAt, ...data } = product;
    set((state) => ({ products: [...state.products, product] }));
    await actions.addProduct(data);
  },
  updateProduct: async (id, data) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    await actions.updateProduct(id, data);
  },
  deleteProduct: async (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    await actions.deleteProduct(id);
  },
  changeStock: async (id, delta) => {
    const product = get().products.find(p => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)),
    }));
    await actions.updateProduct(id, { stock: newStock });
  },

  // Actions - Sales
  addSale: async (sale) => {
    const { date, ...data } = sale; // let prisma handle date
    set((state) => {
      const updatedProducts = state.products.map((p) =>
        p.id === sale.productId ? { ...p, stock: Math.max(0, p.stock - sale.qty) } : p
      );
      return { sales: [...state.sales, sale], products: updatedProducts };
    });
    await actions.addSale(data);
  },
  deleteSale: async (id) => {
    const sale = get().sales.find((s) => s.id === id);
    if (!sale) return;
    set((state) => {
      const updatedProducts = state.products.map((p) =>
        p.id === sale.productId ? { ...p, stock: p.stock + sale.qty } : p
      );
      return { sales: state.sales.filter((s) => s.id !== id), products: updatedProducts };
    });
    await actions.deleteSale(id);
  },

  // Actions - Wholesalers
  addWholesaler: async (wholesaler) => {
    set((state) => ({ wholesalers: [...state.wholesalers, wholesaler] }));
    await actions.addWholesaler(wholesaler);
  },
  updateWholesaler: async (id, data) => {
    set((state) => ({
      wholesalers: state.wholesalers.map((w) => (w.id === id ? { ...w, ...data } : w)),
    }));
    await actions.updateWholesaler(id, data);
  },
  deleteWholesaler: async (id) => {
    set((state) => ({ wholesalers: state.wholesalers.filter((w) => w.id !== id) }));
    await actions.deleteWholesaler(id);
  },

  // Actions - Platforms
  addPlatform: async (platform) => {
    set((state) => ({ platforms: [...state.platforms, platform] }));
    await actions.addPlatform(platform);
  },
  updatePlatform: async (id, data) => {
    set((state) => ({
      platforms: state.platforms.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    await actions.updatePlatform(id, data);
  },
  deletePlatform: async (id) => {
    set((state) => ({ platforms: state.platforms.filter((p) => p.id !== id) }));
    await actions.deletePlatform(id);
  },

  // Actions - Guide/Checklist (still local)
  toggleChecklist: (id) =>
    set((state) => ({
      checklist: state.checklist.map((c) =>
        c.id === id ? { ...c, done: !c.done } : c
      ),
    })),

  // Actions - Settings
  updateSettings: async (data) => {
    set((state) => ({ settings: { ...state.settings, ...data } }));
    const s = get().settings;
    await actions.updateSettingsData({
      partner1: s.partner1,
      partner2: s.partner2,
      shipping: s.shipping,
    });
  },
  updateFirma: async (data) => {
    set((state) => ({
      settings: { ...state.settings, firma: { ...state.settings.firma, ...data } },
    }));
    const f = get().settings.firma;
    await actions.updateSettingsData({
      firmaName: f.name,
      firmaPhone: f.phone,
      firmaEmail: f.email,
      firmaAddress: f.address,
      firmaVkn: f.vkn,
      firmaVd: f.vd,
      firmaIg: f.ig,
      firmaTiktok: f.tiktok,
      firmaLogo: f.logo,
    });
  },

  resetData: () => {
    // Only resets local state. Real reset would need an API route to truncate tables.
    window.location.reload();
  },
}));
