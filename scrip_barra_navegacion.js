
document.getElementById("navbar-toggler").addEventListener("click", function() {
    let estado_menu_expand = document.getElementById("navbarNavAltMarkup").className;
    if (estado_menu_expand == "collapse navbar-collapse"){
        document.getElementById("navbarNavAltMarkup").className = "navbar-collapse"  
    }else
    document.getElementById("navbarNavAltMarkup").className = "collapse navbar-collapse";
})
