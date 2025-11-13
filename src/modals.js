import {domElements, gameState, gameState as GameState} from "./state";
import { showScreen } from "./gameScreen";
import { switchTheme } from "./theme";
import { startGame } from "./main";
import { updateResultsTable } from "./results";

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

export const showAlertModal = (message) => {
    const alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
        alertMessage.textContent = message;
    }
    showModal('alert');
}

export const showConfirmModal = (message) => {
    return new Promise((resolve) => {
        const confirmMessage = document.getElementById('confirm-message');
        if (confirmMessage) {
            confirmMessage.textContent = message;
        }

        const confirmYes = document.getElementById('confirm-yes');
        const confirmNo = document.getElementById('confirm-no');

        const cleanup = () => {
            confirmYes.removeEventListener('click', onYes);
            confirmNo.removeEventListener('click', onNo);
            hideModal('confirm');
        };

        const onYes = () => {
            cleanup();
            resolve(true);
        };

        const onNo = () => {
            cleanup();
            resolve(false);
        };

        confirmYes.addEventListener('click', onYes);
        confirmNo.addEventListener('click', onNo);

        showModal('confirm');
    });
}

const createModalBase = (id, title) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `${id}-modal`;

    const content = document.createElement('div');
    content.className = 'modal-content';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const titleElement = document.createElement('div');
    titleElement.className = 'modal-title';
    titleElement.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => hideModal(id));

    header.appendChild(titleElement);
    header.appendChild(closeButton);
    content.appendChild(header);

    modal.appendChild(content);

    return { modal, content };
};

const createSettingsModal = () => {
    const { modal, content } = createModalBase('settings', 'Settings');

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
    content.appendChild(audioSetting);

    const themeSetting = document.createElement('div');
    themeSetting.className = 'settings-option';

    const themeLabel = document.createElement('div');
    themeLabel.textContent = 'Theme:';
    themeSetting.appendChild(themeLabel);

    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';

    const currentTheme = gameState.settings.theme || 'light';

    const lightThemeBtn = document.createElement('button');
    lightThemeBtn.className = `theme-btn ${currentTheme === 'light' ? 'active' : ''}`;
    lightThemeBtn.textContent = 'Light';
    lightThemeBtn.dataset.theme = 'light';
    lightThemeBtn.addEventListener('click', () => switchTheme('light'));

    const darkThemeBtn = document.createElement('button');
    darkThemeBtn.className = `theme-btn ${currentTheme === 'dark' ? 'active' : ''}`;
    darkThemeBtn.textContent = 'Dark';
    darkThemeBtn.dataset.theme = 'dark';
    darkThemeBtn.addEventListener('click', () => switchTheme('dark'));

    themeSelector.appendChild(lightThemeBtn);
    themeSelector.appendChild(darkThemeBtn);
    themeSetting.appendChild(themeSelector);
    content.appendChild(themeSetting);

    return modal;
};

const createResultsModal = () => {
    const { modal, content } = createModalBase('results', 'Game Results');

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
    content.appendChild(resultsTable);

    return modal;
};

const createOutcomeModal = () => {
    const { modal, content } = createModalBase('outcome', 'Game');

    const outcomeMessage = document.createElement('div');
    outcomeMessage.className = 'outcome-message';
    outcomeMessage.id = 'outcome-message';
    content.appendChild(outcomeMessage);

    const outcomeDetails = document.createElement('div');
    outcomeDetails.className = 'outcome-details';
    outcomeDetails.id = 'outcome-details';
    content.appendChild(outcomeDetails);

    const postGameOptions = document.createElement('div');
    postGameOptions.className = 'post-game-options';

    const createActionButton = (text, onClick) => {
        const button = document.createElement('button');
        button.className = 'control-btn';
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    };

    postGameOptions.appendChild(createActionButton('Play Again', () => {
        hideModal('outcome');
        startGame(GameState.currentMode);
    }));

    postGameOptions.appendChild(createActionButton('Main Menu', () => {
        hideModal('outcome');
        showScreen('start');
    }));

    postGameOptions.appendChild(createActionButton('View Results', () => {
        hideModal('outcome');
        updateResultsTable();
        showModal('results');
    }));

    content.appendChild(postGameOptions);

    return modal;
};

const createAlertModal = () => {
    const { modal, content } = createModalBase('alert', 'Information');

    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert-message';
    alertMessage.id = 'alert-message';
    content.appendChild(alertMessage);

    const alertButton = document.createElement('button');
    alertButton.className = 'control-btn';
    alertButton.textContent = 'OK';
    alertButton.addEventListener('click', () => hideModal('alert'));
    content.appendChild(alertButton);

    return modal;
};

const createConfirmModal = () => {
    const { modal, content } = createModalBase('confirm', 'Confirmation');

    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'confirm-message';
    confirmMessage.id = 'confirm-message';
    content.appendChild(confirmMessage);

    const confirmButtons = document.createElement('div');
    confirmButtons.className = 'confirm-buttons';

    const confirmYes = document.createElement('button');
    confirmYes.className = 'control-btn confirm-yes';
    confirmYes.textContent = 'Yes';
    confirmYes.id = 'confirm-yes';

    const confirmNo = document.createElement('button');
    confirmNo.className = 'control-btn confirm-no';
    confirmNo.textContent = 'No';
    confirmNo.id = 'confirm-no';

    confirmButtons.appendChild(confirmYes);
    confirmButtons.appendChild(confirmNo);
    content.appendChild(confirmButtons);

    return modal;
};

export const createModals = () => {
    const modals = [
        { name: 'settings', creator: createSettingsModal },
        { name: 'results', creator: createResultsModal },
        { name: 'outcome', creator: createOutcomeModal },
        { name: 'alert', creator: createAlertModal },
        { name: 'confirm', creator: createConfirmModal }
    ];

    modals.forEach(({ name, creator }) => {
        domElements[`${name}Modal`] = creator();
        document.body.appendChild(domElements[`${name}Modal`]);
    });
};
