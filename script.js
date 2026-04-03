'use strict';


function setTheme(theme) {
    if (theme === "light") {
        console.log("heads up! turning on the lights");
        document.documentElement.setAttribute("data-theme", theme);
    } else {
        console.log("lights out! switching to dark");
        document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme)
}


document.addEventListener("DOMContentLoaded", function () {
    // get the system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // set the system theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // listen for system theme changes
    mediaQuery.addEventListener('change', (e) => {
        setTheme(e.matches ? 'dark' : 'light');
    });

    // detect button
    let themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) {
        console.error("Theme toggle button not found!");
        // return; // Exit if button doesn't exist <— I don't think I should exit...
    }

    // connect button
    themeToggle.addEventListener("click", function (e) {
        e.preventDefault();
        let currentTheme = document.documentElement.getAttribute("data-theme");
        setTheme(currentTheme == "light" ? "dark" : "light")
    });


    // language change // 
    // Check if a language has been saved previously
    let currentLang = localStorage.getItem("lang");

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
    document.getElementById("lang-toggle").addEventListener("click", function (e) {
        e.preventDefault();
        currentLang = currentLang === "en" ? "ru" : "en";
        localStorage.setItem("lang", currentLang);
        applyTranslations(currentLang);
        loadProjects(currentLang);
    });

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

        document.querySelectorAll("[data-href-key]").forEach((el) => {
            const key = el.getAttribute("data-href-key");
            if (translations[key] && translations[key][lang]) {
                el.setAttribute("href", translations[key][lang]);
            }
        });
    }

    const path = window.location.hash.replace('#', '') || 'home';
    document.querySelector(`[data-page="${path}"]`)?.classList.add('active');
    document.querySelector(`[data-nav-link][data-key="${path}"]`)?.classList.add('active');

    // Load the projects on page load
    loadProjects(currentLang);

    // Load translations on page load
    loadTranslations();

});


//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function (e) {
    e.preventDefault();
    elementToggleFunc(sidebar);
})

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


// beginning of old filtering // ##################################################
//Activating Filter Select and filtering options

// const select = document.querySelector('[data-select]');
// const selectItems = document.querySelectorAll('[data-select-item]');
// const selectValue = document.querySelector('[data-select-value]');
// const filterBtn = document.querySelectorAll('[data-filter-btn]');

// select.addEventListener('click', function () { elementToggleFunc(this); });

// for (let i = 0; i < selectItems.length; i++) {
//     selectItems[i].addEventListener('click', function () {

//         let selectedValue = this.innerText.toLowerCase();
//         selectValue.innerText = this.innerText;
//         elementToggleFunc(select);
//         filterFunc(selectedValue);

//     });
// }

// const filterItems = document.querySelectorAll('[data-filter-item]');

// const filterFunc = function (selectedValue) {
//     for (let i = 0; i < filterItems.length; i++) {
//         if (selectedValue == "all") {
//             filterItems[i].classList.add('active');
//         } else if (selectedValue == filterItems[i].dataset.category) {
//             filterItems[i].classList.add('active');
//         } else {
//             filterItems[i].classList.remove('active');
//         }
//     }
// }

// ending of old filtering // ##################################################

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

// beginning of old filtering // ##################################################

//Enabling filter button for smaller screens 

// let lastClickedBtn = filterBtn[0];

// for (let i = 0; i < filterBtn.length; i++) {

//     filterBtn[i].addEventListener('click', function () {

//         let selectedValue = this.innerText.toLowerCase();
//         selectValue.innerText = this.innerText;
//         filterFunc(selectedValue);

//         lastClickedBtn.classList.remove('active');
//         this.classList.add('active');
//         lastClickedBtn = this;

//     })
// }

// ending of old filtering // ##################################################

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

const DURATION = 150;
let pendingTimer = null;

