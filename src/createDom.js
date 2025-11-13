import { buildStartScreen } from "./startScreen";
import { buildGameScreen } from "./gameScreen";
import { buildResultsScreen } from "./results";
import { createModals } from "./modals";
import { domElements } from "./state";

export const createDOMStructure = () => {
    domElements.screens = {
        start: document.createElement('div'),
        game: document.createElement('div'),
        results: document.createElement('div')
    };

    domElements.screens.start.className = 'screen start-screen';
    domElements.screens.game.className = 'screen game-screen';
    domElements.screens.results.className = 'screen results-screen';

    buildStartScreen();

    buildGameScreen();

    buildResultsScreen();

    createModals();

    document.body.appendChild(domElements.screens.start);
    document.body.appendChild(domElements.screens.game);
    document.body.appendChild(domElements.screens.results);

    domElements.screens.start.classList.add('active');
}
