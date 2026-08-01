"use client";

import { useEffect, useState } from "react";

const MENU_ITEMS = [
  { icon: "/vuesax-outline-home-2.svg", label: "Dashboard", id: "dashboard" },
  { icon: "/icons-2.svg", label: "Properties", id: "properties" },
  { icon: "/vuesax-linear-people.svg", label: "User Management", id: "users" },
  { icon: "/vuesax-outline-category-2.svg", label: "Bookings", id: "bookings" },
  { icon: "/vuesax-outline-candle-2.svg", label: "Dispute Centre", id: "disputes" },
  { icon: "/vuesax-outline-setting-2.svg", label: "Settings", id: "settings" },
];

function Sparkline({ values, positive }) {
  const width = 120;
  const height = 48;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline
        fill="none"
        stroke={positive ? "#047857" : "#b91c1c"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-[var(--success-bg)] text-[var(--success)]",
    "In Progress": "bg-[var(--warning-bg)] text-[var(--warning)]",
    Cancelled: "bg-[var(--danger-bg)] text-[var(--danger)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Completed"
            ? "bg-[var(--success)]"
            : status === "In Progress"
              ? "bg-[var(--warning)]"
              : "bg-[var(--danger)]"
        }`}
      />
      {status}
    </span>
  );
}

function CategoryBadge({ category }) {
  const isGuest = category === "Guest";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
        isGuest
          ? "bg-[var(--info-bg)] text-[var(--info)]"
          : "bg-[var(--warning-bg)] text-[var(--warning)]"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isGuest ? "bg-[var(--info)]" : "bg-[var(--warning)]"}`} />
      {category}
    </span>
  );
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookingQuery, setBookingQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load dashboard");
        }
        if (cancelled) return;
        setProfile(json.data.profile);
        setMetrics(json.data.metrics);
        setBookings(json.data.bookings);
        setUsers(json.data.users);
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUserAction(id, status) {
    const prev = users;
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, status } : u)));

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Update failed");
      }
    } catch {
      setUsers(prev);
    }
  }

  const filteredBookings = bookings.filter((b) =>
    b.name.toLowerCase().includes(bookingQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[272px] flex flex-col justify-between bg-[var(--sidebar)] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pt-8 pb-4">
          <div className="mb-10">
            <p className="font-[family-name:var(--font-instrument)] text-3xl font-bold tracking-tight">
              Efandex
            </p>
            <p className="mt-1 text-xs text-slate-400 tracking-wide uppercase">
              Admin Console
            </p>
          </div>

          <div className="mb-8 flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/10">
            <img src="/icons-1.svg" alt="" className="w-5 h-5 opacity-70 invert" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
            />
          </div>

          <nav className="flex flex-col gap-1.5">
            {MENU_ITEMS.map((item) => {
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left text-sm transition-all ${
                    active
                      ? "bg-white text-[var(--sidebar)] font-semibold shadow-sm"
                      : "text-[var(--sidebar-text)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className={`w-5 h-5 ${active ? "" : "invert opacity-80"}`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-6 pb-8 flex flex-col gap-2">
          <button
            type="button"
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors"
          >
            <img src="/vuesax-outline-book-saved.svg" alt="" className="w-5 h-5 invert opacity-80" />
            Privacy Policy
          </button>
          <button
            type="button"
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium bg-red-500/90 hover:bg-red-500 text-white transition-colors"
          >
            <img src="/icons.svg" alt="" className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg border border-[var(--border)] bg-white"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <span className="block w-4 h-0.5 bg-slate-800 mb-1" />
                <span className="block w-4 h-0.5 bg-slate-800 mb-1" />
                <span className="block w-4 h-0.5 bg-slate-800" />
              </button>
              <div className="min-w-0">
                <h1 className="font-[family-name:var(--font-instrument)] text-xl sm:text-2xl font-semibold text-slate-900 truncate">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-slate-500 truncate">
                  Welcome back, {profile?.name || "MUHAMMAD OBAID"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="hidden sm:flex p-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-slate-50 transition-colors"
                aria-label="Notifications"
              >
                <img src="/vuesax-outline-notification-bing.svg" alt="" className="w-5 h-5" />
              </button>

              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-muted)] text-sm text-slate-600">
                <img src="/vuesax-outline-global.svg" alt="" className="w-4 h-4" />
                <span>EN</span>
                <span className="w-px h-3.5 bg-slate-300" />
                <span>USD</span>
              </div>

              <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-[var(--border)] bg-white shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold tracking-wide">
                  {profile?.initials || "MO"}
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {profile?.name || "MUHAMMAD OBAID"}
                  </p>
                  <p className="text-xs text-slate-500">{profile?.role || "Administrator"}</p>
                </div>
                <img src="/vuesax-outline-arrow-down.svg" alt="" className="w-4 h-4 opacity-60" />
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 px-5 sm:px-8 py-6 sm:py-8 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="h-44 skeleton" />
                ))
              : metrics.map((metric, index) => (
                  <article
                    key={metric.id}
                    className={`rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow)] ${
                      index === 0
                        ? "animate-fade-up"
                        : index === 1
                          ? "animate-fade-up-delay-1"
                          : "animate-fade-up-delay-2"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <select className="px-3 py-1.5 text-sm font-medium text-slate-700 border border-[var(--border)] rounded-lg bg-white outline-none focus:ring-2 focus:ring-slate-200">
                        <option>Last Month</option>
                        <option>This Month</option>
                        <option>Last Year</option>
                      </select>
                      <div
                        className={`flex items-center gap-1.5 text-xs font-semibold ${
                          metric.isPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
                        }`}
                      >
                        <img
                          src={metric.isPositive ? "/arrowfatlinesup.svg" : "/arrowfatlinesup-2.svg"}
                          alt=""
                          className="w-3.5 h-3.5"
                        />
                        {metric.change.toFixed(2)}%
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                        <p className="mt-1 font-[family-name:var(--font-instrument)] text-3xl font-bold text-slate-900 tracking-tight">
                          {metric.value}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">{metric.period}</p>
                      </div>
                      <Sparkline values={metric.trend} positive={metric.isPositive} />
                    </div>
                  </article>
                ))}
          </div>

          {/* Bookings */}
          <article className="rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow)] animate-fade-up-delay-2 overflow-hidden">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 sm:px-6 py-5 border-b border-[var(--border)]">
              <h2 className="font-[family-name:var(--font-instrument)] text-lg font-semibold text-slate-900">
                Recent Bookings
              </h2>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-muted)] min-w-[200px] flex-1 sm:flex-none sm:w-72">
                  <input
                    value={bookingQuery}
                    onChange={(e) => setBookingQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    placeholder="Search bookings..."
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold border border-[var(--border)] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-soft)] transition-colors"
                >
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50/80 text-left">
                    {["Name", "Status", "Price", "Capacity", "Duration", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                        Loading bookings...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {booking.name}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{booking.price}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{booking.capacity}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{booking.duration}</td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className="text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                          >
                            View Booking Details →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* Users */}
          <article className="rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow)] animate-fade-up-delay-3 overflow-hidden">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 sm:px-6 py-5 border-b border-[var(--border)]">
              <h2 className="font-[family-name:var(--font-instrument)] text-lg font-semibold text-slate-900">
                New User Registrations
              </h2>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-muted)] min-w-[200px] flex-1 sm:flex-none sm:w-72">
                  <input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    placeholder="Search users..."
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold border border-[var(--border)] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-soft)] transition-colors"
                >
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50/80 text-left">
                    {["Name", "Category", "Join Date", "Email", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4">
                          <CategoryBadge category={user.category} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.joinDate}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                        <td className="px-6 py-4">
                          {user.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUserAction(user.id, "declined")}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--danger-bg)] text-[var(--danger)] hover:opacity-80 transition-opacity"
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUserAction(user.id, "approved")}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--success-bg)] text-[var(--success)] hover:opacity-80 transition-opacity"
                              >
                                Approve
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`text-xs font-semibold capitalize ${
                                user.status === "approved"
                                  ? "text-[var(--success)]"
                                  : "text-[var(--danger)]"
                              }`}
                            >
                              {user.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <footer className="pt-2 pb-4 text-center text-xs text-slate-400">
            Efandex Admin · Managed by <span className="font-semibold text-slate-600">MUHAMMAD OBAID</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
