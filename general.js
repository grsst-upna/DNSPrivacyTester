

//Function to change the language button of the page

function chang(){
  lang=(document.getElementById('language').innerText).toLowerCase();
  bcheck("s");
}

//Function to change the language of the whole page

function language(reviewa){
  if(npet>0 || rep>0){
    window.location.reload();
  }
  if(lang=="es"){
    if(reviewa==0){
      document.getElementsByTagName("p")[0].innerHTML="Verifica si tu proveedor de Internet manipula el servicio de nombres de Internet (DNS) para obtener información de las webs que visitas y con ello comprometer tu privacidad.<a href='info.html' target='blank'> Más info.</a>";
    }else{
      document.getElementsByTagName("p")[0].innerHTML="Verifica si tu proveedor de Internet manipula el servicio de nombres de Internet (DNS) para obtener información de las webs que visitas y con ello comprometer tu privacidad.";
    }
      document.getElementById('language').innerText="EN";
      document.getElementById('language').title="Switch to english";
      document.getElementById('tip').innerText="* Consejo: Puedes dejar la web funcionando en segundo plano incluso en el móvil.";
      document.getElementsByClassName("poptext")[0].innerText="Su navegador no es compatible con este servicio, por favor utilice chrome o chromium.";
      document.getElementById('main').innerText="Comenzar Test";
      document.getElementsByClassName("button")[0].innerText="Cerrar";
      document.getElementsByClassName('bar-title')[0].innerHTML="Progreso de la prueba <span >(Duración 3 minutos aprox.)</span> ";
      document.getElementById("wait").innerText="Mientras esperas:";
      document.getElementsByClassName("display_collapse")[0].innerText="Mostrar resultados otros usuarios";
      document.getElementsByClassName("display_collapse")[1].innerText="Mostrar gráficas para nerds";
      document.getElementsByClassName("item1")[0].innerText="Duración de la petición";
      document.getElementsByClassName("item2")[0].innerText="Hora a la que se realizó";
      document.getElementById("mlog").innerText="Mostrar tabla de resultados";
      document.getElementById('pie_ti').innerText="Tus resultados VS Resultados ideales";
  }else{
    if(reviewa==0){
      document.getElementsByTagName("p")[0].innerHTML="Check if your Internet service provider (ISP) alters the behaviour of the domain name service (DNS) in order to get information about the webs you visit and compromise your privacy.<a href='info.html' target='blank'> More info.</a>";
    }else{
      document.getElementsByTagName("p")[0].innerHTML="Check if your Internet service provider (ISP) alters the behaviour of the domain name service (DNS) in order to get information about the webs you visit and compromise your privacy.";
    }

    document.getElementById('language').innerText="ES";
    document.getElementById('language').title="Cambiar a español";
    document.getElementById('tip').innerText="* Tip: You can leave the website in the background even on mobile phones.";
    document.getElementsByClassName("poptext")[0].innerText="Your browser is not compatible with the website, please use chrome or chromium.";
    document.getElementById('main').innerText="Start Test";
    document.getElementsByClassName("button")[0].innerText="Close";
    document.getElementsByClassName('bar-title')[0].innerHTML="Test progress <span >(Duration 3 minutes aprox.)</span>";
    document.getElementById("wait").innerText="While waiting:";
    document.getElementsByClassName("display_collapse")[0].innerText="Show results from spanish users";
    document.getElementsByClassName("display_collapse")[1].innerText="Show charts for Nerds";
    document.getElementsByClassName("item1")[0].innerText="Request completion time";
    document.getElementsByClassName("item2")[0].innerText="Time of the request";
    document.getElementById("mlog").innerText="Show results table";
    document.getElementById('pie_ti').innerText="Your results VS ideal results";
  }
}

//Function to get the minimum value from an array

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

//Function to introduce timeouts

function resolveAfter(x,mili) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, mili);
  });
}

//Function to restart the test

function reini(){
  location.reload();
}

//Function to hide or show the charts

function hide(graf){

  if(document.getElementsByClassName("display_collapse")[0].disabled == false || mos==false){

      let tr=["Mostrar resultados otros usuarios","Ocultar resultados otros usuarios","Mostrar gráficas para nerds","Ocultar gráficas para nerds"];

      if(lang!="es"){
        tr=["Show results from spanish users","Hide results from spanish users","Show charts for Nerds","Hide charts for Nerds"];
      }

    if(graf==0){
      let graphs=document.getElementById("global");
      const style = getComputedStyle(graphs);
      const display = style.display;

      if(display=="block"){
        graphs.style.display="none"
        document.getElementsByClassName("display_collapse")[0].innerText=tr[0];
      }else{
        graphs.style.display="block"
        document.getElementsByClassName("display_collapse")[0].innerText=tr[1];
      }
      mos=true;
    }else if(graf==1){
      let graphs=document.getElementById("gpro");
      let logs=document.getElementById("logs");
      const style = getComputedStyle(graphs);
      const display = style.display;

      if(display=="block"){

        document.getElementById("pie_ti").style.display="none";
        logs.style.display="none";
        graphs.style.display="none";
        document.getElementsByClassName("display_collapse")[1].innerText=tr[2];
      }else{
        document.getElementById("pie_ti").style.display="block";
        logs.style.display="block";
        graphs.style.display="block"
        document.getElementsByClassName("display_collapse")[1].innerText=tr[3];
      }
    }

  }
}
