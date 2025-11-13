import {domElements, gameState as GameState} from "./state";

export const startTimer = (initialSeconds = 0) =>  {
    clearInterval(GameState.timerInterval);
    GameState.timer = initialSeconds;
    updateTimerDisplay();

    GameState.timerInterval = setInterval(() => {
        GameState.timer++;
        updateTimerDisplay();
    }, 1000);
}

const updateTimerDisplay = () => {
    if (domElements.timerDisplay) {
        domElements.timerDisplay.textContent = formatTime(GameState.timer);
    }
}

export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
