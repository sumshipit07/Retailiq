import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./UserListMobile.css";

const API_URL =
    "https://retailiq-thru.onrender.com/api/admin";


/* =========================================================
   ICON
========================================================= */

function Icon({ name, size = 18 }) {
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
        case "filter":
            return (
                <svg {...common}>
                    <path d="M4 6h16" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                </svg>
            );

        case "search":
            return (
                <svg {...common}>
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4 4" />
                </svg>
            );

        case "user":
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
            );

        case "users":
            return (
                <svg {...common}>
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20a6 6 0 0 1 12 0" />
                    <path d="M16 5.5a3 3 0 0 1 0 5.5" />
                    <path d="M18 15a5 5 0 0 1 3 4.5" />
                </svg>
            );

        case "chevron":
            return (
                <svg {...common}>
                    <path d="m9 6 6 6-6 6" />
                </svg>
            );

        case "x":
            return (
                <svg {...common}>
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                </svg>
            );

        case "close":
            return (
                <svg {...common}>
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                </svg>
            );

        case "sort":
            return (
                <svg {...common}>
                    <path d="M8 6h12" />
                    <path d="M8 12h9" />
                    <path d="M8 18h6" />
                    <path d="m4 7 2-2 2 2" />
                    <path d="M6 5v14" />
                </svg>
            );

        case "refresh":
            return (
                <svg {...common}>
                    <path d="M20 11a8 8 0 0 0-14.7-4L4 9" />
                    <path d="M4 4v5h5" />
                    <path d="M4 13a8 8 0 0 0 14.7 4L20 15" />
                    <path d="M20 20v-5h-5" />
                </svg>
            );

        default:
            return null;
    }
}


/* =========================================================
   ROLE HELPERS
========================================================= */

function formatRole(role) {
    if (role === "SYSTEM_ADMIN") {
        return "Admin";
    }

    if (role === "STORE_OWNER") {
        return "Store Owner";
    }

    return "User";
}


