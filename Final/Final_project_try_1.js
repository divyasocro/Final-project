
var m = {t:50,r:80,b:50,l:50}
    w = document.getElementById('canvas').clientWidth - m.l -m.r,
    h = document.getElementById('canvas').clientHeight -m.t -m.b;

var plot = d3.select('.canvas') 
    .append('svg')
    .attr('width', w + m.l+ m.r)
    .attr('height', h + m.t + m.b)
    .append('g')
    .attr('class','plot')
    .attr('transform','translate('+m.l+','+m.t+')')

//slider 
var sliderW = document.getElementById('slider').clientWidth -m.l -m.r,
    sliderH = document.getElementById('slider').clientHeight;

var plottwo = d3.select('.slider')
    .append('svg')
    .attr('width',sliderW + m.l +m.r)
    .attr('height', '80px')
    .append('g')
    .attr('transform','translate('+0+',0)');

//create a scale
var size = 220;
var scale = d3.scaleSqrt()
    .range([0,size]);

var scaleR = d3.scaleLinear()
    .range([8,40]);



//global data
var nestdata;


//projection
var projection = d3.geoEquirectangular();

//geopath
var pathGenerator = d3.geoPath()
    .projection(projection);

var map;
var maptwo;
var newdata;
var countrynames;
//console.log(pathGenerator);
//step 1 - import data

d3.queue()
    //import file
    .defer(d3.csv,'../data/olympics/dataset.csv',parse)
    .defer(d3.csv,'../data/olympics/reddata.csv',parsedata)
    .defer(d3.json,'../data/countries.geo.json')
    .await(function(err,medaldata,countrynames,geodata){
        //console.table(medaldata);
        //console.log(countrynames);
        //console.table(mydata);
        //console.log(geodata);
        
   nestdata = d3.nest()
     .key(function(d){return d.Year})
     .key(function(d){return d.Countrycode})
     //.key(function(d){return d.Medal})
     .map(medaldata, d3.map)
        console.log(nestdata);


    

projection.fitExtent([[0,0],[w,h]],geodata);

    var newMap = plot.selectAll('geodata')
       .data(geodata.features)
       .enter()
       .append('path')
       .attr('d',pathGenerator)

 map = d3.map(geodata.features, function(d){return d.properties.name});
 newdata = d3.map();

 maptwo = d3.map(countrynames, function(d){return d.Countrycode});
 //newdata = d3.map();
 console.log(map);
    //years for slider
    var years = nestdata.keys();//map(function(d){return d.key;});
    console.log(years);

    //SET UP BRUSH
    timeSlider(years);

    



//create scale
function timeSlider(years){
var scaleX = d3.scaleLinear()
            .domain([+years[0], +years[years.length-1]])
            .range([0,sliderW])
            .clamp(true);

     axisX = d3.axisBottom()
            .scale(scaleX)
            .tickFormat(d3.format(''))
            .tickSizeOuter(0)
            .tickSizeInner(0)
            .tickPadding(15)
            .tickValues(years.map(function(y){return +y}));

 var axisX = plottwo.append('g')
                    .attr('class','axis')
                    .attr('transform','translate(100,40)')
                    .call(axisX);

//Customize x axis appearance
var AXIS_WIDTH = 1;

axisX.selectAll('.tick').selectAll('text')
        .attr('text-anchor','start')
        .attr('transform','rotate(45)translate(5)');

axisX.append('line')
        .attr('class','domain-offset')
        .attr('x1',-80)
        .attr('x2',sliderW)
        .style('stroke-linecap','round')
        .style('stroke-width',AXIS_WIDTH)
        .select(function(){ return this.parentNode.appendChild(this.cloneNode(true))})
        .attr('class','domain-overlay')
        .style('stroke-width',AXIS_WIDTH-2);

        //drag function

            var drag = d3.drag()
        .on('start drag end', function(){ 
            handle.attr('cx', scaleX(scaleX.invert(d3.event.x)));
        })
        .on('end', function(){
            //Index of the right-hand side insertion point
            var v = scaleX.invert(d3.event.x),
                index = d3.bisect(years, v);

            if(years[index-1]){
                index = (years[index]-v)>=(v-years[index-1])?(index-1):index;
            }

            //Position the handle
            handle.attr('cx', scaleX(years[index]));

            //Highlight the appropriate tick mark
            axisX.selectAll('.tick')
                .classed('selected',false)
                .filter(function(d,i){return i==index})
                .classed('selected',true);
//console.log(nestdata.get(years[index]));
            draw(nestdata.get(years[index]),map);
        })

    //Add slider element
    var handle = axisX.append('circle').attr('class','handle')
        .attr('r',AXIS_WIDTH/2+8)
        .call(drag)

    

        }
//toggle 
       
//slider 

//var filterdata = nestdata.filter(function(d){return d.key == '1896'})
     //console.log("filterdata", filterdata);



//draw(filterdata[0].values,map);//addnewimportfilename);


function draw(filterdata,map){ 
    //console.table(filterdata);
    var data =filterdata.entries()
    //plot.selectAll('.medal').remove();
    console.log(data);
 var node = plot;

scaleR.domain(d3.extent(data, function(d){return d.value.length}))
var country=node
        .selectAll("circle")
        .data(data,function(d){return d.key})
 var   enter=country.enter()
        .append('circle')
        .style('stroke','#2E3192')
        console.log(enter);

        
country.merge(enter)
        
        .style('fill','#27AAE1')
        .style('fill-opacity',.5)

          .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');

            tooltip.select('.title').html(d.key);
            tooltip.select('.value').html(d.value.length);


            tooltip
               .style('visibility','visible')
               .transition()
               .duration(500)
               .style('opacity',1);
            //    var country = maptwo.get(d.key).Country//this retains the circle 
            // console.log(country);
            //tooltip.transition().style('opacity',1);

            d3.select(this).style('fill','blue');
        })
        .on('mousemove',function(d){
            var tooltip = d3.select('.custom-tooltip');
            var xy = d3.mouse( d3.select('.container').node() );
            tooltip
                .style('left',xy[0]+10+'px')
                .style('top',xy[1]+10+'px');
        })


        .on('mouseleave',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip
            .style('visibility','hidden')

            .transition()
            .style('opacity',0);

            d3.select(this).style('fill','blue');

                
        })

        
        //.style('stroke-width', '1px')
        //.style('stroke','black')
        .attr('cx',function(d){
   
   //var country = maptwo.get(d.key).Country?maptwo.get(d.key).Country:d.key;
   var country = maptwo.get(d.key)?maptwo.get(d.key).Country:0;
   //console.log(d.key+':'+country+':'+pathGenerator.centroid(map.get(country).geometry))
            return map.get(country)?pathGenerator.centroid(map.get(country).geometry)[0]:-100;})
        .attr('cy',function(d){
          var country = maptwo.get(d.key)?maptwo.get(d.key).Country:0;
          return map.get(country)?pathGenerator.centroid(map.get(country).geometry)[1]:-100;})
        .transition()
        .duration(800)
        .attr('r',function(d){return scaleR(d.value.length);})
       
  
