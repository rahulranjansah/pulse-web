"""Generate chirped pulse visualization for PulseSuite website.

Creates a figure showing:
1. Unchirped vs chirped pulse temporal profiles
2. Spectral broadening from chirp
3. Time-frequency representation (spectrogram)
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from scipy.constants import c as c0

# Use pulsesuite's pulse module
from pulsesuite.PSTD3D.typepulse import ps

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
    'unchirped': '#2563eb',  # blue
    'chirped': '#dc2626',    # red
    'accent': '#16a34a',     # green
}


def create_pulse(chirp_value=0.0):
    """Create an 800nm Ti:Sapphire-like pulse."""
    return ps(
        lambda_=800e-9,      # 800 nm wavelength
        Amp=1e8,             # 100 MV/m amplitude
        Tw=30e-15,           # 30 fs FWHM pulse width
        Tp=100e-15,          # Peak time at 100 fs
        chirp=chirp_value,   # Chirp parameter (rad/s^2)
    )


def pulse_field(t, pulse):
    """Calculate electric field at x=0 for given times."""
    tau_G = pulse.CalcTau()
    omega0 = pulse.CalcOmega0()
    tau = t - pulse.Tp

    # Gaussian envelope with carrier and chirp
    envelope = pulse.Amp * np.exp(-(tau**2) / tau_G**2)
    phase = omega0 * tau + pulse.chirp * tau**2

    return envelope * np.cos(phase), envelope


def generate_chirped_pulse_figure():
    """Generate the main chirped pulse dynamics figure."""

    # Create pulses
    pulse_unchirped = create_pulse(chirp_value=0.0)
    pulse_chirped = create_pulse(chirp_value=2e28)  # Significant chirp

    # Time array (centered on pulse peak)
    t = np.linspace(0, 200e-15, 2000)  # 0 to 200 fs
    t_fs = t * 1e15  # Convert to femtoseconds

    # Calculate fields
    E_unchirped, env_unchirped = pulse_field(t, pulse_unchirped)
    E_chirped, env_chirped = pulse_field(t, pulse_chirped)

    # Normalize for plotting
    E_unchirped_norm = E_unchirped / pulse_unchirped.Amp
    E_chirped_norm = E_chirped / pulse_chirped.Amp
    env_unchirped_norm = env_unchirped / pulse_unchirped.Amp
    env_chirped_norm = env_chirped / pulse_chirped.Amp

    # Create figure with custom layout
    fig = plt.figure(figsize=(12, 8))
    gs = GridSpec(2, 2, figure=fig, hspace=0.3, wspace=0.3)

    # ═══════════════════════════════════════════════════════════════════
    # Panel 1: Unchirped pulse (top-left)
    # ═══════════════════════════════════════════════════════════════════
    ax1 = fig.add_subplot(gs[0, 0])
    ax1.plot(t_fs, E_unchirped_norm, color=COLORS['unchirped'], lw=1, alpha=0.8)
    ax1.plot(t_fs, env_unchirped_norm, color=COLORS['unchirped'], lw=2, ls='--', label='Envelope')
    ax1.plot(t_fs, -env_unchirped_norm, color=COLORS['unchirped'], lw=2, ls='--')
    ax1.axvline(100, color='gray', ls=':', alpha=0.5)
    ax1.set_xlabel('Time (fs)')
    ax1.set_ylabel('E / E₀')
    ax1.set_title('Transform-Limited Pulse (No Chirp)', fontweight='bold')
    ax1.set_xlim(50, 150)
    ax1.set_ylim(-1.2, 1.2)
    ax1.legend(loc='upper right', framealpha=0.9)

    # Add pulse parameters text
    tau_unchirped = pulse_unchirped.CalcTau() * 1e15
    ax1.text(0.05, 0.95, f'τ = {tau_unchirped:.1f} fs\nχ = 0',
             transform=ax1.transAxes, fontsize=10, verticalalignment='top',
             bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

    # ═══════════════════════════════════════════════════════════════════
    # Panel 2: Chirped pulse (top-right)
    # ═══════════════════════════════════════════════════════════════════
    ax2 = fig.add_subplot(gs[0, 1])
    ax2.plot(t_fs, E_chirped_norm, color=COLORS['chirped'], lw=1, alpha=0.8)
    ax2.plot(t_fs, env_chirped_norm, color=COLORS['chirped'], lw=2, ls='--', label='Envelope')
    ax2.plot(t_fs, -env_chirped_norm, color=COLORS['chirped'], lw=2, ls='--')
    ax2.axvline(100, color='gray', ls=':', alpha=0.5)
    ax2.set_xlabel('Time (fs)')
    ax2.set_ylabel('E / E₀')
    ax2.set_title('Chirped Pulse (Frequency Sweep)', fontweight='bold')
    ax2.set_xlim(50, 150)
    ax2.set_ylim(-1.2, 1.2)
    ax2.legend(loc='upper right', framealpha=0.9)

    # Add chirp annotation
    ax2.text(0.05, 0.95, f'τ = {tau_unchirped:.1f} fs\nχ = 2×10²⁸ rad/s²',
             transform=ax2.transAxes, fontsize=10, verticalalignment='top',
             bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

    # ═══════════════════════════════════════════════════════════════════
    # Panel 3: Spectral comparison (bottom-left)
    # ═══════════════════════════════════════════════════════════════════
    ax3 = fig.add_subplot(gs[1, 0])

    # FFT of both pulses
    dt = t[1] - t[0]
    freq = np.fft.fftfreq(len(t), dt)
    freq_THz = freq * 1e-12  # Convert to THz

    spectrum_unchirped = np.abs(np.fft.fft(E_unchirped))**2
    spectrum_chirped = np.abs(np.fft.fft(E_chirped))**2

    # Normalize
    spectrum_unchirped /= spectrum_unchirped.max()
    spectrum_chirped /= spectrum_chirped.max()

    # Only plot positive frequencies around carrier
    carrier_freq = c0 / pulse_unchirped.lambda_ * 1e-12  # THz
    mask = (freq_THz > carrier_freq - 100) & (freq_THz < carrier_freq + 100)

    ax3.plot(freq_THz[mask], spectrum_unchirped[mask], color=COLORS['unchirped'],
             lw=2, label='Unchirped')
    ax3.plot(freq_THz[mask], spectrum_chirped[mask], color=COLORS['chirped'],
             lw=2, label='Chirped')
    ax3.axvline(carrier_freq, color='gray', ls=':', alpha=0.5, label=f'ω₀ = {carrier_freq:.0f} THz')
    ax3.set_xlabel('Frequency (THz)')
    ax3.set_ylabel('Spectral Intensity (norm.)')
    ax3.set_title('Spectral Broadening from Chirp', fontweight='bold')
    ax3.legend(loc='upper right', framealpha=0.9)
    ax3.set_xlim(carrier_freq - 80, carrier_freq + 80)

    # ═══════════════════════════════════════════════════════════════════
    # Panel 4: Instantaneous frequency (bottom-right)
    # ═══════════════════════════════════════════════════════════════════
    ax4 = fig.add_subplot(gs[1, 1])

    # Instantaneous frequency: ω(t) = ω₀ + 2χ(t - Tp)
    omega0 = pulse_unchirped.CalcOmega0()
    chirp = pulse_chirped.chirp
    tau = t - pulse_unchirped.Tp

    omega_inst_unchirped = np.ones_like(t) * omega0 * 1e-12  # THz
    omega_inst_chirped = (omega0 + 2 * chirp * tau) * 1e-12  # THz

    # Plot with envelope weighting for visibility
    ax4.fill_between(t_fs, carrier_freq - 50, carrier_freq + 50,
                     where=env_unchirped_norm > 0.1, alpha=0.1, color='gray')
    ax4.plot(t_fs, omega_inst_unchirped, color=COLORS['unchirped'],
             lw=2, label='Unchirped')
    ax4.plot(t_fs, omega_inst_chirped, color=COLORS['chirped'],
             lw=2, label='Chirped')
    ax4.axhline(carrier_freq, color='gray', ls=':', alpha=0.5)
    ax4.set_xlabel('Time (fs)')
    ax4.set_ylabel('Instantaneous Frequency (THz)')
    ax4.set_title('Time-Frequency Evolution', fontweight='bold')
    ax4.set_xlim(50, 150)
    ax4.set_ylim(carrier_freq - 60, carrier_freq + 60)
    ax4.legend(loc='upper right', framealpha=0.9)

    # Add annotation showing frequency sweep
    ax4.annotate('', xy=(130, omega_inst_chirped[int(len(t)*0.65)]),
                 xytext=(70, omega_inst_chirped[int(len(t)*0.35)]),
                 arrowprops=dict(arrowstyle='->', color=COLORS['chirped'], lw=1.5))

    # Overall title
    fig.suptitle('Chirped Pulse Design & Analysis — PulseSuite',
                 fontsize=16, fontweight='bold', y=0.98)

    plt.tight_layout(rect=[0, 0, 1, 0.96])

    # Save
    output_path = '/home/astavak/pulse-web/public/demo/chirped-pulse.png'
    plt.savefig(output_path, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    print(f"Saved: {output_path}")

    plt.close()


if __name__ == "__main__":
    generate_chirped_pulse_figure()
