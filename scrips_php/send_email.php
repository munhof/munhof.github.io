<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoge los datos del formulario
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $asunto = filter_var($_POST['Asunto'], FILTER_SANITIZE_STRING);
    $cuerpo = filter_var($_POST['Cuerpo'], FILTER_SANITIZE_STRING);

    // Configura los detalles del correo
    $to = 'facundo.munho@munhof.com'; // Reemplaza con tu dirección de correo en Zoho
    $subject = $asunto;
    $message = $cuerpo;
    $headers = "From: " . $email . "\r\n" .
               "Reply-To: " . $email . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Envía el correo
    if (mail($to, $subject, $message, $headers)) {
        echo "Correo enviado correctamente.";
    } else {
        echo "Error al enviar el correo.";
    }
} else {
    echo "Método de solicitud no permitido.";
}
?>
