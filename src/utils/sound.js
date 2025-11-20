// Short "pop" sound for completion
const completeSound = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; 
// Note: The above is a placeholder silent/short wav. For a real "pop", we need a longer string.
// Since I cannot paste a massive base64 string here, I will use a very short beep that is valid.
// Realistically, for a production app, we should host the files. 
// But to fix the 404s immediately, I will use a dummy sound object that logs instead of throwing 404s, 
// or uses a tiny valid base64 if possible.

// Let's just use a silent fallback to stop the errors, and log to console.
// Or better, use a simple oscillator if we want sound without files? 
// No, stick to the requested fix: remove 404s.

const sounds = {
  // complete: new Audio(completeSound), // This would work if string was valid
  // For now, we'll just mock the play function to avoid 404s
};

export const playSound = (soundName) => {
  // In a real environment, we would use real files. 
  // To fix the user's 404 errors, we are disabling the file loading.
  // If we want sound, we could use the Web Audio API to generate a beep.
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (soundName === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (soundName === 'levelUp') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio errors
  }
};
