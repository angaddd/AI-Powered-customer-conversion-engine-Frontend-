import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Clipboard,
  KeyRound,
  LogOut,
  Mail,
  RefreshCw,
  ShoppingCart,
  Users,
  Zap
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { MetricCard } from "../components/ui/MetricCard.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { LeadPanel } from "../components/panels/LeadPanel.jsx";
import { EventPanel } from "../components/panels/EventPanel.jsx";
import { AutomationPanel } from "../components/panels/AutomationPanel.jsx";
import { MessagePanel } from "../components/panels/MessagePanel.jsx";
import { API_ORIGIN, request, normalizeList } from "../lib/api.js";

const emptyOverview = {
  total_visitors: 0,
  total_events: 0,
  conversion_rate: 0,
  abandoned_carts: 0,
  hot_leads: 0,
  purchases: 0,
  revenue: 0
};

export default function Dashboard({ token, onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [me, setMe] = useState(null);
  const [overview, setOverview] = useState(emptyOverview);
  const [funnel, setFunnel] = useState([]);
  const [trend, setTrend] = useState([]);
  const [eventMix, setEventMix] = useState([]);
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingSms, setSendingSms] = useState(false);

  const trackingScriptUrl = me?.company?.public_key ? `${API_ORIGIN}/api/tracker/${me.company.public_key}.js` : "";
  const installSnippet = trackingScriptUrl ? `<script defer src="${trackingScriptUrl}"></script>` : "";

  async function refresh() {
    setLoading(true);
    try {
      const [
        meData,
        overviewData,
        funnelData,
        trendData,
        mixData,
        leadData,
        eventData,
        insightData,
        automationData,
        messageData
      ] = await Promise.all([
        request("/auth/me/", token),
        request("/analytics/overview/", token),
        request("/analytics/funnel/", token),
        request("/analytics/revenue-trend/", token),
        request("/analytics/event-mix/", token),
        request("/leads/", token),
        request("/events/", token),
        request("/ai-insights/", token),
        request("/automations/", token),
        request("/message-logs/", token)
      ]);

      setMe(meData);
      setOverview({ ...emptyOverview, ...overviewData });
      setFunnel(funnelData);
      setTrend(trendData);
      setEventMix(mixData);
      setLeads(normalizeList(leadData));
      setEvents(normalizeList(eventData));
      setInsights(normalizeList(insightData));
      setAutomations(normalizeList(automationData));
      setMessages(normalizeList(messageData));
      setError("");
    } catch (err) {
      setError(err.message);
      if (err.message.includes("token")) onLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, [token]);

  async function copySnippet() {
    if (!installSnippet) return;
    await navigator.clipboard.writeText(installSnippet);
  }

  async function sendHotSms() {
    setSendingSms(true);
    setError("");
    try {
      const result = await request("/message-logs/send-hot-sms/", token, { method: "POST" });
      await refresh();
      setError(result.sent ? "" : "No hot leads with phone numbers are ready for SMS yet.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingSms(false);
    }
  }

  const bestLeads = useMemo(
    () => [...leads].sort((a, b) => b.intent_score - a.intent_score).slice(0, 8),
    [leads]
  );

  return (
    <div className="app-shell">
      <aside>
        <div className="brand"><Bot /> ConvertIQ</div>
        <nav>
          <button className={activeView === "dashboard" ? "active" : ""} onClick={() => setActiveView("dashboard")}><BarChart3 size={18} /> Dashboard</button>
          <button className={activeView === "leads" ? "active" : ""} onClick={() => setActiveView("leads")}><Users size={18} /> Leads</button>
          <button className={activeView === "automations" ? "active" : ""} onClick={() => setActiveView("automations")}><Zap size={18} /> Automations</button>
          <button className={activeView === "messages" ? "active" : ""} onClick={() => setActiveView("messages")}><Mail size={18} /> Email & SMS</button>
          <button className={activeView === "profile" ? "active" : ""} onClick={() => setActiveView("profile")}><KeyRound size={18} /> Profile</button>
        </nav>
        <div className="tenant-box">
          <span>{me?.company?.name || "Tenant"}</span>
          <small>{me?.company?.domain || "No domain configured"}</small>
        </div>
      </aside>

      <main>
        <header className="page-header">
          <div>
            <p>Authenticated company dashboard</p>
            <h1>{activeView === "dashboard" ? "Live conversion engine" : activeView}</h1>
          </div>
          <div className="header-actions">
            <button onClick={refresh}><RefreshCw size={17} /> {loading ? "Loading" : "Refresh"}</button>
            <button className="secondary" onClick={onLogout}><LogOut size={17} /> Logout</button>
          </div>
        </header>

        {error && <div className="error">{error}</div>}

        {activeView === "dashboard" && (
          <>
            <div className="metrics">
              <MetricCard icon={Users} label="Visitors" value={overview.total_visitors} hint="From tracking SDK" />
              <MetricCard icon={Activity} label="Conversion rate" value={`${overview.conversion_rate}%`} hint="Purchasing visitors" />
              <MetricCard icon={ShoppingCart} label="Abandoned carts" value={overview.abandoned_carts} hint="Cart without purchase" />
              <MetricCard icon={Zap} label="Hot leads" value={overview.hot_leads} hint="Rule-scored intent" />
            </div>

            <section className="panel chart-panel">
              <div className="panel-title">
                <h2>Funnel performance</h2>
                <span>Only tracked client-site events</span>
              </div>
              {funnel.some((item) => item.count > 0) ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={funnel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#147d64" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyState label="No funnel data yet. Open the client site and interact with products." />}
            </section>

            <section className="split">
              <div className="panel">
                <div className="panel-title">
                  <h2>Revenue trend</h2>
                  <span>Purchases by day</span>
                </div>
                {trend.length ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#147d64" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <EmptyState label="No purchases tracked yet." />}
              </div>

              <div className="panel">
                <div className="panel-title">
                  <h2>Event mix</h2>
                  <span>Tracked behavior</span>
                </div>
                {eventMix.length ? eventMix.map((item) => (
                  <div className="event-row" key={item.name}>
                    <span>{item.name}</span>
                    <strong>{item.count}</strong>
                  </div>
                )) : <EmptyState label="No events received yet." />}
              </div>
            </section>

            <section className="split">
              <LeadPanel leads={bestLeads} />
              <EventPanel events={events} />
            </section>
          </>
        )}

        {activeView === "leads" && <LeadPanel leads={leads} full />}
        {activeView === "automations" && <AutomationPanel automations={automations} insights={insights} />}
        {activeView === "messages" && <MessagePanel messages={messages} onSendHotSms={sendHotSms} sendingSms={sendingSms} />}
        {activeView === "profile" && (
          <section className="panel install-panel">
            <div className="panel-title">
              <div>
                <h2>Tracking install</h2>
                <span>Use this script on your client website</span>
              </div>
              <button className="inline-action" onClick={copySnippet}><Clipboard size={16} /> Copy</button>
            </div>
            <div className="install-grid">
              <label>
                Company
                <input readOnly value={me?.company?.name || ""} />
              </label>
              <label>
                Public key
                <input readOnly value={me?.company?.public_key || ""} />
              </label>
              <label>
                Script link
                <input readOnly value={trackingScriptUrl} />
              </label>
            </div>
            <pre>{installSnippet}</pre>
          </section>
        )}
      </main>
    </div>
  );
}
