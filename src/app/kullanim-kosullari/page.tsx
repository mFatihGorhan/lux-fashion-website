import { type Metadata } from 'next'
import styles from './terms.module.css'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Luxe Fashion',
  description: 'Luxe Fashion kullanım koşulları ve şartları. Web sitesi ve hizmetlerimizi kullanırken uymanız gereken kurallar.',
  keywords: 'kullanım koşulları, şartlar, kullanım şartları, yasal uyarılar, hizmet koşulları',
}

export default function TermsOfUsePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kullanım Koşulları</h1>
        <p className={styles.subtitle}>
          Web sitemizi ve hizmetlerimizi kullanırken geçerli olan şartlar ve koşullar 
          aşağıda detaylı olarak açıklanmıştır.
        </p>
        <div className={styles.updateDate}>
          Son güncelleme: 15 Haziran 2024
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Genel Hükümler</h2>
          <div className={styles.sectionContent}>
            <p>
              Bu kullanım koşulları, <strong>Luxe Fashion Tekstil A.Ş.</strong> ("Şirket", "Biz") tarafından işletilen 
              www.luxefashion.com web sitesi ve mobil uygulamaları ("Platform") ile ilgili hizmetlerin 
              kullanımını düzenler.
            </p>
            <p>
              Platformumuzu kullanarak bu koşulları kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, 
              platformumuzu kullanmamalısınız.
            </p>
            <div className={styles.companyInfo}>
              <strong>Şirket Bilgileri:</strong>
              <br />
              Luxe Fashion Tekstil A.Ş.
              <br />
              Adres: Nişantaşı, Abdi İpekçi Cad. No:23, Şişli/İstanbul
              <br />
              Telefon: +90 555 555 55 55
              <br />
              E-posta: info@luxefashion.com
              <br />
              Mersis No: 0123456789012345
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Tanımlar</h2>
          <div className={styles.sectionContent}>
            <ul className={styles.definitionList}>
              <li><strong>Platform:</strong> Luxe Fashion web sitesi ve mobil uygulamaları</li>
              <li><strong>Kullanıcı:</strong> Platformu kullanan her türlü gerçek ve tüzel kişi</li>
              <li><strong>Üye:</strong> Platforma kayıt olmuş kullanıcılar</li>
              <li><strong>Ürün:</strong> Platform üzerinde satışa sunulan giyim eşyaları</li>
              <li><strong>Sipariş:</strong> Platform üzerinden verilen alışveriş talebi</li>
              <li><strong>Sözleşme:</strong> Bu kullanım koşulları ve gizlilik politikası</li>
              <li><strong>Hizmet:</strong> Platform üzerinden sunulan tüm hizmetler</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Hesap Oluşturma ve Üyelik</h2>
          <div className={styles.sectionContent}>
            <h3 className={styles.subsectionTitle}>3.1 Üyelik Koşulları</h3>
            <ul className={styles.list}>
              <li>18 yaşını doldurmuş ve medeni hakları kullanma ehliyetine sahip olmalısınız</li>
              <li>Doğru, güncel ve eksiksiz bilgiler vermelisiniz</li>
              <li>Bir kişi sadece bir üyelik hesabı oluşturabilir</li>
              <li>Hesap bilgilerinizi üçüncü kişilerle paylaşmamalısınız</li>
            </ul>

            <h3 className={styles.subsectionTitle}>3.2 Hesap Güvenliği</h3>
            <ul className={styles.list}>
              <li>Şifrenizi güçlü ve gizli tutma sorumluluğu size aittir</li>
              <li>Hesabınızda gerçekleşen tüm işlemlerden sorumlusunuz</li>
              <li>Yetkisiz erişim durumunda derhal bildirim yapmalısınız</li>
              <li>Şüpheli aktivite tespit edilirse hesabınızı askıya alabiliriz</li>
            </ul>

            <h3 className={styles.subsectionTitle}>3.3 Hesap Kapatma</h3>
            <p>
              Üyeliğinizi istediğiniz zaman sonlandırabilirsiniz. Şirket de bu koşulları ihlal etmeniz 
              durumunda hesabınızı kapatma hakkını saklı tutar.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Alışveriş ve Sipariş Koşulları</h2>
          <div className={styles.sectionContent}>
            <h3 className={styles.subsectionTitle}>4.1 Sipariş Süreci</h3>
            <ul className={styles.list}>
              <li>Ürünleri sepete ekleyip sipariş oluşturabilirsiniz</li>
              <li>Sipariş vermek sözleşme teklifi niteliğindedir</li>
              <li>Ödeme onayı ile sözleşme kurulmuş sayılır</li>
              <li>Stok durumuna göre siparişiniz iptal edilebilir</li>
            </ul>

            <h3 className={styles.subsectionTitle}>4.2 Fiyat ve Ödeme</h3>
            <ul className={styles.list}>
              <li>Fiyatlar Türk Lirası olarak görüntülenir</li>
              <li>KDV dahil fiyatlar gösterilir</li>
              <li>Ödeme anında geçerli fiyat uygulanır</li>
              <li>Teknik hatalar durumunda fiyat düzeltme hakkımız saklıdır</li>
            </ul>

            <h3 className={styles.subsectionTitle}>4.3 Teslimat</h3>
            <ul className={styles.list}>
              <li>Teslimat süreleri tahmini olup değişiklik gösterebilir</li>
              <li>500 TL ve üzeri siparişlerde kargo ücretsizdir</li>
              <li>Teslimat adresinin doğruluğu sorumluluğu size aittir</li>
              <li>Force majeure durumlarında teslimat gecikebilir</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. İade ve Değişim</h2>
          <div className={styles.sectionContent}>
            <h3 className={styles.subsectionTitle}>5.1 İade Koşulları</h3>
            <ul className={styles.list}>
              <li>Ürünleri 14 gün içinde iade edebilirsiniz</li>
              <li>Ürünler kullanılmamış, etiketli ve orijinal ambalajında olmalıdır</li>
              <li>Kişiye özel üretilen ürünler iade kabul edilmez</li>
              <li>Hijyen koşulları gereği iç giyim ürünleri iade edilemez</li>
            </ul>

            <h3 className={styles.subsectionTitle}>5.2 İade Prosedürü</h3>
            <ul className={styles.list}>
              <li>İade talebinizi müşteri hizmetlerine bildirin</li>
              <li>Size gönderilen iade kodunu kullanın</li>
              <li>Ürün tarafımıza ulaştıktan sonra inceleme yapılır</li>
              <li>Onay durumunda 3-5 iş günü içinde para iadesi yapılır</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Kullanıcı Yükümlülükleri</h2>
          <div className={styles.sectionContent}>
            <p>Platform kullanırken aşağıdaki kurallara uymanız gerekmektedir:</p>
            <ul className={styles.list}>
              <li>Yasalara ve bu koşullara uygun şekilde kullanım</li>
              <li>Başkalarının haklarına saygı gösterme</li>
              <li>Doğru ve güncel bilgi verme</li>
              <li>Platformun güvenliğini tehdit etmeme</li>
              <li>Ticari olmayan kişisel kullanım</li>
              <li>Telif haklarına saygı gösterme</li>
              <li>Spam veya zararlı içerik paylaşmama</li>
              <li>Sistemleri manipüle etmeye çalışmama</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Yasaklı Kullanımlar</h2>
          <div className={styles.sectionContent}>
            <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
            <ul className={styles.list}>
              <li>Platform güvenliğini tehdit edici faaliyetler</li>
              <li>Sahte hesap oluşturma veya kimlik hırsızlığı</li>
              <li>Otomatik yazılımlar (bot, crawler) kullanma</li>
              <li>Ürün fiyatlarını manipüle etmeye çalışma</li>
              <li>Hileli ödeme yöntemleri kullanma</li>
              <li>Hakaret, tehdit veya uygunsuz davranışlar</li>
              <li>Rekabete aykırı davranışlar</li>
              <li>Geri dönüşüm (chargeback) suistimali</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Fikri Mülkiyet Hakları</h2>
          <div className={styles.sectionContent}>
            <p>
              Platform üzerindeki tüm içerik, tasarım, logo, fotoğraf, metin ve yazılımlar 
              Luxe Fashion'a aittir ve telif hakkı ile korunmaktadır.
            </p>
            <ul className={styles.list}>
              <li>İçerikleri izin almadan kopyalayamaz, çoğaltamaz veya dağıtamazsınız</li>
              <li>Marka ve logoları izinsiz kullanamazsınız</li>
              <li>Ürün fotoğraflarını başka platformlarda kullanammazsınız</li>
              <li>Platform tasarımını taklit edemezsiniz</li>
              <li>Yazılım kodlarına erişmeye çalışamazsınız</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Sorumluluk Sınırları</h2>
          <div className={styles.sectionContent}>
            <h3 className={styles.subsectionTitle}>9.1 Platform Sorumluluğu</h3>
            <ul className={styles.list}>
              <li>Platformun kesintisiz çalışacağını garanti etmeyiz</li>
              <li>Teknik arızalar için kullanıcıya karşı sorumluluk kabul etmeyiz</li>
              <li>Üçüncü parti hizmet sağlayıcılarından sorumlu değiliz</li>
              <li>Force majeure durumlarında sorumluluk kabul etmeyiz</li>
            </ul>

            <h3 className={styles.subsectionTitle}>9.2 Kullanıcı Sorumluluğu</h3>
            <ul className={styles.list}>
              <li>Hesap bilgilerinizin güvenliğinden sorumlusunuz</li>
              <li>Verdiğiniz bilgilerin doğruluğundan sorumlusunuz</li>
              <li>Yasalara aykırı kullanımlardan sorumlusunuz</li>
              <li>Üçüncü kişilere verdiğiniz zararlardan sorumlusunuz</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Kişisel Verilerin Korunması</h2>
          <div className={styles.sectionContent}>
            <p>
              Kişisel verileriniz 6698 sayılı KVKK uyarınca işlenir ve korunur. 
              Detaylı bilgi için <a href="/gizlilik-politikasi" className={styles.link}>Gizlilik Politikamızı</a> inceleyiniz.
            </p>
            <ul className={styles.list}>
              <li>Verileriniz yalnızca hizmet sunumu için kullanılır</li>
              <li>Güvenlik önlemleri ile korunur</li>
              <li>Yasal süreler boyunca saklanır</li>
              <li>Haklarınızı kullanabilirsiniz</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Uyuşmazlık Çözümü</h2>
          <div className={styles.sectionContent}>
            <h3 className={styles.subsectionTitle}>11.1 Müşteri Hizmetleri</h3>
            <p>
              Herhangi bir sorun yaşadığınızda öncelikle müşteri hizmetlerimiz ile iletişime geçin:
            </p>
            <div className={styles.contactInfo}>
              <div><strong>Telefon:</strong> +90 555 555 55 55</div>
              <div><strong>E-posta:</strong> destek@luxefashion.com</div>
              <div><strong>Çalışma Saatleri:</strong> Pazartesi-Cumartesi 09:00-18:00</div>
            </div>

            <h3 className={styles.subsectionTitle}>11.2 Yasal Uyuşmazlıklar</h3>
            <p>
              Bu sözleşmeden doğan uyuşmazlıklarda İstanbul (Çağlayan) Mahkemeleri ve 
              İcra Müdürlükleri yetkilidir. Türk Hukuku uygulanır.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. Değişiklik ve Güncellemeler</h2>
          <div className={styles.sectionContent}>
            <p>
              Bu kullanım koşulları önceden haber vermeksizin değiştirilebilir. 
              Önemli değişiklikler e-posta ile bildirilir.
            </p>
            <ul className={styles.list}>
              <li>Güncel koşulları düzenli olarak kontrol edin</li>
              <li>Değişiklikler yayınlandığı tarihten itibaren geçerlidir</li>
              <li>Platform kullanımınız değişiklikleri kabul ettiğiniz anlamına gelir</li>
              <li>Kabul etmediğiniz durumlarda platform kullanımını sonlandırmalısınız</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>13. Çeşitli Hükümler</h2>
          <div className={styles.sectionContent}>
            <h3 className={styles.subsectionTitle}>13.1 Bölünebilirlik</h3>
            <p>
              Bu koşulların herhangi bir maddesi geçersiz sayılırsa, diğer maddeler 
              geçerliliğini korur.
            </p>

            <h3 className={styles.subsectionTitle}>13.2 Feragat</h3>
            <p>
              Herhangi bir hakkımızı kullanmamamız, o haktan feragat ettiğimiz anlamına gelmez.
            </p>

            <h3 className={styles.subsectionTitle}>13.3 Devir</h3>
            <p>
              Bu sözleşmeden doğan hak ve yükümlülüklerinizi başkasına devredemezsiniz.
            </p>

            <h3 className={styles.subsectionTitle}>13.4 Tamamlık</h3>
            <p>
              Bu koşullar, taraflar arasındaki tüm anlaşmayı oluşturur ve önceki 
              anlaşmaları hükümsüz kılar.
            </p>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <p>
          Bu kullanım koşulları hakkında sorularınız için 
          <strong> hukuk@luxefashion.com</strong> adresine yazabilir veya 
          <strong> +90 555 555 55 55</strong> numaralı telefonu arayabilirsiniz.
        </p>
        <div className={styles.footerDate}>
          Yürürlük tarihi: 15 Haziran 2024
        </div>
      </div>
    </div>
  )
}