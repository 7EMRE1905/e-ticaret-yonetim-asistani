"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Save, Plus, Trash2, Edit2, Download, Upload, AlertCircle } from "lucide-react";
import { generateId } from "@/lib/utils";

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    updateFirma, 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    platforms,
    addPlatform,
    updatePlatform,
    deletePlatform,
    resetData 
  } = useStore();

  const [firma, setFirma] = useState(settings.firma);
  const [partner1, setPartner1] = useState(settings.partner1);
  const [partner2, setPartner2] = useState(settings.partner2);
  const [shipping, setShipping] = useState(settings.shipping.toString());

  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("");
  const [editCatId, setEditCatId] = useState(null);

  const [platName, setPlatName] = useState("");
  const [platPercentage, setPlatPercentage] = useState("");
  const [platFixedFee, setPlatFixedFee] = useState("");
  const [editPlatId, setEditPlatId] = useState(null);

  const handleSaveFirma = (e) => {
    e.preventDefault();
    updateFirma(firma);
    alert("Firma bilgileri kaydedildi.");
  };

  const handleSavePartners = (e) => {
    e.preventDefault();
    updateSettings({ partner1, partner2, shipping: parseFloat(shipping) || 0 });
    alert("Ortak ve kargo ayarları kaydedildi.");
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catName) return;

    if (editCatId) {
      updateCategory(editCatId, { name: catName, emoji: catEmoji || "📂" });
      setEditCatId(null);
    } else {
      addCategory({ id: generateId(), name: catName, emoji: catEmoji || "📂" });
    }
    setCatName("");
    setCatEmoji("");
  };

  const handleEditCat = (c) => {
    setEditCatId(c.id);
    setCatName(c.name);
    setCatEmoji(c.emoji);
  };

  const handleSavePlatform = (e) => {
    e.preventDefault();
    if (!platName) return;
    const data = { 
      name: platName, 
      percentage: parseFloat(platPercentage) || 0, 
      fixedFee: parseFloat(platFixedFee) || 0 
    };
    if (editPlatId) {
      updatePlatform(editPlatId, data);
      setEditPlatId(null);
    } else {
      addPlatform({ id: generateId(), ...data });
    }
    setPlatName("");
    setPlatPercentage("");
    setPlatFixedFee("");
  };

  const handleEditPlat = (p) => {
    setEditPlatId(p.id);
    setPlatName(p.name);
    setPlatPercentage(p.percentage.toString());
    setPlatFixedFee(p.fixedFee.toString());
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFirma({ ...firma, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Firma Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle>Firma & Mağaza Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveFirma} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Mağaza Adı</label>
                <Input value={firma.name} onChange={e => setFirma({...firma, name: e.target.value})} placeholder="Sepetizm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Telefon</label>
                  <Input value={firma.phone} onChange={e => setFirma({...firma, phone: e.target.value})} placeholder="05XX..." />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">E-posta</label>
                  <Input type="email" value={firma.email} onChange={e => setFirma({...firma, email: e.target.value})} placeholder="ornek@mail.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Adres</label>
                <Input value={firma.address} onChange={e => setFirma({...firma, address: e.target.value})} placeholder="Açık adres..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Vergi Numarası</label>
                  <Input value={firma.vkn} onChange={e => setFirma({...firma, vkn: e.target.value})} placeholder="VKN veya TC" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Vergi Dairesi</label>
                  <Input value={firma.vd} onChange={e => setFirma({...firma, vd: e.target.value})} placeholder="Vergi Dairesi" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Instagram</label>
                  <Input value={firma.ig} onChange={e => setFirma({...firma, ig: e.target.value})} placeholder="@kullaniciadi" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">TikTok</label>
                  <Input value={firma.tiktok} onChange={e => setFirma({...firma, tiktok: e.target.value})} placeholder="@kullaniciadi" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Logo (URL, Emoji veya Fotoğraf)</label>
                <div className="flex gap-2">
                  <Input className="flex-1" value={firma.logo} onChange={e => setFirma({...firma, logo: e.target.value})} placeholder="https://... veya 🚀" />
                  <label className="flex items-center justify-center w-10 shrink-0 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors" title="Fotoğraf Yükle">
                    <Upload size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2">
                <Save size={16} /> Bilgileri Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Ortaklar ve Genel Ayarlar */}
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePartners} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Yetkili / 1. Ortak</label>
                    <Input required value={partner1} onChange={e => setPartner1(e.target.value)} placeholder="Yönetici Adı" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">2. Ortak (İsteğe Bağlı)</label>
                    <Input value={partner2} onChange={e => setPartner2(e.target.value)} placeholder="Boş bırakabilirsiniz" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Varsayılan Kargo Ücreti (₺)</label>
                  <Input type="number" step="0.01" required value={shipping} onChange={e => setShipping(e.target.value)} />
                </div>
                <Button type="submit" className="w-full gap-2 text-indigo-400 border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white transition-colors" variant="outline">
                  <Save size={16} /> Ayarları Kaydet
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Kategoriler */}
          <Card>
            <CardHeader>
              <CardTitle>Kategoriler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveCategory} className="flex gap-2">
                <Input 
                  className="w-16 text-center" 
                  placeholder="📱" 
                  value={catEmoji} 
                  onChange={e => setCatEmoji(e.target.value)} 
                />
                <Input 
                  className="flex-1" 
                  placeholder="Kategori Adı" 
                  required 
                  value={catName} 
                  onChange={e => setCatName(e.target.value)} 
                />
                <Button type="submit" className="shrink-0">
                  {editCatId ? <Save size={18} /> : <Plus size={18} />}
                </Button>
              </form>

              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 p-3">
                    <span className="font-medium text-slate-200">{c.emoji} {c.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditCat(c)} className="text-slate-400 hover:text-indigo-400"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm('Emin misiniz?')) deleteCategory(c.id) }} className="text-slate-400 hover:text-rose-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platformlar */}
          <Card>
            <CardHeader>
              <CardTitle>Satış Platformları (Kesinti & Komisyon)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSavePlatform} className="flex flex-col gap-2 md:flex-row">
                <Input 
                  className="flex-1" 
                  placeholder="Platform Adı (Örn: Shopier)" 
                  required 
                  value={platName} 
                  onChange={e => setPlatName(e.target.value)} 
                />
                <Input 
                  className="w-full md:w-24 text-center" 
                  placeholder="% Oran"
                  type="number"
                  step="0.01"
                  value={platPercentage} 
                  onChange={e => setPlatPercentage(e.target.value)} 
                />
                <Input 
                  className="w-full md:w-28 text-center" 
                  placeholder="Sabit Ücret (₺)"
                  type="number"
                  step="0.01"
                  value={platFixedFee} 
                  onChange={e => setPlatFixedFee(e.target.value)} 
                />
                <Button type="submit" className="shrink-0">
                  {editPlatId ? <Save size={18} /> : <Plus size={18} />}
                </Button>
              </form>

              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2">
                {platforms.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 p-3">
                    <span className="font-medium text-slate-200">{p.name} <span className="text-slate-400 text-sm ml-2">(%{p.percentage} + {p.fixedFee}₺)</span></span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditPlat(p)} className="text-slate-400 hover:text-indigo-400"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm('Emin misiniz?')) deletePlatform(p.id) }} className="text-slate-400 hover:text-rose-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {platforms.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-2">Henüz eklenmiş bir platform yok.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-rose-500/30">
            <CardHeader>
              <CardTitle className="text-rose-400 flex items-center gap-2">
                <AlertCircle size={20} /> Tehlikeli Alan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Tüm verileri kalıcı olarak sıfırlar. Bu işlem geri alınamaz!</p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  if (confirm("TÜM VERİLER SİLİNECEK! Emin misiniz?")) {
                    resetData();
                    window.location.reload();
                  }
                }}
              >
                Tüm Verileri Sıfırla
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
