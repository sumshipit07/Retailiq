import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css";
import "./AdminDashboardMobile.css";
import axios from "axios";

import UserList from "../components/Admin/UserList";
import AddUser from "../components/Admin/AddUser";
import StoreList from "../components/Admin/StoreList";
import AddStore from "../components/Admin/AddStore";


/* =========================================================
   ICON SYSTEM
========================================================= */

function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    switch (name) {
        case "workspace":
            return (
                <svg {...common}>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M8 4v5" />
                </svg>
            );

        case "users":
            return (
                <svg {...common}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                    <circle cx="9.5" cy="7" r="3.5" />
                    <path d="M17 3.5a3.5 3.5 0 0 1 0 7" />
                    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
                </svg>
            );

        case "stores":
            return (
                <svg {...common}>
                    <path d="M4 10h16" />
                    <path d="M5 10v10h14V10" />
                    <path d="M3 10l2-6h14l2 6" />
                    <path d="M8 20v-5h8v5" />
                </svg>
            );

        case "settings":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V22h-2.55v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 17a1.7 1.7 0 0 0-1.56-1.03H6.4v-2.55h.14A1.7 1.7 0 0 0 8.1 12.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V6h2.55v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03H22v2.55h-.1A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
            );

        case "logout":
            return (
                <svg {...common}>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
                </svg>
            );

        case "plus":
            return (
                <svg {...common}>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            );

        case "user-plus":
            return (
                <svg {...common}>
                    <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="3.5" />
                    <path d="M19 8v6" />
                    <path d="M16 11h6" />
                </svg>
            );

        case "store-plus":
            return (
                <svg {...common}>
                    <path d="M4 10h16" />
                    <path d="M5 10v10h14V10" />
                    <path d="M3 10l2-6h14l2 6" />
                    <path d="M12 13v5" />
                    <path d="M9.5 15.5h5" />
                </svg>
            );

        case "users-stat":
            return (
                <svg {...common}>
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
                    <path d="M16 5.5a3 3 0 0 1 0 5.5" />
                    <path d="M18 15a5 5 0 0 1 3 4.5V20" />
                </svg>
            );

        case "store-stat":
            return (
                <svg {...common}>
                    <path d="M4 10h16" />
                    <path d="M5 10v10h14V10" />
                    <path d="M3 10l2-6h14l2 6" />
                    <path d="M9 20v-6h6v6" />
                </svg>
            );

        case "rating":
            return (
                <svg {...common}>
                    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                </svg>
            );

        case "arrow":
            return (
                <svg {...common}>
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                </svg>
            );

        default:
            return null;
    }
}


