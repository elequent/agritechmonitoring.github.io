
 
            var allText;
            function readTextFile(file)
            {
                var rawFile = new XMLHttpRequest();
                rawFile.open("GET", file, false);
                rawFile.onreadystatechange = function ()
                {
                    if(rawFile.readyState === 4)
                    {
                        if(rawFile.status === 200 || rawFile.status == 0)
                        {
                            allText = rawFile.responseText;             
                        }
                    }
                }
                rawFile.send(null);
            }
            var namesSMI = ['SM30', 'SM40', 'SM50', 'SM60', 'SM70', 'SM80', 'SM90', 'SM100']; 
            function readlongdata(start)
            {
                var t1 = allText.split("\n");
                
                var array = [];
                for (var i=0;i<t1.length;i++)
                {
                    array[i] = t1[i].split(",");
                }                
                var length = array.length;          
                var d = [];
                for (var i=0;i<8;i++)
                {
                    d[i] = [];
                    if (start == 0)
                    {
                        for (var j=0;j<length-1;j++)
                        {
                            if (array[j][0] != "")
                            {
                                var parts = array[j][0].split('/');
                                var parts1 = array[j][1].split(':'); 
                                var x = Date.UTC(parts[2], parts[1]-1, parts[0],parts1[0],parts1[1]);
                                var y = Number(array[j][i+2]);
                                d[i].push([x,y]);
                            }
                        }
                    }
                    else
                    {
                        for (var j=length-1-2880;j<length-1;j++)
                        {
                            if (array[j][0] != "")
                            {
                                var parts = array[j][0].split('/');
                                var parts1 = array[j][1].split(':'); 
                                var x = Date.UTC(parts[2], parts[1]-1, parts[0],parts1[0],parts1[1]);
                                var y = Number(array[j][i+2]);
                                d[i].push([x,y]);
                            }
                        }
                    }

                }
                var temparray = [];
                  
                for (var i=0;i<8;i++)
                {
                    temparray[i] = {
                        name: namesSMI[i],
                        data: d[i]
                    };                
                }                
                return temparray;   
            }

            function readdata(start)
            {
                var t1 = allText.split("\n");
                var array = [];
                for (var i=0;i<t1.length;i++)
                {
                    array[i] = t1[i].split(",");
                }                
                var length = array.length;
                var d = [];
                var cumrain = 0;	

                if (start == 0)
                {
                    for(var i=0;i<length-1;i++)
                    {
                        var parts = array[i][0].split('/');
                        var parts1 = array[i][1].split(':');
                        if (parts1[0] == 6 && parts1[1] == 0)
                        {
                            var x = Date.UTC(parts[2], parts[1]-1, parts[0] - 1);                     
                            var y = cumrain;
                            d.push([x,y]);
                            cumrain = 0;
                            cumrain = cumrain + Number(array[i][2]);
                        }
                        else
                        {
                            cumrain = cumrain + Number(array[i][2]);
                        }
                    }  
                }
                else
                {
                    for(var i=length-1-8640;i<length-1;i++)
                    {
                        var parts = array[i][0].split('/');
                        var parts1 = array[i][1].split(':');
                        if (parts1[0] == 6 && parts1[1] == 0)
                        {
                            var x = Date.UTC(parts[2], parts[1]-1, parts[0] - 1);                     
                            var y = cumrain;
                            d.push([x,y]);
                            cumrain = 0;
                            cumrain = cumrain + Number(array[i][2]);
                        }
                        else
                        {
                            cumrain = cumrain + Number(array[i][2]);
                        }
                    }  
                }

   
                var temparray = [];
                names = ['RainSum'];   
                for (var i=0;i<1;i++)
                {
                    temparray[i] = {
                        type: 'column',
                        name: names[i],
                        data: d
                    };                
                }                
                return temparray; 
            }

            readTextFile("Files/b1temp.csv");
            var temp = readlongdata(1);
            readTextFile("Files/b1moist.csv");
            var moist = readlongdata(1);  
            readTextFile("Files/b1rain.csv");
            var rainsum = readdata(1);  


            document.addEventListener('DOMContentLoaded', function () {


                function drawchart(id, d, title, subtitle, yaxis)
                {
                    var myChart = Highcharts.stockChart(id, {
                    rangeSelector: {
                    inputEnabled:false,
                    buttonTheme: { 
                            width : 50,
                            height : 24,       
                    },   
                    inputStyle: {
                        color: '#039',
                        fontWeight: 'bold',
                    }, 
                    inputPosition: {
                        align: 'center'
                    },                                                                   
                    buttons: [{
                            type: 'week',
                            count: 1,
                            text: '1w'
                        },{
                            type: 'month',
                            count: 1,
                            text: '1m'
                        },{
                            type: 'year',
                            count: 1,
                            text: '1y'
                        }, {
                            type: 'all',
                            text: 'All'
                        }],
                        selected: 1
                    },
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#FFFFFF',
                        shadow: true,
                        height: (6 / 16 * 100) + '%' // 16:9 ratio
                    },
                    title: {
                        text: title,
                        style: {     
                            fontWeight: 'bold',      
                        }
                    }, 
                    subtitle: {
                        text: subtitle,
                    },                                        
                    yAxis: {
                        title: {
                            text: yaxis,
                        }/*,    
                        plotBands: [{ // mark the weekend
                            color: '#FFB6C1',
                            from: 0,
                            to: band1
                        },{ // mark the weekend
                            color: '#90EE90',
                            from: ban1,
                            to: band2
                        },{ // mark the weekend
                            color: '#ADD8E6',
                            from: band2,
                            to: band3
                        }]*/                                     
                    },                                     
                    legend: {
                        enabled: true,
                        align: 'right',
                        verticalAlign: 'top',
                        layout: 'vertical',
                        x: 0,
                        y: 100,
                        itemStyle: {
                            color: '#000000',
                            fontWeight: 'bold',
                        }
                    },  
                    series: d,
                    exporting: {
                        
                        buttons: {
                            contextButton: {
                                enabled: false
                            },
                            customButton: {
                                text: 'All Data',
                                onclick: readnewdata
                            }
                        }
                    },                    
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                rangeSelector : {
                                inputEnabled:false
                                },      
                                navigator: {
                                    enabled: false
                                },  
                                chart: {
                                    height: (16 / 16 * 100) + '%' // 16:9 ratio
                                },                                                        
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }]
                    }                                       
                    });                  
                    return myChart;
                } 
                function readnewdata()
                {
                    readTextFile("Files/b1temp.csv");
                    var temp = readlongdata(0);
                    readTextFile("Files/b1moist.csv");
                    var moist = readlongdata(0);  
                    readTextFile("Files/b1rain.csv");
                    var rainsum = readdata(0);  

                    var rainchart = drawchart('rainsum',rainsum,'RainSum = 24h total 0600 - 0600 (mm)','','RainSum (mm)');  
                    var tempchart = drawchart('temp',temp,'Soil temperature measured 300 mm below the top of the cane row','','Deg C'); 
                    var moistchart = drawchart('moist',moist,'Individual sensor moisture','(first sensor, SM30, is located 300 mm below the top of the cane row) SMI = Soil Moisture Index','SMI');  
                                                
                }                
                var rainchart = drawchart('rainsum',rainsum,'RainSum = 24h total 0600 - 0600 (mm)','','RainSum (mm)');  
                var tempchart = drawchart('temp',temp,'Soil temperature measured 300 mm below the top of the cane row','','Deg C'); 
                var moistchart = drawchart('moist',moist,'Individual sensor moisture','(first sensor, SM30, is located 300 mm below the top of the cane row) SMI = Soil Moisture Index','SMI');  
                
                function drawgauge(id, name, type, unit,value, band1, band2, band3)
                {
                    var myChart = Highcharts.chart(id, {

                    chart: {
                        type: 'gauge',
                        backgroundColor: '#f0f0f5'
                    },

                    title: {
                        text: name
                    },

                    pane: {
                        startAngle: -150,
                        endAngle: 150
                    },

                    // the value axis
                    yAxis: {
                        min: 0,
                        max: band3,
                        title: {
                            text: unit
                        },
                        plotBands: [{
                            from: 0,
                            to: band1,
                            color: '#55BF3B' // green
                        }, {
                            from: band1,
                            to: band2,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: band2,
                            to: band3,
                            color: '#DF5353' // red
                        }]
                    },

                    series: [{
                        name: type,
                        data: value,
                        tooltip: {
                            valueSuffix: unit
                        }
                    }],
                    exporting: {
                        enabled: false
                    }
                    });				
                    return myChart;
                }
                
                /*var temps = ['temp1','temp2','temp3','temp4','temp5','temp6','temp7','temp8','temp9'];
                var moists = ['moist1','moist2','moist3','moist4','moist5','moist6','moist7','moist8','moist9'];
                var gauge = new Array(8);
                var gauge1 = new Array(8);*/
                var value = [];
                value.push([rainsum[0].data[rainsum[0].data.length-1][1]]);                
                var raingauge = drawgauge('raincurrent','RainSum Today', 'Rainfall', 'mm', value, 270, 370, 500);
                /*for (var i=0;i<8;i++)
                {
                    var value = [];
                    value.push([temp[i].data[temp[i].data.length-1][1]]);
                    gauge[i] = drawgauge(temps[i], namesSMI[i], 'Temperature', 'Deg C', value ,7, 17, 35);
        
                }
                for (var i=0;i<8;i++)
                {
                    var value = [];
                    value.push([moist[i].data[moist[i].data.length-1][1]]);
                    gauge1[i] = drawgauge(moists[i], namesSMI[i], 'SMI', '', value,17, 27, 40);
                }*/	
            });         