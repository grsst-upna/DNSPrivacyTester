//Global variables used through the tool

let m=[-1,-1,-1];
let cuenta=[0,0,0];
let i=1;
let j=0;
let npet=0;
let warden=0;
let rep=0;
let countOS=0;
let mos=false;
let uf=3;
let mov=false;
let lang;
let urlf;


screencheck();

//Function to check the screen size and adapt the web

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

//Function that checks the browser,if the user is using google chrome as a browser
//and a valid operating system, the test will be started

function bcheck(chan){

  let url="brows.php?lang="+lang+"&chan="+chan;
  let req = new XMLHttpRequest();

  if (!req) return false;

  req.open("GET", url, true);


      req.onreadystatechange= function(){
        if(req.readyState==4){
          if(req.status===200) {

            let button=document.getElementById("main");

            let resp=req.responseText.split("-");
            lang=resp[1];
            let Os=resp[2];

            if(Os=="Windows"){
              uf=2;
            }else if(Os=="Macintosh" || Os=="Android"){
              uf=0.8
            }else{

              i=700;
              let texto_os="Por favor, utilize dispositivos Android, Windows o MacOS para realizar el test. ";
              if(lang!="es"){

                texto_os="Please use Android, Windows or MacOS devices to conduct the test";

              }

              language(1);

                let pop=document.getElementsByClassName("poptext")[0];
                pop.innerText=texto_os;


                $("#myModal").modal();

                $("#main").removeAttr('onclick');
                button.setAttribute("data-toggle", "modal");
                button.setAttribute("data-target", "#myModal");
            }

            if(resp[0]!="Chrome" && i<700){
               $("#myModal").modal();
                i=800;
                $("#main").removeAttr('onclick');
                button.setAttribute("data-toggle", "modal");
                button.setAttribute("data-target", "#myModal");
                language(1);
            }else if(i<700){

              button.addEventListener("click",test);
              language(0);
            }
          }else{
            console.log("Something went wrong.");
          }
        }
      }


      req.send();
}


//Main function that start the test
async function test(){
  document.getElementById("main").style.display="none";
  document.getElementById("gbas").style.display="block";
  if(true){
    document.getElementsByClassName("display_collapse")[0].style.display="block";
    document.getElementsByClassName("display_collapse")[1].style.display="block";
  }

  send_req();
  loop();
  lo_pro();
}

//Loop function to send a request for a resource in case the test can be done

async function loop(){
  while(true){
    if(i==800){
      console.log("La web no es compatible con firefox en linux, recomendamos usar Chromium.");
      break;
    }else if(i==1000){
      break;
    }else if(i==700){
       console.log("La web no sirve para dispositivos iOS o Linux");
      break;
    }
    else if(i<700){
      let x = await resolveAfter(10,10000);

      send_req();
      if(i==3){
        i=0;
      }
    }
  }
}

//Loop function to update the information displayed at the progress bar

async function lo_pro(){
  let cont=0;
  while(cont<150){
    if(document.getElementsByClassName("modal-body")[0].style.backgroundColor!="rgb(68, 68, 68)"){
      cont=150;
    }else{
      let y = await resolveAfter(10,1000);
      pro_bar(10/16);
      cont++;
    }
  }
  let xy = await resolveAfter(10,1000);
  if(document.getElementsByClassName("modal-body")[0].style.backgroundColor=="rgb(68, 68, 68)"){
    if(rep!=0){
      cont=0;
      let barra=document.getElementById("probar");
      barra.setAttribute("data-value","50");
      barra.style.width="50%";
      barra.innerHTML="50%";
      while(cont<160){
        if(document.getElementsByClassName("modal-body")[0].style.backgroundColor!="rgb(68, 68, 68)"){
          cont=160;
        }else{
          let y = await resolveAfter(10,1000);
          pro_bar(10/32);
          cont++;
        }
      }
    }
  }
}

//Function that request a resource to measure how much time is needed to get it

