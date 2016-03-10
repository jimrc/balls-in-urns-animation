
<script src="http://d3js.org/d3.v3.js"></script>
<script type="text/javascript">
  // based on bostocks example 1129492
  var networkOutputBinding = new Shiny.OutputBinding();
    $.extend(networkOutputBinding, {
    find: function(scope) {
      return $(scope).find('.shiny-network-output');
    },
   renderErr: function(el, err) {
     print(err$message)
   },
   renderValue: function(el, data) {
    var w = data.height + 30,
	h = data.height ,
	radius = data.radius,
	color = d3.scale.ordinal()
               .range(["#a05d56","#ff8c00","#d0743c","#98abc5", "#8a89a6", 
                       "#7b6888", "#6b486b" ]),
	darker = d3.scale.ordinal()
               .range(["#b06d66","#ff9c10","#e0844c","#a8bbd5", "#9a99b6", 
                       "#8b7898","#7b587b" ]);

     var spacing = w / (data.nDraws + 1), //for sampled circles
       stepSize = radius/10,
       mixDuration = 700,
       slideDuration = 350
         ;
       //console.log(radius);

       var  xspace = function(i){
           return i * spacing +30 ; 
       }

       //remove the old graph
      var vis = d3.select(el).select("svg");
        vis.remove();
        $(el).html(""); 
          
   //append a new one 
      vis = d3.select(el).append("svg")
        .attr("width",  w + 60) 
        .attr("height", h + 80)
        .append("svg:g")
           .attr("transform", "translate(" +  (w/2 + 10) + "," + 
              (h/2 + 20) +")");
    
      // data for a container
     var boxData = [ { "x": w/2 -40,   "y": h/2},  { "x": -w/2,  "y": h/2},
                  { "x": -w/2,  "y": -h/2}, { "x":w/2 ,  "y": -h/2},
                  { "x": w/2 ,  "y": h/2 - 20}];
      //using this method
     var lineFunction = d3.svg.line()
         .x(function(d) { return d.x; })
         .y(function(d) { return d.y; })
         .interpolate("linear");
       // now draw the container
     var box = vis.append("path")
         .attr("d", lineFunction(boxData))
         .attr("stroke", "blue")
         .attr("stroke-width", 2)
         .attr("fill", "white");   
 
      var balls =  [];
      for (var i=0; i < data.nBalls; i++)  { 
        balls[i]  = {x: data.x[i],
		     y: data.y[i],
		     group: data.drawColor[i],
	             pull: (i < data.nDraws ) ? 1 : 0,
                     r: radius - .75 };
      }
      // for replace = TRUE we need more balls
       // with radius 0 s same locations as the first nDraw balls
      for (var i=0; i < data.nDraws; i++)  { 
           balls[i + data.nBalls]  ={
              x: data.x[i],
	      y: data.y[i],
	      group: data.drawColor[i],
	      pull: 0,
	      r: 0};
       }
      
    var circles = vis.selectAll("g.circle")
         .data(balls)
       .enter().append("circle")
         .attr("fill", function(d, i){ return color(d.group); } )
         .attr("cx", function(d){ return d.x;} ) // 
         .attr("cy", function(d){ return d.y;} )  // 
         .attr("r",  function(d){ return d.r;} )  // 
         .attr("class", "circle") ; 
	
     var turn = function(i){  // rotate the whole batch
	circles.transition()
	  .delay((mixDuration + 2 * slideDuration) *  i)
	  .duration(mixDuration)
	  .ease("cubic-out")
	  .attrTween("transform", function (){
            return d3.interpolateString("rotate( 0, 0, 0)", 
                                   "rotate(720, 0, 0)");
        });
    }


    // Transitions:
       //Spin around nDraw times.
       // Each time move a ball out.

  
    for( var i = 0; i < data.nDraws; i++){ 
        turn(i);
        
    }

    circles.each(function(d,i){
      if(i < data.nDraws){
        d3.select(this)
          .transition()
            .delay( mixDuration * (i+1) + 2*i*slideDuration - 40)
          .attr("cx", w/2 - radius - 2)
          .style("stroke", "black")
          .transition()
            .duration( slideDuration )
           // .ease("cubic-in")
            .attr("cx", w/2 - radius - 2)
            .attr("cy", h/2  + 30)
            .transition()
             //.delay( duration0  )
             .duration( slideDuration )
             .ease("cubic-out")
             .attr("cy", h/2  + 30)
              .attr("cx", -w/2 + xspace(i) ); 
      } else if(data.replace == "yes")  {
	 d3.select(this)
              .transition().attr("r", radius-.75)  ;
      } 
    });

       console.log(circles);

  // transition:  pull a ball straight down on the right,
  // then move it over to the left.
  // Issue 1:  which balls get sampled?  the first (or last) nDraw values?
  // will they have the right colors? w/ w-o replacement?
  // 
  // Issue 2:  how does that work with the force?
  //   do I fix the coordinates after the transition or before?
  // 
  //  First guess:
  //  remove the last node if without replacement, create a circle
  // at middle height, far right and transition it.
  //
  //  Confusion with ircles and draws.
  // plan B:  create all circles in R with the draws coming first
  // draws become the first nDraws of those (use filter?)
  // start transiton0 by scooting to Right edge.
  //   Problem: transition is not stopping the force rotation

 // for(var i = 0; i < 100; i++){
 //     tick();
 // }
    //  console.log(draws);
  
  
	
  
    }
    });

  Shiny.outputBindings.register(networkOutputBinding, 'jimrc.networkbinding');


</script>