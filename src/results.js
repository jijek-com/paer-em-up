import {domElements, gameState as GameState} from "./state";

export const buildResultsScreen = () => {
    const resultsScreen = domElements.screens.results;

    const title = document.createElement('h2');
    title.textContent = 'Game Results';
    resultsScreen.appendChild(title);

    const backButton = document.createElement('button');
    backButton.className = 'control-btn';
    backButton.textContent = 'Back to Start';
    backButton.addEventListener('click', () => showScreen('start'));
    resultsScreen.appendChild(backButton);
}

export const updateResultsTable = () => {
    const tableBody = document.querySelector('#results-table tbody');
    if (!tableBody) {
        console.error('Results table body not found');
        return;
    }

    tableBody.innerHTML = '';

    GameState.results.forEach(result => {
        const row = document.createElement('tr');

        const modeCell = document.createElement('td');
        modeCell.textContent = result.mode;
        row.appendChild(modeCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = result.score;
        row.appendChild(scoreCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = result.time;
        row.appendChild(timeCell);

        const resultCell = document.createElement('td');
        resultCell.textContent = result.win ? 'Win' : 'Loss';
        if (result.win) {
            resultCell.classList.add('win-indicator');
        }
        row.appendChild(resultCell);

        tableBody.appendChild(row);
    });
}
