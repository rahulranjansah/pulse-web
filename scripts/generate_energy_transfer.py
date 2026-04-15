"""Generate quantum energy transfer visualization for PulseSuite website.

Simulates ultrafast light-matter interaction showing:
1. Electric field evolution
2. Carrier population dynamics (electron/hole)
3. Energy transfer between field and carriers
4. Polarization response
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from scipy.constants import c as c0, hbar, e as e_charge

# Set up professional styling
plt.style.use('default')
plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.size': 11,
    'axes.labelsize': 12,
    'axes.titlesize': 13,
    'figure.facecolor': 'white',
    'axes.facecolor': 'white',
    'axes.grid': True,
    'grid.alpha': 0.3,
    'axes.spines.top': False,
    'axes.spines.right': False,
})

# Color palette
COLORS = {
    'field': '#2563eb',      # blue - electric field
    'electron': '#dc2626',   # red - electron population
    'hole': '#16a34a',       # green - hole population
    'polarization': '#9333ea', # purple - polarization
    'energy': '#f59e0b',     # amber - energy
}


def simulate_sbe_dynamics():
    """Simulate simplified SBE dynamics for visualization.

    This is a simplified 2-level model capturing the essential physics
    of the full k-resolved Semiconductor Bloch Equations.
    """

    # Time parameters
    Nt = 2000
    dt = 0.5e-15  # 0.5 fs timestep
    t = np.arange(Nt) * dt
    t_fs = t * 1e15

    # Pulse parameters (800 nm, 30 fs)
    lambda0 = 800e-9
    omega0 = 2 * np.pi * c0 / lambda0
    Tw = 30e-15
    Tp = 150e-15  # Peak at 150 fs
    E0 = 5e7  # 50 MV/m - moderate field

    # Material parameters (GaAs-like)
    Eg = 1.42 * e_charge  # Band gap in Joules
    T2 = 50e-15  # Dephasing time (50 fs)
    T1 = 1e-12   # Population relaxation (1 ps)
    dcv = 5e-29  # Dipole moment (C·m)

    # Detuning (resonant excitation)
    omega_gap = Eg / hbar
    delta = omega0 - omega_gap

    # Initialize arrays
    ne = np.zeros(Nt)  # Electron population
    nh = np.zeros(Nt)  # Hole population
    p_real = np.zeros(Nt)  # Polarization (real part)
    p_imag = np.zeros(Nt)  # Polarization (imag part)
    E_field = np.zeros(Nt)  # Electric field
    energy_field = np.zeros(Nt)  # Field energy
    energy_carriers = np.zeros(Nt)  # Carrier energy

    # Rabi frequency prefactor
    Omega_prefactor = dcv / hbar

    for n in range(1, Nt):
        # Time
        tn = t[n]
        tau = tn - Tp

        # Gaussian pulse envelope
        tau_G = Tw / np.sqrt(2 * np.log(2))
        envelope = np.exp(-(tau**2) / tau_G**2)
        E_field[n] = E0 * envelope * np.cos(omega0 * tau)

        # Rabi frequency
        Omega = Omega_prefactor * E_field[n]

        # SBE time evolution (simplified 2-level)
        # d/dt p = -p/T2 - i*delta*p + i*Omega*(1 - ne - nh)
        # d/dt n = -n/T1 + 2*Im(Omega* * p)

        # RK4-like update for polarization
        inversion = 1.0 - ne[n-1] - nh[n-1]
        dp_real = -p_real[n-1] / T2 + delta * p_imag[n-1] - Omega * inversion * 0
        dp_imag = -p_imag[n-1] / T2 - delta * p_real[n-1] + Omega * inversion

        p_real[n] = p_real[n-1] + dp_real * dt
        p_imag[n] = p_imag[n-1] + dp_imag * dt

        # Population dynamics
        # Absorption rate proportional to Im(E* · P)
        absorption_rate = 2 * Omega * p_imag[n-1]
        dne = -ne[n-1] / T1 + absorption_rate
        dnh = -nh[n-1] / T1 + absorption_rate

        ne[n] = max(0, min(0.5, ne[n-1] + dne * dt))  # Clamp to physical range
        nh[n] = max(0, min(0.5, nh[n-1] + dnh * dt))

        # Energy bookkeeping
        energy_field[n] = 0.5 * E_field[n]**2  # Proportional to field intensity
        energy_carriers[n] = (ne[n] + nh[n]) * Eg  # Carrier energy

    # Normalize for plotting
    E_norm = E_field / E0
    ne_norm = ne / ne.max() if ne.max() > 0 else ne
    nh_norm = nh / nh.max() if nh.max() > 0 else nh
    p_norm = np.sqrt(p_real**2 + p_imag**2)
    p_norm = p_norm / p_norm.max() if p_norm.max() > 0 else p_norm

    return t_fs, E_norm, ne, nh, p_norm, energy_field, energy_carriers


def generate_energy_transfer_figure():
    """Generate the quantum energy transfer dynamics figure."""

    # Run simulation
    t_fs, E_field, ne, nh, polarization, E_field_energy, E_carrier_energy = simulate_sbe_dynamics()

    # Create figure
    fig = plt.figure(figsize=(12, 10))
    gs = GridSpec(3, 2, figure=fig, hspace=0.35, wspace=0.3)

    # ═══════════════════════════════════════════════════════════════════
    # Panel 1: Electric field (top-left)
    # ═══════════════════════════════════════════════════════════════════
    ax1 = fig.add_subplot(gs[0, 0])
    ax1.plot(t_fs, E_field, color=COLORS['field'], lw=1.5)
    ax1.fill_between(t_fs, E_field, alpha=0.2, color=COLORS['field'])
    ax1.axhline(0, color='gray', ls='-', alpha=0.3)
    ax1.set_xlabel('Time (fs)')
    ax1.set_ylabel('E / E₀')
    ax1.set_title('Incident Electric Field', fontweight='bold')
    ax1.set_xlim(0, 400)

    # ═══════════════════════════════════════════════════════════════════
    # Panel 2: Polarization response (top-right)
    # ═══════════════════════════════════════════════════════════════════
    ax2 = fig.add_subplot(gs[0, 1])
    ax2.plot(t_fs, polarization, color=COLORS['polarization'], lw=2)
    ax2.fill_between(t_fs, polarization, alpha=0.2, color=COLORS['polarization'])
    ax2.set_xlabel('Time (fs)')
    ax2.set_ylabel('|P| (norm.)')
    ax2.set_title('Quantum Polarization Response', fontweight='bold')
    ax2.set_xlim(0, 400)

    # ═══════════════════════════════════════════════════════════════════
    # Panel 3: Carrier populations (middle-left)
    # ═══════════════════════════════════════════════════════════════════
    ax3 = fig.add_subplot(gs[1, 0])
    ax3.plot(t_fs, ne, color=COLORS['electron'], lw=2, label='Electrons (nₑ)')
    ax3.plot(t_fs, nh, color=COLORS['hole'], lw=2, ls='--', label='Holes (nₕ)')
    ax3.fill_between(t_fs, ne, alpha=0.15, color=COLORS['electron'])
    ax3.fill_between(t_fs, nh, alpha=0.15, color=COLORS['hole'])
    ax3.set_xlabel('Time (fs)')
    ax3.set_ylabel('Population')
    ax3.set_title('Carrier Population Dynamics', fontweight='bold')
    ax3.set_xlim(0, 400)
    ax3.legend(loc='upper right', framealpha=0.9)

    # ═══════════════════════════════════════════════════════════════════
    # Panel 4: Energy transfer (middle-right)
    # ═══════════════════════════════════════════════════════════════════
    ax4 = fig.add_subplot(gs[1, 1])

    # Normalize energies for comparison
    E_field_norm = E_field_energy / E_field_energy.max() if E_field_energy.max() > 0 else E_field_energy
    E_carrier_norm = E_carrier_energy / E_carrier_energy.max() if E_carrier_energy.max() > 0 else E_carrier_energy

    ax4.plot(t_fs, E_field_norm, color=COLORS['field'], lw=2, label='Field Energy')
    ax4.plot(t_fs, E_carrier_norm, color=COLORS['energy'], lw=2, label='Carrier Energy')
    ax4.fill_between(t_fs, E_field_norm, alpha=0.15, color=COLORS['field'])
    ax4.fill_between(t_fs, E_carrier_norm, alpha=0.15, color=COLORS['energy'])
    ax4.set_xlabel('Time (fs)')
    ax4.set_ylabel('Energy (norm.)')
    ax4.set_title('Energy Transfer: Field → Carriers', fontweight='bold')
    ax4.set_xlim(0, 400)
    ax4.legend(loc='right', framealpha=0.9)

    # Add arrow showing energy flow
    ax4.annotate('', xy=(250, 0.6), xytext=(150, 0.4),
                 arrowprops=dict(arrowstyle='->', color=COLORS['energy'], lw=2))
    ax4.text(200, 0.55, 'Absorption', fontsize=10, ha='center',
             color=COLORS['energy'], fontweight='bold')

    # ═══════════════════════════════════════════════════════════════════
    # Panel 5: Combined view (bottom, spanning both columns)
    # ═══════════════════════════════════════════════════════════════════
    ax5 = fig.add_subplot(gs[2, :])

    # Plot all dynamics together
    ax5.plot(t_fs, E_field**2, color=COLORS['field'], lw=1.5, alpha=0.7, label='|E|² (Field Intensity)')
    ax5.plot(t_fs, ne * 2, color=COLORS['electron'], lw=2, label='2×nₑ (Electron Pop.)')
    ax5.plot(t_fs, polarization, color=COLORS['polarization'], lw=2, ls='--', label='|P| (Polarization)')

    ax5.set_xlabel('Time (fs)')
    ax5.set_ylabel('Amplitude (norm.)')
    ax5.set_title('Self-Consistent Light-Matter Evolution', fontweight='bold')
    ax5.set_xlim(0, 400)
    ax5.legend(loc='upper right', framealpha=0.9, ncol=3)

    # Add phase annotations
    ax5.axvspan(100, 200, alpha=0.1, color='yellow', label='_nolegend_')
    ax5.text(150, ax5.get_ylim()[1] * 0.9, 'Excitation', ha='center',
             fontsize=10, fontweight='bold', color='gray')
    ax5.axvspan(200, 400, alpha=0.1, color='green', label='_nolegend_')
    ax5.text(300, ax5.get_ylim()[1] * 0.9, 'Relaxation', ha='center',
             fontsize=10, fontweight='bold', color='gray')

    # Overall title
    fig.suptitle('Quantum Energy Transfer Dynamics — PulseSuite',
                 fontsize=16, fontweight='bold', y=0.98)

    plt.tight_layout(rect=[0, 0, 1, 0.96])

    # Save
    output_path = '/home/astavak/pulse-web/public/demo/energy-transfer.png'
    plt.savefig(output_path, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    print(f"Saved: {output_path}")

    plt.close()


if __name__ == "__main__":
    generate_energy_transfer_figure()
