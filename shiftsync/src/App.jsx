
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Settings,
  Search,
  Bell,
  Plus,
  Clock3,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  X,
  Menu,
  ArrowUpRight,
  Coffee,
  Mic,
  Camera,
  Megaphone,
  Sparkles,
} from "lucide-react";

import "./App.css";

const initialVolunteers = [
  { id: 1, name: "Aarav Mehta", role: "Event Lead", initials: "AM", color: "purple", availability: "Available" },
  { id: 2, name: "Ishita Sharma", role: "Media Team", initials: "IS", color: "pink", availability: "Available" },
  { id: 3, name: "Rohan Kapoor", role: "Technical", initials: "RK", color: "blue", availability: "Busy" },
  { id: 4, name: "Ananya Verma", role: "Design Team", initials: "AV", color: "orange", availability: "Available" },
  { id: 5, name: "Kabir Singh", role: "Operations", initials: "KS", color: "green", availability: "Available" },
  { id: 6, name: "Meera Iyer", role: "Media Team", initials: "MI", color: "cyan", availability: "Busy" },
];

const initialShifts = [
  {
    id: 1,
    title: "Registration Desk",
    category: "Operations",
    icon: ClipboardList,
    color: "purple",
    time: "09:00 AM – 11:00 AM",
    location: "Main Entrance",
    required: 3,
    volunteers: [1, 5],
  },
  {
    id: 2,
    title: "Technical Support",
    category: "Technical",
    icon: Mic,
    color: "blue",
    time: "10:00 AM – 12:00 PM",
    location: "Auditorium",
    required: 2,
    volunteers: [3, 4],
  },
  {
    id: 3,
    title: "Media & Photography",
    category: "Media",
    icon: Camera,
    color: "pink",
    time: "11:00 AM – 01:00 PM",
    location: "Event Venue",
    required: 3,
    volunteers: [2, 6],
  },
  {
    id: 4,
    title: "Guest Coordination",
    category: "Operations",
    icon: Users,
    color: "orange",
    time: "12:00 PM – 02:00 PM",
    location: "VIP Lounge",
    required: 2,
    volunteers: [1],
  },
  {
    id: 5,
    title: "Refreshment Counter",
    category: "Hospitality",
    icon: Coffee,
    color: "green",
    time: "01:00 PM – 03:00 PM",
    location: "Food Court",
    required: 2,
    volunteers: [5, 6],
  },
];

