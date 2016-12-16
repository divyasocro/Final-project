# Multiple Modules #

This basic example demonstrates two important concepts you might use for your project:
- Modules, whereby different visualization types can be created from the same data but separated for clarity;
- Having different modules interact with each other, using `d3.dispatch` as an event 'traffic control' between modules.

## Problem Set-up ##
Here we have a dataset of state-by-state unemployment from Jan 2006 to Nov 2015. We would like to create a map module, showing a choropleth of unemployment rate, and a graph module, showing how this rate changes over time for each state.

We would like it so that when a state is selected/deselected from the map module, the corresponding line graph appears/disappears from the graph module.

## Creating different modules ##
In index.html, we create two `<div class="canvas">` elements with unique id's. Then in lines 7-18 of script.js, we set up two `<svg>` canvases, one under each element.

Later, in lines *37* and *38*, we invoke a separate drawing function for each canvas using the `selection.call()` method. As a reminder, `selection.call(someFunction)` runs `someFunction`, passing in the selection as the parameter. To elaborate:
```
var plot1 = d3.select('#plot-1')... //line 7: "plot1" is a d3 selection
...
plot1.call(drawMap); //line 37: call "drawMap" function
...
function drawMap(plot){
  plot.append(...)
} //when "drawMap" is called, the parameter is the d3 selection that called it. So in this case, "plot" the parameter is the same as "plot1", the d3 selection
```

There are many benefits to doing this. For one, the code is much better structured and easier to read. In addition, each function, "drawMap" and "drawGraph", creates a local scope where local variables can't accidentally contaminate each other.

## Event broadcasting between modules ##

How can we broadcast events between modules? For example, if I select a state in the map module by clicking on it, how can the graph module know how to react?

The `d3.dispatch()` object is an event aggregator and broadcaster. When you have multiple components/modules, each module can "subscribe" to the dispatch for certain events and can react to them. You can also emit an event from the dispatch, notifying all the subscribers to the event. What's even better, multiple modules can emit or subscribe to the same event; you no longer have to keep close track of which module reacts to which module. All you have to manage is the central traffic control.

The full documentation for `d3.dispatch()` is here: https://github.com/mbostock/d3/wiki/Internals#d3_dispatch. As a quick synopsis, here is how you set up `d3.dispatch()`:
- First, create a dispatcher object, and register all the events it can broadcast. `var dispatch = d3.dispatch('event1','event2','event3'...)`. You have as many events registered as you like, and the names are arbitrary strings.
- When you want to *broadcast* an event to all subscribers, invoke `dispatch.event1([optional parameters])` (for 'event1' you registered). This notifies all subscribers to event1 that this event was just fired. You can pass in optional parameters for these events.
- To subscribe to a certain event, invoke `dispatch.on("event1", eventListenerFunction)`. The eventListenerFunction is run whenever event1 is broadcast, and it receives the optional parameters in step 2.

When you have multiple components subscribing to the same event, it's a good practice to "namespace" i.e. uniquely identify the subscriber. This can be done by adding `.foo` to the event name, where "foo" is some arbitrary namespace. 
```
dispatch.on("event1.component1", func1);
...
dispatch.on("event1.component2", func2);
```
Here, both components 1 and 2 subscribe to the same event event1, but react differently based on their different event listening functions.

## Back to our example ##
A rudimentary example of event dispatching is on lines 62-77 and lines 108-124 of the code.
