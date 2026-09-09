import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css";
import axios from "axios";

import UserList from "../components/Admin/UserList";
import AddUser from "../components/Admin/AddUser";
import StoreList from "../components/Admin/StoreList";
import AddStore from "../components/Admin/AddStore";

function AdminDashboard() {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("workspace");

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const handleNavigation = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="admin-app">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">

                <div className="admin-sidebar-top">

                    {/* BRAND */}

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


                    {/* NAVIGATION */}

                    <nav className="admin-nav">

                        <p className="admin-nav-label">
                            PLATFORM
                        </p>

                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection ===
                                "workspace"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation(
                                    "workspace"
                                )
                            }
                        >
                            <span className="nav-icon">
                                ◇
                            </span>

                            <span>
                                Workspace
                            </span>
                        </button>


                        <p className="admin-nav-label">
                            MANAGEMENT
                        </p>

                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection ===
                                "users"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation(
                                    "users"
                                )
                            }
                        >
                            <span className="nav-icon">
                                ◉
                            </span>

                            <span>
                                Users
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection ===
                                "add-user"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation(
                                    "add-user"
                                )
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
                                activeSection ===
                                "stores"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation(
                                    "stores"
                                )
                            }
                        >
                            <span className="nav-icon">
                                ▣
                            </span>

                            <span>
                                Stores
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`admin-nav-item ${
                                activeSection ===
                                "add-store"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNavigation(
                                    "add-store"
                                )
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


                {/* SIDEBAR BOTTOM */}

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
                        <span>
                            Logout
                        </span>

                        <span>
                            ↗
                        </span>
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <main className="admin-main">

                {/* TOP BAR */}

                <header className="admin-topbar">

                    <div>

                        <span className="admin-topbar-label">
                            SYSTEM ADMINISTRATION
                        </span>

                        <h1>
                            Platform Workspace
                        </h1>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >

                        <span className="admin-topbar-role">
                            SYSTEM ADMIN
                        </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                padding: "10px 18px",
                                borderRadius: "999px",
                                border: "1px solid rgba(190, 112, 255, 0.5)",
                                background: "transparent",
                                color: "inherit",
                                fontSize: "11px",
                                fontWeight: "600",
                                letterSpacing: "0.08em",
                                cursor: "pointer",
                            }}
                        >
                            LOGOUT ↗
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


                        {/* STATISTICS */}

                        <div className="admin-stats">

                            <div className="admin-stat-card">

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


                            <div className="admin-stat-card">

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


                            <div className="admin-stat-card">

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


                        {/* PLATFORM DETAILS */}

                        <div className="workspace-details">

                            <div className="workspace-detail-card">

                                <span className="detail-number">
                                    01
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

                            </div>


                            <div className="workspace-detail-card">

                                <span className="detail-number">
                                    02
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

                            </div>


                            <div className="workspace-detail-card">

                                <span className="detail-number">
                                    03
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

                            </div>

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

            </main>

        </div>
    );
}

export default AdminDashboard;