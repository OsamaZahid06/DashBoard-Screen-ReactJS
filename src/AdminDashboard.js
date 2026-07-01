import React, { useState,useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend
);

const PAGE_SIZE = 15;

const generateData = () => {
  const statuses = ["Pending", "Completed", "Fulfilled", "Draft"];

  return Array.from({ length: 60 }, (_, i) => ({
    id: 116200 + i,
    invoiceDate: "06/22/2026",
    customerName: `Customer ${i + 1}`,
    invoiceTotal: (Math.random() * 5000).toFixed(2),
    paidAmount: "0.00",
    balance: (Math.random() * 5000).toFixed(2),
    paymentMode: "Cash",
    type: "POS",
    status: statuses[i % 4],
  }));
};

export default function AdminDashboard() {
    const maps = [
        "Default Map",
        "Hybrid Map",
        "Light Style",
        "Dark Style",
        "Street View",
        "Markers",
    ];

    const bounds = [
        [35.0, 19.0],
        [41.0, 29.0],
    ];
    const [profiles, setProfiles] = useState([]);

    const [events, setEvents] = useState([
      
        { title: "Christmas Party", date: "2026-12-25", type: "holiday" },
        { title: "Eid-ul-Fitr", date: "2026-03-20", type: "holiday" },
        { title: "9 Muharram", date: "2026-06-25", type: "holiday" },
        { title: "10 Muharram", date: "2026-06-26", type: "holiday" },
        { title: "Eid-ul-Fitr", date: "2026-03-20", type: "holiday" },
        { title: "12 Rabi-ul-Awal", date: "2026-08-26", type: "holiday" },
        { title: "Eid-ul-Adha", date: "2026-05-27", type: "holiday" },
        { title: "New Year Day", date: "2026-01-01", type: "public-holiday" },
        { title: "Pakistan Day", date: "2026-03-23", type: "public-holiday" },
        { title: "Labour Day", date: "2026-05-01", type: "public-holiday" },
        { title: "Independence Day", date: "2026-08-14", type: "public-holiday" },
        { title: "Quaid Day", date: "2026-12-25", type: "public-holiday" },
    ]);

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        image:
            "",
    });

    const [newEvent, setNewEvent] = useState("");
