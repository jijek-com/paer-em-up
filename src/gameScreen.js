import { showModal } from "./modals";
import {domElements, gameState as GameState} from "./state";
import {renderGrid} from "./main";
import {updateGameUI} from "./ui";
import {saveResults} from "./saveGame";
import {formatTime} from "./timer";
import {playSound} from "./audio";
import {findValidMoves} from "./events";

export const showScreen = (screenName) => {
    Object.values(domElements.screens).forEach(screen => {
        screen.classList.remove('active');
    });

    domElements.screens[screenName].classList.add('active');
    GameState.currentScreen = screenName;
}

export const buildGameScreen = () => {
    const gameScreen = domElements.screens.game;

    const gameHeader = document.createElement('div');
    gameHeader.className = 'game-header';

    domElements.modeInfo = document.createElement('div');
    domElements.modeInfo.className = 'mode-info';
    domElements.modeInfo.textContent = `Mode: ${GameState.currentMode || 'Classic'}`;
    gameHeader.appendChild(domElements.modeInfo);

    domElements.scoreDisplay = document.createElement('div');
    domElements.scoreDisplay.className = 'score-display';
    domElements.scoreDisplay.textContent = 'Score: 0 / 100';
    gameHeader.appendChild(domElements.scoreDisplay);

    domElements.timerDisplay = document.createElement('div');
    domElements.timerDisplay.className = 'timer-display';
    domElements.timerDisplay.textContent = '00:00';
    gameHeader.appendChild(domElements.timerDisplay);

    gameScreen.appendChild(gameHeader);

    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    progressContainer.appendChild(progressBar);

    gameScreen.appendChild(progressContainer);

    const gameControls = document.createElement('div');
    gameControls.className = 'game-controls';

    const controlButtonsConfig = [
        { id: 'reset', text: 'Reset' },
        { id: 'save', text: 'Save Game' },
        { id: 'continue', text: 'Continue' },
        { id: 'exit', text: 'Back to Menu' }
    ];

    domElements.controlButtons = {};

    controlButtonsConfig.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'control-btn';
        button.id = `${btn.id}-btn`;
        button.textContent = btn.text;
        gameControls.appendChild(button);
        domElements.controlButtons[btn.id] = button;
    });

    gameScreen.appendChild(gameControls);

    domElements.gameGrid = document.createElement('div');
    domElements.gameGrid.className = 'game-grid';
    gameScreen.appendChild(domElements.gameGrid);

    const assistTools = document.createElement('div');
    assistTools.className = 'assist-tools';

    const assistButtonsConfig = [
        { id: 'hints', text: 'Hints', counter: true },
        { id: 'revert', text: 'Revert', counter: true },
        { id: 'addNumbers', text: 'Add Numbers', counter: true },
        { id: 'shuffle', text: 'Shuffle', counter: true },
        { id: 'eraser', text: 'Eraser', counter: true }
    ];

    domElements.assistButtons = {};

    assistButtonsConfig.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'assist-btn';
        button.id = `${btn.id}-btn`;

        const textSpan = document.createElement('span');
        textSpan.textContent = btn.text;
        button.appendChild(textSpan);

        if (btn.counter) {
            const counter = document.createElement('span');
            counter.className = 'usage-counter';
            counter.id = `${btn.id}-counter`;
            counter.textContent = '∞';
            button.appendChild(counter);
        }

        assistTools.appendChild(button);
        domElements.assistButtons[btn.id] = button;
    });

    gameScreen.appendChild(assistTools);

    const gameSettingsBtn = document.createElement('button');
    gameSettingsBtn.className = 'settings-btn';
    gameSettingsBtn.textContent = 'Settings';
    gameSettingsBtn.style.margin = '20px auto 0';
    gameSettingsBtn.style.display = 'flex';
    gameScreen.appendChild(gameSettingsBtn);

    gameSettingsBtn.addEventListener('click', () => {
        showModal('settings');
    });
}

