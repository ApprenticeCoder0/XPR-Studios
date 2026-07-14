import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export function NetworkLatencyGauge() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [latency, setLatency] = useState(45);

  useEffect(() => {
    // Simulate real-time connectivity speeds
    const interval = setInterval(() => {
      setLatency((prev) => {
        const variance = Math.floor(Math.random() * 21) - 10;
        const newLatency = Math.max(10, Math.min(300, prev + variance));
        return newLatency;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 200;
    const height = 120;
    const margin = 20;
    const radius = Math.min(width, height * 2) / 2 - margin;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height - 10})`);

    // Define the scale for the gauge
    const scale = d3.scaleLinear().domain([0, 300]).range([-Math.PI / 2, Math.PI / 2]);

    // Color scale: Green -> Yellow -> Red
    const colorScale = d3.scaleLinear<string>().domain([0, 150, 300]).range(["#4ade80", "#eab308", "#ef4444"]);

    // Arc generator
    const arc = d3.arc<any, any>()
      .innerRadius(radius - 15)
      .outerRadius(radius)
      .startAngle((d) => d[0])
      .endAngle((d) => d[1]);

    // Background arc
    g.append("path")
      .datum([-Math.PI / 2, Math.PI / 2])
      .style("fill", "#222")
      .attr("d", arc as any);

    // Foreground arc (animated)
    const foreground = g.append("path")
      .datum([-Math.PI / 2, scale(latency)])
      .style("fill", colorScale(latency))
      .attr("d", arc as any)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attrTween("d", function(this: any, d) {
        const interpolate = d3.interpolate(
          this._current || -Math.PI / 2,
          scale(latency)
        );
        this._current = interpolate(1);
        return function(t) {
          return arc([-Math.PI / 2, interpolate(t)] as any)!;
        };
      });

    // Needle
    const needleAngle = scale(latency) * (180 / Math.PI);
    
    // Needle pivot
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      .style("fill", "#D4AF37");

    g.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -(radius - 20))
      .style("stroke", "#D4AF37")
      .style("stroke-width", 2)
      .attr("transform", `rotate(${needleAngle})`)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attrTween("transform", function(this: any) {
        const interpolate = d3.interpolate(
          this._current || -90,
          needleAngle
        );
        this._current = interpolate(1);
        return function(t) {
          return `rotate(${interpolate(t)})`;
        };
      });

  }, [latency]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} width={200} height={120} />
      <div className="text-xl font-mono mt-2" style={{ color: latency < 100 ? "#4ade80" : latency < 200 ? "#eab308" : "#ef4444" }}>
        {latency} ms
      </div>
      <div className="text-[10px] uppercase tracking-widest text-white/50">
        Network Latency
      </div>
    </div>
  );
}
