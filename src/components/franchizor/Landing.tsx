import Header from './Header'
import Hero from './Hero'
import ValueProps from './ValueProps'
import HowItWorks from './HowItWorks'
import Features from './Features'
import LiveDemo from './LiveDemo'
import UseCases from './UseCases'
import Pricing from './Pricing'
import FAQ from './FAQ'
import Footer from './Footer'

const Landing = () => {
  return (
    <div className="min-h-screen bg-cream text-stone-800 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <LiveDemo />
        <ValueProps />
        <HowItWorks />
        <Features />
        <UseCases />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default Landing

