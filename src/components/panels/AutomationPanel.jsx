import React from "react";
import { EmptyState } from "../ui/EmptyState.jsx";

export function AutomationPanel({ automations, insights }) {
  return (
    <section className="split">
      <div className="panel">
        <div className="panel-title">
          <h2>Automation rules</h2>
          <span>Email and SMS actions</span>
        </div>
        {automations.length ? automations.map((rule) => (
          <article className="insight" key={rule.id}>
            <strong>{rule.name}</strong>
            <p>{rule.trigger_type.replaceAll("_", " ")} · {rule.is_active ? "Active" : "Paused"}</p>
          </article>
        )) : <EmptyState label="No automations configured." />}
      </div>
      <div className="panel">
        <div className="panel-title">
          <h2>AI insights</h2>
          <span>Generated from behavior</span>
        </div>
        {insights.length ? insights.map((insight) => (
          <article className="insight" key={insight.id}>
            <strong>{insight.title}</strong>
            <p>{insight.recommendation}</p>
          </article>
        )) : <EmptyState label="No insights yet. Insights appear after enough real events are tracked." />}
      </div>
    </section>
  );
}
