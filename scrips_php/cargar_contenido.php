<?php
// Detecta el idioma (puedes usar una variable de sesión, una cookie, o un parámetro en la URL)
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'es';  // Idioma por defecto: español

// Ruta de la carpeta de idioma
$dir = $lang . '/';

// Función para cargar el contenido de un archivo
function cargar_contenido($archivo) {
    global $dir;
    $ruta = $dir . $archivo;
    if (file_exists($ruta)) {
        return file_get_contents($ruta);
    } else {
        return "Contenido no disponible.";
    }
}
?>
