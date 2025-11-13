import { domElements } from "./state";

export const buildStartScreen = () => {
    const startScreen = domElements.screens.start;

    const title = document.createElement('h1');
    title.className = 'game-title';
    title.textContent = 'Pair \'em Up';
    startScreen.appendChild(title);

    const author = document.createElement('div');
    author.className = 'author-credit';
    author.innerHTML = 'Created by <a href="https://github.com/jijek-com" target="_blank">Jijekcom</a>';
    startScreen.appendChild(author);

    const modeSelection = document.createElement('div');
    modeSelection.className = 'mode-selection';

    const modes = [
        { id: 'classic', name: 'Classic Mode' },
        { id: 'random', name: 'Random Mode' },
        { id: 'chaotic', name: 'Chaotic Mode' }
    ];

    domElements.modeButtons = {};

    modes.forEach(mode => {
        const button = document.createElement('button');
        button.className = 'mode-btn';
        button.textContent = mode.name;
        button.dataset.mode = mode.id;
        modeSelection.appendChild(button);
        domElements.modeButtons[mode.id] = button;
    });

    startScreen.appendChild(modeSelection);

    domElements.continueButton = document.createElement('button');
    domElements.continueButton.className = 'continue-btn';
    domElements.continueButton.textContent = 'Continue Game';
    domElements.continueButton.disabled = true;

    startScreen.appendChild(domElements.continueButton);

    const settingsResultsContainer = document.createElement('div');
    settingsResultsContainer.className = 'settings-results-container';

    domElements.settingsButton = document.createElement('button');
    domElements.settingsButton.className = 'settings-btn';
    domElements.settingsButton.textContent = 'Settings';
    settingsResultsContainer.appendChild(domElements.settingsButton);

    domElements.resultsButton = document.createElement('button');
    domElements.resultsButton.className = 'results-btn';
    domElements.resultsButton.textContent = 'Results';
    settingsResultsContainer.appendChild(domElements.resultsButton);

    startScreen.appendChild(settingsResultsContainer);
}
