import { type Metadata } from 'next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import styles from './faq.module.css'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | Luxe Fashion',
  description: 'Luxe Fashion hakkında sıkça sorulan sorular ve cevaplarını bulun. Sipariş, kargo, iade, ürün bakımı ve daha fazlası.',
  keywords: 'sıkça sorulan sorular, SSS, yardım, destek, sipariş, kargo, iade',
}

const faqData = [
  {
    category: 'Sipariş ve Ödeme',
    questions: [
      {
        question: 'Nasıl sipariş verebilirim?',
        answer: 'Beğendiğiniz ürünü sepete ekleyip, sepet sayfasından siparişinizi tamamlayabilirsiniz. Kredi kartı, banka kartı ve havale ile ödeme seçeneklerimiz mevcuttur.'
      },
      {
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer: 'Visa, Mastercard, American Express kredi kartları, banka kartları ve EFT/Havale ile ödeme kabul ediyoruz. Tüm ödemeler SSL güvenlik sertifikası ile korunmaktadır.'
      },
      {
        question: 'Siparişimi iptal edebilir miyim?',
        answer: 'Henüz kargoya verilmemiş siparişlerinizi iptal edebilirsiniz. Müşteri hizmetlerimiz ile iletişime geçerek iptal talebinizi iletebilirsiniz.'
      },
      {
        question: 'Fatura bilgilerimi nasıl değiştirebilirim?',
        answer: 'Sipariş verirken fatura bilgilerinizi doğru şekilde girdiğinizden emin olun. Verilen sipariş sonrası fatura bilgisi değişikliği mümkün değildir.'
      }
    ]
  },
  {
    category: 'Kargo ve Teslimat',
    questions: [
      {
        question: 'Kargo ücreti ne kadar?',
        answer: '500 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde kargo ücreti 29.90 TL\'dir.'
      },
      {
        question: 'Siparişim ne zaman kargoya verilir?',
        answer: 'Siparişiniz ödeme onayı alındıktan sonra 1-2 iş günü içinde kargoya verilir. Hafta sonu ve resmi tatil günleri kargo çıkışı yapılmaz.'
      },
      {
        question: 'Kargo takip numaramı nasıl öğrenebilirim?',
        answer: 'Siparişiniz kargoya verildikten sonra takip numaranız SMS ve e-posta ile gönderilir. Ayrıca hesabınızdan da takip edebilirsiniz.'
      },
      {
        question: 'Teslimat süresi ne kadar?',
        answer: 'İstanbul ve Ankara için 1-2 gün, diğer iller için 2-4 gün içinde teslimat yapılır. Kargo firması ve bölgeye göre süre değişiklik gösterebilir.'
      }
    ]
  },
  {
    category: 'İade ve Değişim',
    questions: [
      {
        question: 'İade koşulları nelerdir?',
        answer: 'Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. Ürünler kullanılmamış, etiketli ve orijinal ambalajında olmalıdır.'
      },
      {
        question: 'İade işlemini nasıl başlatabilirim?',
        answer: 'İade talebinizi müşteri hizmetlerimize ileterek başlatabilirsiniz. Size iade kargo kodu gönderilir ve ürünü ücretsiz olarak gönderebilirsiniz.'
      },
      {
        question: 'İade ücretini kim karşılıyor?',
        answer: 'Ürün kusurlu veya yanlış gönderilmiş ise iade ücreti tarafımızdan karşılanır. Diğer durumlarda iade kargo ücreti müşteriye aittir.'
      },
      {
        question: 'Para iadesi ne zaman yapılır?',
        answer: 'İade ürününüz tarafımıza ulaştıktan sonra 3-5 iş günü içinde para iadesi yapılır. İade, ödeme yaptığınız kartın hesabına yansır.'
      }
    ]
  },
  {
    category: 'Ürün ve Beden',
    questions: [
      {
        question: 'Beden tablosunu nasıl kullanabilirim?',
        answer: 'Her ürün sayfasında beden tablosu linki bulunur. Ölçülerinizi alarak size uygun bedeni seçebilirsiniz. Beden konusunda kararsız kaldığınızda müşteri hizmetlerimizden destek alabilirsiniz.'
      },
      {
        question: 'Ürün resimleri gerçeği yansıtıyor mu?',
        answer: 'Ürün fotoğrafları profesyonel stüdyo ortamında çekilir. Monitör ayarlarınıza bağlı olarak renk tonu farklılıkları olabilir. Bu durumda iade hakkınızı kullanabilirsiniz.'
      },
      {
        question: 'Ürün stoğu nasıl kontrol edebilirim?',
        answer: 'Ürün sayfasında mevcut bedenler görüntülenir. Stokta olmayan bedenler seçilemez durumda gösterilir. Tekrar stok bildirimi için e-posta adresinizi bırakabilirsiniz.'
      },
      {
        question: 'Ürün bakımı nasıl yapılmalı?',
        answer: 'Her ürünün care label\'ında bakım talimatları bulunur. Ayrıca ürün bakım rehberi sayfamızdan detaylı bilgi alabilirsiniz.'
      }
    ]
  },
  {
    category: 'Üyelik ve Hesap',
    questions: [
      {
        question: 'Üye olmak zorunda mıyım?',
        answer: 'Üye olmadan da alışveriş yapabilirsiniz. Ancak üyelik ile sipariş takibi, favori ürünler ve özel kampanyalardan yararlanabilirsiniz.'
      },
      {
        question: 'Şifremi unuttum, ne yapmalıyım?',
        answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinizi girin. Şifre sıfırlama linki gönderilecektir.'
      },
      {
        question: 'Hesap bilgilerimi nasıl güncellerim?',
        answer: 'Hesabınıza giriş yaptıktan sonra "Hesabım" bölümünden kişisel bilgilerinizi güncelleyebilirsiniz.'
      },
      {
        question: 'Üyeliğimi nasıl kapatırım?',
        answer: 'Üyelik kapatma talebi için müşteri hizmetlerimiz ile iletişime geçin. Verileriniz güvenli şekilde silinecektir.'
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sıkça Sorulan Sorular</h1>
        <p className={styles.subtitle}>
          Luxe Fashion hakkında merak ettiğiniz her şeyi burada bulabilirsiniz.
          Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten çekinmeyin.
        </p>
      </div>

      <div className={styles.content}>
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category.category}</h2>
            <div className={styles.questions}>
              {category.questions.map((item, questionIndex) => (
                <details key={questionIndex} className={styles.question}>
                  <summary className={styles.questionTitle}>
                    <span>{item.question}</span>
                    <ChevronDown className={styles.icon} />
                  </summary>
                  <div className={styles.answer}>
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contact}>
        <h3 className={styles.contactTitle}>Hala cevap bulamadınız mı?</h3>
        <p className={styles.contactText}>
          Müşteri hizmetlerimiz size yardımcı olmak için burada. 
          <strong> +90 555 555 55 55</strong> numaralı telefonu arayın veya 
          <strong> info@luxefashion.com</strong> adresine e-posta gönderin.
        </p>
        <div className={styles.contactHours}>
          <strong>Müşteri Hizmetleri Saatleri:</strong>
          <br />
          Pazartesi - Cumartesi: 09:00 - 18:00
          <br />
          Pazar: Kapalı
        </div>
      </div>
    </div>
  )
}