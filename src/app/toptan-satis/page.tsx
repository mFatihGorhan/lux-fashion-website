import { Metadata } from 'next'
import { Building2, Users, Package, TrendingUp, ArrowLeft, Mail, Phone, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import styles from './wholesale.module.css'

export const metadata: Metadata = {
  title: 'Toptan Satış - Lux Fashion',
  description: 'İşletmeniz için toptan satış fırsatları ve bayilik koşulları hakkında detaylı bilgi.',
}

export default function WholesalePage() {
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
          <span className={styles.breadcrumbCurrent}>Toptan Satış</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Building2 className={styles.titleIcon} />
            Toptan Satış ve Bayilik
          </h1>
          <p className={styles.subtitle}>
            Lux Fashion koleksiyonlarını işletmenizde satarak karlı bir iş ortaklığına adım atın
          </p>
        </div>

        {/* Benefits */}
        <div className={styles.benefits}>
          <h2 className={styles.sectionTitle}>Neden Lux Fashion Bayii Olmalısınız?</h2>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <TrendingUp className={styles.benefitIcon} />
              <h3>Yüksek Kar Marjı</h3>
              <p>Lüks segment ürünlerimiz ile %40-60 arasında kar marjı elde edebilirsiniz.</p>
            </div>
            
            <div className={styles.benefitCard}>
              <Package className={styles.benefitIcon} />
              <h3>Sınırlı Üretim</h3>
              <p>Özgün ve sınırlı sayıda üretilen koleksiyonlarımız ile özel müşteri kitlesine ulaşın.</p>
            </div>
            
            <div className={styles.benefitCard}>
              <Users className={styles.benefitIcon} />
              <h3>Pazarlama Desteği</h3>
              <p>Profesyonel ürün fotoğrafları, kataloglar ve pazarlama materyalleri desteği.</p>
            </div>
            
            <div className={styles.benefitCard}>
              <CheckCircle className={styles.benefitIcon} />
              <h3>Kalite Garantisi</h3>
              <p>Premium kumaşlar ve işçilik kalitesi ile müşteri memnuniyeti garantisi.</p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className={styles.requirements}>
          <h2 className={styles.sectionTitle}>Bayilik Koşulları</h2>
          
          <div className={styles.requirementsContent}>
            <div className={styles.requirementsList}>
              <div className={styles.requirementCard}>
                <h3>📍 Lokasyon Kriterleri</h3>
                <ul>
                  <li>Şehir merkezi veya AVM içinde konumlanmış</li>
                  <li>Minimum 50 m² mağaza alanı</li>
                  <li>Vitrin alanı mevcut</li>
                  <li>Yoğun geçiş noktasında bulunma</li>
                </ul>
              </div>
              
              <div className={styles.requirementCard}>
                <h3>💰 Finansal Koşullar</h3>
                <ul>
                  <li>Minimum 100.000 TL başlangıç sermayesi</li>
                  <li>İlk sipariş: En az 50 parça</li>
                  <li>Aylık minimum sipariş tutarı</li>
                  <li>30 gün vadeli ödeme imkanı</li>
                </ul>
              </div>
              
              <div className={styles.requirementCard}>
                <h3>👥 İnsan Kaynakları</h3>
                <ul>
                  <li>Moda ve satış konusunda deneyimli ekip</li>
                  <li>Müşteri odaklı hizmet anlayışı</li>
                  <li>Ürün bilgisi eğitimi alacak personel</li>
                  <li>Profesyonel mağaza yönetimi</li>
                </ul>
              </div>
              
              <div className={styles.requirementCard}>
                <h3>📋 Yasal Gereklilikler</h3>
                <ul>
                  <li>Aktif ticari işletme belgesi</li>
                  <li>Vergi dairesi kaydı</li>
                  <li>İş yeri açma ve çalışma ruhsatı</li>
                  <li>Temiz KKB kaydı</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Package Options */}
        <div className={styles.packages}>
          <h2 className={styles.sectionTitle}>Toptan Satış Paketleri</h2>
          
          <div className={styles.packagesGrid}>
            <div className={styles.packageCard}>
              <div className={styles.packageHeader}>
                <h3>Başlangıç Paketi</h3>
                <div className={styles.packagePrice}>₺25,000</div>
              </div>
              <ul className={styles.packageFeatures}>
                <li>50 adet karışık ürün</li>
                <li>2 farklı koleksiyon</li>
                <li>Beden dağılımı: XS-XXL</li>
                <li>Pazarlama materyalleri</li>
                <li>30 gün vadeli ödeme</li>
              </ul>
              <div className={styles.packageBadge}>Yeni Bayiler İçin</div>
            </div>
            
            <div className={styles.packageCard}>
              <div className={styles.packageHeader}>
                <h3>Standart Paket</h3>
                <div className={styles.packagePrice}>₺50,000</div>
              </div>
              <ul className={styles.packageFeatures}>
                <li>100 adet karışık ürün</li>
                <li>4 farklı koleksiyon</li>
                <li>Tam beden dağılımı</li>
                <li>Özel vitrin desteği</li>
                <li>45 gün vadeli ödeme</li>
                <li>%5 ek indirim</li>
              </ul>
              <div className={styles.packageBadge}>En Popüler</div>
            </div>
            
            <div className={styles.packageCard}>
              <div className={styles.packageHeader}>
                <h3>Premium Paket</h3>
                <div className={styles.packagePrice}>₺100,000</div>
              </div>
              <ul className={styles.packageFeatures}>
                <li>200 adet karışık ürün</li>
                <li>Tüm koleksiyonlar</li>
                <li>Özel tasarım ürünler</li>
                <li>Mağaza kurulum desteği</li>
                <li>60 gün vadeli ödeme</li>
                <li>%10 ek indirim</li>
                <li>Özel bayi anlaşması</li>
              </ul>
              <div className={styles.packageBadge}>Maksimum Kazanç</div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className={styles.support}>
          <h2 className={styles.sectionTitle}>Size Sunduğumuz Destekler</h2>
          
          <div className={styles.supportGrid}>
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>🎯</div>
              <h3>Pazarlama Desteği</h3>
              <p>Sosyal medya içerikleri, kataloglar, poster ve dijital materyaller.</p>
            </div>
            
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>📚</div>
              <h3>Eğitim Programı</h3>
              <p>Ürün bilgisi, satış teknikleri ve müşteri hizmetleri eğitimleri.</p>
            </div>
            
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>🚚</div>
              <h3>Lojistik Destek</h3>
              <p>Hızlı teslimat, güvenli paketleme ve iade yönetimi.</p>
            </div>
            
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>📞</div>
              <h3>24/7 Destek</h3>
              <p>Özel bayi hattı ile teknik ve operasyonel destek.</p>
            </div>
            
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>📊</div>
              <h3>Satış Analizi</h3>
              <p>Aylık satış raporları ve trend analizleri.</p>
            </div>
            
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>🎁</div>
              <h3>Özel Kampanyalar</h3>
              <p>Bayilere özel indirim ve promosyon fırsatları.</p>
            </div>
          </div>
        </div>

        {/* Application */}
        <div className={styles.application}>
          <h2 className={styles.sectionTitle}>Başvuru Süreci</h2>
          
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Ön Başvuru</h3>
              <p>Aşağıdaki iletişim bilgilerinden bize ulaşın ve ön başvurunuzu yapın.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Değerlendirme</h3>
              <p>Başvurunuz 3-5 iş günü içinde değerlendirilerek size geri dönüş yapılır.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Görüşme</h3>
              <p>Uygun görülen başvurular için detaylı görüşme planlanır.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Sözleşme</h3>
              <p>Karşılıklı anlaşma sağlandığında bayi sözleşmesi imzalanır.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h3>Toptan Satış ve Bayilik için Hemen İletişime Geçin</h3>
          <p>Deneyimli ekibimiz size en uygun paket önerisini sunmak için hazır.</p>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <div>
                <h4>Toptan Satış Hattı</h4>
                <a href="tel:+905555555555">+90 555 555 55 55</a>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <div>
                <h4>E-posta</h4>
                <a href="mailto:toptan@luxefashion.com">toptan@luxefashion.com</a>
              </div>
            </div>
          </div>
          
          <div className={styles.contactButtons}>
            <Link href="/iletisim" className={styles.contactBtn}>
              Detaylı Bilgi Al
            </Link>
            <a href="https://wa.me/905555555555" className={styles.whatsappBtn}>
              WhatsApp ile İletişim
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}