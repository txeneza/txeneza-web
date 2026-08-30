/**
 * Utilitário de Alerta Sonoro usando a Web Audio API nativa.
 * Gera um chime moderno, agradável e profissional em tempo real
 * sem necessidade de carregar ficheiros de áudio externos ou correr risco de 404/CORS.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const notificationSound = {
  /**
   * Verifica se o som está mutado pelo utilizador.
   */
  isMuted(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("txeneza_sound_muted") === "true";
  },

  /**
   * Altera a preferência de som mutado.
   */
  setMuted(muted: boolean): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("txeneza_sound_muted", muted ? "true" : "false");
  },

  /**
   * Toca um chime duplo suave e elegante (Dó Maior harmónico).
   */
  playChime(): void {
    if (this.isMuted()) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Frequências para o acorde Txeneza: F5 (698.46Hz) -> A5 (880Hz) -> C6 (1046.5Hz)
      const notes = [
        { freq: 587.33, start: 0.0, dur: 0.28 }, // D5
        { freq: 880.0, start: 0.08, dur: 0.35 },  // A5
        { freq: 1174.66, start: 0.16, dur: 0.45 }, // D6
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);

        // Envelope: Ataque rápido e decay exponencial suave
        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur);
      });
    } catch (err) {
      console.warn("Não foi possível reproduzir som de notificação:", err);
    }
  },
};
