<div align="center">
  <h1>🛒 E-Ticaret Yönetim Asistanı</h1>
  <p>Satıcıların stok, sipariş ve kargo süreçlerini tek bir panelden yönetmesini sağlayan kapsamlı ve modern SaaS çözümü.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Zustand-orange?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  </div>
</div>

<br />

Bu proje, e-ticaret satıcılarının iş yükünü hafifletmek, verilerini anlamlandırmak ve mağazalarını tek bir merkezden yönetmelerini sağlamak amacıyla geliştirilmiş modern bir yönetim panelidir. Sıkıcı ve hantal yönetim panellerinin aksine, son derece hızlı, göze hitap eden ve akıcı bir arayüze sahiptir.

---

## ✨ Özellikler (Planlanan & Aktif)

- 📦 **Stok ve Ürün Yönetimi:** Ürünlerinizi ekleyin, güncelleyin ve stok durumlarını anlık takip edin.
- 🛒 **Sipariş Takibi:** Gelen siparişlerin durumlarını (Hazırlanıyor, Kargolandı, Teslim Edildi) tek ekrandan yönetin.
- 📊 **Gelişmiş Analitik:** Satış grafikleri, en çok satan ürünler ve gelir takibi (date-fns ile zaman bazlı filtrelemeler).
- 🎨 **Modern Arayüz:** Tailwind CSS v4 ile kodlanmış, duyarlı (responsive) ve karanlık/aydınlık tema destekli tasarım.
- 🗄️ **Güçlü Veritabanı:** Prisma ORM ile güvenli ve hızlı veri akışı.
- ⚡ **Hızlı Durum Yönetimi:** Zustand ile sayfa yenilenmeden anında tepki veren UI.

---

## 🚀 Hızlı Başlangıç

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

**1. Projeyi Klonlayın**
```bash
git clone https://github.com/7EMRE1905/e-ticaret-yonetim-asistani.git
cd e-ticaret-yonetim-asistani
```

**2. Bağımlılıkları Yükleyin**
```bash
npm install
```

**3. Veritabanı Kurulumu (Prisma)**
Çevre değişkenlerinizi (`.env`) ayarladıktan sonra veritabanını oluşturun:
```bash
npx prisma generate
npx prisma db push
```

**4. Projeyi Başlatın**
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

---

## 🛠️ Kullanılan Teknolojiler

- **[Next.js 16](https://nextjs.org/):** React tabanlı full-stack framework.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Hızlı ve modern UI geliştirme.
- **[Prisma](https://www.prisma.io/):** Yeni nesil Node.js ve TypeScript ORM.
- **[Zustand](https://zustand-demo.pmnd.rs/):** Hafif ve hızlı state (durum) yönetimi.
- **[Lucide React](https://lucide.dev/):** Şık ve modern ikon seti.

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır. Projeye katkıda bulunmak, yeni özellikler eklemek veya hata düzeltmek isterseniz Pull Request (PR) gönderebilirsiniz:

1. Projeyi `Fork`'layın
2. Yeni bir dal (branch) açın: `git checkout -b ozellik/YeniOzellik`
3. Değişikliklerinizi yapın ve kaydedin: `git commit -m 'Yeni özellik: Sipariş Dışa Aktarma'`
4. Dalınıza gönderin: `git push origin ozellik/YeniOzellik`
5. Bir Pull Request oluşturun!

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz. Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.

<br/>
<div align="center">
  <b>Yusuf Emre</b> tarafından kodlanmıştır.
</div>
