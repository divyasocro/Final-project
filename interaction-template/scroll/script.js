var m = {t:250,r:50,b:250,l:50},
	width = document.getElementById('plot').clientWidth - m.l - m.r,
	height = document.getElementById('plot').clientHeight - m.t - m.b;

//Make up some generic visualization here
//it will respond to 
var plot = d3.select('#plot')
	.append('svg')
	.attr('width',width+m.l+m.r)
	.attr('height',height+m.t+m.b)
	.append('g').attr('class','canvas')
	.attr('transform','translate('+m.l+','+m.t+')');

var ball = plot.append('circle')
	.attr('cx',0)
	.attr('cy',height/2)
	.attr('r',20)
	.style('fill','white');



//Create scrollController
//Step 1: create a global scroll controller
var scrollController = new ScrollMagic.Controller({
		globalSceneOptions:{
			triggerHook:'onLeave'
		}
	});

//Step2: create scenes
var scene1 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-1').clientHeight, //controlled by height of the #scene-1 <section>, as specified in CSS
		triggerElement:'#scene-1',
		reverse:true //should the scene reverse, scrolling up?
	})
	.on('enter',function(){
		//what happens when we 'enter' the scene i.e. #scene-1 reaches the top of the screen
		console.log('Enter Scene 1');
		d3.select('#plot').transition().style('background','red');
	})
	.addTo(scrollController);

var scene2 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-2').clientHeight, //controlled by height of the #scene-1 <section>, as specified in CSS
		triggerElement:'#scene-2',
		reverse:true //should the scene reverse, scrolling up?
	})
	.on('enter',function(){
		console.log('Enter Scene 2');
		d3.select('#plot').transition().style('background','green');
	})
	.addTo(scrollController);

var scene3 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-3').clientHeight, //controlled by height of the #scene-1 <section>, as specified in CSS
		triggerElement:'#scene-3',
		reverse:true //should the scene reverse, scrolling up?
	})
	.on('enter',function(){
		console.log('Enter Scene 3');
		d3.select('#plot').transition().style('background','blue');
	})
	.addTo(scrollController);


var scene4 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-4').clientHeight, //controlled by height of the #scene-1 <section>, as specified in CSS
		triggerElement:'#scene-4',
		reverse:true //should the scene reverse, scrolling up?
	})
	.on('enter',function(){
		console.log('Enter Scene 4');
	})
	.on('progress',function(e){
		console.log('Scene 4 progress ' + e.progress);
		//e.progress = 0 at the start of scene; 1 at the end of the scene
		ball.attr('cx',e.progress*width);
	})
	.addTo(scrollController);

