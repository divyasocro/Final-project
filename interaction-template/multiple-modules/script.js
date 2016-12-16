var m = {t:50,r:50,b:50,l:50},
	width = document.getElementById('plot-1').clientWidth - m.l - m.r,
	height = document.getElementById('plot-1').clientHeight - m.t - m.b;

//Two visualizations displaying the same data
//
var plot1 = d3.select('#plot-1')
	.append('svg')
	.attr('width',width+m.l+m.r)
	.attr('height',height+m.t+m.b)
	.append('g').attr('class','canvas')
	.attr('transform','translate('+m.l+','+m.t+')');
var plot2 = d3.select('#plot-2')
	.append('svg')
	.attr('width',width+m.l+m.r)
	.attr('height',height+m.t+m.b)
	.append('g').attr('class','canvas')
	.attr('transform','translate('+m.l+','+m.t+')');

//Global variables for storing data
var geo, //GeoJSON data of 50+ states
	unemployment; //d3.map() of unemployment rate over time, state by state

//Other global variables, such as global scales etc.
var scaleColor = d3.scale.linear().domain([0,10]).range(['white','red']);

//create a dispatch object and register events
var dispatch = d3.dispatch('stateselect','statedeselect','timechange');

queue()
	.defer(d3.json,'data/gz_2010_us_040_00_5m.json')
	.defer(d3.csv,'data/unemployment_by_state.csv',parse)
	.await(function(err,g,r){
		geo = g;
		unemployment = d3.nest().key(function(d){return d.state}).map(r, d3.map);
		
		plot1.call(drawMap);
		plot2.call(drawGraph);
	});

function drawMap(plot){
	//plot == plot1
	var projection = d3.geo.albersUsa()
		.translate([width/2,height/2]);

	var path = d3.geo.path().projection(projection);

	console.log(unemployment);

	plot
		.selectAll('.state')
		.data(geo.features)
		.enter()
		.append('path').attr('class','state')
		.attr('d',path)
		.style('fill',function(d){
			var dataSeries = unemployment.get(+d.properties.STATE);
			if(dataSeries){
				return scaleColor(dataSeries[0].rate);
			}
		})
		.on('click',function(d){
			if(d.selected == true){

				//if state is already selected, de-select, remove time series in graph module
				//set stroke to null
				dispatch.statedeselect(+d.properties.STATE);
				d.selected = false;
				d3.select(this).style('stroke',null);
			}else{

				//if state is NOT selected yet, select it, add time series in graph module
				d.selected = true;
				dispatch.stateselect(+d.properties.STATE);
				d3.select(this).style('stroke','black');
			}
		})

}

function drawGraph(plot){
	//plot == plot2
	//In this plot, create a line graph
	//create scales
	var scaleX = d3.time.scale().domain([new Date(2005,11,1), new Date(2015,10,1)]).range([0,width]),
		scaleY = d3.scale.linear().domain([0,25]).range([300,0]);

	var axisX = d3.svg.axis()
		.orient('bottom')
		.scale(scaleX)
		.tickFormat(d3.time.format('%Y-%m'));
	var axisY = d3.svg.axis()
		.orient('left')
		.tickSize(-width)
		.scale(scaleY);

	var lineGen = d3.svg.line()
		.x(function(d){return scaleX(d.time)})
		.y(function(d){return scaleY(d.rate)})
		.interpolate('cardinal');

	plot.append('g').attr('class','axis x')
		.attr('transform','translate(0,300)')
		.call(axisX)
	plot.append('g').attr('class','axis y')
		.call(axisY);

	dispatch.on('stateselect.graph',function(stateId){
		//Get unemployment time series for a particular state
		console.log(stateId);
		var dataSeries = unemployment.get(stateId);
		console.log(dataSeries);

		plot.append('path')
			.datum(dataSeries)
			.attr('class','state-line')
			.attr('id','state-'+stateId)
			.attr('d',lineGen);
	});

	dispatch.on('statedeselect.graph',function(stateId){
		plot.selectAll('#state-'+stateId).remove();
	})
}

function parse(d){
	return {
		state:d.state,
		rate:+d.rate,
		time:new Date(+d.year,(+d.month - 1),1)
	}
}