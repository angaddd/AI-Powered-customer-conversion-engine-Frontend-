import React from "react";

export function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <section className="metric-card">
      <div className="metric-icon"><Icon size={19} /></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{hint}</span>
    </section>
  );
}
