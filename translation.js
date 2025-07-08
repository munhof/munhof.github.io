const translations = {}; // Object to store loaded translations
let currentLang = 'es'; // Default language

async function loadTranslations(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations[lang] = await response.json();
        console.log(`Translations for ${lang} loaded.`);
    } catch (error) {
        console.error(`Could not load translations for ${lang}:`, error);
    }
}

function applyTranslations() {
    const langData = translations[currentLang];
    if (!langData) {
        console.warn(`Translations for ${currentLang} not loaded yet.`);
        return;
    }

    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            // Handle special cases like <a> innerHTML or <input> placeholder
            if (element.tagName === 'A' && element.dataset.i18nLinkText) {
                element.innerHTML = langData[key];
            } else if (element.tagName === 'TITLE') {
                document.title = langData[key];
            } else if (element.dataset.i18nHtml) { // For content that can contain HTML (e.g., copyright with &copy;)
                element.innerHTML = langData[key];
            }
            else {
                element.textContent = langData[key];
            }
        } else {
            console.warn(`Missing translation key: ${key} for language ${currentLang}`);
        }
    });

    // Set the lang attribute on the html tag
    document.documentElement.lang = currentLang;

    console.log(`Applied translations for ${currentLang}`);
}

// Function to change language
async function changeLanguage(lang) {
    currentLang = lang;
    // If translations for the new language are not loaded, load them
    if (!translations[lang]) {
        await loadTranslations(lang);
    }
    applyTranslations();
}

// Event listeners for language switcher buttons
document.addEventListener('DOMContentLoaded', async () => {
    // Load default language first, then apply
    const browserLang = navigator.language.split('-')[0]; // Get primary language from browser
    const initialLang = ['es', 'en'].includes(browserLang) ? browserLang : 'es'; // Fallback to ES

    await changeLanguage(initialLang); // Load and apply initial language

    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.addEventListener('click', (event) => {
            changeLanguage(event.target.dataset.lang);
        });
    });
});