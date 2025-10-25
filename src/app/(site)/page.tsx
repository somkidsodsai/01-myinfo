import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsShowcase from "@/components/Skills";
import ContactCTA from "@/components/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsShowcase />
      <ContactCTA />
    </>
  );
}
