import { site } from "@/content/site";

/**
 * Demo/Gallery section showcasing real simulation outputs from PulseSuite.
 */
export function Demo() {
  // Define demo items with actual images
  const demoItems = [
    {
      title: "Chirped Pulse Dynamics",
      description: "Ultrafast chirped pulse design showing temporal profiles, spectral broadening, and time-frequency evolution. Compare transform-limited vs chirped pulses.",
      media: "/demo/chirped-pulse.png",
      type: "image",
    },
    {
      title: "Quantum Energy Transfer",
      description: "Real-time energy flow between optical fields and carrier populations — absorption, coherent polarization, and population dynamics at femtosecond timescales.",
      media: "/demo/energy-transfer.png",
      type: "image",
    },
    {
      title: "3D Field Propagation",
      description: "Full 3D electromagnetic field evolution through quantum structures with absorbing boundaries. Coming soon.",
      media: "", // Placeholder for future
      type: "placeholder",
    },
  ];

  return (
    <section id="demo" className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {site.demo.headline}
          </h2>
          <p className="mt-4 text-lg text-zinc-600">{site.demo.subhead}</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {demoItems.slice(0, 2).map((item) => (
            <div
              key={item.title}
              className="group border border-zinc-200 bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-50 border-b border-zinc-100">
                <img
                  src={item.media}
                  alt={item.title}
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-medium text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Third item - placeholder for 3D */}
        <div className="mt-8">
          <div className="border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h3 className="text-base font-medium text-zinc-900">
              {demoItems[2].title}
            </h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
              {demoItems[2].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