export const checkGameStatus = () => {
    if (GameState.score >= 100) {
        endGame(true);
        return;
    }

    const validMoves = findValidMoves();
    const allAssistsUsed = Object.values(GameState.assists).every(
        assist => assist.uses >= assist.max
    );

    if (validMoves.length === 0 && allAssistsUsed) {
        endGame(false);
        return;
    }

    if (GameState.grid.length >= 50) {
        endGame(false);
        return;
    }
}

export const removeNumber = (row, col) => {
    if (GameState.grid[row][col] !== null) {
        GameState.grid[row][col] = null;
        renderGrid();
    }
}

export const areCellsConnected = (cell1, cell2) => {
    if (cell1.row === cell2.row && cell1.col === cell2.col) {
        return false;
    }

    if ((Math.abs(cell1.row - cell2.row) === 1 && cell1.col === cell2.col) ||
        (Math.abs(cell1.col - cell2.col) === 1 && cell1.row === cell2.row)) {
        return true;
    }

    if (cell1.row === cell2.row) {
        const minCol = Math.min(cell1.col, cell2.col);
        const maxCol = Math.max(cell1.col, cell2.col);

        for (let col = minCol + 1; col < maxCol; col++) {
            if (GameState.grid[cell1.row][col] !== null) {
                return false;
            }
        }
        return true;
    }

    if (cell1.col === cell2.col) {
        const minRow = Math.min(cell1.row, cell2.row);
        const maxRow = Math.max(cell1.row, cell2.row);

        for (let row = minRow + 1; row < maxRow; row++) {
            if (GameState.grid[row][cell1.col] !== null) {
                return false;
            }
        }
        return true;
    }

    if (Math.abs(cell1.row - cell2.row) === 1) {
        const topCell = cell1.row < cell2.row ? cell1 : cell2;
        const bottomCell = cell1.row < cell2.row ? cell2 : cell1;

        if (topCell.col === 8 && bottomCell.col === 0) {
            return true;
        }
    }

    return false;
}

export const highlightInvalidPair = () => {
    GameState.selectedCells.forEach(cell => {
        const cellElement = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
        if (cellElement) {
            cellElement.classList.add('invalid-pair');
            setTimeout(() => {
                cellElement.classList.remove('invalid-pair');
            }, 500);
        }
    });
}

export const resetHintsCounter = () => {
    const hintCounter = document.getElementById('hints-counter');
    if (hintCounter) {
        hintCounter.textContent = '∞';
    }
}

export const tryPair = () => {
    const [cell1, cell2] = GameState.selectedCells;
    const num1 = GameState.grid[cell1.row][cell1.col];
    const num2 = GameState.grid[cell2.row][cell2.col];

    if (!areCellsConnected(cell1, cell2)) {
        playSound('invalid');
        highlightInvalidPair();
        GameState.selectedCells = [];
        renderGrid();
        return;
    }

    let points = 0;
    let isValid = false;

    if (num1 === 5 && num2 === 5) {
        points = 3;
        isValid = true;
    } else if (num1 === num2) {
        points = 1;
        isValid = true;
    } else if (num1 + num2 === 10) {
        points = 2;
        isValid = true;
    }

    if (isValid) {
        playSound('valid');

        GameState.history.push({
            grid: JSON.parse(JSON.stringify(GameState.grid)),
            score: GameState.score,
            selectedCells: [...GameState.selectedCells]
        });

        GameState.score += points;

        GameState.grid[cell1.row][cell1.col] = null;
        GameState.grid[cell2.row][cell2.col] = null;

        GameState.selectedCells = [];
        GameState.assists.revert.uses = 0;

        updateGameUI();
        renderGrid();

        checkGameStatus();
        resetHintsCounter();
    } else {
        playSound('invalid');
        highlightInvalidPair();
        GameState.selectedCells = [];
        renderGrid();
        resetHintsCounter();
    }
}