function AdminDashboard() {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("workspace");
    const [fabOpen, setFabOpen] = useState(false);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });


    /* =========================================================
       LOAD DASHBOARD
    ========================================================= */

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get(
                "https://retailiq-thru.onrender.com/api/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log(
                    "Admin dashboard:",
                    response.data
                );

                setStats(response.data.data);
            })
            .catch((error) => {
                console.error(
                    "Failed to load admin dashboard:",
                    error.response?.data ||
                        error.message
                );
            });
    }, []);


    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const handleNavigation = (section) => {
        setActiveSection(section);
        setFabOpen(false);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleRatingSection = () => {
        setActiveSection("workspace");
        setFabOpen(false);

        setTimeout(() => {
            document
                .querySelector(".admin-stats")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 50);
    };


    return (
        <div className="admin-app">

            {/* =================================================
                DESKTOP SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">

                <div className="admin-sidebar-top">

                    <div className="admin-brand">

                        <div className="brand-mark">
                            R
                        </div>

                        <div>
                            <div className="admin-brand-name">
                                RetailIQ
                            </div>

                            <div className="admin-brand-label">
                                RETAIL INTELLIGENCE
                            </div>
                        </div>

                    </div>


                    <nav className="admin-nav">

                        <div className="admin-nav-label">
                            PLATFORM
                        </div>

                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === "workspace"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation("workspace")
                            }
                        >
                            <span className="nav-icon">
                                ◇
                            </span>

                            <span>
                                Workspace
                            </span>
                        </button>


                        <div className="admin-nav-label">
                            MANAGEMENT
                        </div>


                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === "users"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation("users")
                            }
                        >
                            <span className="nav-icon">
                                +
                            </span>

                            <span>
                                Users
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === "add-user"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation("add-user")
                            }
                        >
                            <span className="nav-icon">
                                +
                            </span>

                            <span>
                                Add User
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === "stores"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation("stores")
                            }
                        >
                            <span className="nav-icon">
                                ◫
                            </span>

                            <span>
                                Stores
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === "add-store"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation("add-store")
                            }
                        >
                            <span className="nav-icon">
                                ↗
                            </span>

                            <span>
                                Add Store
                            </span>
                        </button>

                    </nav>

                </div>


                <div className="admin-sidebar-bottom">

                    <div className="admin-sidebar-status">

                        <span className="status-dot"></span>

                        <div>
                            <strong>
                                System operational
                            </strong>

                            <span>
                                RetailIQ platform
                            </span>
                        </div>

                    </div>


                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <main className="admin-main">

                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="admin-topbar">

                    <div className="admin-topbar-copy">

                        <span className="admin-topbar-label">
                            SYSTEM ADMINISTRATION
                        </span>

                        <h1>
                            Platform Workspace
                        </h1>

                        <span className="admin-mobile-role">
                            System Administrator
                        </span>

                    </div>


                    <div className="admin-topbar-actions">

                        <span className="admin-topbar-role">
                            SYSTEM ADMIN
                        </span>

                        <button
                            type="button"
                            className="admin-mobile-logout"
                            onClick={handleLogout}
                            aria-label="Logout"
                            title="Logout"
                        >
                            <Icon
                                name="logout"
                                size={20}
                            />
                        </button>

                    </div>

                </header>


                {/* =================================================
                    WORKSPACE
                ================================================= */}

                {activeSection === "workspace" && (

                    <section className="admin-workspace">

                        <div className="workspace-intro">

                            <span className="admin-eyebrow">
                                PLATFORM OVERVIEW
                            </span>

                            <h2>
                                Control center.
                            </h2>

                            <p>
                                Manage users, stores and
                                the rating ecosystem from
                                one centralized workspace.
                            </p>

                        </div>


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <div className="admin-stats">

                            <div className="admin-stat-card admin-stat-users">

                                <div className="mobile-stat-icon">
                                    <Icon
                                        name="users-stat"
                                        size={20}
                                    />
                                </div>

                                <span>
                                    01 · PLATFORM
                                </span>

                                <strong>
                                    {stats.totalUsers}
                                </strong>

                                <small>
                                    Total Users
                                </small>

                            </div>


                            <div className="admin-stat-card admin-stat-stores">

                                <div className="mobile-stat-icon">
                                    <Icon
                                        name="store-stat"
                                        size={20}
                                    />
                                </div>

                                <span>
                                    02 · NETWORK
                                </span>

                                <strong>
                                    {stats.totalStores}
                                </strong>

                                <small>
                                    Total Stores
                                </small>

                            </div>


                            <div className="admin-stat-card admin-stat-ratings">

                                <div className="mobile-stat-icon">
                                    <Icon
                                        name="rating"
                                        size={20}
                                    />
                                </div>

                                <span>
                                    03 · FEEDBACK
                                </span>

                                <strong>
                                    {stats.totalRatings}
                                </strong>

                                <small>
                                    Total Ratings
                                </small>

                            </div>

                        </div>


                        {/* =================================================
                            PLATFORM DETAILS
                        ================================================= */}

                        <div className="workspace-details">

                            <button
                                type="button"
                                className="workspace-detail-card"
                                onClick={() =>
                                    handleNavigation("users")
                                }
                            >

                                <span className="detail-number">
                                    01
                                </span>

                                <span className="mobile-feature-icon">
                                    <Icon
                                        name="users"
                                        size={19}
                                    />
                                </span>

                                <div>
                                    <h3>
                                        User management
                                    </h3>

                                    <p>
                                        View registered users,
                                        filter accounts and
                                        inspect individual
                                        user details.
                                    </p>
                                </div>

                                <span className="mobile-feature-arrow">
                                    <Icon
                                        name="arrow"
                                        size={18}
                                    />
                                </span>

                            </button>


                            <button
                                type="button"
                                className="workspace-detail-card"
                                onClick={() =>
                                    handleNavigation("stores")
                                }
                            >

                                <span className="detail-number">
                                    02
                                </span>

                                <span className="mobile-feature-icon">
                                    <Icon
                                        name="stores"
                                        size={19}
                                    />
                                </span>

                                <div>
                                    <h3>
                                        Store management
                                    </h3>

                                    <p>
                                        Review stores, ratings
                                        and assigned store
                                        owners from the
                                        management workspace.
                                    </p>
                                </div>

                                <span className="mobile-feature-arrow">
                                    <Icon
                                        name="arrow"
                                        size={18}
                                    />
                                </span>

                            </button>


                            <button
                                type="button"
                                className="workspace-detail-card"
                                onClick={handleRatingSection}
                            >

                                <span className="detail-number">
                                    03
                                </span>

                                <span className="mobile-feature-icon">
                                    <Icon
                                        name="rating"
                                        size={19}
                                    />
                                </span>

                                <div>
                                    <h3>
                                        Rating ecosystem
                                    </h3>

                                    <p>
                                        Monitor the total rating
                                        activity across the
                                        RetailIQ platform.
                                    </p>
                                </div>

                                <span className="mobile-feature-arrow">
                                    <Icon
                                        name="arrow"
                                        size={18}
                                    />
                                </span>

                            </button>

                        </div>

                    </section>

                )}


                {/* =================================================
                    USERS
                ================================================= */}

                {activeSection === "users" && (

                    <section className="admin-content-section">

                        <div>

                            <span className="admin-eyebrow">
                                MANAGEMENT
                            </span>

                            <h2>
                                Users
                            </h2>

                            <UserList />

                        </div>

                    </section>

                )}


                {/* =================================================
                    ADD USER
                ================================================= */}

                {activeSection === "add-user" && (

                    <section className="admin-content-section">

                        <div className="admin-form-section">

                            <span className="admin-eyebrow">
                                MANAGEMENT
                            </span>

                            <h2>
                                Create User
                            </h2>

                            <AddUser />

                        </div>

                    </section>

                )}


                {/* =================================================
                    STORES
                ================================================= */}

                {activeSection === "stores" && (

                    <section className="admin-content-section">

                        <div>

                            <span className="admin-eyebrow">
                                MANAGEMENT
                            </span>

                            <h2>
                                Stores
                            </h2>

                            <StoreList />

                        </div>

                    </section>

                )}


                {/* =================================================
                    ADD STORE
                ================================================= */}

                {activeSection === "add-store" && (

                    <section className="admin-content-section">

                        <div className="admin-form-section">

                            <span className="admin-eyebrow">
                                MANAGEMENT
                            </span>

                            <h2>
                                Create Store
                            </h2>

                            <AddStore />

                        </div>

                    </section>

                )}


                {/* =================================================
                    MOBILE SETTINGS
                ================================================= */}

                {activeSection === "settings" && (

                    <section className="admin-mobile-settings">

                        <span className="admin-eyebrow">
                            ACCOUNT
                        </span>

                        <h2>
                            Settings
                        </h2>

                        <div className="mobile-settings-card">

                            <div className="mobile-settings-icon">
                                <Icon
                                    name="settings"
                                    size={22}
                                />
                            </div>

                            <div>
                                <strong>
                                    System Administrator
                                </strong>

                                <span>
                                    RetailIQ administration account
                                </span>
                            </div>

                        </div>


                        <button
                            type="button"
                            className="mobile-settings-logout"
                            onClick={handleLogout}
                        >
                            <Icon
                                name="logout"
                                size={19}
                            />

                            <span>
                                Logout
                            </span>
                        </button>

                    </section>

                )}

            </main>


            {/* =================================================
                MOBILE FAB
            ================================================= */}

            <div
                className={`admin-mobile-fab-wrap ${
                    fabOpen ? "open" : ""
                }`}
            >

                {fabOpen && (

                    <div className="admin-mobile-fab-menu">

                        <button
                            type="button"
                            onClick={() =>
                                handleNavigation("add-user")
                            }
                        >
                            <span>
                                <Icon
                                    name="user-plus"
                                    size={18}
                                />
                            </span>

                            Add User
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleNavigation("add-store")
                            }
                        >
                            <span>
                                <Icon
                                    name="store-plus"
                                    size={18}
                                />
                            </span>

                            Add Store
                        </button>

                    </div>

                )}


                <button
                    type="button"
                    className="admin-mobile-fab"
                    onClick={() =>
                        setFabOpen((previous) => !previous)
                    }
                    aria-label={
                        fabOpen
                            ? "Close actions"
                            : "Add"
                    }
                >
                    <Icon
                        name="plus"
                        size={23}
                    />
                </button>

            </div>


            {/* =================================================
                MOBILE BOTTOM NAVIGATION
            ================================================= */}

            <nav className="admin-mobile-bottom-nav">

                <button
                    type="button"
                    className={
                        activeSection === "workspace"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleNavigation("workspace")
                    }
                >
                    <Icon
                        name="workspace"
                        size={20}
                    />

                    <span>
                        Workspace
                    </span>
                </button>


                <button
                    type="button"
                    className={
                        activeSection === "users" ||
                        activeSection === "add-user"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleNavigation("users")
                    }
                >
                    <Icon
                        name="users"
                        size={20}
                    />

                    <span>
                        Users
                    </span>
                </button>


                <button
                    type="button"
                    className={
                        activeSection === "stores" ||
                        activeSection === "add-store"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleNavigation("stores")
                    }
                >
                    <Icon
                        name="stores"
                        size={20}
                    />

                    <span>
                        Stores
                    </span>
                </button>


                <button
                    type="button"
                    className={
                        activeSection === "settings"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleNavigation("settings")
                    }
                >
                    <Icon
                        name="settings"
                        size={20}
                    />

                    <span>
                        Settings
                    </span>
                </button>

            </nav>

        </div>
    );
}

export default AdminDashboard;