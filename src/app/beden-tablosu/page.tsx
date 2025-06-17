import { Metadata } from 'next'
import { Ruler, Info, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import styles from './size-chart.module.css'

export const metadata: Metadata = {
  title: 'Beden Tablosu - Lux Fashion',
  description: 'Doğru bedeni seçmeniz için detaylı beden tablosu ve ölçü alma rehberi.',
}

export default function SizeChartPage() {
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
          <span className={styles.breadcrumbCurrent}>Beden Tablosu</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Ruler className={styles.titleIcon} />
            Beden Tablosu
          </h1>
          <p className={styles.subtitle}>
            Doğru bedeni seçmeniz için detaylı ölçü rehberi
          </p>
        </div>

        {/* Size Chart */}
        <div className={styles.sizeChart}>
          <h2 className={styles.sectionTitle}>Kadın Giyim Beden Tablosu</h2>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Beden</th>
                  <th>Göğüs (cm)</th>
                  <th>Bel (cm)</th>
                  <th>Kalça (cm)</th>
                  <th>Boy (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>XS (34)</strong></td>
                  <td>82-86</td>
                  <td>62-66</td>
                  <td>88-92</td>
                  <td>158-164</td>
                </tr>
                <tr>
                  <td><strong>S (36)</strong></td>
                  <td>86-90</td>
                  <td>66-70</td>
                  <td>92-96</td>
                  <td>160-166</td>
                </tr>
                <tr>
                  <td><strong>M (38)</strong></td>
                  <td>90-94</td>
                  <td>70-74</td>
                  <td>96-100</td>
                  <td>162-168</td>
                </tr>
                <tr>
                  <td><strong>L (40)</strong></td>
                  <td>94-98</td>
                  <td>74-78</td>
                  <td>100-104</td>
                  <td>164-170</td>
                </tr>
                <tr>
                  <td><strong>XL (42)</strong></td>
                  <td>98-102</td>
                  <td>78-82</td>
                  <td>104-108</td>
                  <td>166-172</td>
                </tr>
                <tr>
                  <td><strong>XXL (44)</strong></td>
                  <td>102-106</td>
                  <td>82-86</td>
                  <td>108-112</td>
                  <td>168-174</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Measurement Guide */}
        <div className={styles.measurementGuide}>
          <h2 className={styles.sectionTitle}>Ölçü Alma Rehberi</h2>
          
          <div className={styles.guideGrid}>
            <div className={styles.guideItem}>
              <div className={styles.guideIcon}>👥</div>
              <h3>Göğüs Ölçüsü</h3>
              <p>Meternizi göğsünüzün en geniş yerinden, kollarınızın altından geçirerek ölçün.</p>
            </div>
            
            <div className={styles.guideItem}>
              <div className={styles.guideIcon}>⏰</div>
              <h3>Bel Ölçüsü</h3>
              <p>Belinizin en ince yerinden, doğal bel hattınızdan ölçün.</p>
            </div>
            
            <div className={styles.guideItem}>
              <div className={styles.guideIcon}>📏</div>
              <h3>Kalça Ölçüsü</h3>
              <p>Kalçanızın en geniş yerinden, ayakta dik dururken ölçün.</p>
            </div>
            
            <div className={styles.guideItem}>
              <div className={styles.guideIcon}>📐</div>
              <h3>Boy Ölçüsü</h3>
              <p>Başınızın tepesinden ayak tabanınıza kadar olan mesafeyi ölçün.</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className={styles.tips}>
          <div className={styles.tipCard}>
            <Info className={styles.tipIcon} />
            <div className={styles.tipContent}>
              <h3>Ölçü Alma İpuçları</h3>
              <ul>
                <li>Ölçü alırken çok sıkı iç çamaşırı giymeyiniz</li>
                <li>Metrevi vücudunuza yapıştırın ama sıkmayın</li>
                <li>Normal nefes alırken ölçünüzü alın</li>
                <li>İki beden arasında kaldıysanız büyük bedeni tercih edin</li>
                <li>Kumaş türüne göre beden seçimi değişebilir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h3>Beden konusunda yardıma mı ihtiyacınız var?</h3>
          <p>Doğru bedeni seçmeniz için size yardımcı olmaktan memnuniyet duyarız.</p>
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