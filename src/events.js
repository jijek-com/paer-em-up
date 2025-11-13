import {classicSequence, domElements, gameState as GameState} from "./state";
import {isGameSaved, loadSavedGame, saveGame, saveSettings} from "./saveGame";
import {hideModal, showModal} from "./modals";
import {updateResultsTable} from "./results";
import {renderGrid, startGame} from "./main";
import {areCellsConnected, showScreen, updateAssistButtons} from "./gameScreen";
import {updateGameUI} from "./ui";
import {playSound} from "./audio";
import {startTimer} from "./timer";

export const findValidMoves = () => {
    const moves = [];
    const cells = [];

    for (let i = 0; i < GameState.grid.length; i++) {
        for (let j = 0; j < GameState.grid[i].length; j++) {
            if (GameState.grid[i][j] !== null) {
                cells.push({ row: i, col: j, value: GameState.grid[i][j] });
            }
        }
    }

    for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
            const cell1 = cells[i];
            const cell2 = cells[j];

            if (cell1.value === cell2.value || cell1.value + cell2.value === 10) {
                if (areCellsConnected(cell1, cell2)) {
                    moves.push({ cell1, cell2 });
                }
            }
        }
    }

    return moves;
}

const revertMove = () => {
    if (GameState.history.length > 0 && GameState.assists.revert.uses < GameState.assists.revert.max) {
        const previousState = GameState.history.pop();
        GameState.grid = previousState.grid;
        GameState.score = previousState.score;
        GameState.selectedCells = previousState.selectedCells;

        GameState.assists.revert.uses++;
        updateAssistButtons();
        updateGameUI();
        renderGrid();

        playSound('assist');
    }
}

const countRemainingNumbers = () => {
    let count = 0;
    for (let i = 0; i < GameState.grid.length; i++) {
        for (let j = 0; j < GameState.grid[i].length; j++) {
            if (GameState.grid[i][j] !== null) {
                count++;
            }
        }
    }
    return count;
}

const highlightValidMoves = (validMoves) => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('hint-highlight');
    });

    validMoves.forEach(move => {
        const cell1 = document.querySelector(`.cell[data-row="${move.cell1.row}"][data-col="${move.cell1.col}"]`);
        const cell2 = document.querySelector(`.cell[data-row="${move.cell2.row}"][data-col="${move.cell2.col}"]`);

        if (cell1 && cell2) {
            cell1.classList.add('hint-highlight');
            cell2.classList.add('hint-highlight');
        }
    });

    setTimeout(() => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('hint-highlight');
        });
    }, 3000);
}

const showHints = () => {
    const validMoves = findValidMoves();
    const hintCount = validMoves.length;

    const hintCounter = document.getElementById('hints-counter');
    if (hintCount > 5) {
        hintCounter.textContent = '5+';
    } else {
        hintCounter.textContent = hintCount.toString();
    }

    highlightValidMoves(validMoves);

    playSound('assist');
}

const shuffleNumbers = () => {
    if (GameState.assists.shuffle.uses < GameState.assists.shuffle.max) {
        GameState.assists.shuffle.uses++;

        const numbers = [];
        for (let i = 0; i < GameState.grid.length; i++) {
            for (let j = 0; j < GameState.grid[i].length; j++) {
                if (GameState.grid[i][j] !== null) {
                    numbers.push(GameState.grid[i][j]);
                }
            }
        }

        shuffleArray(numbers);

        let index = 0;
        for (let i = 0; i < GameState.grid.length; i++) {
            for (let j = 0; j < GameState.grid[i].length; j++) {
                if (GameState.grid[i][j] !== null) {
                    GameState.grid[i][j] = numbers[index];
                    index++;
                }
            }
        }

        updateAssistButtons();
        renderGrid();
        playSound('assist');
    }
}

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const activateEraser = () => {
    if (GameState.assists.eraser.uses < GameState.assists.eraser.max) {
        GameState.eraserActive = true;
        GameState.assists.eraser.uses++;
        updateAssistButtons();
        playSound('assist');

        alert('Click on any number to remove it. This will use one eraser.');
    }
}

