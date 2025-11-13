import {domElements, gameState as states, gameState as GameState} from "./state";
import {showScreen} from "./gameScreen";
import {switchTheme} from "./theme";
import {startGame} from "./main";
import {updateResultsTable} from "./results";

export const showModal = (modalName) => {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.add('active');
    }
}

export const hideModal = (modalName) => {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.remove('active');
    }
}

export const createModals = () => {
    domElements.settingsModal = document.createElement('div');
    domElements.settingsModal.className = 'modal';
    domElements.settingsModal.id = 'settings-modal';

    const settingsContent = document.createElement('div');
    settingsContent.className = 'modal-content';

    const settingsHeader = document.createElement('div');
    settingsHeader.className = 'modal-header';

    const settingsTitle = document.createElement('div');
    settingsTitle.className = 'modal-title';
    settingsTitle.textContent = 'Settings';
    settingsHeader.appendChild(settingsTitle);

    const closeSettings = document.createElement('button');
    closeSettings.className = 'close-modal';
    closeSettings.innerHTML = '&times;';
    closeSettings.addEventListener('click', () => hideModal('settings'));
    settingsHeader.appendChild(closeSettings);

    settingsContent.appendChild(settingsHeader);

    const audioSetting = document.createElement('div');
    audioSetting.className = 'settings-option';

    const audioLabel = document.createElement('label');
    const audioCheckbox = document.createElement('input');
    audioCheckbox.type = 'checkbox';
    audioCheckbox.id = 'audio-toggle';
    audioCheckbox.checked = GameState.settings.audio;

    audioLabel.appendChild(audioCheckbox);
    audioLabel.appendChild(document.createTextNode('Enable Sound Effects'));
    audioSetting.appendChild(audioLabel);

    settingsContent.appendChild(audioSetting);

    const themeSetting = document.createElement('div');
    themeSetting.className = 'settings-option';

    const themeLabel = document.createElement('div');
    themeLabel.textContent = 'Theme:';
    themeSetting.appendChild(themeLabel);

    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';

    const currentTheme = states.settings.theme || 'light';

    const lightThemeBtn = document.createElement('button');
    lightThemeBtn.className = 'theme-btn' + (currentTheme === 'light' ? ' active' : '');
    lightThemeBtn.textContent = 'Light';
    lightThemeBtn.dataset.theme = 'light';
    lightThemeBtn.addEventListener('click', () => switchTheme('light'));

    const darkThemeBtn = document.createElement('button');
    darkThemeBtn.className = 'theme-btn' + (currentTheme === 'light' ? '' : ' active');
    darkThemeBtn.textContent = 'Dark';
    darkThemeBtn.dataset.theme = 'dark';
    darkThemeBtn.addEventListener('click', () => switchTheme('dark'));

    themeSelector.appendChild(lightThemeBtn);
    themeSelector.appendChild(darkThemeBtn);
    themeSetting.appendChild(themeSelector);

    settingsContent.appendChild(themeSetting);

    domElements.settingsModal.appendChild(settingsContent);
    document.body.appendChild(domElements.settingsModal);

    domElements.resultsModal = document.createElement('div');
    domElements.resultsModal.className = 'modal';
    domElements.resultsModal.id = 'results-modal';

    const resultsContent = document.createElement('div');
    resultsContent.className = 'modal-content';

    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'modal-header';

    const resultsTitle = document.createElement('div');
    resultsTitle.className = 'modal-title';
    resultsTitle.textContent = 'Game Results';
    resultsHeader.appendChild(resultsTitle);

    const closeResults = document.createElement('button');
    closeResults.className = 'close-modal';
    closeResults.innerHTML = '&times;';
    closeResults.addEventListener('click', () => hideModal('results'));
    resultsHeader.appendChild(closeResults);

    resultsContent.appendChild(resultsHeader);

    const resultsTable = document.createElement('table');
    resultsTable.className = 'results-table';
    resultsTable.id = 'results-table';

    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Mode', 'Score', 'Time', 'Result'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    tableHeader.appendChild(headerRow);
    resultsTable.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    resultsTable.appendChild(tableBody);

    resultsContent.appendChild(resultsTable);
    domElements.resultsModal.appendChild(resultsContent);
    document.body.appendChild(domElements.resultsModal);

    domElements.outcomeModal = document.createElement('div');
    domElements.outcomeModal.className = 'modal';
    domElements.outcomeModal.id = 'outcome-modal';

    const outcomeContent = document.createElement('div');
    outcomeContent.className = 'modal-content';

    const outcomeHeader = document.createElement('div');
    outcomeHeader.className = 'modal-header';

    const outcomeTitle = document.createElement('div');
    outcomeTitle.className = 'modal-title';
    outcomeTitle.textContent = 'Game';
    outcomeHeader.appendChild(outcomeTitle);

    const closeOutcome = document.createElement('button');
    closeOutcome.className = 'close-modal';
    closeOutcome.innerHTML = '&times;';
    closeOutcome.addEventListener('click', () => hideModal('outcome'));
    outcomeHeader.appendChild(closeOutcome);

    outcomeContent.appendChild(outcomeHeader);

    const outcomeMessage = document.createElement('div');
    outcomeMessage.className = 'outcome-message';
    outcomeMessage.id = 'outcome-message';
    outcomeContent.appendChild(outcomeMessage);

    const outcomeDetails = document.createElement('div');
    outcomeDetails.className = 'outcome-details';
    outcomeDetails.id = 'outcome-details';
    outcomeContent.appendChild(outcomeDetails);

    const postGameOptions = document.createElement('div');
    postGameOptions.className = 'post-game-options';

    const playAgainBtn = document.createElement('button');
    playAgainBtn.className = 'control-btn';
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.addEventListener('click', () => {
        hideModal('outcome');
        startGame(GameState.currentMode);
    });

    const mainMenuBtn = document.createElement('button');
    mainMenuBtn.className = 'control-btn';
    mainMenuBtn.textContent = 'Main Menu';
    mainMenuBtn.addEventListener('click', () => {
        hideModal('outcome');
        showScreen('start');
    });

    const viewResultsBtn = document.createElement('button');
    viewResultsBtn.className = 'control-btn';
    viewResultsBtn.textContent = 'View Results';
    viewResultsBtn.addEventListener('click', () => {
        hideModal('outcome');
        updateResultsTable();
        showModal('results');
    });

    postGameOptions.appendChild(playAgainBtn);
    postGameOptions.appendChild(mainMenuBtn);
    postGameOptions.appendChild(viewResultsBtn);

    outcomeContent.appendChild(postGameOptions);
    domElements.outcomeModal.appendChild(outcomeContent);
    document.body.appendChild(domElements.outcomeModal);
}
