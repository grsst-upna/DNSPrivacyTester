
//Function to make the progress bar advance consequent to the time that the test has been going on

function pro_bar(step){
  if(document.getElementsByClassName("modal-body")[0].style.backgroundColor!="rgb(68, 68, 68)"){
    document.getElementById("barpro").style.width="100%";
    document.getElementById("barpro").innerHTML="100%";
  }else{
    let bar=document.getElementById("barpro");
    const value=bar.getAttribute("data-value");

    const value=parseFloat(value)+step;
    bar.setAttribute("data-value",value);
    const wd=value+"%";
    bar.style.width=wd;
    bar.innerHTML=value.toFixed(2)+"%";
  }
}

//Function to represent the results from previous clients

function bar_chart(compromised,ncompromised){
    let tr=['Others','Privacy compromised ','Privacy not compromised','Statistics per ISP',"Number of tests done"];

    if(lang=="es"){
       tr=['Otros','Privacidad comprometida','Privacidad no comprometida','Estadísticas por operadores',"Número de tests llevados a cabo"];
    }
    let l=parseFloat(getComputedStyle(document.body).fontSize);
    let sizes=[1.5*l,0.6*l,l*0.6,l*0.5];

    if(mov==true){
      sizes=[1.5*l,0.8*l,l*0.62,l*0.7];
    }

    //We set the data for the traces that we represent and their layout options

    var trace1 = {
      x: ncompromised,
      y: [tr[0], 'ISP4',"ISP3","ISP2","ISP1"],
      name: tr[2],
      hoverinfo:"x",
      textinfo:"x",
      orientation: 'h',
      marker: {
        color: 'rgba(0,153,0,0.8)',
        width: 0.8,
        line: {
          width: [1,1,1,1,1],
          color: "rgba(255,255,255,0.5)"}
      },
      type: 'bar'
    };

    let trace2 = {
      x: compromised,
      y: [tr[0], 'ISP4',"ISP3","ISP2","ISP1"],
      name: tr[1],
      orientation: 'h',
      type: 'bar',
      hoverinfo:"x",
      textinfo:"x",
      marker: {
        color: 'rgba(204,0,0,0.8)',
        width: 0.8,
        line: {
          width: [1,1,1,1,1],
          color: "rgba(255,255,255,0.5)"
        }
      }
    };

    let data = [trace1, trace2];

    //We set the layout options of the dashboard

    let layout = {
      title: tr[3],
      plot_bgcolor:"black",
      paper_bgcolor:"#FFF3",
      titlefont: {
        family: 'Arial, sans-serif',
        size: sizes[0],
        color: 'lightgrey'
      },
      barmode: 'stack',
      margin:{
        b:110
      },
      xaxis: {
        title:tr[4],
        titlefont: {
          family: 'Arial, sans-serif',
          size: sizes[1],
          color: 'lightgrey'
        },
        rangemode: 'nonnegative',
        autISP3: true,
        color:"#fff",
        ticks: 'outside',
        tickfont:{
          family: 'Arial, sans-serif',
          size: sizes[3],
          color: 'lightgrey'
        },
        ticklen: 2,
        tickwidth: 1,
        tickcolor: '#fff'

    },
    yaxis: {
      title:"",
      titlefont: {
        family: 'Arial, sans-serif',
        size: 0,
        color: 'lightgrey'
      },
      automargin: true,
      color:"#fff",
      autISP3: true,
      ticks: 'outside',
      ticklen: 2,
      tickwidth: 1,
      tickfont:{
        family: 'Arial, sans-serif',
        size: sizes[3],
        color: 'lightgrey'
      },
      tickcolor: '#fff'

    },
    legend: {
      x: 1,
      y: 1,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: sizes[2],
        color: 'lightgrey'
      },
      bgcolor: 'rgba(0,0,0,0)',
      bordercolor: 'rgba(0,0,0,0)',
      borderwidth: 2
    },
    bargap:0.3
    };

    //We create the bar plot for the ISPs information 

    Plotly.newPlot('bar',data, layout,{responsive: true});
    if(mos==false){
        hide(0);
        mos=true;
          document.getElementsByClassName("display_collapse")[0].disabled = false;
          document.getElementsByClassName("display_collapse")[1].disabled = false;
    }

}

//Function to request the information about the previous tests done before

function requestStats(){

  let url="ISPdata.php?time=2";
  let req = new XMLHttpRequest();

  if (!req) return false;
  req.onreadystatechange= function(){
    if(req.readyState==4){
      if(req.status===200) {
        let operadores = JSON.parse(req.responseText);
        let cont2=0;
        let compromised=[0,0,0,0,0];
        let ncompromised=[0,0,0,0,0];

        while(operadores[cont2]!=null){
          let c1=operadores[cont2];

            compromised[4-cont2]=c1['compromised'];
            ncompromised[4-cont2]=c1['ncompromised'];
            cont2++;
          }
          bar_chart(compromised,ncompromised);
        }else{
          console.log(req.responseText);
        }

      }
    }
    req.open("GET", url, true);
    //req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    req.send();
}
