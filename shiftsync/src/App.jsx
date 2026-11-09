
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
  { id: 1, name: "Aarav Mehta", role: "Marketing", initials: "AM", color: "blue", availability: "Available" },
  { id: 2, name: "Ishita Sharma", role: "Design", initials: "IS", color: "pink", availability: "Available" },
  { id: 3, name: "Rohan Kapoor", role: "Technical", initials: "RK", color: "green", availability: "Assigned" },
  { id: 4, name: "Ananya Verma", role: "Media", initials: "AV", color: "orange", availability: "Available" },
  { id: 5, name: "Kabir Singh", role: "Operations", initials: "KS", color: "purple", availability: "Assigned" },
  { id: 6, name: "Meera Iyer", role: "Marketing", initials: "MI", color: "teal", availability: "Available" },
];

const initialShifts = [
  {
    id: 1,
    time: "09:00 AM",
    end: "10:00 AM",
    task: "Registration Desk",
    location: "Main Entrance",
    required: 3,
    volunteerIds: [1, 2],
    icon: ClipboardList,
    color: "blue",
  },
  {
    id: 2,
    time: "10:00 AM",
    end: "11:00 AM",
    task: "Event Coordination",
    location: "Auditorium",
    required: 4,
    volunteerIds: [3, 4, 5, 6],
    icon: Users,
    color: "purple",
  },
  {
    id: 3,
    time: "11:00 AM",
    end: "12:00 PM",
    task: "Media Coverage",
    location: "Main Stage",
    required: 3,
    volunteerIds: [4],
    icon: Camera,
    color: "pink",
  },
  {
    id: 4,
    time: "12:00 PM",
    end: "01:00 PM",
    task: "Refreshment Desk",
    location: "Cafeteria",
    required: 2,
    volunteerIds: [1, 5],
    icon: Coffee,
    color: "orange",
  },
  {
    id: 5,
    time: "01:00 PM",
    end: "02:00 PM",
    task: "Stage Management",
    location: "Main Stage",
    required: 3,
    volunteerIds: [2, 3],
    icon: Mic,
    color: "green",
  },
];