const [selectedDate, setSelectedDate] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const openProfile = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setShowModal(false);
    };

     const [data, setData] = useState(generateData());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const searchMatch = Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || row.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [data, search, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const updateStatus = (id, status) => {
    if (!window.confirm("Update order status?")) return;

    const updated = data.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    setData(updated);
    alert("Status Updated Successfully");
  };

  const saveEdit = () => {
    if (!window.confirm("Do you want to save changes?")) return;

    const updated = data.map((item) =>
      item.id === editData.id ? editData : item
    );

    setData(updated);
    setEditData(null);

    alert("Saved Successfully");
  };

  const deleteRecord = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?"))
      return;

    setData((prev) => prev.filter((x) => x.id !== id));

    alert("Deleted Successfully");
  };





    const latestUser =
        profiles.length > 0
            ? profiles[profiles.length - 1]
            : formData;


    const [showSidebar, setShowSidebar] = useState(true);
    const [activePage, setActivePage] = useState("Dashboard");


    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // Image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({
                    ...formData,
                    image: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };
   

    const today = new Date().toISOString().split("T")[0];

    const todayEvents = events.filter(
        (event) => event.date === today
    );

    const upcomingEvents = events.filter(
        (event) => event.date > today
    );

    const barData = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
        datasets: [
            {
                data: [50, 65, 40, 80, 30, 40, 20, 10],
                backgroundColor: "#4cc9f0",
            },
        ],
    };

    const areaData = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
        datasets: [
            {
                data: [10, 40, 15, 30, 5, 25, 35, 15],
                borderColor: "#ff4d9d",
                backgroundColor: "rgba(255,77,157,.5)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const areaData2 = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
        datasets: [
            {
                data: [15, 20, 10, 15, 10, 30, 25, 12],
                borderColor: "#4cc9f0",
                backgroundColor: "rgba(76,201,240,.5)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const areaData3 = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
        datasets: [
            {
                data: [20, 5, 25, 5, 22, 15, 28, 5],
                borderColor: "#ffb347",
                backgroundColor: "rgba(255,179,71,.5)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const lineData = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        datasets: [
            {
                label: "Blue",
                data: [150, 250, 120, 200, 180, 300, 150, 90, 170, 140],
                borderColor: "#4cc9f0",
                tension: 0.4,
            },
            {
                label: "Pink",
                data: [180, 300, 80, 160, 150, 210, 150, 170, 70, 150],
                borderColor: "#ff4d9d",
                tension: 0.4,
            },
        ],
    };

    const doughnutData = {
        labels: ["A", "B", "C"],
        datasets: [
            {
                data: [40, 35, 25],
                backgroundColor: [
                    "#ff4d9d",
                    "#4cc9f0",
                    "#ffb347",
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    // Save profile (ONLY ONE USER)
    const saveProfile = () => {
        const { name, dob, email, phone, address, city, zip, image } = formData;

        if (!name || !dob || !email || !phone || !address || !city || !zip || !image) {
            alert("Please fill all required fields (State is optional)");
            return;
        }

        setProfiles([formData]); // overwrite old profile
        alert("Profile saved successfully!");
    };
    const deleteEvent = (title) => {
  const updated = events.filter((e) => e.title !== title);
  setEvents(updated);
};
const addEvent = () => {
  if (!newEvent || !selectedDate) return;

  const updated = [
    ...events,
    {
      title: newEvent,
      date: selectedDate,
      type: "user",
    },
  ];

  setEvents(updated);
  setNewEvent("");
};
const handleDateClick = (arg) => {
  setSelectedDate(arg.dateStr);
};


    return (
        <>
            <style>
                {`
          .menu-scroll {
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .menu-scroll::-webkit-scrollbar {
            display: none;
          }

          .content-scroll {
            overflow-y: auto;
          }

          .sidebar-link {
            color: #fff;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 6px;
            display: block;
          }

          .sidebar-link:hover {
            background: rgba(255,255,255,0.1);
            color: #fff;
          }
        `}
            </style>

            <div className="d-flex vh-100 overflow-hidden">

                {/* Sidebar */}
                {showSidebar && (

                    <aside className="bg-dark text-white d-flex flex-column flex-shrink-0 vh-100 overflow-hidden">
                        {/* Logo */}
                        <div className="p-3 ">
                            <h4 className="m-0 fw-bold">Dashboard Screen</h4>
                        </div>

                        {/* User */}
                        <div className="d-flex align-items-center p-3">
                            <img
                                src={
                                    latestUser.image ||
                                    "https://via.placeholder.com/50"
                                }
                                alt="profile"
                                width="50"
                                height="50"
                                className="rounded-circle me-2"
                            />

                            <div className="flex-grow-1 overflow-hidden">
                                <div className="fw-semibold text-truncate">
                                    {latestUser.name}
                                </div>

                                <small className="text-secondary">
                                    Designer
                                </small>
                            </div>
                        </div>

                        {/* Scrollable Menu */}
                        <div className="menu-scroll flex-grow-1 p-3">
                            <small className="text-secondary text-uppercase">
                                Pages
                            </small>

                            <ul className="nav flex-column mt-2">
                                <li className="nav-item">
                                    <a
                                        href="#"
                                        className={`sidebar-link ${activePage === "Dashboard" ? "active-link bg-secondary" : ""
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Dashboard");
                                        }}
                                    >
                                        Dashboard
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a
                                        href="#"
                                        className={`sidebar-link ${activePage === "Pages" ? "active-link bg-secondary" : ""
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Pages");
                                        }}
                                    >
                                        Pages
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Profile" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Profile");
                                        }}>
                                        Profile
                                    </a>
                                </li>

                                {/* <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Invoice" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Invoice");
                                        }}>
                                        Invoice
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Tasks" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Tasks");
                                        }}>
                                        Tasks
                                    </a>
                                </li> */}

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Calendar" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Calendar");
                                        }}>
                                        Calendar
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Team" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Team");
                                        }}>
                                        Team
                                    </a>
                                </li>
                            </ul>

                            {/* <small className="text-secondary text-uppercase d-block mt-4">
                                Components
                            </small>

                            <ul className="nav flex-column mt-2">
                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "UI Elements" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("UI Elements");
                                        }}>
                                        UI Elements
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Icons" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Icons");
                                        }}>
                                        Icons
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Forms" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Forms");
                                        }}>
                                        Forms
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Tables" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Tables");
                                        }}>
                                        Tables
                                    </a>
                                </li>
                            </ul> */}

                            <small className="text-secondary text-uppercase d-block mt-4">
                                Plugins
                            </small>

                            <ul className="nav flex-column mt-2">
                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Charts" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Charts");
                                        }}>
                                        Charts
                                    </a>
                                </li>

                                {/* <li className="nav-item">
                                    <a href="#"
                                        className={`sidebar-link ${activePage === "Notifications" ? "active-link bg-secondary" : ""
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Notifications");
                                        }}>
                                        Notifications
                                    </a>
                                </li> */}

                                {/* <li className="nav-item">
                                    <a
                                        href="#"
                                        className={`sidebar-link ${activePage === "Maps" ? "active-link bg-secondary" : ""
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Maps");
                                        }}
                                    >
                                        Maps
                                    </a>
                                </li> */}

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Maps" ? "active-link bg-secondary" : ""
                                        }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Maps");
                                        }}>
                                        Google Maps
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "Vector Maps" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("Vector Maps");
                                        }}>
                                        Vector Maps
                                    </a>
                                </li>
                                  <li className="nav-item">
                                    <a href="#" className={`sidebar-link ${activePage === "CRUD" ? "active-link bg-secondary" : ""
                                        }`} onClick={(e) => {
                                            e.preventDefault();
                                            setActivePage("CRUD");
                                        }}>
                                        CRUD
                                    </a>
                                </li>

                            </ul>

                        </div>
                    </aside>
                )}
                {/* Main Area */}
                <div className="flex-grow-1 d-flex flex-column vh-100 overflow-hidden">
                    {/* Navbar */}
                    <header
                        className="bg-white border-bottom px-4 d-flex align-items-center justify-content-between"
                        style={{ height: "60px" }}
                    >
                        {/* Left Side */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-link text-dark text-decoration-none fs-4 p-0"
                                onClick={() => setShowSidebar(!showSidebar)}
                            >
                                ☰
                            </button>

                            <div className="input-group border rounded" style={{ width: "300px" }}>
                                <input
                                    type="text"
                                    className="form-control border-0"
                                    placeholder="Search..."
                                />

                                <button
                                    className="btn btn-light border-0"
                                    type="button"
                                >
                                    🔍
                                </button>
                            </div>
                        </div>
                        {/* Right Side */}
                        <div className="d-flex gap-3 align-items-center">  <a href="#" className="text-dark text-decoration-none">
                            🔔
                        </a>

                            <a href="#" className="text-dark text-decoration-none">
                                ✉️
                            </a>

                            <a href="#" className="text-dark text-decoration-none">
                                ⚙️
                            </a>
                            <img
                                src={
                                    latestUser.image ||
                                    "https://via.placeholder.com/50"
                                }
                                alt="profile"
                                width="30"
                                height="30"
                                className="rounded-circle me-2"
                            />

                        </div>
                    </header>
                    {/* ONLY THIS AREA SCROLLS */}
                    <div className="container-fluid p-4 flex-grow-1 bg-light content-scroll">
                        {activePage === "Dashboard" && (
                            <>
                                <h1 className="mb-4">Dashboard</h1>

                                {/* Cards */}
                                <div className="row g-4 mb-4">
                                    <div className="col-md-3">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body text-center">
                                                <h5>Total Projects</h5>
                                                <h1>24</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body text-center">
                                                <h5>Ended Projects</h5>
                                                <h1>10</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body text-center">
                                                <h5>Running Projects</h5>
                                                <h1>12</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body text-center">
                                                <h5>Pending Projects</h5>
                                                <h1>2</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics Row */}
                                <div className="row g-4 mb-4">
                                    <div className="col-lg-8">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body">
                                                <h5 className="mb-4">Project Analytics</h5>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="progress">
                                                        <div className="progress-bar bg-primary w-25"></div>
                                                    </div>

                                                    <div className="progress">
                                                        <div className="progress-bar bg-success w-50"></div>
                                                    </div>

                                                    <div className="progress">
                                                        <div className="progress-bar bg-warning w-75"></div>
                                                    </div>

                                                    <div className="progress">
                                                        <div className="progress-bar bg-danger w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body">
                                                <h5>Meeting</h5>

                                                <p className="text-muted">
                                                    Meeting with Arc Company
                                                </p>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() =>
                                                        window.open(
                                                            "https://meet.google.com/landing?pli=1",
                                                            "_blank"
                                                        )
                                                    }
                                                >
                                                    Start Meeting
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="row g-4">
                                    <div className="col-lg-4">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body">
                                                <h5>Team Collaboration</h5>

                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item">Ahmed Ali</li>
                                                    <li className="list-group-item">Usman Khan</li>
                                                    <li className="list-group-item">Ali Raza</li>
                                                    <li className="list-group-item">Zeeshan Ahmed</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                                <h5>Project Progress</h5>

                                                <div
                                                    className="rounded-circle border border-4 border-success d-flex align-items-center justify-content-center mx-auto mt-3"
                                                    style={{
                                                        width: "140px",
                                                        height: "140px",
                                                        fontSize: "28px",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    41%
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="card shadow-sm h-100">
                                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                                <h5>Time Tracker</h5>
                                                <h1 className="display-5 fw-bold">
                                                    01:24:08
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {activePage === "Profile" && (
                            <div className="container-fluid">


                                <div className="container">

                                    <h1 className="display-4 mb-5">My Profile</h1>

                                    <div className="row">

                                        {/* LEFT */}
                                        <div className="col-md-4">

                                            {/* Name */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* Image */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Profile Picture *</label>

                                                <div className="card">
                                                    <div className="card-body text-center">

                                                        <img
                                                            src={formData.image || "https://via.placeholder.com/150"}
                                                            alt="Profile"
                                                            width="150"
                                                            height="150"
                                                            className="rounded-circle mb-3"
                                                        />

                                                        <input
                                                            type="file"
                                                            id="imageUpload"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="d-none"
                                                        />

                                                        <div className="d-flex justify-content-center gap-2">
                                                            <label
                                                                htmlFor="imageUpload"
                                                                className="btn btn-outline-primary btn-sm"
                                                            >
                                                                Upload
                                                            </label>

                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() =>
                                                                    setFormData({ ...formData, image: "" })
                                                                }
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* CENTER */}
                                        <div className="col-md-4">

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Date Of Birth *</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                        </div>

                                        {/* RIGHT */}
                                        <div className="col-md-4">

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Phone *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Address *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">City *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">State (Optional)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Zip *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="zip"
                                                    value={formData.zip}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                    {/* SAVE BUTTON */}
                                    <button
                                        className="btn btn-success mt-4"
                                        onClick={saveProfile}
                                    >
                                        ✓ Save Profile
                                    </button>

                                    {/* SAVED PROFILE (ONLY ONE) */}
                                    <div className="mt-5">

                                        <h3>Saved Profile</h3>

                                        {profiles.length > 0 && (
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="card shadow">
                                                        <div className="card-body text-center">

                                                            <img
                                                                src={profiles[0].image}
                                                                width="100"
                                                                height="100"
                                                                className="rounded-circle mb-2"
                                                                alt=""
                                                            />

                                                            <h5>{profiles[0].name}</h5>
                                                            <p>{profiles[0].email}</p>
                                                            <p>{profiles[0].phone}</p>
                                                            <p>{profiles[0].city}</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>
                        )}
                        {activePage === "Pages" && (
                            <div className="container-fluid bg-light min-vh-100">
                                <h1 className="text-center fw-bold text-primary mb-4">
                                    Pages
                                </h1>
                                <div className="row justify-content-center py-5">

                                    <div className="col-md-4 col-lg-3">
                                        <div className="card rounded-5 shadow border-0">

                                            {/* Header */}
                                            <div className="card-body">

                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <button className="btn btn-light rounded-4">
                                                        ←
                                                    </button>

                                                    <button className="btn btn-link text-decoration-none fs-4">
                                                        ☰
                                                    </button>
                                                </div>

                                                {/* Chart */}
                                                <div className="border border-3 rounded-4 p-4 mb-4">
                                                    <div
                                                        className="d-flex align-items-end justify-content-center gap-3"
                                                        style={{ height: "120px" }}
                                                    >
                                                        <div className="bg-primary rounded" style={{ width: "25px", height: "50px" }}></div>

                                                        <div className="bg-primary-subtle rounded" style={{ width: "25px", height: "90px" }}></div>

                                                        <div className="bg-primary rounded" style={{ width: "25px", height: "120px" }}></div>

                                                        <div className="bg-primary-subtle rounded" style={{ width: "25px", height: "80px" }}></div>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <div className="text-center mt-4">
                                                    <h3 className="fw-bold">
                                                        Dashboard
                                                    </h3>

                                                    <p className="text-muted">
                                                        Monitor your projects, reports and analytics from one place.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">

                                                <div className="d-flex gap-2">
                                                    <span className="badge rounded-pill text-bg-primary">
                                                        &nbsp;
                                                    </span>

                                                    <span className="badge rounded-pill text-bg-secondary">
                                                        &nbsp;
                                                    </span>

                                                    <span className="badge rounded-pill text-bg-secondary">
                                                        &nbsp;
                                                    </span>
                                                </div>

                                                <button className="btn btn-light rounded-pill px-4">
                                                    Skip
                                                </button>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className="container-fluid bg-light min-vh-100">
                                    <div className="row justify-content-center py-5">

                                        <div className="col-md-4 col-lg-3">
                                            <div className="card rounded-5 shadow border-0">

                                                {/* Header */}
                                                <div className="card-body">

                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <button className="btn btn-light rounded-4">
                                                            ←
                                                        </button>

                                                        <button className="btn btn-link text-decoration-none fs-4">
                                                            ☰
                                                        </button>
                                                    </div>

                                                    {/* Chart */}
                                                    <div className="border border-3 rounded-4 p-4 mb-4">
                                                        <div
                                                            className="d-flex align-items-end justify-content-center gap-3"
                                                            style={{ height: "120px" }}
                                                        >
                                                            <div className="bg-primary rounded" style={{ width: "25px", height: "50px" }}></div>

                                                            <div className="bg-primary-subtle rounded" style={{ width: "25px", height: "90px" }}></div>

                                                            <div className="bg-primary rounded" style={{ width: "25px", height: "120px" }}></div>

                                                            <div className="bg-primary-subtle rounded" style={{ width: "25px", height: "80px" }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <div className="text-center mt-4">
                                                        <h3 className="fw-bold">
                                                            Analysis Team Working
                                                        </h3>

                                                        <p className="text-muted">
                                                            Monitor your projects, reports and analytics from one place.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">

                                                    <div className="d-flex gap-2">
                                                        <span className="badge rounded-pill text-bg-primary">
                                                            &nbsp;
                                                        </span>

                                                        <span className="badge rounded-pill text-bg-secondary">
                                                            &nbsp;
                                                        </span>

                                                        <span className="badge rounded-pill text-bg-secondary">
                                                            &nbsp;
                                                        </span>
                                                    </div>

                                                    <button className="btn btn-light rounded-pill px-4">
                                                        Skip
                                                    </button>

                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="container-fluid bg-light min-vh-100">
                                    <div className="row justify-content-center py-5">

                                        <div className="col-md-4 col-lg-3">
                                            <div className="card rounded-5 shadow border-0">

                                                {/* Header */}
                                                <div className="card-body">

                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <button className="btn btn-light rounded-4">
                                                            ←
                                                        </button>

                                                        <button className="btn btn-link text-decoration-none fs-4">
                                                            ☰
                                                        </button>
                                                    </div>

                                                    {/* Chart */}
                                                    <div className="border border-3 rounded-4 p-4 mb-4">
                                                        <div
                                                            className="d-flex align-items-end justify-content-center gap-3"
                                                            style={{ height: "120px" }}
                                                        >
                                                            <div className="bg-primary rounded" style={{ width: "25px", height: "50px" }}></div>

                                                            <div className="bg-primary-subtle rounded" style={{ width: "25px", height: "90px" }}></div>

                                                            <div className="bg-primary rounded" style={{ width: "25px", height: "120px" }}></div>

                                                            <div className="bg-primary-subtle rounded" style={{ width: "25px", height: "80px" }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <div className="text-center mt-4">
                                                        <h3 className="fw-bold">
                                                            Project Updates
                                                        </h3>

                                                        <p className="text-muted">
                                                            Monitor your projects, reports and analytics from one place.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">

                                                    <div className="d-flex gap-2">
                                                        <span className="badge rounded-pill text-bg-primary">
                                                            &nbsp;
                                                        </span>

                                                        <span className="badge rounded-pill text-bg-secondary">
                                                            &nbsp;
                                                        </span>

                                                        <span className="badge rounded-pill text-bg-secondary">
                                                            &nbsp;
                                                        </span>
                                                    </div>

                                                    <button className="btn btn-light rounded-pill px-4">
                                                        Skip
                                                    </button>

                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        )}
                        {activePage === "Invoice" && (
                            <div>
                                <h4>Invoice Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}
                        {activePage === "Tasks" && (
                            <div>
                                <h4>Tasks Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}
                        {activePage === "Calendar" && (
                            <div className="container-fluid mt-4">

                                <div className="row">

                                    {/* Calendar */}
                                    <div className="col-lg-8">

                                        <div className="card shadow">
                                            <div className="card-body">
                                                <div className="card p-3 mb-3 shadow">
                                                    <h5>Create Event</h5>

                                                    <input
                                                        className="form-control mb-2"
                                                        placeholder="Event title"
                                                        value={newEvent}
                                                        onChange={(e) => setNewEvent(e.target.value)}
                                                    />

                                                    <input
                                                        className="form-control mb-2"
                                                        value={selectedDate}
                                                        readOnly
                                                        placeholder="Click a date on calendar"
                                                    />

                                                    <button className="btn btn-primary w-100" onClick={addEvent}>
                                                        Add Event
                                                    </button>
                                                </div>

                                                <FullCalendar
                                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                    initialView="dayGridMonth"
                                                    editable={true}
                                                    selectable={true}
                                                    events={events}
                                                    dateClick={handleDateClick}

                                                    eventClick={(info) => {
                                                        if (window.confirm("Delete this event?")) {
                                                            deleteEvent(info.event.title);
                                                        }
                                                    }}

                                                    headerToolbar={{
                                                        left: "prev,next today",
                                                        center: "title",
                                                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Sidebar */}
                                    <div className="col-lg-4">

                                        <div className="card shadow mb-3">
                                            <div className="card-header bg-primary text-white">
                                                Today's Events
                                            </div>

                                            <div className="card-body">
                                                {todayEvents.length > 0 ? (
                                                    todayEvents.map((event, index) => (
                                                        <div
                                                            key={index}
                                                            className="alert alert-success"
                                                        >
                                                            {event.title}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No events today</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card shadow">
                                            <div className="card-header bg-success text-white">
                                                Upcoming Events
                                            </div>

                                            <div className="card-body">

                                                {upcomingEvents.length > 0 ? (
                                                    upcomingEvents.map((event, index) => (
                                                        <div
                                                            key={index}
                                                            className="border rounded p-2 mb-2"
                                                        >
                                                            <strong>{event.title}</strong>
                                                            <br />
                                                            <small>{event.date}</small>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No upcoming events</p>
                                                )}

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        )}
                        {activePage === "Team" && (
                            <div className="container mt-4">
                                <div className="row g-4">

                                    {/* User 1 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=1"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">James Robert</h4>
                                                <p className="text-muted">Frontend Developer</p>

                                                {/* <button className="btn btn-success w-100 mb-2">
                                                        Add Friend
                                                    </button> */}
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "James Robert",
                                                            role: "Frontend Developer",
                                                            img: "https://i.pravatar.cc/150?img=1",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 2 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=2"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Ali Khan</h4>
                                                <p className="text-muted">UI Designer</p>
                                                {/* 
                                                <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Ali Khan",
                                                            role: "UI Designer",
                                                            img: "https://i.pravatar.cc/150?img=2",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 3 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=3"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Usman Ahmed</h4>
                                                <p className="text-muted">Backend Developer</p>

                                                {/* <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Usman Ahmed",
                                                            role: "Backend Developer",
                                                            img: "https://i.pravatar.cc/150?img=3",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 4 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=4"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Zeeshan Ali</h4>
                                                <p className="text-muted">Project Manager</p>

                                                {/* <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Zeeshan Ali",
                                                            role: "Project Manager",
                                                            img: "https://i.pravatar.cc/150?img=4",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 5 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=5"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Sarah Khan</h4>
                                                <p className="text-muted">QA Engineer</p>

                                                {/* <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}

                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Sarah Khan",
                                                            role: "QA Engineer",
                                                            img: "https://i.pravatar.cc/150?img=5",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 6 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=11"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Ahmed Raza</h4>
                                                <p className="text-muted">DevOps Engineer</p>

                                                {/* <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}

                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Ahmed Raza",
                                                            role: "DevOps Engineer",
                                                            img: "https://i.pravatar.cc/150?img=11",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 7 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=10"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Fatima Noor</h4>
                                                <p className="text-muted">Business Analyst</p>
                                                {/* 
                                                <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Fatima Noor",
                                                            role: "Business Analyst",
                                                            img: "https://i.pravatar.cc/150?img=10",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User 8 */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm">
                                            <div className="card-body">
                                                <img
                                                    src="https://i.pravatar.cc/150?img=13"
                                                    className="rounded-circle mb-3"
                                                    width="120"
                                                    height="120"
                                                    alt=""
                                                />

                                                <h4 className="fw-bold">Hamza Malik</h4>
                                                <p className="text-muted">Team Lead</p>

                                                {/* <button className="btn btn-success w-100 mb-2">
                                                    Add Friend
                                                </button> */}
                                                <button
                                                    className="btn btn-outline-success w-100"
                                                    onClick={() =>
                                                        openProfile({
                                                            name: "Hamza Malik",
                                                            role: "Team Lead",
                                                            img: "https://i.pravatar.cc/150?img=13",
                                                        })
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                        {activePage === "UI Elements" && (
                            <div>
                                <h4>UI Elements Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}
                        {activePage === "Icons" && (
                            <div>
                                <h4>Icons Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}
                        {activePage === "Forms" && (
                            <div>
                                <h4>Forms Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}
                        {activePage === "Tables" && (
                            <div>
                                <h4>Tables Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}
                        {activePage === "Charts" && (
                            <div className="container-fluid bg-dark text-white py-4">
                                <div className="container">

                                    <div className="row g-4">

                                        {/* Left Column */}
                                        <div className="col-lg-4">

                                            <div className="card bg-black border-secondary mb-4">
                                                <div className="card-body">
                                                    <Bar data={barData} options={options} />
                                                </div>
                                            </div>

                                            <div className="card bg-black border-secondary mb-4">
                                                <div className="card-body text-center">
                                                    <Doughnut data={doughnutData} />
                                                    <h2 className="mt-3 text-white">110</h2>
                                                    <p className="text-white">Lorem ipsum dolor</p>
                                                </div>
                                            </div>

                                            <div className="card bg-black border-secondary mb-4">
                                                <div className="card-body">
                                                    <Bar data={barData} options={options} />
                                                </div>
                                            </div>

                                            <div className="card bg-black border-secondary">
                                                <div className="card-body text-center">
                                                    <Doughnut data={doughnutData} />
                                                    <h1 className="mt-3 text-white">300</h1>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Right Column */}
                                        <div className="col-lg-8">

                                            <div className="card bg-black border-secondary mb-4">
                                                <div className="card-body">
                                                    <Line data={areaData} options={options} />
                                                </div>
                                            </div>

                                            <div className="card bg-black border-secondary mb-4">
                                                <div className="card-body">
                                                    <Line data={areaData2} options={options} />
                                                </div>
                                            </div>

                                            <div className="card bg-black border-secondary mb-4">
                                                <div className="card-body">
                                                    <Line data={areaData3} options={options} />
                                                </div>
                                            </div>

                                            <div className="card bg-black border-secondary">
                                                <div className="card-body">
                                                    <Line data={lineData} options={options} />
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        )}{activePage === "Notifications" && (
                            <div>
                                <h4>Notifications Data</h4>
                                <p>Total Users: 120</p>
                                <p>Total Sales: $5000</p>
                            </div>
                        )}

                        {activePage === "Maps" && (
                            <div> <h3 className="mb-4">Google Maps</h3>

                                <div className="row g-4">
                                    {maps.map((map, index) => (
                                        <div key={index} className="col-lg-6">
                                            <div className="card shadow-sm border-0">
                                                <div className="card-body">
                                                    <h6>{map}</h6>

                                                    <p className="text-muted small">
                                                        Google Map Preview
                                                    </p>

                                                    <iframe
                                                        title={map}
                                                        width="100%"
                                                        height="250"
                                                        style={{ border: 0 }}
                                                        src="https://maps.google.com/maps?q=new+york&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activePage === "CRUD" && (
                            <div className="container-fluid mt-3">

      {/* Status Tabs */}
      <div className="mb-3">
        {["All", "Completed", "Pending", "Fulfilled", "Draft"].map(
          (status) => (
            <button
              key={status}
              className={`btn me-2 ${
                statusFilter === status
                  ? "btn-success"
                  : "btn-outline-secondary"
              }`}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Search */}
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Customer Name or Invoice No"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="col-md-2">
          <button className="btn btn-success w-100">
            Add New
          </button>
        </div>
      </div>

      {/* Pagination Top */}
      <div className="d-flex justify-content-between mb-2">
        <strong>15 Records Per Page</strong>

        <div>
          <button
            className="btn btn-sm btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            «
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="btn btn-sm btn-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            »
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">

          <thead
            style={{
              background: "#19695F",
              color: "#fff",
            }}
          >
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Invoice Total</th>
              <th>Paid Amt.</th>
              <th>Balance</th>
              <th>Payment Mode</th>
              <th>Type</th>
              <th>Order Status</th>
              <th width="280" className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.invoiceDate}</td>
                <td>{row.customerName}</td>
                <td>${row.invoiceTotal}</td>
                <td>${row.paidAmount}</td>
                <td>${row.balance}</td>
                <td>{row.paymentMode}</td>
                <td>{row.type}</td>

                <td>
  <select
    className="form-select form-select-sm text-white fw-bold"
    value={row.status}
    onChange={(e) =>
      updateStatus(row.id, e.target.value)
    }
    style={{
      backgroundColor:
        row.status === "Pending"
          ? "#dc3545"
          : row.status === "Completed"
          ? "#198754"
          : row.status === "Fulfilled"
          ? "#ffc107"
          : "#6c757d",
      color: row.status === "Fulfilled" ? "#000" : "#fff",
      border: "none",
      cursor: "pointer",
    }}
  >
    <option value="Pending">Pending</option>
    <option value="Completed">Completed</option>
    <option value="Fulfilled">Fulfilled</option>
    <option value="Draft">Draft</option>
  </select>
</td>

                <td className="text-center align-middle">
                  <button
                    className="btn btn-info text-white btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                    onClick={() => setViewData(row)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-primary btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    onClick={() =>
                      setEditData({ ...row })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteRecord(row.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* View Modal */}
      <div
        className="modal fade"
        id="viewModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Invoice Details</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">
              {viewData && (
                <>
                  <p>
                    <b>Invoice:</b>{" "}
                    {viewData.id}
                  </p>

                  <p>
                    <b>Customer:</b>{" "}
                    {viewData.customerName}
                  </p>

                  <p>
                    <b>Total:</b> $
                    {viewData.invoiceTotal}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {viewData.status}
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Edit Invoice</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">
              {editData && (
                <>
                  <div className="mb-3">
                    <label>Customer Name</label>

                    <input
                      className="form-control"
                      value={
                        editData.customerName
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          customerName:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Total</label>

                    <input
                      className="form-control"
                      value={
                        editData.invoiceTotal
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          invoiceTotal:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Status</label>

                    <select
                      className="form-select"
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status:
                            e.target.value,
                        })
                      }
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>Fulfilled</option>
                      <option>Draft</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                onClick={saveEdit}
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
                        )}
                        {activePage === "Vector Maps" && (
                            <div className="container-fluid p-0">
                                <div className="position-relative vh-100">

                                    {/* Map */}
                                    <MapContainer
                                        center={[38, 24]}
                                        zoom={6}
                                        className="w-100 vh-100"
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        {/* <Rectangle
            bounds={bounds}
            pathOptions={{
              color: "#444",
              weight: 2,
            }}
          /> */}
                                    </MapContainer>

                                    {/* Left Panel
        <div className="card position-absolute top-0 start-0 m-3 shadow col-md-3">
          <div className="card-body">
            <h5 className="mb-3">Export Map</h5>

            <div className="mb-3">
              <label className="form-label">File Type</label>
              <select className="form-select">
                <option>SVG</option>
                <option>PDF</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Preset</label>
              <select className="form-select">
                <option>City Trip</option>
              </select>
            </div>

            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  defaultValue="120"
                  className="form-control"
                  placeholder="Width"
                />
              </div>

              <div className="col-6">
                <input
                  type="number"
                  defaultValue="120"
                  className="form-control"
                  placeholder="Height"
                />
              </div>
            </div>

            <button className="btn btn-dark w-100 mt-3">
              Download
            </button>
          </div>
        </div> */}

                                    {/* Left Toolbar */}
                                    <div className="position-absolute top-50 start-0 translate-middle-y ms-2 d-flex flex-column gap-2">
                                        <button className="btn btn-light shadow">+</button>
                                        <button className="btn btn-light shadow">−</button>
                                        <button className="btn btn-light shadow">☰</button>
                                        <button className="btn btn-light shadow">⬆</button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {showModal && selectedUser && (
                            <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">

                                        <div className="modal-header">
                                            <h5 className="modal-title">User Profile</h5>
                                            <button className="btn-close" onClick={closeModal}></button>
                                        </div>

                                        <div className="modal-body text-center">
                                            <img
                                                src={selectedUser.img}
                                                className="rounded-circle mb-3"
                                                width="120"
                                                height="120"
                                                alt=""
                                            />

                                            <h4>{selectedUser.name}</h4>
                                            <p className="text-muted">{selectedUser.role}</p>
                                        </div>

                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={closeModal}>
                                                Close
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                        {todayEvents.map((event, index) => (
                            <div key={index} className="alert alert-success d-flex justify-content-between">
                                {event.title}

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteEvent(event.title)}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    );
}