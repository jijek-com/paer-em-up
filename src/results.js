import {domElements, gameState as GameState} from "./state";
import {showScreen} from "./gameScreen";

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

    const timeToSeconds = (timeStr) => {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    const sortByTime = (results) => {
        return [...results].sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time)).slice(0, 5);
    };

    const createHeaderRow = (text) => {
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('td');
        headerCell.colSpan = 4;
        headerCell.textContent = text;
        headerCell.style.fontWeight = 'bold';
        headerCell.style.textAlign = 'center';
        headerCell.style.backgroundColor = 'var(--cell-border)';
        headerRow.appendChild(headerCell);
        return headerRow;
    };

    const createResultRow = (result, isWin) => {
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
        resultCell.textContent = isWin ? 'Win' : 'Loss';
        resultCell.className = isWin ? 'win-indicator' : 'loss-indicator';
        row.appendChild(resultCell);

        return row;
    };

    const wins = GameState.results.filter(result => result.win);
    const losses = GameState.results.filter(result => !result.win);

    const sortedWins = sortByTime(wins);
    const sortedLosses = sortByTime(losses);

    if (sortedWins.length > 0) {
        tableBody.appendChild(createHeaderRow('Победы'));
        sortedWins.forEach(result => {
            tableBody.appendChild(createResultRow(result, true));
        });
    }

    if (sortedLosses.length > 0) {
        tableBody.appendChild(createHeaderRow('Проигрыши'));
        sortedLosses.forEach(result => {
            tableBody.appendChild(createResultRow(result, false));
        });
    }
};
