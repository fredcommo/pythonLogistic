            //Width and height for the drawing window
            var w = 1000,
                h = 800,
                pad = h/8,
                xTicks = 5,
                yTicks = 5; //Set rough # of ticks

            // Load data from the same dir 
            d3.json("./fit.json", function(error, json){
                var dataset = json;

//                var minDat = d3.min(d3.values(dataset)),
                var minx = -1,
                    maxx = 3,
                    miny = -.1,
                    maxy = 0.25,
                    xScale = d3.scale.linear().domain([minx, maxx]).range([pad, w-pad]),
                    yScale = d3.scale.linear().domain([miny, maxy]).range([h-pad, pad]);

//                console.log(minDat);

                //Create a SVG element
                var svg = d3.select("body").append("svg")
                            .attr("width", w)
                            .attr("height", h);

                // Create a title
                    svg.append("text")
                            .attr("x", w/2)
                            .attr("y", pad*2/3)
                            .style("text-anchor", "middle")
                            .style("font-size", "40px")
                            .text("Logistic regression");

                // Create circle generator
                var pts = svg.selectAll("circle").data(dataset).enter()
                            .append("circle");

                // Add points as circles: values are stored in d[0], d[1] (x and y, resp)
                    pts.attr("cx", function(d) {return xScale(d.x);})
                           .attr("cy", function(d) {return yScale(d.y);})
                           .attr("r", 5)
                           .attr("fill", "cyan")
                           .attr("stroke", "black")

                           // On mouseover, add tooltips and change the point size
                           .on("mouseover", function(d) {

                                // Increase the point size
                                d3.select(this)
                                    .transition().duration(500).ease("elastic").attr("r", 10);

                                var xPosition = xScale(d.x)+pad/4;
                                var yPosition = yScale(d.y)+pad/4;

                                //Update the tooltip position and value
                                d3.select("#tooltip")
                                    .style("left", xPosition + "px")
                                    .style("top", yPosition + "px")
                                    .select("#value")
                                    .text(d.sample);
                           
                                //Show the tooltip
                                d3.select("#tooltip").classed("hidden", false);
                                })

                            // On mouseout, remove the tooltip and resize the point to its original value
                            .on("mouseout", function() {
                                d3.select(this)
                                    .transition().duration(750).ease("bounce").attr("r", 5);
                                d3.select("#tooltip").classed("hidden", true);
                               });

                // Add the regression line stored in xFit, yFit
                var line = d3.svg.line()
                            .x(function(d) {return xScale(d.xfit);})
                            .y(function(d) {return yScale(d.yfit);})
                            .interpolate("basic")

                    svg.append("path")
                            .datum(dataset)
                            .attr("class", "line")
                            .attr("fill", "none")
                            .attr("stroke", "darkblue")
                            .attr("stroke-width", "7px")
                            .attr("d", line)
//                            .attr("shape-rendering", "crispEdges");

                // Define axes
                var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom")
                            .ticks(xTicks);

                var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .ticks(yTicks);

                // Add axes
                    svg.append("g")
                            .attr("class", "axis")
                            .attr("transform", "translate(0," + (h - pad) + ")")
                            .call(xAxis);

                    svg.append("g")
                            .attr("class", "axis")
                            .attr("transform", "translate(" + pad + ",0)")
                            .call(yAxis);

                // Add a name on x-axis
                    svg.append("text")
                            .attr("x", w/2)
                            .attr("y", h-pad/3)
                            .style("text-anchor", "middle")
                            .style("font-size", "30px")
                            .text("Copy numbers in Log2(ratio)");
      
                // Add a name on y-axis
                    svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("x", -(h + pad)/2)
                            .attr("y", 0)
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .style("font-size", "30px")
                            .text("Gene expression");
            });
