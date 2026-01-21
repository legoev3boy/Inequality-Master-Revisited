
class SoundService {
  private successAudio: HTMLAudioElement | null = null;
  private failureAudio: HTMLAudioElement | null = null;

  constructor() {
    // Using placeholder URLs for short UI sounds
    this.successAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    this.failureAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  }

  playSuccess() {
    this.successAudio?.play().catch(() => {});
  }

  playFailure() {
    this.failureAudio?.play().catch(() => {});
  }
}

export const soundService = new SoundService();
