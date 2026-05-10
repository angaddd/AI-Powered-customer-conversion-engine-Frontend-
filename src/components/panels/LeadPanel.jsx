import React from "react";
import { EmptyState } from "../ui/EmptyState.jsx";

export function LeadPanel({ leads, full = false }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <h2>{full ? "All leads" : "Lead scoring"}</h2>
        <span>Cold, warm, hot, customer</span>
      </div>
      {leads.length ? leads.map((lead) => (
        <div className="lead-row" key={lead.id}>
          <div>
            <strong>{lead.name || lead.email || lead.visitor_id}</strong>
            <span>
              {lead.intent_category.replaceAll("_", " ")}
              {lead.email ? ` | ${lead.email}` : ""}
              {lead.phone ? ` | ${lead.phone}` : ""}
            </span>
          </div>
          <meter min="0" max="150" value={lead.intent_score}></meter>
          <b>{lead.intent_score}</b>
        </div>
      )) : <EmptyState label="No leads yet. Visit the client site to generate real traffic." />}
    </div>
  );
}