function App() {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [shifts, setShifts] = useState(initialShifts);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [newVolunteer, setNewVolunteer] = useState("");
  const [newRole, setNewRole] = useState("Operations");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalRequired = shifts.reduce((sum, shift) => sum + shift.required, 0);
  const totalAssigned = shifts.reduce((sum, shift) => sum + shift.volunteerIds.length, 0);
  const understaffed = shifts.filter(
    (shift) => shift.volunteerIds.length < shift.required
  );

  const filteredVolunteers = volunteers.filter((volunteer) =>
    volunteer.name.toLowerCase().includes(search.toLowerCase()) ||
    volunteer.role.toLowerCase().includes(search.toLowerCase())
  );

  function assignVolunteer(shiftId, volunteerId) {
    setShifts((current) =>
      current.map((shift) => {
        if (shift.id !== shiftId || shift.volunteerIds.includes(volunteerId)) {
          return shift;
        }

        return {
          ...shift,
          volunteerIds: [...shift.volunteerIds, volunteerId],
        };
      })
    );

    setVolunteers((current) =>
      current.map((volunteer) =>
        volunteer.id === volunteerId
          ? { ...volunteer, availability: "Assigned" }
          : volunteer
      )
    );
  }

  function removeVolunteer(shiftId, volunteerId) {
    setShifts((current) =>
      current.map((shift) =>
        shift.id === shiftId
          ? {
              ...shift,
              volunteerIds: shift.volunteerIds.filter((id) => id !== volunteerId),
            }
          : shift
      )
    );

    const assignedElsewhere = shifts.some(
      (shift) => shift.id !== shiftId && shift.volunteerIds.includes(volunteerId)
    );

    if (!assignedElsewhere) {
      setVolunteers((current) =>
        current.map((volunteer) =>
          volunteer.id === volunteerId
            ? { ...volunteer, availability: "Available" }
            : volunteer
        )
      );
    }
  }

  function addVolunteer(event) {
    event.preventDefault();

    if (!newVolunteer.trim()) return;

    const initials = newVolunteer
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setVolunteers((current) => [
      ...current,
      {
        id: Date.now(),
        name: newVolunteer.trim(),
        role: newRole,
        initials,
        color: "teal",
        availability: "Available",
      },
    ]);

    setNewVolunteer("");
    setShowModal(false);
  }

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Events", icon: CalendarDays },
    { name: "Volunteers", icon: Users },
    { name: "Tasks", icon: ClipboardList },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <h2>ShiftSync</h2>
            <span>Volunteer Hub</span>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`nav-item ${activeNav === item.name ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "Tasks" && <span className="nav-count">5</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-event">
          <div className="event-mini-icon">
            <Megaphone size={18} />
          </div>
          <div>
            <p>UPCOMING EVENT</p>
            <h4>TechFest 2026</h4>
            <span>Nov 15 · Main Campus</span>
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile-mini">
            <div className="avatar avatar-purple">VG</div>
            <div className="profile-info">
              <strong>Vivan Garg</strong>
              <span>Event Organizer</span>
            </div>
            <ArrowUpRight size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{activeNav}</strong>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search volunteers..."
              />
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button notification-button">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="avatar avatar-purple top-avatar">VG</div>
          </div>
        </header>

        <div className="dashboard">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                EVENT MANAGEMENT
              </div>
              <h1>Volunteer Dashboard</h1>
              <p>Keep your team organized and every shift running smoothly.</p>
            </div>

            <button className="primary-button" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Add Volunteer
            </button>
          </section>

          <section className="event-banner">
            <div className="event-banner-content">
              <div className="banner-tag">
                <span className="live-dot" />
                UPCOMING EVENT
              </div>
              <h2>TechFest 2026</h2>
              <p>Your campus, your community, your moment.</p>

              <div className="banner-meta">
                <span><CalendarDays size={16} /> November 15, 2026</span>
                <span><Clock3 size={16} /> 09:00 AM – 02:00 PM</span>
                <span><MapPin size={16} /> Main Campus</span>
              </div>
            </div>

            <div className="banner-decoration">
              <div className="banner-circle circle-one" />
              <div className="banner-circle circle-two" />
              <div className="banner-circle circle-three" />
              <div className="banner-illustration">
                <Users size={75} strokeWidth={1.3} />
                <Sparkles size={25} className="banner-sparkle" />
              </div>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Volunteers</span>
                <div className="stat-icon stat-blue"><Users size={20} /></div>
              </div>
              <h2>{volunteers.length}</h2>
              <p><span className="positive">+2</span> from last event</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Shift Coverage</span>
                <div className="stat-icon stat-green"><CheckCircle2 size={20} /></div>
              </div>
              <h2>{totalRequired ? Math.round((totalAssigned / totalRequired) * 100) : 0}%</h2>
              <p>{totalAssigned} of {totalRequired} positions filled</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Understaffed Shifts</span>
                <div className="stat-icon stat-orange"><AlertTriangle size={20} /></div>
              </div>
              <h2>{understaffed.length}</h2>
              <p className={understaffed.length ? "warning-text" : "positive"}>
                {understaffed.length ? "Needs your attention" : "All shifts staffed!"}
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Available Volunteers</span>
                <div className="stat-icon stat-purple"><UserCheck size={20} /></div>
              </div>
              <h2>{volunteers.filter((v) => v.availability === "Available").length}</h2>
              <p>Ready to be assigned</p>
            </div>
          </section>

          <section className="content-grid">
            <div className="left-column">
              <div className="section-card schedule-card">
                <div className="section-heading">
                  <div>
                    <h3>Shift Schedule</h3>
                    <p>Manage volunteer assignments by time slot</p>
                  </div>
                  <button className="text-button" onClick={() => setActiveNav("Events")}>
                    Full schedule <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="schedule-list">
                  {shifts.map((shift) => {
                    const Icon = shift.icon;
                    const assignedVolunteers = volunteers.filter((volunteer) =>
                      shift.volunteerIds.includes(volunteer.id)
                    );
                    const gap = Math.max(shift.required - shift.volunteerIds.length, 0);

                    return (
                      <div className={`shift-row ${gap ? "shift-understaffed" : ""}`} key={shift.id}>
                        <div className="shift-time">
                          <strong>{shift.time}</strong>
                          <span>{shift.end}</span>
                        </div>

                        <div className={`shift-icon shift-${shift.color}`}>
                          <Icon size={19} />
                        </div>

                        <div className="shift-details">
                          <h4>{shift.task}</h4>
                          <span><MapPin size={13} /> {shift.location}</span>
                          <div className="assigned-avatars">
                            {assignedVolunteers.slice(0, 4).map((volunteer) => (
                              <div
                                className={`avatar avatar-${volunteer.color}`}
                                title={volunteer.name}
                                key={volunteer.id}
                              >
                                {volunteer.initials}
                              </div>
                            ))}
                            <span className="assigned-count">
                              {shift.volunteerIds.length}/{shift.required}
                            </span>
                          </div>
                        </div>

                        <div className="shift-status">
                          {gap > 0 ? (
                            <span className="status-badge status-warning">
                              <AlertTriangle size={13} /> {gap} needed
                            </span>
                          ) : (
                            <span className="status-badge status-filled">
                              <CheckCircle2 size={13} /> Filled
                            </span>
                          )}

                          <button
                            className="assign-button"
                            onClick={() => setSelectedShift(shift)}
                          >
                            Manage <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="section-card volunteers-card">
                <div className="section-heading">
                  <div>
                    <h3>Volunteer Team</h3>
                    <p>Your event's people and their availability</p>
                  </div>
                  <button className="text-button" onClick={() => setActiveNav("Volunteers")}>
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="volunteer-table">
                  <div className="table-header">
                    <span>VOLUNTEER</span>
                    <span>ROLE</span>
                    <span>AVAILABILITY</span>
                  </div>

                  {filteredVolunteers.slice(0, 5).map((volunteer) => (
                    <div className="table-row" key={volunteer.id}>
                      <div className="table-person">
                        <div className={`avatar avatar-${volunteer.color}`}>
                          {volunteer.initials}
                        </div>
                        <strong>{volunteer.name}</strong>
                      </div>
                      <span className="role-label">{volunteer.role}</span>
                      <span className={`availability ${volunteer.availability === "Available" ? "available" : "assigned"}`}>
                        <span />
                        {volunteer.availability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="right-column">
              <div className="section-card coverage-card">
                <div className="section-heading">
                  <div>
                    <h3>Staffing Overview</h3>
                    <p>Volunteer distribution</p>
                  </div>
                </div>

                <div className="coverage-chart">
                  <div
                    className="coverage-ring"
                    style={{
                      "--coverage": `${totalRequired ? (totalAssigned / totalRequired) * 100 : 0}%`,
                    }}
                  >
                    <div className="coverage-inner">
                      <strong>{totalRequired ? Math.round((totalAssigned / totalRequired) * 100) : 0}%</strong>
                      <span>Coverage</span>
                    </div>
                  </div>
                </div>

                <div className="coverage-legend">
                  <div>
                    <span className="legend-dot legend-filled" />
                    <span>Assigned</span>
                    <strong>{totalAssigned}</strong>
                  </div>
                  <div>
                    <span className="legend-dot legend-open" />
                    <span>Open positions</span>
                    <strong>{Math.max(totalRequired - totalAssigned, 0)}</strong>
                  </div>
                </div>
              </div>

              <div className="section-card alerts-card">
                <div className="section-heading">
                  <div>
                    <h3>Staffing Alerts</h3>
                    <p>Shifts that need attention</p>
                  </div>
                  <span className="alert-count">{understaffed.length}</span>
                </div>

                {understaffed.length === 0 ? (
                  <div className="empty-state">
                    <CheckCircle2 size={27} />
                    <strong>You're all set!</strong>
                    <span>Every shift has enough volunteers.</span>
                  </div>
                ) : (
                  <div className="alert-list">
                    {understaffed.map((shift) => (
                      <div className="alert-item" key={shift.id}>
                        <div className="alert-icon">
                          <AlertTriangle size={17} />
                        </div>
                        <div className="alert-info">
                          <strong>{shift.task}</strong>
                          <span>{shift.time} · {shift.location}</span>
                          <small>{shift.required - shift.volunteerIds.length} volunteer(s) needed</small>
                        </div>
                        <button
                          className="alert-action"
                          onClick={() => setSelectedShift(shift)}
                        >
                          Fix
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="tip-card">
                <div className="tip-icon"><Sparkles size={18} /></div>
                <div>
                  <strong>Quick tip</strong>
                  <p>Assign volunteers to understaffed shifts first to keep your event running smoothly.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>ShiftSync · Society Volunteer Coordination</span>
            <span>Made for campus communities <span className="footer-heart">♥</span></span>
          </footer>
        </div>
      </main>

      {selectedShift && (
        <div className="modal-backdrop" onClick={() => setSelectedShift(null)}>
          <div className="modal shift-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="modal-eyebrow">SHIFT MANAGEMENT</span>
                <h2>{selectedShift.task}</h2>
                <p>{selectedShift.time} – {selectedShift.end} · {selectedShift.location}</p>
              </div>
              <button className="icon-button" onClick={() => setSelectedShift(null)}>
                <X size={19} />
              </button>
            </div>

            <div className="modal-progress">
              <div>
                <span>Staffing</span>
                <strong>{selectedShift.volunteerIds.length} / {selectedShift.required}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((selectedShift.volunteerIds.length / selectedShift.required) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <h4 className="modal-section-title">Assigned volunteers</h4>

            {selectedShift.volunteerIds.length === 0 && (
              <p className="modal-empty">No volunteers assigned yet.</p>
            )}

            {selectedShift.volunteerIds.map((id) => {
              const volunteer = volunteers.find((v) => v.id === id);
              if (!volunteer) return null;

              return (
                <div className="modal-volunteer" key={id}>
                  <div className={`avatar avatar-${volunteer.color}`}>
                    {volunteer.initials}
                  </div>
                  <div className="modal-volunteer-info">
                    <strong>{volunteer.name}</strong>
                    <span>{volunteer.role}</span>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeVolunteer(selectedShift.id, id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <h4 className="modal-section-title">Available volunteers</h4>

            {volunteers
              .filter((volunteer) =>
                volunteer.availability === "Available" &&
                !selectedShift.volunteerIds.includes(volunteer.id)
              )
              .map((volunteer) => (
                <div className="modal-volunteer" key={volunteer.id}>
                  <div className={`avatar avatar-${volunteer.color}`}>
                    {volunteer.initials}
                  </div>
                  <div className="modal-volunteer-info">
                    <strong>{volunteer.name}</strong>
                    <span>{volunteer.role}</span>
                  </div>
                  <button
                    className="add-assignment-button"
                    onClick={() => assignVolunteer(selectedShift.id, volunteer.id)}
                  >
                    <Plus size={15} /> Assign
                  </button>
                </div>
              ))}

            {volunteers.filter((v) => v.availability === "Available").length === 0 && (
              <p className="modal-empty">No available volunteers right now.</p>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <form className="modal add-modal" onSubmit={addVolunteer} onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="modal-eyebrow">TEAM MANAGEMENT</span>
                <h2>Add a volunteer</h2>
                <p>Bring another teammate into the event.</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setShowModal(false)}>
                <X size={19} />
              </button>
            </div>

            <label className="form-label">
              Full name
              <input
                value={newVolunteer}
                onChange={(event) => setNewVolunteer(event.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </label>

            <label className="form-label">
              Volunteer role
              <select value={newRole} onChange={(event) => setNewRole(event.target.value)}>
                <option>Operations</option>
                <option>Marketing</option>
                <option>Design</option>
                <option>Technical</option>
                <option>Media</option>
                <option>Coordination</option>
              </select>
            </label>

            <button type="submit" className="primary-button modal-submit">
              <Plus size={17} /> Add to team
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