function App() {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [shifts, setShifts] = useState(initialShifts);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [assignShift, setAssignShift] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({ name: "", role: "Operations" });

  const totalRequired = shifts.reduce((sum, shift) => sum + shift.required, 0);
  const totalAssigned = shifts.reduce((sum, shift) => sum + shift.volunteers.length, 0);
  const coverage = Math.round((totalAssigned / totalRequired) * 100);
  const understaffed = shifts.filter((shift) => shift.volunteers.length < shift.required);

  const filteredVolunteers = volunteers.filter((volunteer) =>
    `${volunteer.name} ${volunteer.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const getVolunteer = (id) => volunteers.find((volunteer) => volunteer.id === id);

  function addVolunteer(e) {
    e.preventDefault();

    if (!newVolunteer.name.trim()) return;

    const colors = ["purple", "pink", "blue", "orange", "green", "cyan"];
    const initials = newVolunteer.name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setVolunteers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newVolunteer.name.trim(),
        role: newVolunteer.role,
        initials,
        color: colors[prev.length % colors.length],
        availability: "Available",
      },
    ]);

    setNewVolunteer({ name: "", role: "Operations" });
    setShowVolunteerModal(false);
  }

  function toggleAssignment(shiftId, volunteerId) {
    setShifts((prev) =>
      prev.map((shift) => {
        if (shift.id !== shiftId) return shift;

        const alreadyAssigned = shift.volunteers.includes(volunteerId);

        return {
          ...shift,
          volunteers: alreadyAssigned
            ? shift.volunteers.filter((id) => id !== volunteerId)
            : [...shift.volunteers, volunteerId],
        };
      })
    );
  }

  return (
    <div className="app-shell">
      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Users size={22} />
          </div>
          <div>
            <h2>ShiftSync</h2>
            <span>Volunteer Management</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}>
            <X size={19} />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">O</div>
          <div>
            <strong>OWASP Society</strong>
            <span>Student Chapter</span>
          </div>
          <span className="workspace-chevron">⌄</span>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {[
            { name: "Overview", icon: LayoutDashboard },
            { name: "Events", icon: CalendarDays },
            { name: "Volunteers", icon: Users },
            { name: "Assignments", icon: ClipboardList },
          ].map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${activeTab === name ? "active" : ""}`}
              onClick={() => {
                setActiveTab(name);
                setMobileMenu(false);
              }}
            >
              <Icon size={18} />
              <span>{name}</span>
              {name === "Assignments" && understaffed.length > 0 && (
                <span className="nav-count">{understaffed.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="nav-label">PREFERENCES</div>
        <button className="nav-item" onClick={() => alert("Settings are coming soon!")}>
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <Sparkles size={17} />
            </div>
            <strong>Need a hand?</strong>
            <p>Keep your event running smoothly with ShiftSync.</p>
            <button onClick={() => alert("Welcome to ShiftSync! Manage your society shifts right here.")}>
              Explore guide <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="profile">
            <div className="avatar avatar-purple">VG</div>
            <div className="profile-info">
              <strong>Vivan Garg</strong>
              <span>Event Administrator</span>
            </div>
            <button className="profile-menu" onClick={() => alert("Profile settings coming soon.")}>•••</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(true)}>
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activeTab}</strong>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                placeholder="Search volunteers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </div>

            <button className="icon-button notification-button" onClick={() => alert(`${understaffed.length} shifts need additional volunteers.`)}>
              <Bell size={19} />
              {understaffed.length > 0 && <span className="notification-dot" />}
            </button>

            <div className="avatar avatar-purple top-avatar">VG</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">MONDAY, NOVEMBER 9, 2026</div>
              <h1>Good afternoon, Vivan <span>✦</span></h1>
              <p>Here's what's happening with your volunteers today.</p>
            </div>

            <button className="primary-button" onClick={() => setShowVolunteerModal(true)}>
              <Plus size={18} /> Add volunteer
            </button>
          </section>

          <section className="event-banner">
            <div className="event-banner-content">
              <div className="event-tag"><span /> UPCOMING EVENT</div>
              <h2>TechFest 2026</h2>
              <p>Your society's biggest tech event is coming up. Let's make it happen.</p>

              <div className="event-details">
                <span><CalendarDays size={16} /> November 14, 2026</span>
                <span><Clock3 size={16} /> 09:00 AM – 05:00 PM</span>
                <span><MapPin size={16} /> Main Auditorium</span>
              </div>
            </div>

            <div className="event-decoration">
              <div className="event-decoration-circle circle-one" />
              <div className="event-decoration-circle circle-two" />
              <div className="event-decoration-circle circle-three" />
              <div className="event-decoration-icon"><CalendarDays size={46} /></div>
              <div className="event-decoration-label">TECH<br />FEST</div>
            </div>

            <button className="banner-edit" onClick={() => alert("Event editing coming soon.")}>
              Edit event <ArrowUpRight size={15} />
            </button>
          </section>

          <section className="stats-grid">
            <StatCard
              label="Total Volunteers"
              value={volunteers.length}
              change="Registered members"
              icon={Users}
              color="purple"
            />
            <StatCard
              label="Active Shifts"
              value={shifts.length}
              change="Across today's event"
              icon={CalendarDays}
              color="blue"
            />
            <StatCard
              label="Staffing Coverage"
              value={`${coverage}%`}
              change={`${totalAssigned} of ${totalRequired} spots filled`}
              icon={CheckCircle2}
              color="green"
            />
            <StatCard
              label="Needs Attention"
              value={understaffed.length}
              change="Shifts need volunteers"
              icon={AlertTriangle}
              color="orange"
            />
          </section>

          <div className="dashboard-grid">
            <section className="panel shifts-panel">
              <div className="panel-header">
                <div>
                  <h3>Event Shifts</h3>
                  <p>Manage staffing for your upcoming event</p>
                </div>
                <button className="text-button" onClick={() => setActiveTab("Assignments")}>
                  View all <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="shift-list">
                {shifts.map((shift) => {
                  const Icon = shift.icon;
                  const filled = shift.volunteers.length;
                  const percent = Math.min((filled / shift.required) * 100, 100);
                  const isUnderstaffed = filled < shift.required;

                  return (
                    <div className="shift-row" key={shift.id}>
                      <div className={`shift-icon icon-${shift.color}`}>
                        <Icon size={19} />
                      </div>

                      <div className="shift-main">
                        <div className="shift-title-line">
                          <strong>{shift.title}</strong>
                          <span className={`shift-status ${isUnderstaffed ? "status-warning" : "status-filled"}`}>
                            {isUnderstaffed ? "Understaffed" : "Fully staffed"}
                          </span>
                        </div>

                        <div className="shift-meta">
                          <span><Clock3 size={13} /> {shift.time}</span>
                          <span><MapPin size={13} /> {shift.location}</span>
                        </div>

                        <div className="shift-progress">
                          <div className="progress-track">
                            <div
                              className={`progress-fill ${isUnderstaffed ? "progress-warning" : ""}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span>{filled}/{shift.required} volunteers</span>
                        </div>

                        <div className="assigned-avatars">
                          {shift.volunteers.map((id) => {
                            const volunteer = getVolunteer(id);
                            if (!volunteer) return null;

                            return (
                              <div
                                key={id}
                                className={`avatar avatar-${volunteer.color} small-avatar`}
                                title={volunteer.name}
                              >
                                {volunteer.initials}
                              </div>
                            );
                          })}

                          <button
                            className="add-assignee"
                            title="Manage volunteers"
                            onClick={() => setAssignShift(shift)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        className="manage-button"
                        onClick={() => setAssignShift(shift)}
                      >
                        Manage
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="panel coverage-panel">
              <div className="panel-header">
                <div>
                  <h3>Staffing Overview</h3>
                  <p>Volunteer allocation at a glance</p>
                </div>
                <button className="more-button" onClick={() => setActiveTab("Assignments")}>•••</button>
              </div>

              <div className="coverage-chart">
                <div
                  className="donut"
                  style={{ "--coverage": `${coverage}%` }}
                >
                  <div className="donut-inner">
                    <strong>{coverage}%</strong>
                    <span>Coverage</span>
                  </div>
                </div>
              </div>

              <div className="coverage-legend">
                <div><span className="legend-dot legend-purple" /> Filled positions <strong>{totalAssigned}</strong></div>
                <div><span className="legend-dot legend-gray" /> Remaining positions <strong>{Math.max(totalRequired - totalAssigned, 0)}</strong></div>
              </div>

              <div className="coverage-footer">
                <CheckCircle2 size={17} />
                <span>{coverage === 100 ? "All shifts are fully staffed!" : "You're making good progress!"}</span>
              </div>
            </section>
          </div>

          <div className="bottom-grid">
            <section className="panel volunteer-panel">
              <div className="panel-header">
                <div>
                  <h3>Volunteer Directory</h3>
                  <p>Your event's registered volunteers</p>
                </div>
                <button className="text-button" onClick={() => setShowVolunteerModal(true)}>
                  <Plus size={15} /> Add new
                </button>
              </div>

              <div className="volunteer-table">
                <div className="table-header">
                  <span>VOLUNTEER</span>
                  <span>ROLE</span>
                  <span>AVAILABILITY</span>
                  <span>STATUS</span>
                </div>

                {filteredVolunteers.map((volunteer) => (
                  <div className="volunteer-row" key={volunteer.id}>
                    <div className="volunteer-name">
                      <div className={`avatar avatar-${volunteer.color}`}>
                        {volunteer.initials}
                      </div>
                      <strong>{volunteer.name}</strong>
                    </div>

                    <span className="volunteer-role">{volunteer.role}</span>

                    <span className="volunteer-availability">
                      <span className={`availability-dot ${volunteer.availability === "Available" ? "available" : "busy"}`} />
                      {volunteer.availability}
                    </span>

                    <span className="member-status">Active</span>
                  </div>
                ))}

                {filteredVolunteers.length === 0 && (
                  <div className="empty-state">No volunteers found.</div>
                )}
              </div>
            </section>

            <section className="panel attention-panel">
              <div className="panel-header">
                <div>
                  <h3>Needs Attention</h3>
                  <p>Shifts that need your help</p>
                </div>
                <span className="attention-count">{understaffed.length}</span>
              </div>

              {understaffed.length === 0 ? (
                <div className="all-staffed">
                  <CheckCircle2 size={30} />
                  <strong>Everything is covered!</strong>
                  <span>All shifts have enough volunteers.</span>
                </div>
              ) : (
                <div className="attention-list">
                  {understaffed.map((shift) => {
                    const missing = shift.required - shift.volunteers.length;

                    return (
                      <div className="attention-item" key={shift.id}>
                        <div className="attention-icon"><AlertTriangle size={17} /></div>
                        <div className="attention-text">
                          <strong>{shift.title}</strong>
                          <span>{missing} more volunteer{missing > 1 ? "s" : ""} needed</span>
                        </div>
                        <button onClick={() => setAssignShift(shift)}>Fix <ArrowUpRight size={14} /></button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="attention-footer">
                <Megaphone size={16} />
                <span>Tip: Assign available volunteers to understaffed shifts.</span>
              </div>
            </section>
          </div>

          <footer className="footer">
            <span>© 2026 ShiftSync</span>
            <span>Made for societies, built for teamwork ✦</span>
          </footer>
        </div>
      </main>

      {showVolunteerModal && (
        <div className="modal-overlay" onClick={() => setShowVolunteerModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Add volunteer</h2>
                <p>Register a new society volunteer.</p>
              </div>
              <button className="modal-close" onClick={() => setShowVolunteerModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={addVolunteer}>
              <label>Full name</label>
              <input
                autoFocus
                placeholder="e.g. Rahul Sharma"
                value={newVolunteer.name}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                required
              />

              <label>Team / Role</label>
              <select
                value={newVolunteer.role}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, role: e.target.value })}
              >
                <option>Operations</option>
                <option>Media Team</option>
                <option>Technical</option>
                <option>Design Team</option>
                <option>Event Lead</option>
                <option>Hospitality</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowVolunteerModal(false)}>Cancel</button>
                <button type="submit" className="primary-button"><Plus size={16} /> Add volunteer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignShift && (
        <div className="modal-overlay" onClick={() => setAssignShift(null)}>
          <div className="modal assignment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Manage volunteers</h2>
                <p>{assignShift.title}</p>
              </div>
              <button className="modal-close" onClick={() => setAssignShift(null)}><X size={20} /></button>
            </div>

            <div className="assignment-info">
              <span><Clock3 size={15} /> {assignShift.time}</span>
              <span><UserCheck size={15} /> {assignShift.volunteers.length} / {assignShift.required} assigned</span>
            </div>

            <div className="assignment-list">
              {volunteers.map((volunteer) => {
                const assigned = assignShift.volunteers.includes(volunteer.id);

                return (
                  <button
                    key={volunteer.id}
                    className={`assignment-person ${assigned ? "person-assigned" : ""}`}
                    onClick={() => {
                      toggleAssignment(assignShift.id, volunteer.id);

                      setAssignShift((current) => ({
                        ...current,
                        volunteers: assigned
                          ? current.volunteers.filter((id) => id !== volunteer.id)
                          : [...current.volunteers, volunteer.id],
                      }));
                    }}
                  >
                    <div className={`avatar avatar-${volunteer.color}`}>{volunteer.initials}</div>
                    <div className="assignment-person-info">
                      <strong>{volunteer.name}</strong>
                      <span>{volunteer.role}</span>
                    </div>
                    <span className={`assignment-check ${assigned ? "checked" : ""}`}>
                      {assigned && <CheckCircle2 size={17} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="modal-actions">
              <button className="primary-button full-button" onClick={() => setAssignShift(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-${color}`}><Icon size={20} /></div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-change">{change}</span>
    </div>
  );
}

export default App;
