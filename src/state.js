export const gameState = {
    currentScreen: 'start',
    currentMode: null,
    grid: [],
    score: 0,
    timer: 0,
    timerInterval: null,
    selectedCells: [],
    gameOver: false,
    assists: {
        hints: { uses: 0, max: Infinity },
        revert: { uses: 0, max: 1 },
        addNumbers: { uses: 0, max: 10 },
        shuffle: { uses: 0, max: 5 },
        eraser: { uses: 0, max: 5 }
    },
    history: [],
    settings: {
        audio: true,
        theme: 'light'
    },
    results: [],
    totalCellsAdded: 27
};

export const domElements = {
    screens: {},
    startScreen: {},
    gameScreen: {},
    resultsScreen: {},
    modeButtons: {},
    continueButton: {},
    settingsButton: {},
    resultsButton: {},
    gameGrid: {},
    scoreDisplay: {},
    timerDisplay: {},
    modeInfo: {},
    controlButtons: {},
    assistButtons: {},
    settingsModal: {},
    resultsModal: {},
    outcomeModal: {},
};

export const audioElements = {
    select: new Audio('./assets/sounds/select.mp3'),
    valid: new Audio('./assets/sounds/valid.mp3'),
    invalid: new Audio('./assets/sounds/invalid.mp3'),
    assist: new Audio('./assets/sounds/assist.mp3'),
    win: new Audio('./assets/sounds/win.mp3'),
    lose: new Audio('./assets/sounds/lose.mp3'),
};

export const classicSequence = [
    1,2,3,4,5,6,7,8,9,
    1,1,1,2,1,3,1,4,1,
    5,1,6,1,7,1,8,1,9
];