export const endGame = (isWin) => {
    GameState.gameOver = true;
    clearInterval(GameState.timerInterval);

    const result = {
        mode: GameState.currentMode,
        score: GameState.score,
        time: formatTime(GameState.timer),
        win: isWin,
        timestamp: new Date().toISOString()
    };

    GameState.results.unshift(result);
    if (GameState.results.length > 5) {
        GameState.results.pop();
    }

    saveResults();

    const outcomeMessage = document.getElementById('outcome-message');
    const outcomeDetails = document.getElementById('outcome-details');

    if (isWin) {
        outcomeMessage.textContent = 'Congratulations! You Won!';
        outcomeMessage.style.color = 'var(--success-color)';
        playSound('win');
    } else {
        outcomeMessage.textContent = 'Game Over';
        outcomeMessage.style.color = 'var(--accent-color)';
        playSound('lose');
    }

    const p1 = document.createElement('p');
    p1.textContent = `Score: ${GameState.score}`;

    const p2 = document.createElement('p');
    p2.textContent = `Time: ${formatTime(GameState.timer)}`;

    const p3 = document.createElement('p');
    p3.textContent = `Mode: ${GameState.currentMode}`;

    outcomeDetails.appendChild(p1);
    outcomeDetails.appendChild(p2);
    outcomeDetails.appendChild(p3);

    showModal('outcome');
}

export const updateAssistButtons = () => {

    const revertCounter = document.getElementById('revert-counter');
    if (revertCounter) {
        revertCounter.textContent = `${GameState.assists.revert.uses}/${GameState.assists.revert.max}`;
    }
    domElements.assistButtons.revert.disabled = GameState.assists.revert.uses >= GameState.assists.revert.max;


    const addNumbersCounter = document.getElementById('addNumbers-counter');
    if (addNumbersCounter) {
        addNumbersCounter.textContent = `${GameState.assists.addNumbers.uses}/${GameState.assists.addNumbers.max}`;
    }

    domElements.assistButtons.addNumbers.disabled =
        GameState.assists.addNumbers.uses >= GameState.assists.addNumbers.max ||
        GameState.grid.length >= 50;

    const shuffleCounter = document.getElementById('shuffle-counter');

    if (shuffleCounter) {
        shuffleCounter.textContent = `${GameState.assists.shuffle.uses}/${GameState.assists.shuffle.max}`;
    }
    domElements.assistButtons.shuffle.disabled = GameState.assists.shuffle.uses >= GameState.assists.shuffle.max;

    const eraserCounter = document.getElementById('eraser-counter');
    if (eraserCounter) {
        eraserCounter.textContent = `${GameState.assists.eraser.uses}/${GameState.assists.eraser.max}`;
    }
    domElements.assistButtons.eraser.disabled = GameState.assists.eraser.uses >= GameState.assists.eraser.max;
}

export const handleCellClick = (e) => {
    if (GameState.gameOver) return;

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    if (isNaN(row) || isNaN(col)) {
        console.error('Invalid cell coordinates:', row, col);
        return;
    }

    if (row >= GameState.grid.length || !GameState.grid[row]) {
        console.error('Row does not exist in grid:', row, 'Grid length:', GameState.grid.length);
        return;
    }

    if (col >= GameState.grid[row].length || GameState.grid[row][col] === undefined) {
        console.error('Column does not exist in row:', col, 'Row length:', GameState.grid[row].length);
        return;
    }

    if (GameState.grid[row][col] === null) return;

    if (GameState.eraserActive) {
        removeNumber(row, col);
        GameState.eraserActive = false;
        updateAssistButtons();
        return;
    }

    const alreadySelected = GameState.selectedCells.some(c => c.row === row && c.col === col);

    if (alreadySelected) {
        GameState.selectedCells = GameState.selectedCells.filter(
            c => !(c.row === row && c.col === col)
        );
        playSound('select');
    } else {
        if (GameState.selectedCells.length < 2) {
            GameState.selectedCells.push({ row, col });
            playSound('select');
        }

        if (GameState.selectedCells.length === 2) {
            setTimeout(tryPair, 300);
        }
    }

    renderGrid();
}
