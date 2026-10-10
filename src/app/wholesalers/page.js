"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Edit2, Trash2, Phone, MapPin, MessageCircle, Truck } from "lucide-react";
import { generateId } from "@/lib/utils";

export default function WholesalersPage() {
  const { wholesalers, categories, addWholesaler, updateWholesaler, deleteWholesaler } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    phone: "",
    location: "",
    notes: "",
  });

  const handleOpenModal = (ws = null) => {
    if (ws) {
      setEditId(ws.id);
      setFormData({
        name: ws.name,
        categoryId: ws.categoryId,
        phone: ws.phone,
        location: ws.location || "",
        notes: ws.notes || "",
      });
    } else {
      setEditId(null);
      setFormData({ name: "", categoryId: "", phone: "", location: "", notes: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateWholesaler(editId, formData);
    } else {
      addWholesaler({ id: generateId(), ...formData });
    }
    setIsModalOpen(false);
  };

  const getCatLabel = (id) => {
    const c = categories.find((x) => x.id === id);
    return c ? `${c.emoji} ${c.name}` : "—";
  };

  const formatPhoneForWa = (phone) => {
    return phone.replace(/\s/g, '').replace(/^0/, '90');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Toptancılar & Tedarikçiler</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Yeni Toptancı
        </Button>
      </div>

      {wholesalers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-24 text-center">
          <div className="rounded-full bg-white/5 p-4 mb-4">
            <Truck className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-200">Kayıtlı toptancı yok</p>
          <p className="text-sm text-slate-500">Çalıştığınız toptancıları buraya ekleyerek iletişimde kalın.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wholesalers.map((w) => (
            <Card key={w.id} className="flex flex-col">
              <div className="flex-1 p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{w.name}</h3>
                  <p className="text-sm text-indigo-400 font-medium">{getCatLabel(w.categoryId)}</p>
                </div>
                
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-500" />
                    <a href={`tel:${w.phone}`} className="hover:text-indigo-400 transition-colors">{w.phone}</a>
                  </div>
                  {w.location && (
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                      <span>{w.location}</span>
                    </div>
                  )}
                </div>

                {w.notes && (
                  <div className="rounded-md bg-white/5 p-3 text-xs text-slate-400 italic">
                    {w.notes}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 border-t border-white/5 p-4 bg-black/10">
                <a 
                  href={`https://wa.me/${formatPhoneForWa(w.phone)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366]/10 py-2 text-sm font-semibold text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <Button variant="outline" size="icon" onClick={() => handleOpenModal(w)}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => { if(confirm('Silmek istediğinize emin misiniz?')) deleteWholesaler(w.id) }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Toptancıyı Düzenle" : "Yeni Toptancı Ekle"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Firma / Toptancı Adı</label>
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
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Telefon</label>
            <Input required type="tel" placeholder="05XX XXX XX XX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Konum / Adres</label>
            <Input placeholder="Şehir, İlçe, Mahalle..." value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Notlar (İsteğe Bağlı)</label>
            <textarea 
              className="flex w-full rounded-md border border-white/10 bg-[#0e1020] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px]"
              placeholder="Min. sipariş, ödeme koşulları vs."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full">
              {editId ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
