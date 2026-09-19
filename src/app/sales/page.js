"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function SalesPage() {
  const { sales, products, categories, settings, addSale, deleteSale } = useStore();
  const [filterCat, setFilterCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: "",
    qty: "1",
    shipping: settings.shipping.toString(),
  });

  const filteredSales = sales.filter((s) => filterCat === "all" || s.categoryId === filterCat);

  // Shopier Calc
  const selectedProduct = products.find(p => p.id === formData.productId);
  const qty = parseInt(formData.qty) || 0;
  const shipping = parseFloat(formData.shipping) || 0;
  
  let calc = null;
  if (selectedProduct && qty > 0) {
    const sell = selectedProduct.sellPrice * qty;
    const cost = selectedProduct.buyPrice * qty;
    const shopier = sell * 0.0299 + 0.49;
    const deductions = shopier + shipping;
    const net = sell - cost - deductions;
    calc = { sell, cost, shopier, deductions, net, each: net / 2 };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (selectedProduct.stock < qty) {
      alert("Yetersiz stok!");
      return;
    }

    addSale({
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      categoryId: selectedProduct.categoryId,
      qty,
      sell: calc.sell,
      cost: calc.cost,
      shopier: calc.shopier,
      shipping,
      deductions: calc.deductions,
      net: calc.net,
      each: calc.each,
      date: new Date().toISOString(),
    });
    
    setIsModalOpen(false);
    setFormData({ productId: "", qty: "1", shipping: settings.shipping.toString() });
  };

  const getCatLabel = (id) => {
    const c = categories.find((x) => x.id === id);
    return c ? `${c.emoji} ${c.name}` : "—";
  };

  const formatMoney = (val) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select
          className="w-full sm:max-w-[250px]"
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
        
        <Button onClick={() => setIsModalOpen(true)} className="shrink-0 gap-2">
          <Plus size={18} />
          Yeni Satış Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Satış Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-center">Adet</TableHead>
                <TableHead className="text-right">Ciro</TableHead>
                <TableHead className="text-right">Kesintiler</TableHead>
                <TableHead className="text-right">Net Kâr</TableHead>
                <TableHead className="text-right">Tarih</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="h-8 w-8 opacity-20" />
                      Henüz satış bulunmuyor
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                [...filteredSales].reverse().map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-slate-200">{s.productName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400">
                        {getCatLabel(s.categoryId)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{s.qty}</TableCell>
                    <TableCell className="text-right font-medium text-slate-300">{formatMoney(s.sell)}</TableCell>
                    <TableCell className="text-right text-rose-400">{formatMoney(s.deductions)}</TableCell>
                    <TableCell className={`text-right font-bold ${s.net >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {formatMoney(s.net)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-400">
                      {format(new Date(s.date), "dd MMM, HH:mm", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-rose-500"
                        onClick={() => { if(confirm('Silmek istediğinize emin misiniz? (Stok geri eklenecek)')) deleteSale(s.id) }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Satış Kaydet">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Ürün Seçin</label>
            <Select 
              required 
              value={formData.productId} 
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              <option value="">Seçiniz...</option>
              {products.filter(p => p.stock > 0).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatMoney(p.sellPrice)} (Stok: {p.stock})
                </option>
              ))}
            </Select>
            {products.length > 0 && products.filter(p => p.stock > 0).length === 0 && (
              <p className="text-xs text-rose-400 mt-1">Stokta ürün kalmamış!</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Adet</label>
              <Input 
                type="number" 
                min="1" 
                required 
                value={formData.qty} 
                onChange={(e) => setFormData({ ...formData, qty: e.target.value })} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Kargo Ücreti (₺)</label>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
                required 
                value={formData.shipping} 
                onChange={(e) => setFormData({ ...formData, shipping: e.target.value })} 
              />
            </div>
          </div>

          {calc && (
            <div className="rounded-lg bg-black/20 p-4 space-y-2 mt-4 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Satış Tutarı</span>
                <span className="text-slate-200">{formatMoney(calc.sell)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Ürün Maliyeti</span>
                <span className="text-slate-200">{formatMoney(calc.cost)}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-400">
                <span>Shopier (%2.99 + 0.49₺)</span>
                <span>-{formatMoney(calc.shopier)}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-400">
                <span>Kargo</span>
                <span>-{formatMoney(parseFloat(formData.shipping) || 0)}</span>
              </div>
              <div className="my-2 h-px bg-white/10" />
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">Net Kâr</span>
                <span className={calc.net >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {formatMoney(calc.net)}
                </span>
              </div>
              {settings.partner2 && (
                <div className="flex justify-between text-sm font-medium text-indigo-400">
                  <span>Her Ortağa</span>
                  <span>{formatMoney(calc.each)}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={!selectedProduct || (selectedProduct && selectedProduct.stock < qty)}>
              Satışı Onayla
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
