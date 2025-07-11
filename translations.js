const translations = {}; // Objeto para almacenar las traducciones cargadas
let currentLang = 'es'; // Idioma por defecto (puedes cambiarlo a 'en' si lo prefieres)

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

    // Traducir elementos con atributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            // Manejo especial para el título de la página
            if (element.tagName === 'TITLE') {
                document.title = langData[key];
            }
            // Manejo para contenido que puede contener HTML (ej. copyright)
            else if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = langData[key];
            }
            // Para el resto de elementos, usar textContent
            else {
                element.textContent = langData[key];
            }
        } else {
            console.warn(`Missing translation key: "${key}" for language ${currentLang}`);
        }
    });

    // Establecer el atributo lang en la etiqueta html
    document.documentElement.lang = currentLang;

    console.log(`Applied translations for ${currentLang}`);
}

// Función para cambiar de idioma
async function changeLanguage(lang) {
    // Si el idioma es el mismo que el actual, no hacer nada
    if (currentLang === lang && translations[lang]) {
        console.log(`Language is already ${lang}, no change needed.`);
        return;
    }

    currentLang = lang;
    // Si las traducciones para el nuevo idioma no están cargadas, cárgalas
    if (!translations[lang]) {
        await loadTranslations(lang);
    }
    applyTranslations();
}

// Event listeners para los botones de cambio de idioma
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar el idioma predeterminado primero, luego aplicar.
    // Intenta detectar el idioma del navegador. Si es 'es' o 'en', úsalo. Si no, por defecto a 'es'.
    const browserLang = navigator.language.split('-')[0]; // Obtiene el idioma primario del navegador (ej. 'es' de 'es-ES')
    const initialLang = ['es', 'en'].includes(browserLang) ? browserLang : 'es';

    await changeLanguage(initialLang); // Carga y aplica el idioma inicial

    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.addEventListener('click', (event) => {
            changeLanguage(event.target.dataset.lang);
        });
    });
});
