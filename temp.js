
          <!-- ====================== INFANTMORTALITY PLOT STUFF BELOW ====================== -->
          <svg id="infantmortality_plot" class="brush_container" width="800" height="600">
              <rect id="infantmortality_rect" rx="4" ry="4" x="0" y="0" width="0" height="0" class="selection-rect"
                  style="fill: rgba(185, 177, 177, 0.25); stroke: rgb(82, 82, 82); stroke-width: 2.5;">
              </rect>
          </svg>


          // ====================== INFANTMORTALITY PLOT ======================
          d3.select("#infantmortality_plot rect").attr("width", 0);
          d3.select("#infantmortality_plot rect").attr("height", 0);
          drawInfantmortalityPlot();

          // ====================== INFANTMORTALITY PLOT STUFF BELOW ======================
          if(name_of_plot != "infantmortality_plot"){
              d3.select("#infantmortality_plot rect").attr("width", 0);
              d3.select("#infantmortality_plot rect").attr("height", 0);
          }

        // =========================================================================
        // ============================= INFANTMORTALITY PLOT =================================
        // =========================================================================

        // Draw infantmortality plot function
        let infantmortality_widthPlot = 450;
        let infantmortality_heightPlot = 250;
        let infantmortality_verticalOffset = 750;
        let infantmortality_marginTop = 0;
        let infantmortality_marginRight = 20;
        let infantmortality_marginBottom = 20;
        let infantmortality_marginLeft = 20;
        let infantmortality_radius = 4;
        let infantmortality_padding = 2;
        let xScaleInfantmortality = d3.scaleLog()
          .domain(d3.extent(Object.values(countriesData).map(d => +d["Infant mortality (per 1000 births)"])))
          .range([infantmortality_marginLeft, width - infantmortality_marginRight]);

        drawInfantmortalityPlot = () => {
          let svg_infantmortality = d3.select("#infantmortality_plot")
            .attr("width", infantmortality_widthPlot)
            .attr("height", infantmortality_heightPlot)
            .attr("transform", `translate(0,${infantmortality_marginTop})`)
            .attr("viewBox", [0, 600, infantmortality_widthPlot, infantmortality_heightPlot])
            .attr("style", "max-width: 100%; height: auto;");

          svg_infantmortality.append("g")
            .attr("transform", `translate(0,${infantmortality_verticalOffset - infantmortality_marginBottom})`)
            .call(d3.axisBottom(xScaleInfantmortality).ticks(5, ",.0f").tickSize(10));

          // Append x-axis label
          svg_infantmortality.append("text")
            .attr("transform", `translate(${infantmortality_widthPlot / 2},${infantmortality_verticalOffset + 20})`) // Adjust the position as needed
            .style("text-anchor", "middle")
            .text("Infant Mortality (per 1000 births)");

          // Append title
          svg_infantmortality.append("text")
            .attr("x", infantmortality_widthPlot / 2)
            .attr("y", `${infantmortality_verticalOffset + 50}`) // Adjust the position as needed
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .text("Infant Mortality Distribution by Country");

          svg_infantmortality.append("g")
            .selectAll("dot")
            .data(dodge(Object.values(countriesData), { infantmortality_radius: infantmortality_radius * 2 + infantmortality_padding, x: d => xScaleInfantmortality(d["Infant mortality (per 1000 births)"]) }))
            .enter()
            .append("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => infantmortality_verticalOffset - infantmortality_marginBottom - infantmortality_radius - infantmortality_padding - d.y)
            .attr("r", infantmortality_radius)
            .attr("fill", dotColor);

          svg_infantmortality.call(d3.drag()
            .on("start", dragStart_infantmortality)
            .on("drag", dragMove_infantmortality)
            .on("end", dragEnd_infantmortality));

          function dodge(data, { infantmortality_radius = 1, x }) {
            const infantmortality_radius2 = infantmortality_radius ** 2;
            const circles = data.map((d, i, data) => ({ x: +xScaleInfantmortality(d["Infant mortality (per 1000 births)"]), data: d })).sort((a, b) => a.x - b.x);
            // circles.forEach(circle => {
            //   console.log(circle);
            // });
            const epsilon = 1e-3;
            let head = null, tail = null;

            // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
            function intersects(x, y) {
              let a = head;
              while (a) {
                if (infantmortality_radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
                  return true;
                }
                a = a.next;
              }
              return false;
            }

            // Place each circle sequentially.
            for (const b of circles) {
              // Remove circles from the queue that can’t intersect the new circle b.
              while (head && head.x < b.x - infantmortality_radius2) head = head.next;

              // Choose the minimum non-intersecting tangent.
              if (intersects(b.x, b.y = 0)) {
                let a = head;
                b.y = Infinity;
                do {
                  let y = a.y + Math.sqrt(infantmortality_radius2 - (a.x - b.x) ** 2);
                  if (y < b.y && !intersects(b.x, y)) b.y = y;
                  a = a.next;
                } while (a);
              }

              // Add b to the queue.
              b.next = null;
              if (head === null) head = tail = b;
              else tail = tail.next = b;
            }
            return circles;
          }
        }










          
          // ================== INFANTMORTALITY PLOT BRUSHING AND LINKING =================
          
          // Declare rectElement_infantmortality outside the function
          var rectElement_infantmortality;


          var selectionRect_infantmortality = {
            element: null,
            originX: 0,
            originY: 0,
            currentX: 0,
            currentY: 0,

            setElement: function (ele) {
              this.element = ele;
            },

            init: function (newX, newY, xAxisOnly) {
              this.setElement(rectElement_infantmortality);
              this.originX = newX;
              this.originY = newY;
              this.update(newX, newY, xAxisOnly);
            },

            update: function (newX, newY, xAxisOnly) {
              this.currentX = newX;
              this.currentY = newY;

              var x = Math.min(this.currentX, this.originX);
              var y = Math.min(this.currentY, this.originY);
              var width = Math.abs(this.currentX - this.originX);
              var height = Math.abs(this.currentY - this.originY);

              // Set properties of the rectElement_infantmortality directly
              rectElement_infantmortality.attr("x", x);
              rectElement_infantmortality.attr("width", width);

              if (xAxisOnly) {
                // If only the X-axis is used, set a fixed height
                rectElement_infantmortality.attr("y", 600); // currently hard-coded in
                rectElement_infantmortality.attr("height", 130); // currently hard-coded in
              } else {
                // If both axes are used, update the width and height
                rectElement_infantmortality.attr("y", y);
                rectElement_infantmortality.attr("height", height);
              }
            },

            remove: function () {
              // No need to remove the rectElement_infantmortality since it's not created dynamically
              this.element = null;
            }
          };

          function dragStart_infantmortality() {
            var p = d3.mouse(this);
            selectionRect_infantmortality.init(p[0], p[1], true);
            clearOtherSelections("infantmortality_plot");
          }

          function dragMove_infantmortality() {

            var p = d3.mouse(this);

            // Update the selection box
            selectionRect_infantmortality.update(p[0], p[1], true);

            // Get the x-range of the selection box
            var xMin = Math.min(selectionRect_infantmortality.originX, selectionRect_infantmortality.currentX);
            var xMax = Math.max(selectionRect_infantmortality.originX, selectionRect_infantmortality.currentX);

            // Initialize a Map to store country names and their corresponding x-values
            let countryXMap = new Map();

            // Populate the countryXMap during the data loading phase
            Object.values(countriesData).forEach(function (country) {
              var countryName = country["Country_cleaned_name"].replace(/[$"]|\s+$/g, "").trim();
              var xValue = xScaleInfantmortality(country["Infant mortality (per 1000 births)"]);
              countryXMap.set(countryName, xValue);
            });

            // Filter countries based on the x-range
            var selectedCountriesInBox_infantmortality = Object.values(countriesData).filter(function (country) {
              var x = xScaleInfantmortality(country["Infant mortality (per 1000 births)"]);
              return x >= xMin && x <= xMax;
            });

            // Update selectedCountries array
            selectedCountries = selectedCountriesInBox_infantmortality.map(function (country) {
              return country["Country_cleaned_name"].replace(/[$"]|\s+$/g, "").trim();
            });

            //console.log(selectedCountries);

            // Update the color based on the selection
            colorMap();
            colorPlot();
            // drawMap();
          }

          function dragEnd_infantmortality() {
            console.log("dragEnd_infantmortality");
          }










          
          // ====================== INFANTMORTALITY PLOT BRUSHING SELECTION ======================
          function displayRect_infantmortality() {
            // Select the rect element inside #selection_box
            rectElement_infantmortality = d3.select("#infantmortality_plot rect#infantmortality_rect");

            if (rectElement_infantmortality.empty()) {
              console.error("No rect element found inside #infantmortality_plot");
              return;
            }

            // Attach drag behavior to the existing rectElement_infantmortality
            rectElement_infantmortality
              .call(d3.drag().on("start", dragStart_infantmortality).on("drag", dragMove_infantmortality).on("end", dragEnd_infantmortality));

            // Set the rectElement_infantmortality to be the target for selectionRect_infantmortality
            selectionRect_infantmortality.setElement(rectElement_infantmortality);
          }

          // Call the displayRect function to initiate the rectangle
          displayRect_infantmortality();