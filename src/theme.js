import { gameState as GameState } from "./state";
import { saveSettings } from "./saveGame";

export const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

export const switchTheme = (theme) => {
    GameState.settings.theme = theme;
    applyTheme(theme);
    saveSettings();

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}
