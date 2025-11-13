import { audioElements, gameState as GameState } from "./state";

let audioInitialized = false;

export const setupAudio = () => {
    if (audioInitialized) return;

    audioInitialized = true;
    
    Object.values(audioElements).forEach(audio => {
        audio.preload = 'auto';
        audio.volume = 0.7;
    });

    Object.values(audioElements).forEach(audio => {
        const handleAudioError = () => {
            console.warn(`Audio file not found: ${audio.src}`);
            audio.removeEventListener('error', handleAudioError);
            audio.removeAttribute('src');
            audio.load();
        };

        audio.addEventListener('error', handleAudioError);
    });
}

export const playSound = (sound) => {
    if (GameState.settings.audio && audioElements[sound]) {
        audioElements[sound].currentTime = 0;
        audioElements[sound].play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }
}
