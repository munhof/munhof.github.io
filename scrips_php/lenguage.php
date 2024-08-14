<?php
session_start();

function get_default_language() {
    $lang = 'en'; // Idioma por defecto

    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $languages = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
        $primary_language = substr($languages[0], 0, 2); // Primer idioma

        // Definir idioma basado en la configuración del navegador
        if (in_array($primary_language, ['en', 'es', 'pt'])) {
            $lang = $primary_language;
        }
    }

    return $lang;
}

function get_current_language() {
    if (isset($_SESSION['lang'])) {
        return $_SESSION['lang'];
    } else {
        // Aquí puedes elegir entre `get_default_language()` o `get_language_from_ip()`
        return get_default_language();
    }
}