country.exit().remove();
}


 
});



//mine for min and max
    /*var minX = d3.min(rows, function(d){return d.MedalBronze}),
        maxX = d3.max(rows,function(d){return d.MedalBronze});
        console.log(minX, maxX);



/*var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w)
    .attr('height',h);*/ 

/*for(var x=0; x<=w; x+=10)
    plot.append('line')
    .attr('x1',x)
    .attr('x2',x)
    .attr('y1',0)
    .attr('y2',h)
    .attr('class','axis');
    
    
for(var x=0; x<=h; x+=10)
    plot.append('line')
    .attr('x1',0)
    .attr('x2',w)
    .attr('y1',x)
    .attr('y2',x)
    .attr('class','axis');*/
    /*var mergedData = countryNamesArray.map(function(d){
        var countryCode = countryCodeArray.filter(function(e){return e.countryName == d.countryName})[0].countryCode;
        d.countryCode = countryCode;
        return d;
    })*/

    function parse(d) {
        return{
            City: d['City'],
            Year: +d['Edition'],
            Sport: d['Discipline'],
            Athlete: d['Athlete'],
            Countrycode: d['NOC'],
            Gender: d['Gender'],
            Medal:d['Medal']

        }

        }

    function parsedata(d){
        return{

            Countrycode: d['NOC'],
            Country: d['Country']
            
        }
    }

  
   /*function parsedata(d){
        return{
            Country: d['Country'],
            Year: +d['Edition'],
            Bronze: +d['Bronze'],
            Men: +d['Men'],
            Women: +d['Women'],
            Gold: +d['Gold'],
            Meng: +d['Meng'],
            Womeng: +d['Womeng'],
            Silver: +d['Silver'],
            Mens: +d['Mens'],
            Womens: +d['Womens'],
            Total: +d['Grand Total']
        }
    }*/
        
    






