import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Technology } from "@/components/Technology";
import { PulseDesigner3D } from "@/components/PulseDesigner3D";
import { SBEVisualizer3D } from "@/components/SBEVisualizer3D";
import { UseCases } from "@/components/UseCases";
import { Demo } from "@/components/Demo";
import { Comparison } from "@/components/Comparison";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

/**
 * Homepage. Composed entirely from modular section components.
 *
 * To add a new section: create a new file under src/components/,
 * import it here, and drop it into the JSX. Nothing else to wire up.
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Technology />
        <PulseDesigner3D />
        <SBEVisualizer3D />
        <Demo />
        <UseCases />
        <Comparison />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
