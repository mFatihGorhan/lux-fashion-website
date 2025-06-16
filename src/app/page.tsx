import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import PageErrorBoundary from '@/components/PageErrorBoundary'

const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), {
  loading: () => (
    <section style={{ padding: '4rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ height: '1rem', width: '120px', background: '#f0f0f0', borderRadius: '4px', margin: '0 auto 0.75rem' }}></div>
          <div style={{ height: '2.5rem', width: '300px', background: '#f0f0f0', borderRadius: '4px', margin: '0 auto 1rem' }}></div>
          <div style={{ height: '1.25rem', width: '400px', background: '#f0f0f0', borderRadius: '4px', margin: '0 auto' }}></div>
        </div>
        <ProductCardSkeleton viewMode="grid" count={4} />
      </div>
    </section>
  ),
  ssr: true
})

function HomeContent() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
    </main>
  )
}

export default function Home() {
  return (
    <PageErrorBoundary pageName="Ana sayfa">
      <HomeContent />
    </PageErrorBoundary>
  )
}