async function send_req(){

    let d1 = new Date();
    let v=Math.random().toString(36).substring(2, 15)+d1.getTime();

    performance.clearResourceTimings();

      //console.log(npet)
      if(npet==0){
        urlf="http://"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+".dnsprivacytester.tlm.unavarra.es/resource.php?t=";
      }

      let urls=urlf+v;

      console.log(urls);

        let req = new XMLHttpRequest();

        if (!req) return false;

        if (typeof exito != 'function') exito = function () {};
        error = function () {alert("connection error.");};

        req.open("GET", urls, true);

        req.onreadystatechange = function(){

            if(req.readyState == 4) {
              if(req.status===200) {

                console.log()

                  let p = performance.getEntries();
                  let  pr=p[p.length-1];
                  i=i+1;
                    let result=parseFloat(pr['domainLookupEnd']-pr['domainLookupStart']);
                        result=result.toFixed(2);
                        sendResults(result,urlf);
              }
    }
  }
    req.send();

    return false;

}



//Function to send the results to be stored in a file
function sendResults(result,url2){

  let url="analisys.php?result="+result+"&domain="+url2;
  let req = new XMLHttpRequest();

  if (!req) return false;

  req.open("GET", url, true);


      req.onreadystatechange=  async function(){
        if(req.readyState==4){
          if(req.status===200) {

            if(req.responseText=="10 intentos en menos de 60 mins." && i<500){

              let texto="No se permite realizar más de 20 veces el test en una hora.";
              if(lang!="es"){
                texto="It is not allowed to perform the test more than 20 times in an hour.";
              }

              i=1000;
              let pop=document.getElementsByClassName("poptext")[0];
              pop.innerText=texto;
              pop.parentNode.style.backgroundColor="GoldenRod";
              $("#myModal").modal();

            }else if(req.responseText=="NSDB"){
              window.location.reload();

            }else if(req.responseText=="NSDB-T"){

              let texto="Por favor, espere antes de reintentar el test al menos 30 segundos.";

              if(lang!="es"){
              texto="Please, wait 30 seconds before doing the test again.";

              }

               let pop=document.getElementsByClassName("poptext")[0];
              pop.innerText=texto;
             pop.parentNode.style.backgroundColor="GoldenRod";

          		$("#myModal").modal();
          		let x = await resolveAfter(10,10000);
          		window.location.reload();
            }else if(req.responseText=="FFF"){
                opstat(url2);
                 urlf="http://"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+".dnsprivacytester.tlm.unavarra.es/resource.php?t=";

            }else{
              //let datos=JSON.parse(req.responseText);

              let date = new Date;
              let seconds = date.getSeconds();
              let minutes = date.getMinutes();
              let hour = date.getHours();
              if(minutes<10){
                minutes="0"+minutes;
              }
              if(seconds<10){
                seconds="0"+seconds;
              }
              if(hour<10){
                hour="0"+hour;
              }

              let datos=hour+":"+minutes+":"+seconds;

              //check(result,url2);
              advancedChart(result,datos);
              if(mos==false){
                hide(1);
              }
              if(i==2){
              requestStats();
              }
            }
          }else{
            console.log("Something went wrong");
          }
        }
      }
      req.send();
}

//This function tells to the user the results of the test and restarts it in case it was not enough taking 18 samples

function opstat(url2){
  let url="ISPdata.php?domain="+url2;
  let req = new XMLHttpRequest();


  if (!req) return false;

  req.open("GET", url, true);

  req.onreadystatechange= function(){
    if(req.readyState==4){
      if(req.status===200) {
        if(req.responseText=="NL"){
          location.reload();
        }else if(document.getElementsByClassName("modal-body")[0].style.backgroundColor=="rgb(68, 68, 68)"){

          let tr=["result: Su privacidad está comprometida. Su proveedor está manipulando el servicio de nombres DNS.","Resultado: Su privacidad no está comprometida."];
          if(lang!="es"){
            tr=["Result: Your privacy is compromised. Your Internet service provider is altering the behaviour of the domain name service DNS.","Result: Your privacy is not compromised"];
          }

          if(req.responseText=="POS"){

            let pop=document.getElementsByClassName("poptext")[0];
            pop.innerText=tr[0];
            pop.parentNode.style.backgroundColor="DarkRed";
            $("#myModal").modal();

          }else if(req.responseText=="NEG"){

            let pop=document.getElementsByClassName("poptext")[0];
            pop.innerText=tr[1];
            pop.parentNode.style.backgroundColor="darkgreen";
            $("#myModal").modal();

          }else if(req.responseText=="REP"){

            rep=npet;

          }

        }

        }
      }
  req.send();
}
