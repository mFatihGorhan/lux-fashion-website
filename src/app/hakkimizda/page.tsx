'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  Heart, 
  Leaf, 
  Users,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react'
import styles from './about.module.css'

const stats = [
  { number: '500+', label: 'Mutlu Müşteri' },
  { number: '50+', label: 'Butik Partner' },
  { number: '12', label: 'Özgün Koleksiyon' },
  { number: '100%', label: 'El İşçiliği' }
]

const values = [
  {
    icon: <Sparkles size={24} />,
    title: 'Özgün Tasarımlar',
    description: 'Her parça, modaya yön veren trendleri takip ederken kendi hikayesini anlatır. Tasarımlarımız, modern kadının gücünü ve zarafetini yansıtır.'
  },
  {
    icon: <Heart size={24} />,
    title: 'Sınırlı Üretim',
    description: 'Kitlesel üretimin aksine, her koleksiyonumuz sınırlı sayıda üretilir. Bu yaklaşım, müşterilerimize özel ve benzersiz parçalar sunmamızı sağlar.'
  },
  {
    icon: <Leaf size={24} />,
    title: 'Sürdürülebilirlik',
    description: 'Çevreye duyarlı üretim yöntemleri ve kaliteli malzemeler kullanarak, hem şık hem de sürdürülebilir bir moda anlayışı benimsiyoruz.'
  }
]

const timeline = [
  {
    year: '2020',
    title: 'Kuruluş',
    description: 'Luxe Fashion, iki moda tutkunu tarafından İstanbul\'da kuruldu.'
  },
  {
    year: '2021',
    title: 'İlk Koleksiyon',
    description: 'Timeless isimli ilk koleksiyonumuz büyük beğeni topladı.'
  },
  {
    year: '2022',
    title: 'Büyüme',
    description: 'Türkiye\'nin önde gelen butikleriyle çalışmaya başladık.'
  },
  {
    year: '2024',
    title: 'Yeni Ufuklar',
    description: 'Uluslararası pazarlara açılma hedefiyle yeni atılımlar.'
  }
]

export default function AboutPage() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.subtitle}>Hakkımızda</span>
          <h1 className={styles.title}>
            Ulaşılabilir Lüksün<br />
            <span className={styles.highlight}>Yeni Adresi</span>
          </h1>
          <p className={styles.heroText}>
            Luxe Fashion olarak, kadın giyiminde özgünlük ve kaliteyi 
            bir araya getiriyoruz. Her parçamız, modern kadının 
            hayatına değer katmak için özenle tasarlanıyor.
          </p>
        </div>
        
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder}>
            <Sparkles size={48} className={styles.iconFloat} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={styles.statItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className={styles.statNumber}>{stat.number}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <h2 className={styles.sectionTitle}>Hikayemiz</h2>
              <p className={styles.storyText}>
                2020 yılında, moda endüstrisinde yaşanan hızlı tüketim kültürüne 
                alternatif bir yaklaşım sunmak amacıyla yola çıktık. Amacımız, 
                kadınların kendilerini özel hissedebilecekleri, kaliteli ve 
                zamansız parçalar üretmekti.
              </p>
              <p className={styles.storyText}>
                İstanbul'un kalbinde başlayan bu yolculuk, bugün Türkiye'nin 
                dört bir yanındaki seçkin butiklerle devam ediyor. Her 
                koleksiyonumuzda, el emeğinin ve detaylara gösterilen özenin 
                izlerini görebilirsiniz.
              </p>
              <p className={styles.storyText}>
                Luxe Fashion olarak, sadece kıyafet üretmiyoruz; kadınların 
                kendilerini ifade edebilecekleri, güçlü ve zarif hissedecekleri 
                bir dünya yaratıyoruz.
              </p>
            </div>
            
            <div className={styles.storyImages}>
              <div className={styles.imageCard}>
                <div className={styles.storyImagePlaceholder}>
                  <Award size={32} />
                  <span>Kalite & Mükemmellik</span>
                </div>
              </div>
              <div className={styles.imageCard}>
                <div className={styles.storyImagePlaceholder}>
                  <Users size={32} />
                  <span>Ekip & Tutku</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.valuesHeader}>
            <h2 className={styles.sectionTitle}>Değerlerimiz</h2>
            <p className={styles.sectionSubtitle}>
              Markamızı şekillendiren ve bizi farklı kılan temel ilkeler
            </p>
          </div>
          
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div 
                key={index} 
                className={styles.valueCard}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={styles.valueIcon}>
                  {value.icon}
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timeline}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Yolculuğumuz</h2>
          
          <div className={styles.timelineWrapper}>
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className={styles.timelineItem}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={styles.timelinePoint}>
                  <span className={styles.timelineYear}>{item.year}</span>
                </div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <div className={styles.container}>
          <div className={styles.teamContent}>
            <h2 className={styles.sectionTitle}>Arkasındaki Ekip</h2>
            <p className={styles.teamText}>
              Luxe Fashion'ın başarısının arkasında, modaya tutkuyla bağlı, 
              yaratıcı ve özverili bir ekip var. Tasarımcılarımızdan üretim 
              ekibimize, her birimiz aynı vizyonu paylaşıyoruz: Kadınlara 
              kendilerini en iyi hissedecekleri parçaları sunmak.
            </p>
            
            <div className={styles.teamGrid}>
              <div className={styles.teamCard}>
                <div className={styles.teamImagePlaceholder}>
                  <Zap size={32} />
                </div>
                <h4 className={styles.teamRole}>Tasarım Ekibi</h4>
                <p className={styles.teamDescription}>
                  Trendleri takip eden, yenilikçi tasarımlar
                </p>
              </div>
              
              <div className={styles.teamCard}>
                <div className={styles.teamImagePlaceholder}>
                  <Heart size={32} />
                </div>
                <h4 className={styles.teamRole}>Üretim Ekibi</h4>
                <p className={styles.teamDescription}>
                  Detaylara özen gösteren usta eller
                </p>
              </div>
              
              <div className={styles.teamCard}>
                <div className={styles.teamImagePlaceholder}>
                  <Users size={32} />
                </div>
                <h4 className={styles.teamRole}>Müşteri İlişkileri</h4>
                <p className={styles.teamDescription}>
                  Her zaman yanınızda olan destek ekibi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Koleksiyonlarımızı Keşfedin
          </h2>
          <p className={styles.ctaText}>
            Özgün tasarımlarımız ve sınırlı üretim parçalarımızla 
            tanışmak için hemen göz atın
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/koleksiyonlar" className={styles.ctaPrimary}>
              <span>Koleksiyonları Gör</span>
              <ArrowRight size={20} />
            </Link>
            <Link href="/iletisim" className={styles.ctaSecondary}>
              <span>Bizimle İletişime Geçin</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}