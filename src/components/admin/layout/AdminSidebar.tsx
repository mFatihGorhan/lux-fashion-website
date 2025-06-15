'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  Tags, 
  FileText,
  Image,
  Settings,
  Monitor
} from 'lucide-react'
import styles from './AdminSidebar.module.css'

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    icon: Package,
    label: 'Urunler',
    href: '/admin/products',
  },
  {
    icon: FolderOpen,
    label: 'Kategoriler',
    href: '/admin/categories',
  },
  {
    icon: Tags,
    label: 'Koleksiyonlar',
    href: '/admin/collections',
  },
  {
    icon: Monitor,
    label: 'Hero Yonetimi',
    href: '/admin/hero',
  },
  {
    icon: FileText,
    label: 'Blog',
    href: '/admin/blog',
    submenu: [
      { label: 'Yazilar', href: '/admin/blog/posts' },
      { label: 'Kategoriler', href: '/admin/blog/categories' },
      { label: 'Yazarlar', href: '/admin/blog/authors' },
    ]
  },
  {
    icon: Image,
    label: 'Medya',
    href: '/admin/media',
  },
  {
    icon: Settings,
    label: 'Ayarlar',
    href: '/admin/settings',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li key={item.href} className={styles.menuItem}>
              <Link 
                href={item.href}
                className={`${styles.menuLink} ${isActive(item.href) ? styles.active : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
              
              {item.submenu && isActive(item.href) && (
                <ul className={styles.submenu}>
                  {item.submenu.map((subItem) => (
                    <li key={subItem.href}>
                      <Link 
                        href={subItem.href}
                        className={`${styles.submenuLink} ${pathname === subItem.href ? styles.active : ''}`}
                      >
                        <span>{subItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}