'use strict';

//Changing the language
document.addEventListener("DOMContentLoaded", function () {
    // Check for a saved theme preference in localStorage
    let savedTheme = localStorage.getItem("theme");
    let theme;

    if (savedTheme) {
        theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no saved preference, check the system preference
        theme = "dark";
    } else {
        // Fallback default to dark mode
        theme = "dark";
    }

    // Apply the theme
    setTheme(theme);


    let themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) {
        console.error("Theme toggle button not found!");
        return; // Exit if button doesn't exist
    }

    themeToggle.addEventListener("click", function () {
        let currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme === "light") {
            console.log("lights out! switching to dark");
            localStorage.setItem("theme", "dark");
            document.documentElement.removeAttribute("data-theme");
        } else {
            console.log("heads up! turning on the lights");
            localStorage.setItem("theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
        }
        console.log("switched!");
        console.log("Current data-theme:", document.documentElement.getAttribute("data-theme"));
    });


    function setTheme(theme) {
        console.log("setting theme");
        document.documentElement.setAttribute("data-theme", theme);
    }

    // // language change // 
    // let currentLang = localStorage.getItem("lang") || "en";
    // let translations = {};

    // language change // 
    // Check if a language has been saved previously
    let currentLang = localStorage.getItem("lang");

    // If no saved language, auto-detect from the browser
    if (!currentLang) {
        // Detect the user's language (e.g., "en-US", "ru-RU")
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
        const files = ["general", "about", "home", "projects"];
        const fetchPromises = files.map(file => fetch(`lang/${file}.json`).then(res => res.json()));

        Promise.all(fetchPromises)
            .then(dataArray => {
                // Merge all loaded JSON objects into translations
                translations = Object.assign({}, ...dataArray);
                applyTranslations(currentLang);
            })
            .catch(error => console.error("Error loading translation files:", error));
    }

    // Toggle language when button is clicked
    document.getElementById("lang-toggle").addEventListener("click", function () {
        currentLang = currentLang === "en" ? "ru" : "en";
        localStorage.setItem("lang", currentLang);
        applyTranslations(currentLang);
    });

    // Apply translations based on the selected language
    function applyTranslations(lang) {
        document.querySelectorAll("[data-key]").forEach((el) => {
            const key = el.getAttribute("data-key");
            if (translations[key] && translations[key][lang]) {
                el.textContent = translations[key][lang];
            }
        });
    }

    // Load translations on page load
    loadTranslations();

});


//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); })

//Activating Modal-testimonial

// const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
// const modalContainer = document.querySelector('[data-modal-container]');
// const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
// const overlay = document.querySelector('[data-overlay]');

// const modalImg = document.querySelector('[data-modal-img]');
// const modalTitle = document.querySelector('[data-modal-title]');
// const modalText = document.querySelector('[data-modal-text]');

// const testimonialsModalFunc = function () {
//     modalContainer.classList.toggle('active');
//     overlay.classList.toggle('active');
// }

// for (let i = 0; i < testimonialsItem.length; i++) {
//     testimonialsItem[i].addEventListener('click', function () {
//         modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
//         modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
//         modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
//         modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

//         testimonialsModalFunc();
//     })
// }

//Activating close button in modal-testimonial

// modalCloseBtn.addEventListener('click', testimonialsModalFunc);
// overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for (let i = 0; i < filterItems.length; i++) {
        if (selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

// const filterFunc = function (selectedValue) {
//     const activeCards = document.querySelectorAll('[data-filter-item].active');
//     const newCards = document.querySelectorAll(`[data-filter-item][data-category="${selectedValue}"]`);

//     // If "all" is selected, show everything
//     if (selectedValue === "all") {
//         newCards = document.querySelectorAll('[data-filter-item]');
//     }

//     // Animate existing cards off-screen
//     activeCards.forEach(card => {
//         card.classList.add('card-swing-out');
//         card.addEventListener('animationend', () => {
//             card.classList.remove('active', 'card-swing-out');
//             card.style.display = 'none';
//         }, { once: true });
//     });

//     // Delay for outgoing animation to complete
//     setTimeout(() => {
//         newCards.forEach(card => {
//             card.style.display = 'block';
//             card.classList.add('card-swing-in');
//             card.addEventListener('animationend', () => {
//                 card.classList.remove('card-swing-in');
//             }, { once: true });
//             card.classList.add('active');
//         });
//     }, 500); // Delay matches swingOut duration
// };


//Enabling filter button for smaller screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener('click', function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if (form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.setAttribute('disabled', '');
        }
    })
}

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function (event) {
        event.preventDefault(); // bc of href="#" — prevents from jumping up to the top of the screen
        for (let i = 0; i < pages.length; i++) {
            if (this.dataset.key == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i].classList.remove('active');
            }
        }
    });
}