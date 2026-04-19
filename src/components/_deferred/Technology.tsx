/**
 * Technology section - commercial-focused technical overview
 * Presents the physics in enterprise language without linking to open-source docs
 */
export function Technology() {
  const capabilities = [
    {
      category: "Electromagnetic Solver",
      items: [
        "3D Pseudo-Spectral Time-Domain (PSTD) Maxwell solver",
        "Leapfrog time integration with automatic CFL stability",
        "Perfectly matched layer (PML) absorbing boundaries",
        "Arbitrary material dispersion and nonlinearity",
      ],
    },
    {
      category: "Quantum Carrier Dynamics",
      items: [
        "Two-band Semiconductor Bloch Equations (SBEs)",
        "Microscopic polarization and population dynamics",
        "Femtosecond-scale coherent and incoherent processes",
        "Self-consistent light-matter coupling at every timestep",
      ],
    },
    {
      category: "Many-Body Physics",
      items: [
        "Coulomb interaction and exciton correlations",
        "Dynamic band-gap renormalization",
        "Carrier-carrier and carrier-phonon scattering",
        "LO and LA phonon modes with proper thermalization",
      ],
    },
    {
      category: "Computational Engine",
      items: [
        "Native GPU acceleration via CUDA (CuPy backend)",
        "NumPy/Numba CPU fallback for development",
        "Scalable to large 3D simulation domains",
        "Python API with ML framework compatibility",
      ],
    },
  ];

  return (
    <section id="technology" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            The Technology
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            A unified computational framework for simulating light-matter interaction
            at the quantum-classical boundary.
          </p>
        </div>

        {/* Core methodology */}
        <div className="mt-16 border-l border-zinc-200 pl-8">
          <h3 className="text-sm uppercase tracking-wide text-zinc-500">
            Core Methodology
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-700">
            PulseSuite solves the coupled Maxwell-Semiconductor Bloch Equations (Maxwell-SBE)
            system in three spatial dimensions. At each timestep, the electromagnetic field
            evolution drives quantum carrier transitions, while the resulting microscopic
            polarization feeds back into Maxwell's equations as a source term. This
            self-consistent approach captures phenomena that decoupled solvers fundamentally cannot:
            pulse reshaping during propagation, coherent transients, and the full spatiotemporal
            dynamics of light-matter energy exchange.
          </p>
        </div>

        {/* Technical capabilities grid */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          {capabilities.map((cap) => (
            <div key={cap.category} className="border-l border-zinc-200 pl-6">
              <h3 className="text-base font-medium text-zinc-900">{cap.category}</h3>
              <ul className="mt-4 space-y-2">
                {cap.items.map((item) => (
                  <li key={item} className="text-sm text-zinc-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Equations reference */}
        <div className="mt-16 border border-zinc-200 bg-zinc-50 p-8">
          <h3 className="text-sm uppercase tracking-wide text-zinc-500">
            Governing Equations
          </h3>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-zinc-700">Maxwell Equations</p>
              <p className="mt-2 font-mono text-sm text-zinc-600">
                curl E = -dB/dt
              </p>
              <p className="font-mono text-sm text-zinc-600">
                curl H = dD/dt + J
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                with D = eps_0 E + P (material polarization)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700">Semiconductor Bloch Equations</p>
              <p className="mt-2 font-mono text-sm text-zinc-600">
                dp/dt = -i(e_e + e_h)p - i*Omega*(f_e + f_h - 1) - p/T_2
              </p>
              <p className="font-mono text-sm text-zinc-600">
                df/dt = -2*Im(Omega* p) - (f - f_eq)/T_1
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                p: microscopic polarization, f: carrier population
              </p>
            </div>
          </div>
        </div>

        {/* Differentiation */}
        <div className="mt-16 border-l border-zinc-200 pl-8">
          <h3 className="text-sm uppercase tracking-wide text-zinc-500">
            Why Self-Consistency Matters
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-700">
            Traditional workflows decouple electromagnetic simulation from quantum models,
            passing results between tools in post-processing. This misses the bidirectional
            feedback between light and matter that dominates in ultrafast regimes. PulseSuite
            computes both simultaneously, enabling accurate simulation of gain saturation,
            coherent artifacts, pulse breakup, and carrier-induced index changes that emerge
            from the coupled dynamics.
          </p>
        </div>
      </div>
    </section>
  );
}