function getInitials(name = "") {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


/* =========================================================
   COMPONENT
========================================================= */

function UserList() {

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [advancedOpen, setAdvancedOpen] =
        useState(false);

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: "",
    });

    const [sortBy, setSortBy] =
        useState("createdAt");

    const [order, setOrder] =
        useState("DESC");


    /* =====================================================
       FETCH USERS
    ===================================================== */

    const fetchUsers = async (
        customFilters = filters,
        customSortBy = sortBy,
        customOrder = order
    ) => {

        const token =
            localStorage.getItem("token");

        const params = {
            ...customFilters,
            sortBy: customSortBy,
            order: customOrder,
        };

        setLoading(true);

        try {

            const response = await axios.get(
                `${API_URL}/users`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    params,
                }
            );

            setUsers(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load users:",
                error.response?.data ||
                    error.message
            );

            setUsers([]);

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchUsers();
    }, []);


    /* =====================================================
       FILTER CHANGE
    ===================================================== */

    const handleFilterChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearch = async () => {

        await fetchUsers(
            filters,
            sortBy,
            order
        );

        setFilterOpen(false);
    };


    /* =====================================================
       CLEAR
    ===================================================== */

    const handleClear = async () => {

        const emptyFilters = {
            name: "",
            email: "",
            address: "",
            role: "",
        };

        setFilters(emptyFilters);

        setSortBy("createdAt");
        setOrder("DESC");

        await fetchUsers(
            emptyFilters,
            "createdAt",
            "DESC"
        );
    };


    /* =====================================================
       REMOVE ONE FILTER
    ===================================================== */

    const removeFilter = async (
        filterName
    ) => {

        const updatedFilters = {
            ...filters,
            [filterName]: "",
        };

        setFilters(updatedFilters);

        await fetchUsers(
            updatedFilters,
            sortBy,
            order
        );
    };


    /* =====================================================
       SORT
    ===================================================== */

    const handleSortChange = (
        event
    ) => {

        setSortBy(event.target.value);
    };


    const handleOrderChange = (
        event
    ) => {

        setOrder(event.target.value);
    };


    useEffect(() => {

        if (!loading) {
            fetchUsers(
                filters,
                sortBy,
                order
            );
        }

    }, [sortBy, order]);


    /* =====================================================
       VIEW USER DETAILS
    ===================================================== */

    const handleViewDetails = async (
        userId
    ) => {

        const token =
            localStorage.getItem("token");

        try {

            const response =
                await axios.get(
                    `${API_URL}/users/${userId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setSelectedUser(
                response.data?.data
            );

        } catch (error) {

            console.error(
                "Failed to load user details:",
                error.response?.data ||
                    error.message
            );
        }
    };


    /* =====================================================
       ACTIVE FILTER CHIPS
    ===================================================== */

    const activeFilters =
        useMemo(() => {

            const labels = {
                name: "Name",
                email: "Email",
                address: "Address",
                role: "Role",
            };

            return Object.entries(filters)
                .filter(
                    ([, value]) =>
                        value.trim() !== ""
                )
                .map(
                    ([key, value]) => ({
                        key,
                        label:
                            labels[key],
                        value:
                            key === "role"
                                ? formatRole(value)
                                : value,
                    })
                );

        }, [filters]);


    /* =====================================================
       ROLE AVATAR CLASS
    ===================================================== */

    const getRoleClass = (role) => {

        if (role === "SYSTEM_ADMIN") {
            return "admin";
        }

        if (role === "STORE_OWNER") {
            return "owner";
        }

        return "user";
    };


    return (
        <section className="users-management">

            {/* =================================================
                MOBILE USERS HEADER
            ================================================= */}

            <div className="users-mobile-header">

                <div className="users-mobile-title-row">

                    <div>

                        <span className="users-mobile-eyebrow">
                            MANAGEMENT
                        </span>

                        <h2>
                            Users
                            <span className="users-count-pill">
                                {users.length}
                            </span>
                        </h2>

                        <p>
                            Manage registered accounts
                            and roles
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                MOBILE SEARCH
            ================================================= */}

            <div className="users-mobile-search">

                <div className="users-mobile-search-box">

                    <Icon
                        name="search"
                        size={18}
                    />

                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={
                            handleFilterChange
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                handleSearch();
                            }
                        }}
                        placeholder="Search users by name"
                        aria-label="Search users by name"
                    />

                    <button
                        type="button"
                        onClick={
                            handleSearch
                        }
                        aria-label="Search"
                    >
                        <Icon
                            name="search"
                            size={17}
                        />
                    </button>

                </div>


                <button
                    type="button"
                    className={`users-filter-toggle ${
                        filterOpen
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setFilterOpen(
                            (previous) =>
                                !previous
                        )
                    }
                >

                    <Icon
                        name="filter"
                        size={18}
                    />

                    <span>
                        Filter & Sort
                    </span>

                    {activeFilters.length >
                        0 && (
                        <b>
                            {activeFilters.length}
                        </b>
                    )}

                </button>

            </div>


            {/* =================================================
                ACTIVE FILTER CHIPS
            ================================================= */}

            {activeFilters.length > 0 && (

                <div className="users-filter-chips">

                    {activeFilters.map(
                        (filter) => (

                            <button
                                type="button"
                                key={filter.key}
                                className="users-filter-chip"
                                onClick={() =>
                                    removeFilter(
                                        filter.key
                                    )
                                }
                            >

                                <span>
                                    {filter.label}:
                                    {" "}
                                    {filter.value}
                                </span>

                                <Icon
                                    name="x"
                                    size={12}
                                />

                            </button>
                        )
                    )}

                </div>
            )}


            {/* =================================================
                FILTER PANEL
            ================================================= */}

            {filterOpen && (

                <div className="users-mobile-filter-panel">

                    <div className="users-filter-panel-header">

                        <div>

                            <span>
                                FILTER & SORT
                            </span>

                            <h3>
                                Find users
                            </h3>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setFilterOpen(
                                    false
                                )
                            }
                            aria-label="Close filters"
                        >
                            <Icon
                                name="close"
                                size={18}
                            />
                        </button>

                    </div>


                    <div className="users-filter-fields">

                        <div className="users-filter-field">

                            <label htmlFor="mobile-user-email">
                                Email
                            </label>

                            <input
                                id="mobile-user-email"
                                type="text"
                                name="email"
                                placeholder="Search by email"
                                value={filters.email}
                                onChange={
                                    handleFilterChange
                                }
                            />

                        </div>


                        <div className="users-filter-field">

                            <label htmlFor="mobile-user-role">
                                Role
                            </label>

                            <select
                                id="mobile-user-role"
                                name="role"
                                value={filters.role}
                                onChange={
                                    handleFilterChange
                                }
                            >

                                <option value="">
                                    All roles
                                </option>

                                <option value="NORMAL_USER">
                                    User
                                </option>

                                <option value="STORE_OWNER">
                                    Store Owner
                                </option>

                                <option value="SYSTEM_ADMIN">
                                    Admin
                                </option>

                            </select>

                        </div>


                        <button
                            type="button"
                            className="users-advanced-toggle"
                            onClick={() =>
                                setAdvancedOpen(
                                    (previous) =>
                                        !previous
                                )
                            }
                        >

                            <span>
                                Advanced filters
                            </span>

                            <span>
                                {advancedOpen
                                    ? "−"
                                    : "+"}
                            </span>

                        </button>


                        {advancedOpen && (

                            <div className="users-advanced-fields">

                                <div className="users-filter-field">

                                    <label htmlFor="mobile-user-address">
                                        Address
                                    </label>

                                    <input
                                        id="mobile-user-address"
                                        type="text"
                                        name="address"
                                        placeholder="Search by address"
                                        value={
                                            filters.address
                                        }
                                        onChange={
                                            handleFilterChange
                                        }
                                    />

                                </div>

                            </div>
                        )}


                        <div className="users-filter-sort">

                            <div className="users-filter-field">

                                <label htmlFor="mobile-sort-by">
                                    Sort by
                                </label>

                                <select
                                    id="mobile-sort-by"
                                    value={sortBy}
                                    onChange={
                                        handleSortChange
                                    }
                                >

                                    <option value="createdAt">
                                        Created Date
                                    </option>

                                    <option value="name">
                                        Name
                                    </option>

                                    <option value="email">
                                        Email
                                    </option>

                                    <option value="address">
                                        Address
                                    </option>

                                    <option value="role">
                                        Role
                                    </option>

                                </select>

                            </div>


                            <div className="users-filter-field">

                                <label htmlFor="mobile-order">
                                    Order
                                </label>

                                <select
                                    id="mobile-order"
                                    value={order}
                                    onChange={
                                        handleOrderChange
                                    }
                                >

                                    <option value="DESC">
                                        Descending
                                    </option>

                                    <option value="ASC">
                                        Ascending
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    <div className="users-filter-actions-mobile">

                        <button
                            type="button"
                            className="users-search-primary"
                            onClick={
                                handleSearch
                            }
                        >
                            <Icon
                                name="search"
                                size={17}
                            />

                            Search
                        </button>

                        <button
                            type="button"
                            className="users-clear-secondary"
                            onClick={
                                handleClear
                            }
                        >
                            Clear filters
                        </button>

                    </div>

                </div>
            )}


            {/* =================================================
                DIRECTORY SUMMARY
            ================================================= */}

            <div className="users-directory-summary">

                <div>

                    <span>
                        USER DIRECTORY
                    </span>

                    <strong>
                        {loading
                            ? "Loading users..."
                            : `Showing ${users.length} ${
                                  users.length === 1
                                      ? "user"
                                      : "users"
                              }`}
                    </strong>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        fetchUsers()
                    }
                    aria-label="Refresh users"
                >
                    <Icon
                        name="refresh"
                        size={17}
                    />
                </button>

            </div>


            {/* =================================================
                LOADING SKELETONS
            ================================================= */}

            {loading && (

                <div className="users-mobile-list">

                    {Array.from({
                        length: 5,
                    }).map((_, index) => (

                        <div
                            className="user-mobile-card user-mobile-skeleton"
                            key={index}
                        >

                            <div className="skeleton-avatar" />

                            <div className="skeleton-content">

                                <div className="skeleton-line skeleton-name" />

                                <div className="skeleton-line skeleton-email" />

                                <div className="skeleton-pill" />

                            </div>

                            <div className="skeleton-arrow" />

                        </div>

                    ))}

                </div>
            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!loading &&
                users.length === 0 && (

                    <div className="users-empty-mobile">

                        <div className="users-empty-icon">

                            <Icon
                                name="users"
                                size={30}
                            />

                        </div>

                        <h3>
                            No users found
                        </h3>

                        <p>
                            Try adjusting your
                            filters
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleClear
                            }
                        >
                            Clear Filters
                        </button>

                    </div>
                )}


            {/* =================================================
                MOBILE USER CARDS
            ================================================= */}

            {!loading &&
                users.length > 0 && (

                    <div className="users-mobile-list">

                        {users.map((user) => (

                            <button
                                type="button"
                                className="user-mobile-card"
                                key={user.id}
                                onClick={() =>
                                    handleViewDetails(
                                        user.id
                                    )
                                }
                            >

                                <div
                                    className={`user-mobile-avatar role-${getRoleClass(
                                        user.role
                                    )}`}
                                >
                                    {getInitials(
                                        user.name
                                    )}
                                </div>


                                <div className="user-mobile-card-content">

                                    <strong>
                                        {user.name}
                                    </strong>

                                    <span className="user-mobile-email">
                                        {user.email}
                                    </span>

                                    <span
                                        className={`user-mobile-role role-${getRoleClass(
                                            user.role
                                        )}`}
                                    >
                                        {formatRole(
                                            user.role
                                        )}
                                    </span>

                                </div>


                                <span className="user-mobile-chevron">

                                    <Icon
                                        name="chevron"
                                        size={19}
                                    />

                                </span>

                            </button>
                        ))}

                    </div>
                )}


            {/* =================================================
                USER DETAILS MODAL
            ================================================= */}

            {selectedUser && (

                <div
                    className="user-modal-backdrop"
                    onClick={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedUser(
                                null
                            );
                        }

                    }}
                >

                    <div
                        className="user-details-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="user-details-title"
                    >

                        <div className="modal-top">

                            <div>

                                <span>
                                    USER PROFILE
                                </span>

                                <h3 id="user-details-title">
                                    User details
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setSelectedUser(
                                        null
                                    )
                                }
                                aria-label="Close user details"
                            >
                                <Icon
                                    name="close"
                                    size={18}
                                />
                            </button>

                        </div>


                        <div className="details-profile">

                            <div
                                className={`details-avatar role-${getRoleClass(
                                    selectedUser.role
                                )}`}
                            >
                                {getInitials(
                                    selectedUser.name
                                )}
                            </div>


                            <div>

                                <h4>
                                    {selectedUser.name}
                                </h4>

                                <span
                                    className={`role-badge role-${selectedUser.role.toLowerCase()}`}
                                >
                                    {formatRole(
                                        selectedUser.role
                                    )}
                                </span>

                            </div>

                        </div>


                        <div className="details-grid">

                            <div className="detail-item">

                                <span>
                                    EMAIL
                                </span>

                                <strong>
                                    {selectedUser.email}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    ADDRESS
                                </span>

                                <strong>
                                    {selectedUser.address ||
                                        "-"}
                                </strong>

                            </div>

                        </div>


                        {selectedUser.role ===
                            "STORE_OWNER" &&
                            selectedUser.store && (

                                <div className="owner-store-card">

                                    <div className="owner-store-header">

                                        <span>
                                            STORE INFORMATION
                                        </span>

                                        <span className="store-rating">
                                            ★{" "}
                                            {
                                                selectedUser
                                                    .store
                                                    .overallRating
                                            }
                                        </span>

                                    </div>


                                    <div className="store-detail-grid">

                                        <div>

                                            <span>
                                                STORE NAME
                                            </span>

                                            <strong>
                                                {
                                                    selectedUser
                                                        .store
                                                        .name
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                STORE EMAIL
                                            </span>

                                            <strong>
                                                {
                                                    selectedUser
                                                        .store
                                                        .email
                                                }
                                            </strong>

                                        </div>


                                        <div className="store-address-detail">

                                            <span>
                                                STORE ADDRESS
                                            </span>

                                            <strong>
                                                {
                                                    selectedUser
                                                        .store
                                                        .address
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                </div>
                            )}


                        <button
                            type="button"
                            className="modal-close-button"
                            onClick={() =>
                                setSelectedUser(
                                    null
                                )
                            }
                        >
                            Close details
                        </button>

                    </div>

                </div>
            )}

        </section>
    );
}

export default UserList;