for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // If the user clicks again mid-transition, cancel the previous pending activation
        if (pendingTimer) {
            clearTimeout(pendingTimer);
            pendingTimer = null;
        }

        const key = this.dataset.key;
        history.pushState(null, '', '#' + key);

        // If already on this page, do nothing
        const current = document.querySelector('[data-page].active');
        if (current && current.dataset.page === key) return;

        // Update nav link active state immediately (optional; you can also delay this)
        for (let j = 0; j < navigationLinks.length; j++) {
            navigationLinks[j].classList.toggle('active', navigationLinks[j] === this);
        }

        // Fade out the old page first
        if (current) {
            current.classList.remove('active');
            current.classList.add('exiting');

            // After fade-out completes, hide old page and show+fade-in new page
            pendingTimer = setTimeout(() => {
                current.classList.remove('exiting');

                // Activate the new page ONLY now (successive transition)
                for (let j = 0; j < pages.length; j++) {
                    pages[j].classList.toggle('active', pages[j].dataset.page === key);
                }

                pendingTimer = null;
            }, DURATION);
        } else {
            // No current page: just show the new page immediately
            for (let j = 0; j < pages.length; j++) {
                pages[j].classList.toggle('active', pages[j].dataset.page === key);
            }
        }
    });
}


const TAG_LABELS = {
    desktop: "Desktop",
    ios: "iOS",
    web: "Web",
    tgbots: "Telegram Bot",

    python: "Python",
    swift: "Swift",
    javascript: "JS",
    c: "C",

    frontend: "Frontend",
    backend: "Backend",
    fullstack: "Fullstack",
    ml: "ML",

    utility: "Utility",
    app: "App",
    service: "Service",

    wip: "Work In Progress",
    demo: "Demo",
    done: "80% Done"
};

async function loadProjects(lang = 'en') {
    const response = await fetch('/projects/projects.json');
    const data = await response.json();

    const projectList = document.querySelector('.project-list');
    projectList.innerHTML = ''; // Clear existing cards

    data.projects.forEach(project => {
        const primaryTag = project.tags[0];
        const primaryLabel = primaryTag && TAG_LABELS[primaryTag];

        // multiple tags:
        // project.tags
        //     .filter(tag => TAG_LABELS[tag])
        //     .map(tag => `<div class="project-tag">${TAG_LABELS[tag]}</div>`)
        //     .join('')

        const tagDivs = project.tags.map(tag => `<div class="${tag}"></div>`).join('');
        const tagBadges = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');


        // const images = project.assets.map(src =>
        //     `<img src="${src}" alt="${project.name[lang]}" />`
        // ).join('');

        const images = project.assets.map(src => {
            const isLight = src.includes('-light.');
            const isDark = src.includes('-dark.');
            const themeClass = isLight ? 'img-light-only' : isDark ? 'img-dark-only' : '';
            return `<img src="${src}" alt="${project.name[lang]}" class="${themeClass}" />`;
        }).join('');

        const card = document.createElement('li');
        card.className = 'project-card';
        card.dataset.projectId = project.id;

        if (project.status === 'unfinished') card.dataset.projectStatus = 'unfinished';

        card.innerHTML = `
            ${tagDivs}
            <a href="${project['github-url']}" target="_blank" class="project-card-link">
                <div class="project-card-content">
                    <h3 class="project-title">${project.name[lang]}</h3>
                    ${primaryLabel ? `<div class="project-tag">${primaryLabel}</div>` : ''}
                </div>
                <div class="project-card-image">
                    ${images}
                </div>
            </a>
        `;

        // Apply card-level style
        if (project.styles?.card) card.style.cssText = project.styles.card;
        if (project.styles?.['image-container']) {
            card.querySelector('.project-card-image').style.cssText = project.styles['image-container'];
        }

        // Apply per-image styles after innerHTML is set
        if (project.styles) {
            const imageEls = card.querySelectorAll('.project-card-image img');
            imageEls.forEach((img, i) => {
                const key = `image-${i + 1}`;
                if (project.styles[key]) img.style.cssText = project.styles[key];
            });
        }

        projectList.appendChild(card);
    });
}
