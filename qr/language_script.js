// language change // 
// Check if a language has been saved previously
let currentLang = localStorage.getItem("lang");

console.log(currentLang)

// If no saved language, auto-detect from the browser
if (!currentLang) {
    // Detect the user's language ("en-US", "ru-RU")
    const defaultLang = navigator.languages ? navigator.languages[0] : navigator.language;
    // Normalize (e.g., "en-US" becomes "en")
    let langCode = defaultLang.split('-')[0];
    // Validate the language, default to "en" if not supported
    if (!["en", "ru"].includes(langCode)) {
        langCode = "en";
    }
    currentLang = langCode;
    // Save the detected language for future visits
    localStorage.setItem("lang", currentLang);
}

// Strings for the "advanced" panel. Kept here so they work even before
// /lang/qr.json has them; any key in qr.json overrides these.
const localTranslations = {
    advanced: { en: "Advanced settings", ru: "Дополнительные настройки" },
    optSize: { en: "PNG size (px)", ru: "Размер PNG (пикс.)" },
    optCm: { en: "Print size (cm)", ru: "Размер при печати (см)" },
    optDpi: { en: "Print quality (DPI)", ru: "Качество печати (DPI)" },
    optEcc: { en: "Error correction", ru: "Коррекция ошибок" },
    eccL: { en: "Low (7%)", ru: "Низкая (7%)" },
    eccM: { en: "Medium (15%)", ru: "Средняя (15%)" },
    eccQ: { en: "Quartile (25%)", ru: "Повышенная (25%)" },
    eccH: { en: "High (30%)", ru: "Высокая (30%)" },
    optMargin: { en: "Margin (modules)", ru: "Отступ (в модулях)" },
    optDark: { en: "Foreground", ru: "Цвет кода" },
    optLight: { en: "Background", ru: "Цвет фона" },
    optRadius: { en: "Corner radius (%)", ru: "Скругление углов (%)" },
    optTransparent: { en: "Transparent background", ru: "Прозрачный фон" },
    advancedHint: {
        en: "For print, SVG is best: it's vector, so it stays sharp at any size. For PNG, pick the print size and DPI and the pixel size is worked out for you.",
        ru: "Для печати лучше всего SVG: это вектор, он остаётся чётким при любом размере. Для PNG укажите размер при печати и DPI — размер в пикселях посчитается сам.",
    },
    optReset: { en: "Reset to defaults", ru: "Сбросить настройки" },
};

let translations = { ...localTranslations };

// Load translations from all the .json files
function loadTranslations() {
    fetch("/lang/qr.json")
        .then(res => res.json())
        .then(data => {
            translations = { ...localTranslations, ...data };
            applyTranslations(currentLang);
        })
        .catch(error => {
            console.error("Error loading translation file:", error);
            applyTranslations(currentLang);
        });
}

// Apply translations based on the selected language
function applyTranslations(lang) {
    document.querySelectorAll("[data-key]").forEach((el) => {
        const key = el.getAttribute("data-key");
        const attr = el.getAttribute("data-attr");

        if (translations[key] && translations[key][lang]) {
            if (attr) {
                el.setAttribute(attr, translations[key][lang]);
            } else {
                el.textContent = translations[key][lang];
            }
        }
    });
}

loadTranslations();
