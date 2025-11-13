import { classicSequence, domElements, gameState as GameState } from "./state";

import { createDOMStructure } from "./createDom";
import { loadSavedState} from "./saveGame";
import {handleCellClick, showScreen} from "./gameScreen";

import { applyTheme } from "./theme";
import { setupEventListeners, shuffleArray } from "./events";
import { playSound, setupAudio } from "./audio";
import { updateGameUI } from "./ui";
import { startTimer } from "./timer";

const initGame = () => {
    createDOMStructure();

    loadSavedState();

    setupEventListeners();

    showScreen('start');

    setupAudio();

    applyTheme(GameState.settings.theme);
}

export const renderGrid = () => {
    domElements.gameGrid.innerHTML = '';

    for (let i = 0; i < GameState.grid.length; i++) {

        for (let j = 0; j < GameState.grid[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i.toString();
            cell.dataset.col = j.toString();

            if (GameState.grid[i][j] !== null) {
                cell.textContent = GameState.grid[i][j];
                cell.addEventListener('click', handleCellClick);
            } else {
                cell.classList.add('empty');
            }

            if (GameState.selectedCells.some(c => c.row === i && c.col === j)) {
                cell.classList.add('selected');
            }

            domElements.gameGrid.appendChild(cell);
        }
    }
}

const initializeGrid = (mode) => {
    GameState.grid = [];
    GameState.classicSequenceIndex = 0;

    if (mode === 'classic') {
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const index = i * 9 + j;
                if (index < classicSequence.length) {
                    row.push(classicSequence[index]);
                    GameState.classicSequenceIndex = (index + 1) % classicSequence.length;
                } else {
                    row.push(null);
                }
            }
            GameState.grid.push(row);
        }
    } else if (mode === 'random') {
        const shuffledSequence = [...classicSequence];
        shuffleArray(shuffledSequence);

        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const index = i * 9 + j;
                if (index < shuffledSequence.length) {
                    row.push(shuffledSequence[index]);
                } else {
                    row.push(null);
                }
            }
            GameState.grid.push(row);
        }
    } else if (mode === 'chaotic') {
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                row.push(Math.floor(Math.random() * 9) + 1);
            }
            GameState.grid.push(row);
        }
    }

    GameState.totalCellsAdded = 27;

    renderGrid();
}

export const startGame = (mode) => {
    GameState.currentMode = mode;
    GameState.score = 0;
    GameState.timer = 0;
    GameState.selectedCells = [];
    GameState.gameOver = false;
    GameState.history = [];
    GameState.totalCellsAdded = 0;
    GameState.classicSequenceIndex = 0;

    Object.keys(GameState.assists).forEach(key => {
        GameState.assists[key].uses = 0;
    });

    GameState.assists.revert.uses = 0;

    initializeGrid(mode);

    updateGameUI();

    startTimer();

    showScreen('game');
    playSound('assist');
}

document.addEventListener('DOMContentLoaded', initGame);
