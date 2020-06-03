"use strict";

var myChart;

$(function(){
    $.ajax({
        type:'GET',
        url:"https://frank-dopatka.de/tradingtool/getISINs/",
        success: function(corporations){
            $.each(corporations.kursreihen, function(i, corporation){
                var element=document.createElement("option");
                element.innerText=corporation.isin + ", " + corporation.name;
                document.getElementById("selection").appendChild(element);
            });
        }
    });
});


function toDate(datum){
    let day=datum.substr(0,2);
    let month=datum.substr(3,2);
    let year=datum.substr(6,4);
    return new Date(year, month, day);
}

function selectCorporation(){
    var selection = document.getElementById("selection").value.substr(0,12);
    $.ajax({
        type:'GET',
        url:"https://frank-dopatka.de/tradingtool/getKursreihe/" + selection +"/05.02.2020",
        success: function(shareData){
            var shareInformation=[];
            var currency=shareData.einheit;
            $.each(shareData.kurse, function(i, share){
                shareInformation.push({x: toDate(share.datum), y: share.c});
            });
            //Graph darstellen
            if(myChart!=null){
                myChart.destroy();
            }
            var ctx= $("#myChart");

            var options = {
                scales: {
                    xAxes: [{ticks: {callback: (value) => {return new Date(value).toLocaleDateString("de-DE", {day: "numeric",month: "short",year: "numeric"});}}}],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: currency
                        }
                    }]
                },
                responsive: true,
                maintainAspectRatio: false
            };
            myChart = new Chart(ctx, { type: 'scatter',
                                       data: {
                                           datasets: [{
                                               label: selection, // Name the series
                                               data: shareInformation, // Specify the data values array
                                               borderColor: "#2196f3",
                                               fill: false,
                                               showLine:true,
                                               backgroundColor: "#2196f3",
                                               pointRadius: 1,
                                               hoverRadius: 10
                                           }]
                                       },
                                       options: options
            });

        }
    })




}
