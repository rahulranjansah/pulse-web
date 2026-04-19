import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Positioning } from "@/components/Positioning";
import { CTA } from "@/components/CTA";
import { ForTeams } from "@/components/ForTeams";
import { Footer } from "@/components/Footer";

/**
 * Homepage. One page, composed from modular components.
 *
 * To add a section: drop a new component under src/components/, import
 * it here, place it in the flow. Copy lives in src/content/site.ts.
 *
 * v1 section order:
 *   Nav → Hero → Differentiators → Positioning → CTA → ForTeams → Footer
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Positioning />
        <CTA />
        <ForTeams />
      </main>
      <Footer />
    </div>
  );
}
