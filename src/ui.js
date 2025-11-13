import { domElements, gameState as GameState } from "./state";
import { resetHintsCounter, updateAssistButtons } from "./gameScreen";

export const updateGameUI = () => {
    if (domElements.scoreDisplay) {
        domElements.scoreDisplay.textContent = `Score: ${GameState.score} / 100`;
    }

    if (domElements.modeInfo) {
        domElements.modeInfo.textContent = `Mode: ${GameState.currentMode}`;
    }

    const progressBar = document.getElementById('progress-bar');

    if (progressBar) {
        const progress = Math.min(GameState.score / 100, 1);
        progressBar.style.width = `${progress * 100}%`;
    }

    resetHintsCounter();
    updateAssistButtons();
}
