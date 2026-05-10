import React from "react";
import { Send, MessageSquare } from "lucide-react";
import { EmptyState } from "../ui/EmptyState.jsx";

export function MessagePanel({ messages, onSendHotSms, sendingSms }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <div>
          <h2>Message logs</h2>
          <span>Development provider logs</span>
        </div>
        <button className="inline-action" onClick={onSendHotSms} disabled={sendingSms}>
          <Send size={16} /> {sendingSms ? "Sending" : "Send SMS to hot leads"}
        </button>
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
