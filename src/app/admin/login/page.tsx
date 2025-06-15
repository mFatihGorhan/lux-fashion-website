'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './login.module.css'

const loginSchema = z.object({
  email: z.string().email('Gecerli bir email adresi girin'),
  password: z.string().min(6, 'Sifre en az 6 karakter olmalidir'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      setError('')

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email veya sifre hatali')
        return
      }

      // Session kontrolu
      const session = await getSession()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((session?.user as any)?.role !== 'ADMIN') {
        setError('Bu alana erisim yetkiniz yok')
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Giris yapilirken bir hata olustu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>Lux Fashion</h1>
          <p className={styles.subtitle}>Admin Paneli</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              placeholder="admin@luxfashion.com"
              disabled={isLoading}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Sifre
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`${styles.input} ${errors.password ? styles.error : ''}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Test kullanıcısı: admin@luxfashion.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}