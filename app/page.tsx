import CTA from '@/components/cta'
import Features from '@/components/feature'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import Navbar from '@/components/navbar'
import Pricing from '@/components/pricing'

const HomePage = () => {
  return (
   <main className='relative overflow-hidden bg-background'>
    <Navbar />
    <Hero />
    <Features />
    <Pricing />
    <CTA />
    <Footer />
   </main>
  )
}

export default HomePage
