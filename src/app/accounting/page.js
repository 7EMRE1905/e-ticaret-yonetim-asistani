"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calculator, TrendingUp, Landmark, Percent, Settings2, HelpCircle } from "lucide-react";
import { generateId } from "@/lib/utils";

export default function AccountingPage() {
  const { platforms, settings, sales } = useStore();
  const [activeTab, setActiveTab] = useState("calculator"); // 'calculator' | 'summary'
  
  // Calculator State
  const [calcMode, setCalcMode] = useState("findPrice"); // 'findPrice' | 'findProfit'
  const [platformId, setPlatformId] = useState("none");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState(settings?.shipping || 0);
  const [kdv, setKdv] = useState(20);
  const [hasInputVat, setHasInputVat] = useState(true); // Fatura ile alındı (Maliyete KDV Dahil)
  const [targetProfit, setTargetProfit] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  
  // Get active platform details
  const activePlatform = platforms.find(p => p.id === platformId) || { percentage: 0, fixedFee: 0 };
  const commRate = parseFloat(activePlatform.percentage) || 0;
  const fixedFee = parseFloat(activePlatform.fixedFee) || 0;
  const numCost = parseFloat(cost) || 0;
  const numShipping = parseFloat(shipping) || 0;
  const numKdv = parseFloat(kdv) || 0;
  const numTargetProfit = parseFloat(targetProfit) || 0;
  const numSellingPrice = parseFloat(sellingPrice) || 0;

  // Calculations
  let resultPrice = 0;
  let resultProfit = 0;
  let kdvAmount = 0;
  let commAmount = 0;
  let inputVat = 0;

  if (hasInputVat) {
    inputVat = numCost - (numCost / (1 + numKdv / 100));
  }
  
  if (calcMode === "findPrice") {
    // S = (Net + FixedFee + Kargo + NetCost) / (1/(1+KDV) - Comm)
    const kdvMultiplier = 1 / (1 + numKdv / 100);
    const commMultiplier = commRate / 100;
    const denominator = kdvMultiplier - commMultiplier;
    
    if (denominator > 0) {
      resultPrice = (numTargetProfit + fixedFee + numShipping + (numCost - inputVat)) / denominator;
      resultProfit = numTargetProfit;
      kdvAmount = resultPrice - (resultPrice / (1 + numKdv / 100));
      commAmount = resultPrice * commMultiplier;
    }
  } else {
    // Net = S - KDV_Amount - Comm_Amount - FixedFee - Kargo - NetCost
    kdvAmount = numSellingPrice - (numSellingPrice / (1 + numKdv / 100));
    commAmount = numSellingPrice * (commRate / 100);
    resultPrice = numSellingPrice;
    resultProfit = numSellingPrice - kdvAmount - commAmount - fixedFee - numShipping - (numCost - inputVat);
  }

  // Summary State (Simple Monthly or All Time)
  const totalRevenue = sales.reduce((acc, s) => acc + (s.sell * s.qty), 0);
  const totalCost = sales.reduce((acc, s) => acc + (s.cost * s.qty), 0);
  const totalShipping = sales.reduce((acc, s) => acc + (s.shipping * s.qty), 0);
  const totalDeductions = sales.reduce((acc, s) => acc + (s.deductions * s.qty), 0);
  const totalNet = sales.reduce((acc, s) => acc + (s.net * s.qty), 0);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-lg w-max mb-6">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "calculator" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Calculator size={16} /> Fiyat Hesaplayıcı
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "summary" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Landmark size={16} /> Muhasebe Özeti
        </button>
      </div>

      {activeTab === "calculator" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-400">
                <Settings2 size={20} /> Hesaplama Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 pb-4 border-b border-white/10">
                <label className="text-sm font-medium text-slate-300">Ne Hesaplamak İstiyorsunuz?</label>
                <div className="flex gap-2">
                  <Button 
                    variant={calcMode === "findPrice" ? "default" : "outline"} 
                    onClick={() => setCalcMode("findPrice")}
                    className="flex-1"
                  >
                    Satış Fiyatı Öner
                  </Button>
                  <Button 
                    variant={calcMode === "findProfit" ? "default" : "outline"} 
                    onClick={() => setCalcMode("findProfit")}
                    className="flex-1"
                  >
                    Net Kârı Bul
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Satış Platformu</label>
                  <Select value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
                    <option value="none">Kesinti Yok (0%)</option>
                    {platforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (%{p.percentage})</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">KDV Oranı (%)</label>
                  <Input type="number" value={kdv} onChange={(e) => setKdv(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Ürün Maliyeti (₺)</label>
                  <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
                  <label className="flex items-center gap-2 mt-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" checked={hasInputVat} onChange={(e) => setHasInputVat(e.target.checked)} className="rounded border-slate-700 bg-slate-800" />
                    Maliyete KDV Dahil (Faturalı Alım)
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Kargo Gideri (₺)</label>
                  <Input type="number" value={shipping} onChange={(e) => setShipping(e.target.value)} />
                </div>
              </div>

              {calcMode === "findPrice" ? (
                <div className="space-y-1 pt-2">
                  <label className="text-sm font-medium text-emerald-400">Hedeflenen Net Kâr (₺)</label>
                  <Input type="number" value={targetProfit} onChange={(e) => setTargetProfit(e.target.value)} placeholder="Örn: 50" className="border-emerald-500/30 focus:border-emerald-500" />
                </div>
              ) : (
                <div className="space-y-1 pt-2">
                  <label className="text-sm font-medium text-blue-400">Belirlenen Satış Fiyatı (₺)</label>
                  <Input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Örn: 150" className="border-blue-500/30 focus:border-blue-500" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-indigo-400">Hesaplama Sonucu</CardTitle>
            </CardHeader>
            <CardContent>
              {resultPrice > 0 ? (
                <div className="space-y-6">
                  {/* Big Number */}
                  <div className="text-center p-6 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-sm text-slate-400 mb-1">
                      {calcMode === "findPrice" ? "Önerilen Satış Fiyatı" : "Net Kâr (Cebinize Kalan)"}
                    </p>
                    <p className={`text-4xl font-bold ${calcMode === "findPrice" ? "text-blue-400" : "text-emerald-400"}`}>
                      {calcMode === "findPrice" ? resultPrice.toFixed(2) : resultProfit.toFixed(2)} ₺
                    </p>
                  </div>

                  {/* Breakdown Table */}
                  <div className="space-y-3 text-sm">
                    <h4 className="font-medium text-slate-300 flex items-center gap-2 pb-2 border-b border-white/10">
                      <Percent size={16} /> Gider Kırılımı (Kime ne kadar ödeyeceksiniz?)
                    </h4>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Ürün Maliyeti (Brüt)</span>
                      <span className="font-medium text-slate-200">-{numCost.toFixed(2)} ₺</span>
                    </div>

                    {hasInputVat && inputVat > 0 && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400">İndirilecek KDV (Devletten Alacak)</span>
                        <span className="font-medium text-emerald-400">+{inputVat.toFixed(2)} ₺</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Kargo Gideri</span>
                      <span className="font-medium text-slate-200">-{numShipping.toFixed(2)} ₺</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Satış KDV'si (%{numKdv})</span>
                      <span className="font-medium text-rose-400">-{kdvAmount.toFixed(2)} ₺</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Platform Kesintisi (%{commRate} + {fixedFee}₺)</span>
                      <span className="font-medium text-rose-400">-{(commAmount + fixedFee).toFixed(2)} ₺</span>
                    </div>

                    <div className="flex justify-between items-center py-3 mt-2 border-t border-white/10">
                      <span className="text-slate-300 font-medium">Net Devlete Ödenecek KDV</span>
                      <span className="font-medium text-rose-400">{(kdvAmount - inputVat).toFixed(2)} ₺</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 space-y-4">
                  <HelpCircle size={48} className="text-indigo-400" />
                  <p className="text-sm">Sonucu görmek için sol taraftaki alanları doldurun.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "summary" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Toplam Satış (Ciro)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{totalRevenue.toFixed(2)} ₺</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Toplam Ürün & Kargo Maliyeti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{(totalCost + totalShipping).toFixed(2)} ₺</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Toplam Kesinti (Komisyon+Vergi)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-400">{totalDeductions.toFixed(2)} ₺</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Net Kâr (Bize Kalan)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{totalNet.toFixed(2)} ₺</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
