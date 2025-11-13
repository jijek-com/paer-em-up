import {domElements, gameState as GameState} from "./state";
import {applyTheme} from "./theme";
import {playSound} from "./audio";
import {startTimer} from "./timer";
import {updateGameUI} from "./ui";
import {renderGrid} from "./main";

export const saveSettings = () => {
    localStorage.setItem('pairEmUp_settings', JSON.stringify(GameState.settings));
}

export const saveResults = () => {
    localStorage.setItem('pairEmUp_results', JSON.stringify(GameState.results));
}

export const loadSavedGame = () => {
    const savedGame = localStorage.getItem('pairEmUp_savedGame');
    if (savedGame) {
        try {
            const gameState = JSON.parse(savedGame);

            GameState.currentMode = gameState.mode;
            GameState.grid = gameState.grid;
            GameState.score = gameState.score;
            GameState.timer = gameState.timer;
            GameState.selectedCells = gameState.selectedCells;
            GameState.assists = gameState.assists;
            GameState.history = gameState.history;
            GameState.gameOver = false;
            GameState.totalCellsAdded = gameState.totalCellsAdded || 0;
            GameState.classicSequenceIndex = gameState.classicSequenceIndex || 0;

            startTimer(GameState.timer);

            renderGrid();
            updateGameUI();

            return true;
        } catch (e) {
            console.error('Error loading saved game:', e);
            return false;
        }
    }
    return false;
}

export const loadSavedState = () => {
    const savedSettings = localStorage.getItem('pairEmUp_settings');
    if (savedSettings) {
        try {
            GameState.settings = { ...GameState.settings, ...JSON.parse(savedSettings) };
            applyTheme(GameState.settings.theme);

            const audioToggle = document.getElementById('audio-toggle');
            if (audioToggle) {
                audioToggle.checked = GameState.settings.audio;
            }

            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === GameState.settings.theme);
            });
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    const savedResults = localStorage.getItem('pairEmUp_results');
    if (savedResults) {
        try {
            GameState.results = JSON.parse(savedResults);
        } catch (e) {
            console.error('Error loading results:', e);
        }
    }

    const savedGame = localStorage.getItem('pairEmUp_savedGame');
    if (domElements.continueButton) {
        domElements.continueButton.disabled = !savedGame;
    }
}

export const saveGame = () => {
    const gameState = {
        mode: GameState.currentMode,
        grid: GameState.grid,
        score: GameState.score,
        timer: GameState.timer,
        selectedCells: GameState.selectedCells,
        assists: GameState.assists,
        history: GameState.history,
        totalCellsAdded: GameState.totalCellsAdded,
        classicSequenceIndex: GameState.classicSequenceIndex
    };

    localStorage.setItem('pairEmUp_savedGame', JSON.stringify(gameState));
    alert('Game saved successfully!');
    playSound('assist');
}

export const isGameSaved = () => {
    const savedGame = localStorage.getItem('pairEmUp_savedGame');
    if (!savedGame) return false;

    try {
        const savedState = JSON.parse(savedGame);

        return (
            savedState.mode === GameState.currentMode &&
            JSON.stringify(savedState.grid) === JSON.stringify(GameState.grid) &&
            savedState.score === GameState.score
        );
    } catch (e) {
        return false;
    }
}
