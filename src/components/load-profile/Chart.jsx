"use client";

import React, { useEffect, useRef } from "react";

// Utility SVG chart for load profiles (MW vs time)
export default function Chart({ profiles = [], timeHorizon = "daily", height = 400 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear previous
    svg.innerHTML = "";

    if (!profiles || profiles.length === 0) {
      // Draw empty axes for consistency
      drawAxes(svg, [], timeHorizon, height);
      return;
    }

    // Compute ranges
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 800;
    const padding = { top: 20, right: 110, bottom: 60, left: 60 };

    // Flatten all data and compute maxima
    const allDataPoints = profiles
      .filter((p) => p.visible !== false)
      .flatMap((p) => p.data || []);
    const maxValue = Math.max(1, Math.max(...allDataPoints.map((d) => d?.value ?? 0)) * 1.1);

    // Determine max time index for scale based on horizon
    let maxTimeIndex = 24;
    if (timeHorizon === "daily") maxTimeIndex = 24;
    else if (timeHorizon === "weekly") maxTimeIndex = 7 * 24;
    else if (timeHorizon === "monthly") maxTimeIndex = 30;
    else if (timeHorizon === "8760") maxTimeIndex = 8760;

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const xScale = (time) => {
      const t = typeof time === "number" ? time : 0;
      return (t / (Math.max(1, maxTimeIndex))) * innerWidth + padding.left;
    };
    const yScale = (value) => {
      const v = typeof value === "number" ? value : 0;
      return height - padding.bottom - (v / maxValue) * innerHeight;
    };

    // Grid lines + axes labels
    drawGridAndAxes(svg, { padding, width, height, innerHeight, innerWidth, maxValue, maxTimeIndex, timeHorizon, xScale, yScale });

    // Draw profiles
    profiles.forEach((profile, idx) => {
      if (!profile?.visible || !Array.isArray(profile?.data) || profile.data.length === 0) return;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const pathData = profile.data
        .map((point, i) => {
          const x = xScale(point.time ?? i);
          const y = yScale(point.value ?? 0);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

      path.setAttribute("d", pathData);
      path.setAttribute("stroke", profile.color || "#ea580b");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      svg.appendChild(path);

      // Legend
      const legendY = padding.top + idx * 20;
      const legendLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      legendLine.setAttribute("x1", width - padding.right + 10);
      legendLine.setAttribute("y1", legendY);
      legendLine.setAttribute("x2", width - padding.right + 30);
      legendLine.setAttribute("y2", legendY);
      legendLine.setAttribute("stroke", profile.color || "#ea580b");
      legendLine.setAttribute("stroke-width", "2");
      svg.appendChild(legendLine);

      const legendText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      legendText.setAttribute("x", width - padding.right + 35);
      legendText.setAttribute("y", legendY + 4);
      legendText.setAttribute("style", "font-family: Sen, sans-serif; font-size: 11px; fill: #374151;");
      const label = typeof profile?.name === "string" ? profile.name : `Profile ${idx + 1}`;
      legendText.textContent = label.length > 24 ? label.substring(0, 24) + "..." : label;
      svg.appendChild(legendText);
    });

    // Axis labels
    const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yLabel.setAttribute("x", 20);
    yLabel.setAttribute("y", height / 2);
    yLabel.setAttribute("transform", `rotate(-90, 20, ${height / 2})`);
    yLabel.setAttribute("text-anchor", "middle");
    yLabel.setAttribute("style", "font-family: Sen, sans-serif; font-size: 12px; font-weight: 600; fill: #374151;");
    yLabel.textContent = "Load (MW)";
    svg.appendChild(yLabel);

    const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xLabel.setAttribute("x", (width - padding.right + padding.left) / 2);
    xLabel.setAttribute("y", height - 10);
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("style", "font-family: Sen, sans-serif; font-size: 12px; font-weight: 600; fill: #374151;");
    xLabel.textContent = timeHorizon === "daily" ? "Hour of Day" : timeHorizon === "weekly" ? "Hour (Week)" : timeHorizon === "monthly" ? "Day" : "Hour (Annual)";
    svg.appendChild(xLabel);
  }, [profiles, timeHorizon, height]);

  return <svg ref={svgRef} className="w-full" style={{ height: `${height}px` }} />;
}

function drawGridAndAxes(svg, ctx) {
  const { padding, width, height, innerHeight, innerWidth, maxValue, maxTimeIndex, timeHorizon, xScale } = ctx;

  // Horizontal grid and Y ticks
  const yTicks = 10;
  for (let i = 0; i <= yTicks; i++) {
    const y = padding.top + i * (innerHeight) / yTicks;
    const value = maxValue * (1 - i / yTicks);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", padding.left);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - padding.right);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#E5E7EB");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", padding.left - 10);
    text.setAttribute("y", y + 4);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("style", "font-family: Sen, sans-serif; font-size: 11px; fill: #6B7280;");
    text.textContent = value.toFixed(1);
    svg.appendChild(text);
  }

  // X-axis ticks
  const xTicks = timeHorizon === "daily" ? 24 : timeHorizon === "weekly" ? 14 : timeHorizon === "monthly" ? 15 : 12;
  for (let i = 0; i <= xTicks; i++) {
    const x = padding.left + i * (innerWidth) / xTicks;
    const time = Math.floor((i * maxTimeIndex) / xTicks);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", height - padding.bottom + 20);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("style", "font-family: Sen, sans-serif; font-size: 11px; fill: #6B7280;");

    if (timeHorizon === "daily") {
      text.textContent = `${time}:00`;
    } else if (timeHorizon === "weekly") {
      text.textContent = `H${time}`;
    } else if (timeHorizon === "monthly") {
      text.textContent = `Day ${time}`;
    } else {
      text.textContent = `H${time}`;
    }
    svg.appendChild(text);
  }

  // X axis baseline
  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axis.setAttribute("x1", padding.left);
  axis.setAttribute("y1", height - padding.bottom);
  axis.setAttribute("x2", padding.left + innerWidth);
  axis.setAttribute("y2", height - padding.bottom);
  axis.setAttribute("stroke", "#9CA3AF");
  axis.setAttribute("stroke-width", "1");
  svg.appendChild(axis);
}

