import Header from "@/components/header";
import CinematicOpeningHero from "@/components/cinematic-opening-hero";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <CinematicOpeningHero />
        <AboutSection />
        <ServicesSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}


