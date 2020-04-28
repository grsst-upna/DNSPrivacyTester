
//Function to display the advanced charts in the web page

function advancedChart(result,time){

  let tr=["Number of request","Request completion time (ms)",'Browser cache','Operating system cache','DNS request','Your results','Ideal results',"DNS requests"];

  if(lang=="es"){
    tr=["Número de petición","Tiempo en realizar la petición (ms)",'Cache navegador','Cache sistema operativo','Petición DNS','Tus results','results ideales',"Peticiones DNS"];
  }
  let Gresults=[18,0,2];
  if(uf==3){
    let Gresults=[16,2,2];
  }
  npet++;
  let col1=document.getElementsByClassName("data1")[0];
  let to_pe= document.createElement("div");
      to_pe.innerText=result;
      to_pe.classList.add("cells");
      col1.appendChild(to_pe);
  let col2=document.getElementsByClassName("data2")[0];
  let tp_pe= document.createElement("div");
      tp_pe.innerText= time;
      tp_pe.classList.add("cells");
      col2.appendChild(tp_pe);
  document.getElementsByClassName('table')[0].style.display="grid";
      let point=parseFloat(result);
      let l=parseFloat(getComputedStyle(document.body).fontSize);

      let sizes=[l*0.6,l*0.58,l*0.385,l*0.96,l*0.615,l*1.5,l*0.5];

      if(mov==true){
        sizes=[l*0.8,l*0.58,l*0.385,l*0.96,l*0.615,l*1.5,l*0.8];
      }

      //Chart for the times registered during the test

      //Options settled for the layout
      let layout={
        title: tr[3],

        titlefont: {
          family: 'Arial, sans-serif',
          size: sizes[5],
          color: 'lightgrey'
        },
        plot_bgcolor:"black",
        paper_bgcolor:"#FFF3",
        margin:{
          b:110
        },
        xaxis: {
          title:tr[0],
          titlefont: {
            family: 'Arial, sans-serif',
            size: sizes[0],
            color: 'lightgrey'
          },
          rangemode: 'nonnegative',
          autorange: true,
          color:"#fff",
          ticks: 'outside',
          tickfont:{
            family: 'Arial, sans-serif',
            size: sizes[6],
            color: 'lightgrey'
          },
          ticklen: 2,
          tickwidth: 1,
          tickcolor: '#fff'

      },
      yaxis: {
        title: tr[1],
        titlefont: {
          family: 'Arial, sans-serif',
          size: sizes[0],
          color: 'lightgrey'
        },
        tickfont:{
          family: 'Arial, sans-serif',
          size: sizes[6],
          color: 'lightgrey'
        },
        type:"log",
        range: [-3, 4],
        color:"#fff",
        ticks: 'outside',
        ticklen: 2,
        tickwidth: 0.2,
        tickcolor: '#fff'

      },
      legend: {
        x: 1,
        y: 1,
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: sizes[1],
          color: 'lightgray'
        },
        bgcolor: 'rgba(0,0,0,0)',
        bordercolor: 'rgba(0,0,0,0)',
        borderwidth: 2
      }
    }

      //Browser cache
      if((point<=0.2) || ((uf==1) && (point<uf))){
        if(m[0]==-1){
          cuenta[0]++;
          Plotly.plot('chart',[{
                 y:[point],
                 x:[npet],
                 mode: 'markers',
                 type:'scatter',
                 marker: {
                   color: "rgb(0, 255, 0)",
                   size: sizes[2]
                 },
                 name: tr[2]

           }],layout);
           m[0]=j;
           j++;
         }else{
           cuenta[0]++;
           Plotly.extendTraces('chart', {y : [[point]],x : [[npet]]},[m[0]])
        }
       }
      //OS cache
       else if(point>0.2 && point<uf && uf==3){
         if(m[1]==-1){
          cuenta[1]++;
           Plotly.plot('chart',[{
                  y:[point],
                  x:[npet],
                  mode: 'markers',
                  type:'scatter',
                  marker: {
                    color: "rgb(255, 255, 0)",
                    size: sizes[2]
                  },
                  name: tr[3]
            }],layout);
            m[1]=j;
            j++;
          }else{
            cuenta[1]++;
            Plotly.extendTraces('chart', {y : [[point]],x : [[npet]]},[m[1]])
          }
       }

      //DNS request

       else if(point>uf)
       {
         if(m[2]==-1){
           cuenta[2]++;
           Plotly.plot('chart',[{
                  y:[point],
                  x:[npet],
                  mode: 'markers',
                  type:'scatter',
                  marker: {
                    color: "rgb(255, 0, 0)",
                    size: sizes[2]
                  },name: tr[4]
          }],layout);
          m[2]=j;
          j++;
        }else{
          cuenta[2]++;
          Plotly.extendTraces('chart', {y : [[point]],x : [[npet]]},[m[2]])
        }
      }
      let layoutp = {
      showlegend: true,
      legend:{
        font: {
          family: 'sans-serif',
          size: sizes[1],
          color: '#FFF',
          traceorder:"normal"
        },

        bgcolor: 'rgba(0,0,0,0)',
        bordercolor: 'rgba(0,0,0,0)',
        borderwidth: 2
      },
      grid: {rows: 1, columns: 2}
      };

      //Pie chart for displaying the same information that was displayed before

      Plotly.newPlot('pie1',[{
        text: tr[7],
        values: cuenta,
        textinfo: "percent",
        name:"",
        labels: [tr[2], tr[3], tr[4]],
        marker: {
        colors: ["rgb(0, 153, 0)","rgb(192, 192, 0)","rgb(204, 0, 0)"],
        line:{
          width:2,
          color: "rgba(0,0,0,0.3)"
        }
        },
        textposition: 'auto',
        domain: {column: 0},
        hole: .6,
        type: 'pie'

      },{
        text: "Peticiones DNS",
        values: Gresults,
        name:"",
        textinfo: "percent",
        labels: [tr[2], tr[3], tr[4]],

        marker: {
        colors: ["rgb(0, 153, 0)","rgb(192, 192, 0)","rgb(204, 0, 0)"],
        line:{
          width:2,
          color: "rgba(0,0,0,0.3)"
        }
        },
        textposition: 'auto',
        domain: {column: 1},
        hole: .6,
        type: 'pie',
      }],layoutp,{responsive: false});

  }
