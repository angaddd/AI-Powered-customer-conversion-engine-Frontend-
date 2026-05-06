import React from "react";
import { EmptyState } from "../ui/EmptyState.jsx";

export function EventPanel({ events }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <h2>Live event feed</h2>
        <span>Polling every 5 seconds</span>
      </div>
      {events.length ? events.slice(0, 15).map((event) => (
        <div className="event-row" key={event.id}>
          <span>{event.event_type.replaceAll("_", " ")}</span>
          <small>{event.visitor_id}</small>
        </div>
      )) : <EmptyState label="No client events received." />}
    </div>
  );
}
