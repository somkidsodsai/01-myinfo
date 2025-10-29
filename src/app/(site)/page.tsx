import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ExperienceHighlights from "@/components/ExperienceHighlights";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsShowcase from "@/components/Skills";
import ContactCTA from "@/components/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ExperienceHighlights />
      <FeaturedProjects />
      <SkillsShowcase />
      <ContactCTA />
    </>
  );
}
