"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Edit2, Trash2, PackageMinus, PackagePlus, AlertTriangle, Calculator, Percent } from "lucide-react";
import { generateId } from "@/lib/utils";

export default function ProductsPage() {
  const { products, categories, platforms, settings, addProduct, updateProduct, deleteProduct, changeStock } = useStore();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    buyPrice: "",
    sellPrice: "",
    stock: "",
  });

  const [isQuickCalcOpen, setIsQuickCalcOpen] = useState(false);
  const [qcPlatform, setQcPlatform] = useState("none");
  const [qcKdv, setQcKdv] = useState("20");
  const [qcProfit, setQcProfit] = useState("");

  const handleQuickCalc = () => {
    const buyPrice = parseFloat(formData.buyPrice) || 0;
    const targetProfit = parseFloat(qcProfit) || 0;
    const kdvRate = parseFloat(qcKdv) || 0;
    const shipping = parseFloat(settings?.shipping) || 0;
    
    const activePlatform = platforms.find(p => p.id === qcPlatform) || { percentage: 0, fixedFee: 0 };
    const commRate = parseFloat(activePlatform.percentage) || 0;
    const fixedFee = parseFloat(activePlatform.fixedFee) || 0;

    const kdvMultiplier = 1 / (1 + kdvRate / 100);
    const commMultiplier = commRate / 100;
    const denominator = kdvMultiplier - commMultiplier;

    if (denominator > 0) {
      const suggestedPrice = (targetProfit + fixedFee + shipping + buyPrice) / denominator;
      setFormData({ ...formData, sellPrice: suggestedPrice.toFixed(2) });
      setIsQuickCalcOpen(false);
    } else {
      alert("Bu oranlarla zarar ediyorsunuz veya matematiksel olarak kâr imkansız!");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "all" || p.categoryId === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditId(product.id);
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        buyPrice: product.buyPrice.toString(),
        sellPrice: product.sellPrice.toString(),
        stock: product.stock.toString(),
      });
    } else {
      setEditId(null);
      setFormData({ name: "", categoryId: "", buyPrice: "", sellPrice: "", stock: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      buyPrice: parseFloat(formData.buyPrice) || 0,
      sellPrice: parseFloat(formData.sellPrice) || 0,
      stock: parseInt(formData.stock) || 0,
    };

    if (editId) {
      updateProduct(editId, data);
    } else {
      addProduct({ id: generateId(), ...data });
    }
    setIsModalOpen(false);
  };

  const getCatLabel = (id) => {
    const c = categories.find((x) => x.id === id);
    return c ? `${c.emoji} ${c.name}` : "Bilinmiyor";
  };

  const formatMoney = (val) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Ürün ara..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            className="w-full max-w-[200px]"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={() => handleOpenModal()} className="shrink-0 gap-2">
          <Plus size={18} />
          Yeni Ürün
        </Button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-24 text-center">
          <div className="rounded-full bg-white/5 p-4 mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-200">Ürün bulunamadı</p>
          <p className="text-sm text-slate-500">Arama kriterlerinize uygun ürün yok veya henüz eklemediniz.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <Card key={p.id} className={`overflow-hidden transition-all hover:shadow-lg hover:shadow-indigo-500/5 ${p.stock === 0 ? 'border-rose-500/30' : p.stock < 3 ? 'border-amber-500/30' : ''}`}>
              <div className="flex items-start justify-between border-b border-white/5 p-4">
                <div>
                  <h3 className="font-semibold text-slate-100">{p.name}</h3>
                  <p className="text-xs text-slate-400">{getCatLabel(p.categoryId)}</p>
                </div>
                {p.stock === 0 ? (
                  <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    <AlertTriangle size={12} /> Tükendi
                  </span>
                ) : p.stock < 3 ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <AlertTriangle size={12} /> Kritik
                  </span>
                ) : null}
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs">Maliyet</span>
                    <span className="font-semibold text-slate-300">{formatMoney(p.buyPrice)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500 text-xs">Satış</span>
                    <span className="font-semibold text-indigo-400">{formatMoney(p.sellPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-black/20 p-2">
                  <span className="text-xs font-medium text-slate-400">Stok:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeStock(p.id, -1)}
                      className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                      <PackageMinus size={16} />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-200">{p.stock}</span>
                    <button
                      onClick={() => changeStock(p.id, 1)}
                      className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                      <PackagePlus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs h-8" onClick={() => handleOpenModal(p)}>
                    <Edit2 size={14} className="mr-2" />
                    Düzenle
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => { if(confirm('Emin misiniz?')) deleteProduct(p.id) }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Ürün Adı</label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Kategori</label>
            <Select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
              <option value="">Seçiniz</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Alış Fiyatı (₺)</label>
              <Input type="number" step="0.01" min="0" required value={formData.buyPrice} onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium flex justify-between text-slate-300">
                Satış Fiyatı (₺) 
                <button type="button" onClick={() => setIsQuickCalcOpen(true)} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs">
                  <Calculator size={12}/> Sihirbaz
                </button>
              </label>
              <Input type="number" step="0.01" min="0" required value={formData.sellPrice} onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Stok Miktarı</label>
            <Input type="number" min="0" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full">
              {editId ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Calculator Modal */}
      <Modal isOpen={isQuickCalcOpen} onClose={() => setIsQuickCalcOpen(false)} title="Akıllı Fiyat Sihirbazı">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Ürün maliyetinize ek olarak kargo, KDV ve platform komisyonlarını hesaplayarak hedeflenen kâr için en uygun satış fiyatını önerir.</p>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Satış Platformu</label>
            <Select value={qcPlatform} onChange={(e) => setQcPlatform(e.target.value)}>
              <option value="none">Kesinti Yok (0%)</option>
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.name} (%{p.percentage})</option>
              ))}
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">KDV Oranı (%)</label>
              <Input type="number" value={qcKdv} onChange={(e) => setQcKdv(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Net Kâr Hedefi (₺)</label>
              <Input type="number" value={qcProfit} onChange={(e) => setQcProfit(e.target.value)} placeholder="Örn: 50" className="border-emerald-500/30 focus:border-emerald-500" />
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsQuickCalcOpen(false)}>İptal</Button>
            <Button onClick={handleQuickCalc} className="flex-1 bg-indigo-600 hover:bg-indigo-700">Fiyat Öner ve Uygula</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
