<?php
    include "configuracion.php"
    
?>
<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MunhoF_dev</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="estilo.css"/>
    <link rel="icon" href="MunhoF_ICO.ico" type="image/x-icon">
</head>

<body>
    <header class="fixed-top">
    <nav class="navbar navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
        <a class="navbar-brand" href="#munhof.github.io">MunhoF</a>
        <button id="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-link active" aria-current="page" href="#quien_soy"><?php echo $lang['Quien soy'] ?></a>
                    <a class="nav-link active" href="#proyectos"><?php echo $lang["Proyectos"] ?></a>
                    <a class="nav-link active" href="#contactame"><?php echo $lang["Contacto"] ?></a>
                    <a class="nav-link" href="index.php?lang=es"><?php echo $lang['es'] ?></a>
                    <a class="nav-link" href="index.php?lang=en"><?php echo $lang['en'] ?></a>
                    <a class="nav-link" href="index.php?lang=po"><?php echo $lang['po'] ?></a>
                </div>
            </div>
        </div>
    </nav>
    <script src="scrip_barra_navegacion.js"></script>
    </header>

    <div id="titulo" class="container container-lg">
        <h1 class="text-center">MunhoF &lt;dev&gt;</h1>     
    </div>


    <section id="quien_soy" class="seccion">

    <div id="titulo_quien_soy" class="container-fluid container-fluid-lg titulo-seccion" >
        <h2 class="text-center"><?php echo $lang['Quien soy']?></h2>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-6 col-lg-4 ">
                <div class="card text-white bg-dark back_light carta-presentacion" id="carta-presentacion">
                    <div class="card-body">
                        <h3 class="card-title text-center"><?php echo $lang['Quien soy']?></h3>
                        <p class="card-text">
                            <span><?php echo $lang['Texto quien soy']?></span>
                        </p>
                    </div> 
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
            <div class="card text-white bg-dark back_light carta-presentacion" id="carta-presentacion">
                    <div class="card-body">
                        <h3 class="card-title text-center"><?php echo $lang['Formacion']?></h3>
                        <p class="card-text">
                            <span><?php echo $lang['Texto Formacion']?> </span>
                        </p>
                    </div>
            </div>
            </div>
            <div class="col-md-12 col-lg-4">
                <div class="card text-white bg-dark back_light carta-presentacion">
                    <div class="card-body text-center"> 
                        <h3><?php echo $lang['Habilidades']?></h3>
                            <p>
                                <span><?php echo $lang['Texto Habilidades']?></span>
                            </p>
                            
                        
                    
                    </div>
                </div>
            </div>
      </div>
    </div>
    

    </section>

    <section id="proyectos" class="seccion">

    <div id="titulo_quien_soy" class="container-fluid container-fluid-lg" >
        <h2 class="text-center"><?php echo $lang['Proyectos']?></h2>
    </div>
    <h5 class="text-center"> <?php echo $lang['Texto Proyectos']?>
    </h5>
    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">

        <div class="carousel-inner">
            <div class="carousel-item active text-center">
                <img class="rounded mx-auto d-block w-50" src="https://www.shutterstock.com/image-vector/cute-cat-sitting-on-laptop-260nw-1453678082.jpg" alt="First slide">
            </div>
            <div class="carousel-item text-center">
                <img class="rounded mx-auto d-block w-50" src="https://img.freepik.com/vector-premium/gato-lindo-dibujado-mano-ilustracion-caja_118282-154.jpg?w=740" alt="Second slide">
            </div>
            <div class="carousel-item text-center">
                <img class="rounded mx-auto d-block w-50" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsZAFrjDAT3P84vVLWU6H_O9QlHSSx51rxwab6m4tGM20jSlKE_poWtEHELDNTnOWBDew&usqp=CAU" alt="Third slide">
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
      </div>

    <div id="titulo_quien_soy" class="container-fluid container-fluid-lg" >
        <h2 class="text-center"><?php echo $lang['Otros proyectos']?></h2>
    </div>

    <div id="otros proyectos" class="container-fluid container-fluid-lg" >
        <h6 class="text-center">
            <a href="">Bouquet of flowers</a>
            <a href="">Bag of popcorn</a> 
            <a href="">Pillow</a>
            <a href="">Can of peas</a>
            <a href="">Beef</a>
            <a href="">Quartz crystal</a>
        </h6>         
    </div>


    <section id="contactame" class="container">

    <h2  class="text-center" id="titulo-contactame">
        <?php echo $lang['Contacto']?>
    </h2>

    <p  class="text-center" id="texto-contactame">
        <?php echo $lang['Texto Contactame']?>
    </p>
    
    <form action="send_email.php" method="POST" id="formulario-contacto">
        <div class="row mb-3">
            <div class="col-1"></div>
            <label for="inputEmail3" class="col-sm-1 col-form-label">Email</label>
            <div class="col col-md-8">
                <input type="email" placeholder="juan@mail.com" class="form-control" id="inputEmail3" name="email">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-1"></div>
            <label for="inputAsunto3" class="col-sm-1 col-form-label">Asunto</label>
            <div class="col col-md-8">
                <input type="asunto" placeholder=<?php echo $lang['Asunto']?> class="form-control" id="inputPassword3" name="Asunto">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-1"></div>
            <label for="colFormLabel" class="col-sm-1 col-form-label"><?php echo $lang['Cuerpo']?></label>
            <div class="col col-md-8">
                <textarea class="form-control" placeholder="<?php echo $lang['Cuerpo']?>" id="floatingTextarea2" style="height: 100px" name="Cuerpo"></textarea>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-1"></div>
            <label for="colFormLabel" class="col-sm-1 col-form-label"></label>
            <div class="col col-md-8 d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" class="btn btn-primary me-md-2"> <a href="#contactame" name="buton"><?php echo $lang['Enviar']?></button>
            </div>
        </div>
    </form>

    </section>



<!-- Footer -->
<footer class="bg-dark text-center text-white sticky-bottom">
    <!-- Grid container -->
    <div class="container p-4">
      <section class="mb-4">
        <ul class="nav justify-content-center">
            <li class="botton-level-entry-containter">
                <a class="botton-level-entry" href="https://twitter.com/MunhoF_Dev">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-twitter" viewBox="0 0 25 25">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                    </svg> 
                </a>
            </li>
            <li class="botton-level-entry-containter">
                <a class="botton-level-entry" href="https://www.linkedin.com/in/facundo-nicolas-munhó-vital-8488ba160/"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 25 25">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                </a>
            </li>
            <li class="botton-level-entry-containter">  
                <a class="botton-level-entry" href="https://github.com/munhof">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-github" viewBox="0 0 25 25">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg> 
                </a>
            </li>
        </ul>
      </section>
  
      <!-- Section: Text -->
      <section class="mb-4">
        <p>
            <?php echo $lang['Texto redes sociales']?>
        </p>
      </section>
      <!-- Section: Text -->
  
      <!-- Section: Links -->
      <section class="">
        <ul class="nav justify-content-center">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#quien_soy"><?php echo $lang['Quien soy']?></a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="#proyectos"><?php echo $lang['Proyectos']?></a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="#contactame"><?php echo $lang['Contacto']?></a>
            </li>
        </ul>    
      </section>
      <!-- Section: Links -->
    </div>
    <!-- Grid container -->
  
    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
      © 2024 Copyright:
      <a class="text-white" href="https://munhof.github.io/">munhof.github.io</a>
    </div>
    <!-- Copyright -->
  </footer>
  <!-- Footer -->

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>