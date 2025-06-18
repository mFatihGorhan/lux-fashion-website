import { type Metadata } from 'next'
import styles from './cookies.module.css'

export const metadata: Metadata = {
  title: 'Çerez Politikası | Luxe Fashion',
  description: 'Luxe Fashion çerez politikası. Web sitemizde kullanılan çerezler, türleri ve yönetimi hakkında detaylı bilgiler.',
  keywords: 'çerez politikası, cookies, web sitesi çerezleri, veri toplama, gizlilik',
}

export default function CookiePolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Çerez Politikası</h1>
        <p className={styles.subtitle}>
          Web sitemizde kullanılan çerezler ve bu çerezlerin nasıl yönetileceği hakkında 
          detaylı bilgiler aşağıda yer almaktadır.
        </p>
        <div className={styles.updateDate}>
          Son güncelleme: 15 Haziran 2024
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Çerez Nedir?</h2>
          <div className={styles.sectionContent}>
            <p>
              Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, telefon) kaydedilen 
              küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını sağlar ve size 
              kişiselleştirilmiş bir deneyim sunar.
            </p>
            <p>
              Çerezler kişisel olarak sizi tanımlamaz, ancak web sitesi deneyiminizi kişiselleştirmek için 
              tarayıcınızı tanır. Çerezleri kabul etmeyebilir veya silebilirsiniz, ancak bu durumda 
              web sitesinin bazı özellikleri düzgün çalışmayabilir.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Çerez Türleri</h2>
          <div className={styles.sectionContent}>
            <div className={styles.cookieType}>
              <h3 className={styles.cookieTypeTitle}>Zorunlu Çerezler</h3>
              <p>
                Web sitesinin temel işlevlerinin çalışması için gerekli olan çerezlerdir. 
                Bu çerezler olmadan web sitesi düzgün çalışamaz.
              </p>
              <ul className={styles.list}>
                <li>Oturum yönetimi ve güvenlik</li>
                <li>Alışveriş sepeti işlevselliği</li>
                <li>Form verilerinin hatırlanması</li>
                <li>Tercih edilen dil ve para birimi</li>
              </ul>
            </div>

            <div className={styles.cookieType}>
              <h3 className={styles.cookieTypeTitle}>Performans Çerezleri</h3>
              <p>
                Web sitesinin performansını ölçmek ve iyileştirmek için kullanılan çerezlerdir. 
                Hangi sayfaların popüler olduğunu ve ziyaretçilerin site içinde nasıl hareket ettiğini anlarız.
              </p>
              <ul className={styles.list}>
                <li>Sayfa görüntüleme istatistikleri</li>
                <li>Site içi gezinme davranışları</li>
                <li>Hata raporları ve site performansı</li>
                <li>Yükleme süreleri ve teknik metrikler</li>
              </ul>
            </div>

            <div className={styles.cookieType}>
              <h3 className={styles.cookieTypeTitle}>İşlevsellik Çerezleri</h3>
              <p>
                Size daha iyi bir kullanıcı deneyimi sunmak için tercihlerinizi hatırlayan çerezlerdir.
              </p>
              <ul className={styles.list}>
                <li>Dil ve bölge tercihleri</li>
                <li>Tema ve görünüm ayarları</li>
                <li>Sosyal medya entegrasyonu</li>
                <li>Özelleştirilmiş içerik gösterimi</li>
              </ul>
            </div>

            <div className={styles.cookieType}>
              <h3 className={styles.cookieTypeTitle}>Pazarlama Çerezleri</h3>
              <p>
                Size ve ilgi alanlarınıza uygun reklamları göstermek için kullanılan çerezlerdir. 
                Bu çerezler onayınız ile kullanılır.
              </p>
              <ul className={styles.list}>
                <li>Kişiselleştirilmiş reklamlar</li>
                <li>Sosyal medya platformları ile entegrasyon</li>
                <li>Retargeting kampanyaları</li>
                <li>E-posta pazarlama segmentasyonu</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Kullandığımız Çerezler</h2>
          <div className={styles.sectionContent}>
            <div className={styles.cookieTable}>
              <div className={styles.tableHeader}>
                <div>Çerez Adı</div>
                <div>Türü</div>
                <div>Süresi</div>
                <div>Amacı</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>luxe_session</div>
                <div>Zorunlu</div>
                <div>Oturum</div>
                <div>Kullanıcı oturumu yönetimi</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>luxe_cart</div>
                <div>Zorunlu</div>
                <div>7 gün</div>
                <div>Alışveriş sepeti verilerini saklama</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>luxe_preferences</div>
                <div>İşlevsellik</div>
                <div>1 yıl</div>
                <div>Kullanıcı tercihlerini hatırlama</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>_ga</div>
                <div>Performans</div>
                <div>2 yıl</div>
                <div>Google Analytics - ziyaretçi analizi</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>_gid</div>
                <div>Performans</div>
                <div>24 saat</div>
                <div>Google Analytics - günlük ziyaretçi analizi</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>_fbp</div>
                <div>Pazarlama</div>
                <div>90 gün</div>
                <div>Facebook Pixel - reklam optimizasyonu</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Üçüncü Taraf Çerezleri</h2>
          <div className={styles.sectionContent}>
            <p>Web sitemizde aşağıdaki üçüncü taraf servislerinin çerezleri kullanılmaktadır:</p>
            
            <div className={styles.thirdParty}>
              <h4>Google Analytics</h4>
              <p>
                Web sitesi trafiğini analiz etmek ve kullanıcı davranışlarını anlamak için kullanılır. 
                <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Google Gizlilik Politikası
                </a>
              </p>
            </div>
            
            <div className={styles.thirdParty}>
              <h4>Facebook Pixel</h4>
              <p>
                Sosyal medya reklamlarının etkinliğini ölçmek ve kişiselleştirilmiş reklamlar sunmak için kullanılır.
                <br />
                <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Facebook Gizlilik Politikası
                </a>
              </p>
            </div>
            
            <div className={styles.thirdParty}>
              <h4>Google Tag Manager</h4>
              <p>
                Web sitesi etiketlerini yönetmek ve pazarlama araçlarını entegre etmek için kullanılır.
                <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Google Gizlilik Politikası
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Çerez Yönetimi</h2>
          <div className={styles.sectionContent}>
            <p>Çerezleri yönetmek için aşağıdaki seçenekleri kullanabilirsiniz:</p>
            
            <div className={styles.managementOption}>
              <h4>Tarayıcı Ayarları</h4>
              <p>Tarayıcınızın ayarlar bölümünden çerezleri yönetebilirsiniz:</p>
              <ul className={styles.list}>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className={styles.link}>Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className={styles.link}>Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className={styles.link}>Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className={styles.link}>Internet Explorer</a></li>
              </ul>
            </div>
            
            <div className={styles.managementOption}>
              <h4>Çerez Tercihleri</h4>
              <p>
                Web sitemizi ilk ziyaret ettiğinizde çıkan çerez onay penceresinden tercihlerinizi belirleyebilirsiniz. 
                Bu tercihleri istediğiniz zaman değiştirebilirsiniz.
              </p>
              <button className={styles.preferencesButton}>
                Çerez Tercihlerini Yönet
              </button>
            </div>
            
            <div className={styles.managementOption}>
              <h4>Çerez Reddi</h4>
              <p>
                Zorunlu çerezler dışındaki tüm çerezleri reddetmeyi seçebilirsiniz. Ancak bu durumda 
                web sitesinin bazı özellikleri çalışmayabilir ve size kişiselleştirilmiş bir deneyim sunamayabiliriz.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Mobil Uygulamalar</h2>
          <div className={styles.sectionContent}>
            <p>
              Mobil uygulamalarımızda geleneksel çerezler yerine benzeri teknolojiler kullanılmaktadır:
            </p>
            <ul className={styles.list}>
              <li><strong>Uygulama Verileri:</strong> Tercihlerinizi ve ayarlarınızı kaydetmek için</li>
              <li><strong>Cihaz Tanımlayıcıları:</strong> Güvenlik ve dolandırıcılık önleme için</li>
              <li><strong>Analitik SDK'ları:</strong> Uygulama performansını ölçmek için</li>
              <li><strong>Push Token'ları:</strong> Bildirim gönderiminde kullanmak için</li>
            </ul>
            <p>Bu verileri uygulama ayarlarından yönetebilir veya uygulamayı silebilirsiniz.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Yasal Çerçeve</h2>
          <div className={styles.sectionContent}>
            <p>
              Çerez kullanımımız aşağıdaki yasal düzenlemelere uygun olarak gerçekleştirilmektedir:
            </p>
            <ul className={styles.list}>
              <li>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</li>
              <li>Elektronik Ticaretin Düzenlenmesi Hakkında Kanun</li>
              <li>Avrupa Birliği Genel Veri Koruma Yönetmeliği (GDPR)</li>
              <li>ePrivacy Direktifi (Cookie Law)</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. İletişim</h2>
          <div className={styles.sectionContent}>
            <p>Çerez politikamız hakkında sorularınızı aşağıdaki kanallardan iletebilirsiniz:</p>
            <div className={styles.contactInfo}>
              <div><strong>E-posta:</strong> cerez@luxefashion.com</div>
              <div><strong>Telefon:</strong> +90 555 555 55 55</div>
              <div><strong>Adres:</strong> Nişantaşı, Abdi İpekçi Cad. No:23, Şişli/İstanbul</div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Politika Güncellemeleri</h2>
          <div className={styles.sectionContent}>
            <p>
              Bu çerez politikası, yasal değişiklikler ve teknolojik gelişmeler doğrultusunda güncellenebilir. 
              Önemli değişiklikler web sitemizde duyurulur ve size bildirilir.
            </p>
            <p>
              Güncel çerez politikamızı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <p>
          Çerez kullanımı hakkında daha fazla bilgi için 
          <a href="/gizlilik-politikasi" className={styles.footerLink}> Gizlilik Politikamızı</a> inceleyebilirsiniz.
        </p>
      </div>
    </div>
  )
}