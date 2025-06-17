import { Metadata } from 'next'
import { Shirt, Droplets, Sun, Wind, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from './care-guide.module.css'

export const metadata: Metadata = {
  title: 'Ürün Bakım Rehberi - Lux Fashion',
  description: 'Kıyafetlerinizin uzun süre dayanması için detaylı bakım ve yıkama rehberi.',
}

export default function CareGuidePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            <ArrowLeft size={16} />
            Ana Sayfa
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Ürün Bakım Rehberi</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Shirt className={styles.titleIcon} />
            Ürün Bakım Rehberi
          </h1>
          <p className={styles.subtitle}>
            Lüks kıyafetlerinizin uzun süre kalitesini koruması için profesyonel bakım önerileri
          </p>
        </div>

        {/* Care Symbols */}
        <div className={styles.careSymbols}>
          <h2 className={styles.sectionTitle}>Bakım Sembolleri Rehberi</h2>
          
          <div className={styles.symbolsGrid}>
            <div className={styles.symbolCard}>
              <div className={styles.symbol}>🫧</div>
              <h3>Yıkama</h3>
              <ul>
                <li><strong>30°C:</strong> Soğuk su ile hassas yıkama</li>
                <li><strong>40°C:</strong> Normal yıkama sıcaklığı</li>
                <li><strong>El ile:</strong> Sadece el ile yıkanmalı</li>
                <li><strong>❌:</strong> Yıkanmamalı, kuru temizleme</li>
              </ul>
            </div>

            <div className={styles.symbolCard}>
              <div className={styles.symbol}>🌡️</div>
              <h3>Ütüleme</h3>
              <ul>
                <li><strong>• (110°C):</strong> Düşük sıcaklık</li>
                <li><strong>•• (150°C):</strong> Orta sıcaklık</li>
                <li><strong>••• (200°C):</strong> Yüksek sıcaklık</li>
                <li><strong>❌:</strong> Ütülenmemeli</li>
              </ul>
            </div>

            <div className={styles.symbolCard}>
              <div className={styles.symbol}>🧽</div>
              <h3>Kuru Temizleme</h3>
              <ul>
                <li><strong>P:</strong> Perchloroethylene ile</li>
                <li><strong>F:</strong> Petroleum bazlı çözücü</li>
                <li><strong>W:</strong> Islak temizleme</li>
                <li><strong>❌:</strong> Kuru temizleme yapılmamalı</li>
              </ul>
            </div>

            <div className={styles.symbolCard}>
              <div className={styles.symbol}>☀️</div>
              <h3>Kurutma</h3>
              <ul>
                <li><strong>□:</strong> Düz sererek kurutun</li>
                <li><strong>⭕:</strong> Makine kurutma uygun</li>
                <li><strong>🌛:</strong> Gölgede kurutun</li>
                <li><strong>❌:</strong> Makine kurutma yasak</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fabric Care */}
        <div className={styles.fabricCare}>
          <h2 className={styles.sectionTitle}>Kumaş Türüne Göre Bakım</h2>
          
          <div className={styles.fabricGrid}>
            <div className={styles.fabricCard}>
              <div className={styles.fabricIcon}>🪶</div>
              <h3>İpek</h3>
              <ul>
                <li>Soğuk su ile el yıkama tercih edin</li>
                <li>Yumuşak deterjan kullanın</li>
                <li>Direkt güneş ışığından uzak tutun</li>
                <li>Düşük ısıda ters yüzünden ütüleyin</li>
                <li>Asla sıkmayın, havlu ile kurulayın</li>
              </ul>
            </div>

            <div className={styles.fabricCard}>
              <div className={styles.fabricIcon}>🐑</div>
              <h3>Yün</h3>
              <ul>
                <li>Özel yün deterjanı kullanın</li>
                <li>30°C'yi geçmeyen suda yıkayın</li>
                <li>Düz sererek kurutun</li>
                <li>Buhar ütüsü tercih edin</li>
                <li>Kuru temizleme önerilir</li>
              </ul>
            </div>

            <div className={styles.fabricCard}>
              <div className={styles.fabricIcon}>🌿</div>
              <h3>Pamuk</h3>
              <ul>
                <li>40°C'de makine yıkama yapabilirsiniz</li>
                <li>Renkli ve beyazları ayırın</li>
                <li>Orta ısıda ütüleyin</li>
                <li>Makine kurutma uygundur</li>
                <li>Çekme olmasın diye nemli ütüleyin</li>
              </ul>
            </div>

            <div className={styles.fabricCard}>
              <div className={styles.fabricIcon}>⚡</div>
              <h3>Sentetik</h3>
              <ul>
                <li>30-40°C'de yıkayın</li>
                <li>Düşük devirde sıkın</li>
                <li>Düşük ısıda ütüleyin</li>
                <li>Anti-statik ürün kullanın</li>
                <li>Hızlı kurur, dikkat edin</li>
              </ul>
            </div>

            <div className={styles.fabricCard}>
              <div className={styles.fabricIcon}>👗</div>
              <h3>Dantel & Tül</h3>
              <ul>
                <li>El ile hassas yıkama</li>
                <li>Yumuşak fırça ile temizleyin</li>
                <li>Çamaşır filesi kullanın</li>
                <li>Düz sererek kurutun</li>
                <li>Düşük ısıda, bez arası ütüleyin</li>
              </ul>
            </div>

            <div className={styles.fabricCard}>
              <div className={styles.fabricIcon}>🧥</div>
              <h3>Deri & Süet</h3>
              <ul>
                <li>Profesyonel temizlik önerilir</li>
                <li>Özel deri temizleyici kullanın</li>
                <li>Nem ve güneşten uzak tutun</li>
                <li>Askıda muhafaza edin</li>
                <li>Periyodik bakım yaptırın</li>
              </ul>
            </div>
          </div>
        </div>

        {/* General Tips */}
        <div className={styles.tips}>
          <div className={styles.tipCard}>
            <AlertTriangle className={styles.tipIcon} />
            <div className={styles.tipContent}>
              <h3>Genel Bakım İpuçları</h3>
              <div className={styles.tipColumns}>
                <div className={styles.tipColumn}>
                  <h4>Yıkama Öncesi</h4>
                  <ul>
                    <li>Cepleri kontrol edin</li>
                    <li>Leke varsa önceden temizleyin</li>
                    <li>Renkleri ayırın</li>
                    <li>Çamaşır makinenizi aşırı doldurmayın</li>
                    <li>Etiket talimatlarını okuyun</li>
                  </ul>
                </div>
                <div className={styles.tipColumn}>
                  <h4>Saklama</h4>
                  <ul>
                    <li>Temiz ve kuru saklayın</li>
                    <li>Havadar dolapta muhafaza edin</li>
                    <li>Kaliteli askı kullanın</li>
                    <li>Güve önleyici ürünler tercih edin</li>
                    <li>Mevsimlik değişimde kontrol edin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Care */}
        <div className={styles.emergencyCare}>
          <h2 className={styles.sectionTitle}>Acil Durum Temizliği</h2>
          
          <div className={styles.emergencyGrid}>
            <div className={styles.emergencyCard}>
              <h3>🍷 Şarap Lekesi</h3>
              <p>Hemen tuz döküp emdiirin. Soğuk su ile durulayın. Beyaz şarap veya soda ile muamele edin.</p>
            </div>
            
            <div className={styles.emergencyCard}>
              <h3>🩸 Kan Lekesi</h3>
              <p>Soğuk su ile hemen yıkayın. Oksijen bazlı leke çıkarıcı kullanın. Sıcak su kullanmayın.</p>
            </div>
            
            <div className={styles.emergencyCard}>
              <h3>🫒 Yağ Lekesi</h3>
              <p>Talp veya nişasta ile fazlalığı alın. Bulaşık deterjanı ile ön temizlik yapın.</p>
            </div>
            
            <div className={styles.emergencyCard}>
              <h3>🖊️ Mürekkep Lekesi</h3>
              <p>Alkol bazlı temizleyici kullanın. Emici kağıt ile bastırarak alın. Sürtmeyin.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h3>Özel bakım danışmanlığı mı istiyorsunuz?</h3>
          <p>Lüks kıyafetlerinizin profesyonel bakımı için uzman ekibimizle iletişime geçin.</p>
          <div className={styles.contactButtons}>
            <Link href="/iletisim" className={styles.contactBtn}>
              İletişime Geçin
            </Link>
            <a href="https://wa.me/905555555555" className={styles.whatsappBtn}>
              WhatsApp Destek
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}