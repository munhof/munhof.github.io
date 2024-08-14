<?php
session_start();

if (isset($_GET['lang']) && in_array($_GET['lang'], ['es', 'en', 'pt'])) {
    $_SESSION['lang'] = $_GET['lang'];
}

header('Location: ' . $_SERVER['HTTP_REFERER']); // Redirige a la página anterior
exit();