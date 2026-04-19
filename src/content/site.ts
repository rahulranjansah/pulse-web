/**
 * Single source of truth for all site copy and links.
 *
 * Edit this file to change wording, links, or any visible text.
 * No component should hardcode copy — if you see text in a .tsx file
 * that feels like it should live here, move it here.
 */

export const site = {
  name: "PulseSuite",

  // One-line description used in the <title> tag and meta description.
  // Kept intentionally narrow to match our real positioning.
  tagline: "Coupled Quantum-Electromagnetic Simulation for Ultrafast Semiconductor Devices",
  description:
    "Open-source physics toolkit for designing ultrafast semiconductor laser and quantum photonic devices. Couples 3D Maxwell electromagnetics with Semiconductor Bloch Equations in a single self-consistent solver.",

  // External links. Everything visitor-facing goes through here so we
  // can swap destinations (e.g. point CTAs to a real signup form later)
  // without touching component JSX.
  links: {
    docs: "https://pulsesuite0.readthedocs.io",
    github: "https://github.com/pulsesuite0/pulsesuite",
    paper: "https://doi.org/10.1364/OE.27.023573", // Gulley & Huang 2019
  },

  // Nav bar sections. Keep this list short — long navs look unfocused
  // for a v1 marketing site.
  nav: [
    { label: "What it is", href: "#differentiators" },
    { label: "Where it fits", href: "#positioning" },
    { label: "Docs", href: "https://pulsesuite0.readthedocs.io" },
    { label: "GitHub", href: "https://github.com/pulsesuite0/pulsesuite" },
  ],

  // Hero section.
  // Tone: honest about what we are (a specialized solver), confident
  // about the differentiator (self-consistent coupling), no overclaim.
  hero: {
    // eyebrow: "Open source · LGPL · Alpha",
    headline: "Coupled quantum-electromagnetic simulation for ultrafast semiconductor devices.",
    subhead:
      "PulseSuite couples Semiconductor Bloch Equations with a 3D pseudo-spectral Maxwell solver evolved self-consistently at every timestep. Built for quantum cascade lasers, VCSELs, quantum-confined modulators, and other devices where classical FDTD and TCAD alone aren't enough.",
    primaryCta: { label: "Read the Docs", href: "https://pulsesuite0.readthedocs.io" },
    secondaryCta: { label: "View on GitHub", href: "https://github.com/pulsesuite0/pulsesuite" },
  },

  // Three differentiators — no more, no less.
  // Each one is specific enough that a physicist could verify it,
  // and broad enough that a non-physicist grasps the "so what".
  differentiators: [
    {
      title: "Self-consistent coupling, not a stitched workflow",
      body:
        "Maxwell fields drive quantum carrier transitions, and the resulting microscopic polarization feeds back into Maxwell at every timestep. Not a one-way handoff between separate solvers.",
    },
    {
      title: "Many-body semiconductor physics, built in",
      body:
        "Coulomb screening, exciton correlations, band-gap renormalization, LO/LA phonon scattering, dephasing, and DC-field transport all ported from peer-reviewed published physics.",
    },
    {
      title: "Python-native, open, GPU-ready",
      body:
        "Built on NumPy, Numba, and pyFFTW, with CuPy / Numba CUDA paths. Interoperates with PyTorch and JAX for inverse design. LGPL-3.0 open source. No legacy Fortran, no per-seat license to evaluate.",
    },
  ],

  // Honest "where it fits / where it doesn't" — mirrors the Silicon Catalyst
  // application's narrow positioning. This is a trust signal: teams who build
  // serious software know what their tool isn't.
  positioning: {
    headline: "A deep solver for a narrow, technically demanding slice.",
    lede:
      "PulseSuite is not trying to replace mainstream photonic design automation. It complements it in the specific regime where coupled quantum carrier dynamics and electromagnetic propagation materially change the answer.",
    goodFit: {
      title: "Designed for",
      items: [
        "Quantum cascade lasers (QCLs)",
        "VCSELs with full spatiotemporal dynamics",
        "Quantum-confined Stark effect modulators",
        "Photonic quantum sources and detectors",
        "High-harmonic generation in solids",
        "Ultrafast III-V device research",
      ],
    },
    badFit: {
      title: "Not the right tool for",
      items: [
        "Passive silicon photonics transceiver layout (use Lumerical or Tidy3D)",
        "DC drift-diffusion TCAD (use Sentaurus or nextnano)",
        "Ray-optics lens design (use Zemax or CODE V)",
        "Circuit-level schematic capture and tape-out",
      ],
    },
  },

  // Closing CTA — still docs-first for v1.
  cta: {
    headline: "Start with the documentation.",
    subhead:
      "Read the physics notes, run the examples, and open issues on GitHub. PulseSuite is alpha-stage open core product. Feedback from early users is what the project needs most right now.",
  },

  // Light commercial signal. Not pricing, not a tier grid — just a quiet
  // line for companies and labs who want to talk about pilots, training,
  // or on-prem support. Keeps academic users feeling welcome while signaling
  // that there's a business forming around the project.
  forTeams: {
    eyebrow: "For teams",
    headline: "Open source core · Commercial services available.",
    // Lead copy for the section. Kept as one string so it wraps naturally.
    body:
      "Today: free local install under LGPL `pip install pulsesuite`, run on your CPU or GPU. " +
      "In development: a hosted GPU runtime for teams who need 3D simulations to finish in minutes, not days.",
    // Second paragraph, sets who this section is speaking to.
    audience:
      "Research groups and companies working on QCLs, VCSELs, photonic quantum devices, or other coupled-physics problems. Join the cloud waitlist for early access, or reach out directly about pilot engagements and training.",

    // Primary CTA: waitlist for the hosted cloud product.
    // For v1 this is a pre-filled mailto — zero backend setup. When you're
    // ready to collect emails at scale, swap this href for a Formspree,
    // Tally, or Buttondown URL. No component code changes needed.
    waitlist: {
      label: "Join the cloud waitlist",
      href:
        "mailto:sahra1@furman.edu?subject=PulseSuite%20cloud%20waitlist" +
        "&body=Please%20add%20me%20to%20the%20PulseSuite%20hosted-cloud%20early-access%20waitlist.%0A%0A" +
        "Name%3A%20%0A" +
        "Affiliation%20%2F%20company%3A%20%0A" +
        "Device%20type%20or%20simulation%20use%20case%3A%20%0A",
    },

    // Secondary CTA: direct commercial inquiry for labs/companies that want
    // to start a specific pilot conversation, not just join a waitlist.
    contactEmail: "sahra1@furman.edu", // TODO: replace with real inbox before shipping
    contactLabel: "Commercial inquiry",
  },

  // Footer.
  footer: {
    blurb:
      "An alpha-stage open-source computational physics toolkit. Research lineage: Dr. Jeremy R. Gulley, Furman University.",
    tagline: "Open source core · Commercial services available",
    copyright: `© ${new Date().getFullYear()} PulseSuite contributors. Released under LGPL-3.0-or-later.`,
  },
} as const;

export type Site = typeof site;
