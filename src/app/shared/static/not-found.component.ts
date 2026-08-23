import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
  <div class="error-page-container">
  <!-- Arka Plan Parlama Efektleri (Glow) -->
  <div class="glow-bg bg-indigo-600/10 -top-20 -left-20"></div>
  <div class="glow-bg bg-purple-600/10 -bottom-20 -right-20"></div>

  <div class="error-card">
    <!-- Visual / Icon Area -->
    <div class="error-visual">
      <span class="error-code text-indigo-500/20">404</span>
      <div class="error-icon-wrapper border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
        <i class="fa-solid fa-compass-slash"></i>
      </div>
    </div>

    <!-- Metin İçeriği -->
    <div class="error-content">
      <h1 class="error-title">Sayfa Bulunamadı</h1>
      <p class="error-description">
        Aradığınız sayfa silinmiş, ismi değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.
      </p>
    </div>

    <!-- Aksiyon Butonları -->
    <div class="error-actions">
      <button type="button" (click)="goBack()" class="btn-secondary">
        <i class="fa-solid fa-arrow-left text-xs"></i>
        <span>Geri Dön</span>
      </button>

      <a routerLink="/dashboard" class="btn-primary bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20">
        <i class="fa-solid fa-house text-xs"></i>
        <span>Ana Sayfa</span>
      </a>
    </div>
  </div>
</div>`,
    styles: `
/* Sayfa Ana Kapsayıcısı */
.error-page-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0f19; /* Fluxify koyu arka planı */
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* Ambient Glow Efektleri */
.glow-bg {
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

/* Hata Kartı */
.error-card {
  position: relative;
  z-index: 10;
  max-width: 480px;
  width: 100%;
  background-color: rgba(15, 23, 42, 0.6); /* Slate-900 / 60 */
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Görsel Alanı & Büyük Hata Kodu */
.error-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.error-code {
  font-size: 110px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.05em;
  user-select: none;
}

.error-icon-wrapper {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* Metin İçerikleri */
.error-title {
  font-size: 22px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 10px;
}

.error-description {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* Aksiyon Butonları */
.error-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}`
})
export class NotFoundComponent {
    private location = inject(Location);

    goBack(): void {
        this.location.back();
    }
}