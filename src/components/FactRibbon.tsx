"use client";
import React from "react";

const facts = [
  "Early intervention is key: 80% of brain development happens by age 3.",
  "Did you know? Sensory play builds critical nerve connections in the brain's pathways.",
  "Every child blooms at their own pace. Celebrate the small victories!",
  "Occupational therapy helps kids develop crucial fine motor skills for daily independence.",
  "Consistency is magic: Regular structured routines can significantly reduce childhood anxiety.",
  "Reading with your child for just 15 minutes a day accelerates cognitive development.",
  "Movement breaks improve focus! A 5-minute jump or stretch resets the nervous system.",
];

export default function FactRibbon() {
  return (
    <div style={{
      width: "100%",
      background: "#086A75", // Slightly darker than primary for contrast
      color: "rgba(255,255,255,0.95)",
      overflow: "hidden",
      position: "absolute",
      top: 68,
      padding: "8px 0",
      display: "flex",
      alignItems: "center",
      zIndex: 40,
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          white-space: nowrap;
          animation: scrollTicker 60s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          padding: 0 40px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .ticker-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          margin-right: 40px;
        }
      `}} />
      <div className="ticker-track">
        {/* Render the array twice to create a seamless infinite loop */}
        {[...facts, ...facts].map((fact, index) => (
          <div key={index} className="ticker-item">
            {index > 0 && <span className="ticker-dot" />}
            {fact}
          </div>
        ))}
      </div>
    </div>
  );
}
