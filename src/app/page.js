"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Wallet, ShoppingBag, Receipt, TrendingUp, Users, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function DashboardPage() {
  const { sales, categories, settings } = useStore();

  let rev = 0, cost = 0, ded = 0;
  const catMap = {};

  sales.forEach((s) => {
    rev += s.sell;
    cost += s.cost;
    ded += s.deductions;
    catMap[s.categoryId] = (catMap[s.categoryId] || 0) + s.sell;
  });

  const net = rev - cost - ded;
  const share = net / 2;
  const maxCatVal = Object.values(catMap).length > 0 ? Math.max(...Object.values(catMap)) : 0;

  const getCatLabel = (id) => {
    const c = categories.find((x) => x.id === id);
    return c ? `${c.emoji} ${c.name}` : "—";
  };

  const formatMoney = (val) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Toplam Ciro</CardTitle>
            <div className="rounded-md bg-indigo-500/10 p-2">
              <Wallet className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{formatMoney(rev)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Maliyet</CardTitle>
            <div className="rounded-md bg-amber-500/10 p-2">
              <ShoppingBag className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{formatMoney(cost)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Kesintiler</CardTitle>
            <div className="rounded-md bg-rose-500/10 p-2">
              <Receipt className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{formatMoney(ded)}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Net Kâr</CardTitle>
            <div className="rounded-md bg-emerald-500/20 p-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{formatMoney(net)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Partners Split / Single Owner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              {settings.partner2 ? "Kâr Dağılımı (%50 - %50)" : "Kâr Dağılımı (Tek Yönetici)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-around rounded-xl border border-white/5 bg-black/20 p-6">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white shadow-lg">
                  {settings.partner1?.[0]?.toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-200">{settings.partner1}</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {settings.partner2 ? formatMoney(share) : formatMoney(net)}
                  </p>
                </div>
              </div>

              {settings.partner2 && (
                <>
                  <div className="flex flex-col items-center text-slate-500">
                    <ArrowRightLeft className="h-6 w-6" />
                    <span className="mt-1 text-xs font-semibold">EŞİT DAĞILIM</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xl font-bold text-white shadow-lg">
                      {settings.partner2?.[0]?.toUpperCase()}
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-200">{settings.partner2}</p>
                      <p className="text-lg font-bold text-emerald-400">{formatMoney(share)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Kategori Satışları
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(catMap).length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-slate-500">
                Henüz satış verisi yok
              </div>
            ) : (
              <div className="flex h-48 items-end gap-2 pt-4">
                {Object.entries(catMap).map(([cid, total], i) => {
                  const h = maxCatVal > 0 ? Math.max(10, (total / maxCatVal) * 100) : 10;
                  const colors = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-purple-500"];
                  const color = colors[i % colors.length];

                  return (
                    <div key={cid} className="group relative flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">{formatMoney(total)}</span>
                      <div
                        className={`w-full rounded-t-sm transition-all hover:brightness-110 ${color}`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="w-full truncate text-center text-xs text-slate-400" title={getCatLabel(cid)}>
                        {getCatLabel(cid)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Son İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead className="text-center">Adet</TableHead>
                <TableHead className="text-right">Ciro</TableHead>
                <TableHead className="text-right">Net Kâr</TableHead>
                <TableHead className="text-right">Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    Henüz işlem bulunmuyor
                  </TableCell>
                </TableRow>
              ) : (
                [...sales].reverse().slice(0, 5).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-slate-200">{s.productName}</TableCell>
                    <TableCell className="text-center">{s.qty}</TableCell>
                    <TableCell className="text-right font-medium text-indigo-400">{formatMoney(s.sell)}</TableCell>
                    <TableCell className={`text-right font-bold ${s.net >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {formatMoney(s.net)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-400">
                      {format(new Date(s.date), "dd MMM yyyy, HH:mm", { locale: tr })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