const goBackToMenu = () => {
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }

    if (!isGameSaved()) {
        const confirmLeave = confirm('Your progress is not saved. Are you sure you want to return to the main menu?');
        if (!confirmLeave) {
            if (!GameState.gameOver) {
                startTimer();
            }
            return;
        }
    }

    saveSettings();

    showScreen('start');
    playSound('assist');
}

const addNumbersSequentially = (numbers) => {
    let numberIndex = 0;

    let currentRow = Math.floor(GameState.totalCellsAdded / 9);
    let currentCol = GameState.totalCellsAdded % 9;

    while (numberIndex < numbers.length) {
        if (currentRow >= GameState.grid.length) {
            if (GameState.grid.length >= 50) {
                break;
            }

            GameState.grid.push(Array(9).fill(null));
        }

        GameState.grid[currentRow][currentCol] = numbers[numberIndex];
        numberIndex++;
        GameState.totalCellsAdded++;

        currentCol++;
        if (currentCol >= 9) {
            currentRow++;
            currentCol = 0;
        }
    }
}

const addNumbers = () => {
    if (GameState.assists.addNumbers.uses < GameState.assists.addNumbers.max) {
        if (GameState.grid.length >= 50) {
            alert('Grid limit reached! Cannot add more numbers.');
            return;
        }

        GameState.assists.addNumbers.uses++;

        const numbersToAdd = [];
        const remainingNumbers = countRemainingNumbers();

        if (GameState.currentMode === 'classic') {

            for (let i = 0; i < remainingNumbers; i++) {
                numbersToAdd.push(classicSequence[GameState.classicSequenceIndex]);
                GameState.classicSequenceIndex = (GameState.classicSequenceIndex + 1) % classicSequence.length;
            }

        } else if (GameState.currentMode === 'random') {
            for (let i = 0; i < remainingNumbers; i++) {
                const randomIndex = Math.floor(Math.random() * classicSequence.length);
                numbersToAdd.push(classicSequence[randomIndex]);
            }

        } else if (GameState.currentMode === 'chaotic') {
            for (let i = 0; i < remainingNumbers; i++) {
                numbersToAdd.push(Math.floor(Math.random() * 9) + 1);
            }
        }

        addNumbersSequentially(numbersToAdd);

        updateAssistButtons();
        renderGrid();
        playSound('assist');
    }
}

export const setupEventListeners = () => {
    Object.values(domElements.modeButtons).forEach(button => {
        button.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            startGame(mode);
        });
    });

    domElements.continueButton.addEventListener('click', () => {
        if (loadSavedGame()) {
            showScreen('game');
        }
    });

    domElements.controlButtons.exit.addEventListener('click', () => {
        goBackToMenu()
    })

    domElements.settingsButton.addEventListener('click', () => showModal('settings'));

    domElements.resultsButton.addEventListener('click', () => {
        updateResultsTable();
        showModal('results');
    });

    domElements.controlButtons.reset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the game?')) {
            startGame(GameState.currentMode);
        }
    });

    domElements.controlButtons.save.addEventListener('click', saveGame);
    domElements.controlButtons.continue.addEventListener('click', () => {
        if (loadSavedGame()) showScreen('game');
    });

    domElements.assistButtons.hints.addEventListener('click', showHints);
    domElements.assistButtons.revert.addEventListener('click', revertMove);
    domElements.assistButtons.addNumbers.addEventListener('click', addNumbers);
    domElements.assistButtons.shuffle.addEventListener('click', shuffleNumbers);
    domElements.assistButtons.eraser.addEventListener('click', activateEraser);

    document.getElementById('audio-toggle').addEventListener('change', (e) => {
        GameState.settings.audio = e.target.checked;
        saveSettings();
    });

    [domElements.settingsModal, domElements.resultsModal, domElements.outcomeModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id.replace('-modal', ''));
            }
        });
    });
}
