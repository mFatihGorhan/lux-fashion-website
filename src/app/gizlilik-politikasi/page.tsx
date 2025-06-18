import { type Metadata } from 'next'
import styles from './privacy.module.css'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Luxe Fashion',
  description: 'Luxe Fashion gizlilik politikası. Kişisel verilerinizin korunması, işlenmesi ve kullanımı hakkında detaylı bilgiler.',
  keywords: 'gizlilik politikası, kişisel veriler, KVKK, veri koruma, güvenlik',
}

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gizlilik Politikası</h1>
        <p className={styles.subtitle}>
          Kişisel verilerinizin güvenliği bizim için önceliklidir. Bu politika, verilerinizin nasıl toplandığını, 
          kullanıldığını ve korunduğunu açıklar.
        </p>
        <div className={styles.updateDate}>
          Son güncelleme: 15 Haziran 2024
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Veri Sorumlusu</h2>
          <div className={styles.sectionContent}>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin veri sorumlusu 
              <strong> Luxe Fashion Tekstil A.Ş.</strong>'dir.
            </p>
            <div className={styles.contactInfo}>
              <strong>İletişim Bilgileri:</strong>
              <br />
              Adres: Nişantaşı, Abdi İpekçi Cad. No:23, Şişli/İstanbul
              <br />
              E-posta: kvkk@luxefashion.com
              <br />
              Telefon: +90 555 555 55 55
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Toplanan Kişisel Veriler</h2>
          <div className={styles.sectionContent}>
            <p>Aşağıdaki kişisel verilerinizi topluyoruz:</p>
            <ul className={styles.list}>
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura için gerekli ise)</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgileri</li>
              <li><strong>Müşteri İşlem Bilgileri:</strong> Sipariş geçmişi, ödeme bilgileri, iade/değişim talepleri</li>
              <li><strong>Pazarlama Bilgileri:</strong> Ürün tercihleri, kampanya katılımları</li>
              <li><strong>Teknik Bilgiler:</strong> IP adresi, çerez bilgileri, cihaz bilgileri</li>
              <li><strong>Görsel/İşitsel Kayıtlar:</strong> Müşteri hizmetleri görüşme kayıtları (onay alınarak)</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Kişisel Verilerin İşlenme Amaçları</h2>
          <div className={styles.sectionContent}>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className={styles.list}>
              <li>Sipariş alma, teslimat ve müşteri hizmetleri sunma</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi ve faturalandırma</li>
              <li>İade, değişim ve garanti hizmetlerinin yürütülmesi</li>
              <li>Müşteri memnuniyeti ölçümü ve hizmet kalitesi artırma</li>
              <li>Pazarlama faaliyetleri ve kişiselleştirilmiş öneriler sunma</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Güvenlik önlemlerinin alınması ve dolandırıcılık tespiti</li>
              <li>İstatistiksel analiz ve raporlama</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
          <div className={styles.sectionContent}>
            <p>Kişisel verileriniz KVKK'nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
            <ul className={styles.list}>
              <li>Açık tafınız (pazarlama için)</li>
              <li>Sözleşmenin kurulması veya ifası için gerekli olması</li>
              <li>Yasal yükümlülüğün yerine getirilmesi</li>
              <li>Meşru menfaatlerin temini (güvenlik, dolandırıcılık önleme)</li>
              <li>Temel hak ve özgürlüklerle dengelenmek kaydıyla meşru menfaatlerimiz</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Kişisel Verilerin Paylaşılması</h2>
          <div className={styles.sectionContent}>
            <p>Kişisel verileriniz aşağıdaki durumlarda üçüncü kişilerle paylaşılabilir:</p>
            <ul className={styles.list}>
              <li><strong>Kargo Firmaları:</strong> Siparişlerinizin teslimatı için</li>
              <li><strong>Ödeme Kuruluşları:</strong> Güvenli ödeme işlemleri için</li>
              <li><strong>Hukuki Müşavirler:</strong> Hukuki süreçlerin yürütülmesi için</li>
              <li><strong>Denetim Firmaları:</strong> Yasal denetim süreçleri için</li>
              <li><strong>Resmi Kurumlar:</strong> Yasal yükümlülük kapsamında</li>
              <li><strong>İş Ortakları:</strong> Hizmet sağlayıcıları (güvenlik sözleşmesi ile)</li>
            </ul>
            <p>Verileriniz yurt dışına aktarılmadan önce yasal prosedürler tamamlanır ve uygun güvenlik önlemleri alınır.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Kişisel Verilerin Saklanma Süresi</h2>
          <div className={styles.sectionContent}>
            <p>Kişisel verileriniz aşağıdaki süreler boyunca saklanır:</p>
            <ul className={styles.list}>
              <li><strong>Müşteri Kayıtları:</strong> İşlem sonrası 10 yıl (Türk Ticaret Kanunu)</li>
              <li><strong>Finansal Kayıtlar:</strong> 5 yıl (Vergi mevzuatı)</li>
              <li><strong>Pazarlama Verileri:</strong> İzin iptal edilene kadar veya 2 yıl</li>
              <li><strong>Çerez Verileri:</strong> Çerez politikamızda belirtilen süreler</li>
              <li><strong>Güvenlik Kayıtları:</strong> 1 yıl</li>
            </ul>
            <p>Saklama süreleri sona erdiğinde verileriniz güvenli şekilde silinir veya anonimleştirilir.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Kişisel Veri Sahibinin Hakları</h2>
          <div className={styles.sectionContent}>
            <p>KVKK'nın 11. maddesi uyarınca sahip olduğunuz haklar:</p>
            <ul className={styles.list}>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
              <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme, silme ve yok etme işlemlerinin paylaştığımız üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Güvenlik Önlemleri</h2>
          <div className={styles.sectionContent}>
            <p>Kişisel verilerinizin güvenliği için aldığımız önlemler:</p>
            <ul className={styles.list}>
              <li><strong>Teknik Güvenlik:</strong> SSL sertifikası, şifreleme, güvenlik duvarı</li>
              <li><strong>İdari Güvenlik:</strong> Erişim yetkileri, personel eğitimi, güvenlik politikaları</li>
              <li><strong>Fiziksel Güvenlik:</strong> Güvenli sunucu odaları, kamera sistemleri</li>
              <li><strong>Veri Yedekleme:</strong> Düzenli yedekleme ve kurtarma prosedürleri</li>
              <li><strong>Olay Müdahale:</strong> Güvenlik ihlali durumunda hızlı müdahale planı</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Çerezler (Cookies)</h2>
          <div className={styles.sectionContent}>
            <p>
              Web sitemizde kullanıcı deneyimini geliştirmek amacıyla çerezler kullanılmaktadır. 
              Çerez kullanımı hakkında detaylı bilgi için <a href="/cerez-politikasi" className={styles.link}>Çerez Politikamızı</a> inceleyebilirsiniz.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Çocukların Kişisel Verileri</h2>
          <div className={styles.sectionContent}>
            <p>
              18 yaşından küçük çocukların kişisel verilerinin işlenmesi için veli/vasi onayı gereklidir. 
              Çocuklara yönelik özel koruma önlemleri uygulanır ve gereksiz veri toplama yapılmaz.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Başvuru Yolları</h2>
          <div className={styles.sectionContent}>
            <p>KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki yollarla başvurabilirsiniz:</p>
            <div className={styles.contactMethods}>
              <div className={styles.method}>
                <strong>E-posta:</strong> kvkk@luxefashion.com
              </div>
              <div className={styles.method}>
                <strong>Posta:</strong> Nişantaşı, Abdi İpekçi Cad. No:23, Şişli/İstanbul
              </div>
              <div className={styles.method}>
                <strong>Website:</strong> www.luxefashion.com üzerinden başvuru formu
              </div>
            </div>
            <p>Başvurularınız 30 gün içinde değerlendirilir ve sonuç tarafınıza bildirilir.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. Politika Güncellemeleri</h2>
          <div className={styles.sectionContent}>
            <p>
              Bu gizlilik politikası, yasal değişiklikler veya iş süreçlerimizin gelişimi doğrultusunda güncellenebilir. 
              Önemli değişiklikler e-posta ile bildirilir ve web sitemizde duyurulur.
            </p>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <p>
          Bu politika hakkında sorularınız için <strong>kvkk@luxefashion.com</strong> adresine yazabilir 
          veya <strong>+90 555 555 55 55</strong> numaralı telefonu arayabilirsiniz.
        </p>
      </div>
    </div>
  )
}