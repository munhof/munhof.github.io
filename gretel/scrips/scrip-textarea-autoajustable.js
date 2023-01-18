

document.getElementById("textarea_form").addEventListener("input", function(){
    var num_lineas = document.getElementById("textarea_form").value.split(/\r\n|\r|\n/, -1).length;
    document.getElementById("textarea_form").style.height = num_lineas.toString()+"em";
    document.getElementById("textarea_label").style.cssText = "transform: translateY("+(-num_lineas-3).toString()+"em) scale(.9); transition: transform 0s, color 0s;"
  });
