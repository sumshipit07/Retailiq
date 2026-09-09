import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState({});

    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const loadStores = async (
        name = searchName,
        address = searchAddress
    ) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/user/stores",
                {
                    params: {
                        name,
                        address,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStores(response.data.data);
        } catch (error) {
            console.error(
                "Failed to load stores:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    const handleRatingChange = (storeId, rating) => {
        setSelectedRatings((previous) => ({
            ...previous,
            [storeId]: rating,
        }));
    };

    const handleSubmitRating = async (storeId) => {
        const rating = selectedRatings[storeId];

        if (!rating) {
            alert("Please select a rating.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/ratings",
                {
                    storeId,
                    rating: Number(rating),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Rating submitted successfully.");

            await loadStores();
        } catch (error) {
            console.error(
                "Failed to submit rating:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                    "Failed to submit rating."
            );
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                "http://localhost:5000/api/user/change-password",
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

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const ratedStores = stores.filter(
        (store) => store.userRating !== null
    );

    const averageYourRating =
        ratedStores.length > 0
            ? (
                  ratedStores.reduce(
                      (total, store) =>
                          total + Number(store.userRating),
                      0
                  ) / ratedStores.length
              ).toFixed(1)
            : "—";

    return (
        <div className="user-app">

            {/* Sidebar */}

            <aside className="user-sidebar">

                <div className="user-brand">
                    <div className="brand-mark">
                        R
                    </div>

                    <div>
                        <strong>RetailIQ</strong>

                        <span>
                            RETAIL INTELLIGENCE
                        </span>
                    </div>
                </div>

                <nav className="user-navigation">

                    <span className="user-nav-label">
                        WORKSPACE
                    </span>

                    <button
                        type="button"
                        className={`user-nav-item ${
                            !isPasswordOpen ? "active" : ""
                        }`}
                        onClick={() =>
                            setIsPasswordOpen(false)
                        }
                    >
                        <span>◈</span>
                        Overview
                    </button>

                    <span className="user-nav-label">
                        ACCOUNT
                    </span>

                    <button
                        type="button"
                        className={`user-nav-item ${
                            isPasswordOpen ? "active" : ""
                        }`}
                        onClick={() =>
                            setIsPasswordOpen(
                                !isPasswordOpen
                            )
                        }
                    >
                        <span>+</span>
                        Security
                    </button>

                </nav>

                <div className="user-sidebar-bottom">

                    <div className="user-status">
                        <span className="status-dot"></span>

                        <div>
                            <strong>
                                Account active
                            </strong>

                            <small>
                                RetailIQ platform
                            </small>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="user-logout"
                        onClick={handleLogout}
                    >
                        Logout
                        <span>↗</span>
                    </button>

                </div>

            </aside>


            {/* Main */}

            <main className="user-main">

                <header className="user-topbar">

                    <div>
                        <span className="topbar-eyebrow">
                            NORMAL USER
                        </span>

                        <h1>
                            Your workspace
                        </h1>
                    </div>

                    <div className="user-profile">

                        <div className="user-avatar">
                            {user.name
                                ? user.name
                                      .charAt(0)
                                      .toUpperCase()
                                : "U"}
                        </div>

                        <div>
                            <strong>
                                {user.name || "User"}
                            </strong>

                            <span>
                                {user.email || ""}
                            </span>
                        </div>

                    </div>

                </header>


                {/* Overview */}

                {!isPasswordOpen && (
                    <>

                        {/* Hero */}

                        <section className="user-hero">

                            <div>
                                <span className="section-eyebrow">
                                    RETAIL EXPERIENCE
                                </span>

                                <h2>
                                    Discover stores.
                                    <br />
                                    Share your experience.
                                </h2>

                                <p>
                                    Explore stores across the
                                    RetailIQ platform and keep
                                    your feedback up to date.
                                </p>
                            </div>

                            <div className="hero-accent">

                                <span>
                                    {stores.length
                                        .toString()
                                        .padStart(2, "0")}
                                </span>

                                <small>
                                    STORES AVAILABLE
                                </small>

                            </div>

                        </section>


                        {/* Statistics */}

                        <section className="user-stats">

                            <div className="user-stat-card">

                                <span>
                                    01 · DIRECTORY
                                </span>

                                <strong>
                                    {stores.length}
                                </strong>

                                <small>
                                    Stores available
                                </small>

                            </div>

                            <div className="user-stat-card">

                                <span>
                                    02 · FEEDBACK
                                </span>

                                <strong>
                                    {ratedStores.length}
                                </strong>

                                <small>
                                    Stores you've rated
                                </small>

                            </div>

                            <div className="user-stat-card">

                                <span>
                                    03 · YOUR SCORE
                                </span>

                                <strong>
                                    {averageYourRating}
                                </strong>

                                <small>
                                    Average of your ratings
                                </small>

                            </div>

                        </section>


                        {/* Store directory */}

                        <section className="user-directory">

                            <div className="directory-header">

                                <div>

                                    <span className="section-eyebrow">
                                        STORE DIRECTORY
                                    </span>

                                    <h2>
                                        Find a store
                                    </h2>

                                    <p>
                                        Search by store name or
                                        location.
                                    </p>

                                </div>

                                <span className="directory-count">
                                    {stores.length} results
                                </span>

                            </div>


                            {/* Search */}

                            <div className="user-search">

                                <div className="search-field">

                                    <label>
                                        Store name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        value={searchName}
                                        onChange={(event) =>
                                            setSearchName(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="search-field">

                                    <label>
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search by address"
                                        value={searchAddress}
                                        onChange={(event) =>
                                            setSearchAddress(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                                <button
                                    type="button"
                                    className="user-search-button"
                                    onClick={() =>
                                        loadStores(
                                            searchName,
                                            searchAddress
                                        )
                                    }
                                >
                                    Search
                                    <span>→</span>
                                </button>

                                <button
                                    type="button"
                                    className="user-clear-button"
                                    onClick={() => {
                                        setSearchName("");
                                        setSearchAddress("");

                                        loadStores("", "");
                                    }}
                                >
                                    Clear
                                </button>

                            </div>


                            {/* Stores */}

                            <div className="store-list">

                                {stores.length === 0 ? (

                                    <div className="empty-stores">

                                        <span>◎</span>

                                        <h3>
                                            No stores found
                                        </h3>

                                        <p>
                                            Try changing your
                                            search criteria.
                                        </p>

                                    </div>

                                ) : (

                                    stores.map((store, index) => (

                                        <article
                                            className="store-card"
                                            key={store.id}
                                        >

                                            <div className="store-number">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>


                                            <div className="store-information">

                                                <span className="store-label">
                                                    STORE
                                                </span>

                                                <h3>
                                                    {store.name}
                                                </h3>

                                                <p>
                                                    {store.address}
                                                </p>

                                                <span className="store-email">
                                                    {store.email}
                                                </span>

                                            </div>


                                            <div className="store-rating">

                                                <span>
                                                    OVERALL RATING
                                                </span>

                                                <strong>
                                                    ★{" "}
                                                    {Number(
                                                        store.overallRating
                                                    ).toFixed(1)}
                                                </strong>

                                            </div>


                                            <div className="store-your-rating">

                                                <span>
                                                    YOUR RATING
                                                </span>

                                                <strong>
                                                    {store.userRating
                                                        ? `★ ${store.userRating}`
                                                        : "Not rated"}
                                                </strong>

                                            </div>


                                            <div className="store-action">

                                                <select
                                                    value={
                                                        selectedRatings[
                                                            store.id
                                                        ] ??
                                                        store.userRating ??
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        handleRatingChange(
                                                            store.id,
                                                            event.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        Rate
                                                    </option>

                                                    <option value="1">
                                                        1 — Poor
                                                    </option>

                                                    <option value="2">
                                                        2 — Fair
                                                    </option>

                                                    <option value="3">
                                                        3 — Good
                                                    </option>

                                                    <option value="4">
                                                        4 — Very good
                                                    </option>

                                                    <option value="5">
                                                        5 — Excellent
                                                    </option>

                                                </select>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSubmitRating(
                                                            store.id
                                                        )
                                                    }
                                                >
                                                    {store.userRating
                                                        ? "Update rating"
                                                        : "Submit rating"}

                                                    <span>→</span>
                                                </button>

                                            </div>

                                        </article>

                                    ))

                                )}

                            </div>

                        </section>

                    </>
                )}


                {/* Security */}

                {isPasswordOpen && (

                    <section className="user-security">

                        <div className="security-header">

                            <div>

                                <span className="section-eyebrow">
                                    ACCOUNT SECURITY
                                </span>

                                <h2>
                                    Change password
                                </h2>

                                <p>
                                    Keep your RetailIQ
                                    account secure.
                                </p>

                            </div>

                        </div>


                        <form
                            className="password-form"
                            onSubmit={handleChangePassword}
                        >

                            <div className="password-field">

                                <label>
                                    Current password
                                </label>

                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) =>
                                        setCurrentPassword(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="password-field">

                                <label>
                                    New password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    minLength={8}
                                    maxLength={16}
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="password-submit"
                            >
                                Update password
                                <span>→</span>
                            </button>

                        </form>


                        {passwordMessage && (

                            <p className="password-message">
                                {passwordMessage}
                            </p>

                        )}

                    </section>

                )}

            </main>

        </div>
    );
}

export default UserDashboard;