import React from "react";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "../ui/EmptyState.jsx";

export function MessagePanel({ messages }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <h2>Message logs</h2>
        <span>Development provider logs</span>
      </div>
      {messages.length ? messages.map((message) => (
        <div className="message-row" key={message.id}>
          <MessageSquare size={17} />
          <div>
            <strong>{message.channel.toUpperCase()} to {message.recipient}</strong>
            <span>{message.subject || message.body}</span>
          </div>
          <b>{message.status}</b>
        </div>
      )) : <EmptyState label="No email or SMS automations have fired yet." />}
    </div>
  );
}
