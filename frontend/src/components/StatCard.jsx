import React from "react";

export const StatCard = ({ title, value, color }) => {
  return (
    <div className={`text-center p-4 bg-${color}-50 rounded-xl border border-${color}-200`}>
      <div className={`text-xl font-bold text-${color}-600`}>{value}</div>
      <div className={`text-xs text-${color}-600/70 uppercase tracking-wide`}>{title}</div>
    </div>
  );
};


