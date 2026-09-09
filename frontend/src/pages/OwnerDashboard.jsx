import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const loadDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://retailiq-thru.onrender.com/api/owner/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Owner dashboard:", response.data);

            setDashboard(response.data.data);
        } catch (error) {
            console.error(
                "Failed to load owner dashboard:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleChangePassword = async (event) => {
        event.preventDefault();

        setPasswordMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                "https://retailiq-thru.onrender.com/api/owner/change-password",
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPasswordMessage(response.data.message);

            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error(
                "Failed to change password:",
                error.response?.data || error.message
            );

            setPasswordMessage(
                error.response?.data?.message ||
                "Failed to change password."
            );
        }
    };

    if (!dashboard) {
        return (
            <main className="owner-loading">
                <div className="owner-loading-mark">
                    R
                </div>

                <p>
                    Loading your workspace...
                </p>
            </main>
        );
    }

    const ratingCount = dashboard.ratings.length;

    return (
        <main className="owner-app">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="owner-sidebar">

                <div className="owner-sidebar-top">

                    <div className="owner-brand">

                        <div className="owner-brand-mark">
                            R
                        </div>

                        <div>
                            <strong>
                                RetailIQ
                            </strong>

                            <span>
                                RETAIL INTELLIGENCE
                            </span>
                        </div>

                    </div>


                    <div className="owner-sidebar-divider"></div>


                    <nav className="owner-navigation">

                        <span className="owner-nav-label">
                            WORKSPACE
                        </span>

                        <button
                            type="button"
                            className={
                                !isPasswordOpen
                                    ? "owner-nav-item active"
                                    : "owner-nav-item"
                            }
                            onClick={() => {
                                setIsPasswordOpen(false);
                                setPasswordMessage("");
                            }}
                        >
                            <span className="owner-nav-icon">
                                ◆
                            </span>

                            <span>
                                Overview
                            </span>
                        </button>


                        <span className="owner-nav-label owner-account-label">
                            ACCOUNT
                        </span>

                        <button
                            type="button"
                            className={
                                isPasswordOpen
                                    ? "owner-nav-item active"
                                    : "owner-nav-item"
                            }
                            onClick={() => {
                                setIsPasswordOpen(true);
                                setPasswordMessage("");
                            }}
                        >
                            <span className="owner-nav-icon">
                                +
                            </span>

                            <span>
                                Security
                            </span>
                        </button>

                    </nav>

                </div>


                <div className="owner-sidebar-bottom">

                    <div className="owner-account-card">

                        <span>
                            Account active
                        </span>

                        <small>
                            RetailIQ platform
                        </small>

                    </div>

                    <button
                        type="button"
                        className="owner-logout"
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


            {/* =====================================================
                MAIN
            ===================================================== */}

            <section className="owner-main">

                {/* TOPBAR */}

                <header className="owner-topbar">

                    <div>

                        <span className="owner-topbar-eyebrow">
                            STORE OWNER
                        </span>

                        <h1>
                            Owner workspace
                        </h1>

                    </div>


                    <div className="owner-profile">

                        <div className="owner-avatar">
                            {storedUser.name
                                ? storedUser.name.charAt(0).toUpperCase()
                                : "O"}
                        </div>

                        <div className="owner-profile-info">

                            <strong>
                                {storedUser.name || "Store Owner"}
                            </strong>

                            <span>
                                {storedUser.email || "Owner account"}
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    OVERVIEW
                ================================================= */}

                {!isPasswordOpen && (
                    <div className="owner-content">

                        <section className="owner-hero">

                            <div className="owner-hero-copy">

                                <span className="owner-section-eyebrow">
                                    YOUR STORE
                                </span>

                                <h2>
                                    {dashboard.store.name}
                                </h2>

                                <p>
                                    Monitor customer feedback and
                                    understand how people rate your store.
                                </p>

                            </div>

                            <div className="owner-store-meta">

                                <span>
                                    {dashboard.store.email}
                                </span>

                                <span>
                                    {dashboard.store.address}
                                </span>

                            </div>

                        </section>


                        {/* =================================================
                            STATS
                        ================================================= */}

                        <section className="owner-stats">

                            <article className="owner-stat-card featured">

                                <span className="owner-stat-label">
                                    AVERAGE RATING
                                </span>

                                <strong>
                                    ★ {dashboard.averageRating}
                                </strong>

                                <small>
                                    Overall customer score
                                </small>

                            </article>


                            <article className="owner-stat-card">

                                <span className="owner-stat-label">
                                    CUSTOMER RATINGS
                                </span>

                                <strong>
                                    {ratingCount}
                                </strong>

                                <small>
                                    Submitted reviews
                                </small>

                            </article>


                            <article className="owner-stat-card">

                                <span className="owner-stat-label">
                                    FEEDBACK STATUS
                                </span>

                                <strong>
                                    {ratingCount > 0
                                        ? "Active"
                                        : "Waiting"}
                                </strong>

                                <small>
                                    {ratingCount > 0
                                        ? "Customers are responding"
                                        : "Waiting for first rating"}
                                </small>

                            </article>

                        </section>


                        {/* =================================================
                            CUSTOMER RATINGS
                        ================================================= */}

                        <section className="owner-ratings">

                            <div className="owner-ratings-header">

                                <div>

                                    <span className="owner-section-eyebrow">
                                        CUSTOMER FEEDBACK
                                    </span>

                                    <h2>
                                        Ratings received
                                    </h2>

                                    <p>
                                        Customers who have submitted
                                        a rating for your store.
                                    </p>

                                </div>

                                <div className="owner-rating-count">
                                    {ratingCount}{" "}
                                    {ratingCount === 1
                                        ? "rating"
                                        : "ratings"}
                                </div>

                            </div>


                            {ratingCount === 0 ? (

                                <div className="owner-empty">

                                    <div className="owner-empty-icon">
                                        ○
                                    </div>

                                    <h3>
                                        No ratings yet
                                    </h3>

                                    <p>
                                        Customer ratings will appear
                                        here once someone reviews
                                        your store.
                                    </p>

                                </div>

                            ) : (

                                <div className="owner-rating-table-wrap">

                                    <table className="owner-rating-table">

                                        <thead>

                                            <tr>
                                                <th>
                                                    CUSTOMER
                                                </th>

                                                <th>
                                                    EMAIL
                                                </th>

                                                <th>
                                                    RATING
                                                </th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {dashboard.ratings.map(
                                                (rating) => (
                                                    <tr key={rating.id}>

                                                        <td>
                                                            <div className="owner-customer">

                                                                <div className="owner-customer-avatar">
                                                                    {rating.user.name
                                                                        .charAt(0)
                                                                        .toUpperCase()}
                                                                </div>

                                                                <span>
                                                                    {rating.user.name}
                                                                </span>

                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className="owner-customer-email">
                                                                {rating.user.email}
                                                            </span>
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={
                                                                    `owner-rating-badge rating-${rating.rating}`
                                                                }
                                                            >
                                                                ★{" "}
                                                                {rating.rating}
                                                            </span>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>

                    </div>
                )}


                {/* =================================================
                    SECURITY
                ================================================= */}

                {isPasswordOpen && (
                    <div className="owner-content">

                        <section className="owner-security">

                            <div className="owner-security-header">

                                <span className="owner-section-eyebrow">
                                    ACCOUNT SECURITY
                                </span>

                                <h2>
                                    Change password
                                </h2>

                                <p>
                                    Keep your RetailIQ owner account secure.
                                </p>

                            </div>


                            <form
                                className="owner-password-form"
                                onSubmit={handleChangePassword}
                            >

                                <div className="owner-password-field">

                                    <label htmlFor="owner-current-password">
                                        Current password
                                    </label>

                                    <input
                                        id="owner-current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) =>
                                            setCurrentPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter current password"
                                        autoComplete="current-password"
                                        required
                                    />

                                </div>


                                <div className="owner-password-field">

                                    <label htmlFor="owner-new-password">
                                        New password
                                    </label>

                                    <input
                                        id="owner-new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Create a new password"
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>


                                {passwordMessage && (
                                    <div className="owner-password-message">
                                        {passwordMessage}
                                    </div>
                                )}


                                <button
                                    type="submit"
                                    className="owner-password-submit"
                                >
                                    <span>
                                        Update password
                                    </span>

                                    <span>
                                        →
                                    </span>
                                </button>

                            </form>

                        </section>

                    </div>
                )}

            </section>

        </main>
    );
}

export default OwnerDashboard;