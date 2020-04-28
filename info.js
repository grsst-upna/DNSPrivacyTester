
let lang;

screencheck();


//Function that checks the size of the screen and the language

function screencheck(){
    if(screen.width>719){
      document.body.style.fontSize="1.4vw";
    }else{
      document.body.style.width="720px";
      document.body.style.fontSize="2.6vw";
      mov=true;
    }
    let userLang = navigator.language || navigator.userLanguage;
        lang = userLang.substr(0, 2);
        if(lang!="es" && lang!="en"){
          lang="en";
        }
    bcheck("n");
}

//Function to request a change of the lagunage

function bcheck(camb){

  let url="brows.php?lang="+lang+"&chan="+camb;
  let req = new XMLHttpRequest();

  if (!req) return false;

  req.open("GET", url, true);


      req.onreadystatechange= function(){
        if(req.readyState==4){
          if(req.status===200) {
            let resp=req.responseText.split("-");
            lang=resp[1];
            languageChan();


          }else{
            console.log("Something went wrong");
          }
        }
      }


      req.send();
}

//Function that gets the current language change

function chang(){
  lang=(document.getElementById('language').innerText).toLowerCase();
  bcheck("s");
}

//Function to change the language of the information part

function languageChan(){
  if(lang=="es"){
    document.getElementById('language').innerText="EN";
    document.getElementsByClassName('info-title')[0].innerText="¿Qué es el servicio DNS?";
    document.getElementsByClassName('paragraph')[0].innerText="Las direcciones IP identifican a los servidores en los cuales se alojan las webs de Internet. Para evitar tener que aprender estas direcciones, se les asignan nombres simbólicos (dominios) que son más fáciles de recordar. El servicio DNS es el encargado de preguntar la dirección IP asignada a un dominio concreto a una base de datos en la red.";
    document.getElementsByClassName('paragraph')[1].innerText="Para hacer uso del servicio DNS, tu ordenador debe preguntar a un servidor DNS por la IP asignada a un dominio mediante una petición DNS. Este servidor que controla tu proveedor de Internet, deberá pedir esta información a un servidor DNS autoritativo para responder a tu petición.";
    document.getElementsByClassName('paragraph')[2].innerText="Los servidores DNS autoritativos son los responsables de alojar el registro (mapeo autorizado) para los nombres de determinado dominio DNS, almacenando la dirección IP y el nombre asignado a los equipos de una red.";
    document.getElementsByClassName('paragraph')[3].innerText="Los servidores DNS de los proveedores de Internet se ocupan de pedir información a los servidores autoritativos y entregarla a tu ordenador. Esta información la almacenan durante un tiempo que debe ser marcado por los servidores autoritativos en el campo TTL de las respuestas DNS que envían, de modo que si otro cliente pregunta por ese dominio durante este periodo de tiempo, el servidor puede contestarle directamente sin preguntar al servidor autoritativo.";
    document.getElementsByClassName('paragraph')[4].innerText="Por último, tu ordenador, almacena la información sobre el dominio durante el tiempo marcado en el campo TTL también, y una vez que este tiempo pasa, vuelve a realizar una petición DNS para pedir información sobre el dominio.";
    document.getElementsByClassName('paragraph')[5].innerText="En la siguiente figura se puede ver el proceso que tu equipo lleva a cabo para pedir información sobre un dominio:"
    document.getElementsByTagName('img')[0].src="diagrama.png";

    document.getElementsByClassName('info-title')[1].innerText="¿Cómo afecta su manipulación a mi privacidad?";
    document.getElementsByClassName('paragraph')[6].innerText="Los servidores DNS de los proveedores de Internet anteriormente mencionados pueden alterar el campo TTL de las respuestas DNS, forzando a tu dispositivo a pedir información sobre un dominio con más frecuencia de la que debería, permitiéndoles extraer información sobre el uso que das al servicio de Internet de forma más detallada.";
    document.getElementsByClassName('paragraph')[7].innerText="Actualmente no está globalmente implementado ningún sistema para evitar que el servidor DNS que resuelve las peticiones de un cliente pueda extraer información sobre lo que este busca en Internet, pero reduciendo el TTL de las peticiones DNS la cantidad de información que pueden extraer es mayor y más precisa, comprometiendo de este modo la privacidad del usuario.";

    document.getElementsByClassName('info-title')[2].innerText="¿Cómo detectáis si mi privacidad está comprometida?";
    document.getElementsByClassName('paragraph')[8].innerText="  Para detectar si tu proveedor de Internet está manipulando el servicio DNS realizamos varias peticiones DNS (una cada 10 segundos) pidiendo recursos a un subdominio aleatorio, de modo que en un periodo de 2 a 4 minutos podemos ver si están alterando el servicio DNS o no.";

    document.getElementsByClassName('info-title')[3].innerText="Quienes somos";
    document.getElementsByClassName('paragraph')[9].innerText="Somos un equipo de investigadores del grupo de redes, sistemas y servicios telemáticos de la Universidad Pública de Navarra, con inquietudes en temas de monitorización y seguridad en la red. El objetivo de este proyecto es ofrecer una herramienta fácil y sencilla de usar, que permita mejorar la privacidad de los usuarios de Internet."
  }else{
    document.getElementById('idiom').innerText="ES";
    document.getElementsByClassName('info-title')[0].innerText="What is the DNS service?";
    document.getElementsByClassName('paragraph')[0].innerText="IP addresses identify the servers that store the information of the Internet websites. In order to avoid learning these adresses, they are assigned symbolic names (domains) that are easier to remember. The DNS service duty is asking an Internet database about the IP address assigned to a certain domain.";
    document.getElementsByClassName('paragraph')[1].innerText="In order to use the DNS service, your computer has to ask a DNS server about the IP address assigned to a domain through a DNS query. This server, which is controlled by the Internet service provider, will have to ask an authoritative DNS server to get this information and answer to the query coming from your computer.";
    document.getElementsByClassName('paragraph')[2].innerText="The authorative DNS servers are in charge of storing the DNS information about the IP address and domains assigned to the hosts in the network.";
    document.getElementsByClassName('paragraph')[3].innerText="The Internet service providers' DNS servers are in charge of asking the authorative DNS servers for the DNS information about their hosts, and deliver it to your computer. This information is stored by local DNS servers for a period of time that is defined at the Time To Live (TTL). This way, if another client makes a query about the same domain during this period, the local DNS server can directly answer the query without having to query again the authorative server.";
    document.getElementsByClassName('paragraph')[4].innerText="Your computer store the DNS information about a domain for a period of time defined at the Time To Live (TTL) field as well, and once the information expires, it asks for the domain's information again.";
    document.getElementsByClassName('paragraph')[5].innerText="In the following picture you can observe the steps of the process that your PC undergoes to obtain information about a domain:"
    document.getElementsByTagName('img')[0].src="diagram.png";

    document.getElementsByClassName('info-title')[1].innerText="How does DNS manipulation affect my privacy?";
    document.getElementsByClassName('paragraph')[6].innerText="The local DNS servers can alter the TTL field of the DNS answers in order to force their clients to ask information about a domain more frequently. This allows them to acquire a more detailed knowledge of the use they are giving to the Internet.";
    document.getElementsByClassName('paragraph')[7].innerText="Nowadays there are not fully implemented systems to prevents Internet service providers (ISPs) from gathering information through the DNS service, but by reducing the TTL of the DNS answers they can gather even more information and increase the accurancy of their scanning systems, compromising the privacy of the DNS service users in the process.";

    document.getElementsByClassName('info-title')[2].innerText="How does your website detect if my privacy is compromised?";
    document.getElementsByClassName('paragraph')[8].innerText="To detect if your ISP is manipulating the DNS service we make several queries (one every 10 seconds), asking for resources allocated in random subdomains. In a period of 2 to 4 minutes we gather enough data to know whether ISP is manipulating the DNS service or not.";

    document.getElementsByClassName('info-title')[3].innerText="About us";
    document.getElementsByClassName('paragraph')[9].innerText="We are a research group from the Public University of Navarre whose interests are focused on network security and data analysis. The aim of this proyect is to offer an easy and simple tool that improves the privacy of Internet users ."
  }

}

//Refresh the page when the banner is clicked

function reini(){
  window.open('http://dnsprivacytester.tlm.unavarra.es','_self');
}
