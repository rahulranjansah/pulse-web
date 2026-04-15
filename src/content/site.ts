/**
 * Single source of truth for all site copy and links.
 *
 * Edit this file to change wording, links, or feature lists.
 * Components import from here so you never touch JSX to update copy.
 */

export const site = {
  name: "PulseSuite",
  tagline: "Ultrafast Photonics Simulation Platform",
  description:
    "End-to-end simulation software for designing ultrafast laser systems, quantum photonic devices, and next-generation optoelectronic components.",

  // External links
  links: {
    technology: "#technology", // Internal technology overview
    contact: "#contact",
    demo: "#demo",
    docs: "https://pulsesuite0.readthedocs.io",
  },

  // Hero section
  hero: {
    eyebrow: "Quantum-Accurate · GPU-Accelerated · Production-Ready",
    headline: "Design at the Quantum-Classical Boundary",
    subhead:
      "PulseSuite is the only simulation platform that couples 3D Maxwell electromagnetics with Semiconductor Bloch Equations — delivering quantum-accurate carrier dynamics and light propagation in a single, self-consistent solver.",
    primaryCta: { label: "Request a Demo", href: "#contact" },
    secondaryCta: { label: "See It In Action", href: "#demo" },
  },

  // Value proposition stats
  stats: [
    { value: "3D", label: "Full-wave Maxwell solver" },
    { value: "fs", label: "Femtosecond time resolution" },
    { value: "GPU", label: "CUDA-accelerated" },
    { value: "Self-consistent", label: "Quantum + EM coupling" },
  ],

  // Feature cards - differentiated from competitors
  features: [
    {
      title: "Full 3D Electromagnetic Propagation",
      body: "Pseudo-spectral time-domain Maxwell solver with leapfrog integration. Simulate pulse propagation through complex 3D structures with spectral accuracy and automatic CFL stability.",
      icon: "3d",
    },
    {
      title: "Chirped Pulse Design & Analysis",
      body: "Engineer ultrafast chirped pulses with precise control over temporal and spectral profiles. Model pulse compression, stretching, and nonlinear phase evolution in dispersive media.",
      icon: "pulse",
    },
    {
      title: "Quantum Energy Transfer Dynamics",
      body: "Track energy flow between light fields and quantum carriers in real-time. Visualize absorption, stimulated emission, and coherent energy exchange at the femtosecond scale.",
      icon: "energy",
    },
    {
      title: "Self-Consistent Maxwell + SBE Coupling",
      body: "The only platform solving 3D Maxwell equations with Semiconductor Bloch Equations at every timestep. Quantum carrier dynamics and light propagation evolve together — no decoupling.",
      icon: "physics",
    },
    {
      title: "Many-Body Coulomb & Phonon Physics",
      body: "Exciton correlations, band-gap renormalization, carrier screening, and LO/LA phonon scattering. Model realistic thermalization and carrier relaxation in nanostructures.",
      icon: "quantum",
    },
    {
      title: "GPU-Accelerated Python",
      body: "Built on NumPy, Numba, and CuPy. Run on NVIDIA GPUs with one flag. Integrates with PyTorch, JAX, and modern ML pipelines. No legacy Fortran.",
      icon: "gpu",
    },
  ],

  // Use cases / applications
  useCases: [
    {
      title: "Silicon Photonics & PICs",
      description: "Design modulators, detectors, and waveguide structures with quantum-accurate carrier dynamics for next-gen photonic integrated circuits.",
      industries: ["Data Centers", "Telecom", "AI Infrastructure"],
    },
    {
      title: "Quantum Light Sources",
      description: "Simulate single-photon emitters, quantum dots, and entangled photon sources with full many-body physics and electromagnetic feedback.",
      industries: ["Quantum Computing", "Quantum Communication", "Sensing"],
    },
    {
      title: "Ultrafast Laser Systems",
      description: "Model pulse propagation, carrier excitation, and nonlinear optical effects in semiconductor gain media and saturable absorbers.",
      industries: ["Laser Manufacturing", "Medical Devices", "Scientific Instruments"],
    },
    {
      title: "Optoelectronic Devices",
      description: "Analyze LEDs, photodetectors, and solar cells with self-consistent optical and electronic transport simulations.",
      industries: ["Consumer Electronics", "Automotive", "Renewable Energy"],
    },
  ],

  // Comparison with competitors
  comparison: {
    headline: "Why Teams Choose PulseSuite",
    description: "Existing tools solve electromagnetics OR quantum physics. PulseSuite solves both — together.",
    competitors: [
      {
        name: "Ansys Lumerical",
        limitation: "FDTD for passive photonics — no quantum carrier dynamics",
      },
      {
        name: "Synopsys RSoft",
        limitation: "Waveguide modes and gratings — no many-body semiconductor physics",
      },
      {
        name: "COMSOL",
        limitation: "General multiphysics — no Semiconductor Bloch Equations",
      },
    ],
    pulsesuite: "Full Maxwell + SBE coupling with Coulomb, phonons, and screening — in one solver",
  },

  // Call to action section
  cta: {
    headline: "Ready to simulate at the quantum-classical boundary?",
    subhead: "Join leading research teams and photonics companies using PulseSuite to design the next generation of ultrafast and quantum photonic devices.",
    primaryCta: { label: "Request a Demo", href: "#contact" },
    secondaryCta: { label: "Contact Sales", href: "#contact" },
  },

  // Contact / demo request section
  contact: {
    headline: "Get Started with PulseSuite",
    subhead: "Request a demo or talk to our team about your simulation needs.",
    email: "contact@pulsesuite.io", // TODO: Update with real email
    calendly: "", // TODO: Add calendly link if available
  },

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} PulseSuite. All rights reserved.`,
    tagline: "Ultrafast Photonics Simulation Platform",
  },

  // Demo section - placeholder for simulation outputs
  demo: {
    headline: "See PulseSuite in Action",
    subhead: "Visualize ultrafast pulse propagation, energy transfer dynamics, and 3D field evolution in real semiconductor structures.",
    // TODO: Add paths to simulation images/videos
    items: [
      {
        title: "3D Electric Field Propagation",
        description: "Watch the full 3D evolution of electromagnetic fields through a quantum structure with absorbing boundaries.",
        media: "/demo/3d-field-propagation.mp4", // TODO: Add actual file
        type: "video",
      },
      {
        title: "Chirped Pulse Dynamics",
        description: "Ultrafast chirped pulse compression and reshaping as it interacts with dispersive quantum media.",
        media: "/demo/chirped-pulse.png", // TODO: Add actual file
        type: "image",
      },
      {
        title: "Quantum Energy Transfer",
        description: "Real-time energy flow between optical fields and carrier populations — absorption, emission, and coherent exchange.",
        media: "/demo/energy-transfer.png", // TODO: Add actual file
        type: "image",
      },
    ],
  },
};