function drawAxes(svg, _profiles, timeHorizon, height) {
  // Minimal placeholder if no data
  const width = svg.clientWidth || 800;
  const padding = { top: 20, right: 110, bottom: 60, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axis.setAttribute("x1", padding.left);
  axis.setAttribute("y1", height - padding.bottom);
  axis.setAttribute("x2", padding.left + innerWidth);
  axis.setAttribute("y2", height - padding.bottom);
  axis.setAttribute("stroke", "#9CA3AF");
  axis.setAttribute("stroke-width", "1");
  svg.appendChild(axis);

  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute("x", 20);
  yLabel.setAttribute("y", height / 2);
  yLabel.setAttribute("transform", `rotate(-90, 20, ${height / 2})`);
  yLabel.setAttribute("text-anchor", "middle");
  yLabel.setAttribute("style", "font-family: Sen, sans-serif; font-size: 12px; font-weight: 600; fill: #374151;");
  yLabel.textContent = "Load (MW)";
  svg.appendChild(yLabel);

  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", (width - padding.right + padding.left) / 2);
  xLabel.setAttribute("y", height - 10);
  xLabel.setAttribute("text-anchor", "middle");
  xLabel.setAttribute("style", "font-family: Sen, sans-serif; font-size: 12px; font-weight: 600; fill: #374151;");
  xLabel.textContent = timeHorizon === "daily" ? "Hour of Day" : timeHorizon === "weekly" ? "Hour (Week)" : timeHorizon === "monthly" ? "Day" : "Hour (Annual)";
  svg.appendChild(xLabel);
}