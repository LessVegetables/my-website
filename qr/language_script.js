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

let translations = {};

// Load translations from all the .json files
function loadTranslations() {
    fetch("/lang/qr.json")
        .then(res => res.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLang);
        })
        .catch(error => console.error("Error loading translation file:", error));
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
applyTranslations(currentLang);