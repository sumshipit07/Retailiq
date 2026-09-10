import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./StoreListMobile.css";

const API_URL =
    "https://retailiq-thru.onrender.com/api/admin";


/* =========================================================
   ICONS
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

        case "store":
            return (
                <svg {...common}>
                    <path d="M4 10h16" />
                    <path d="M5 10v10h14V10" />
                    <path d="M3 10l2-6h14l2 6" />
                    <path d="M9 20v-6h6v6" />
                </svg>
            );

        case "star":
            return (
                <svg {...common}>
                    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
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

        case "refresh":
            return (
                <svg {...common}>
                    <path d="M20 11a8 8 0 0 0-14.7-4L4 9" />
                    <path d="M4 4v5h5" />
                    <path d="M4 13a8 8 0 0 0 14.7 4L20 15" />
                    <path d="M20 20v-5h-5" />
                </svg>
            );

        case "close":
            return (
                <svg {...common}>
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                </svg>
            );

        default:
            return null;
    }
}


/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "S";
    }

    if (parts.length === 1) {
        return parts[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


function formatStoreName(name = "") {
    return name
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(
            /\w\S*/g,
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        );
}


function getLocation(address = "") {
    if (!address) {
        return "Location unavailable";
    }

    const parts = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 2) {
        return parts[parts.length - 2];
    }

    return parts[0];
}


function formatRating(value) {
    const rating = Number(value || 0);

    return rating.toFixed(1);
}


/* =========================================================
   COMPONENT
========================================================= */

function StoreList() {

    const [stores, setStores] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [advancedOpen, setAdvancedOpen] =
        useState(false);

    const [selectedStore, setSelectedStore] =
        useState(null);

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
    });

    const [sortBy, setSortBy] =
        useState("name");

    const [order, setOrder] =
        useState("ASC");


    /* =====================================================
       LOAD STORES
    ===================================================== */

    const fetchStores = async (
        customFilters = filters,
        customSortBy = sortBy,
        customOrder = order
    ) => {

        const token =
            localStorage.getItem("token");

        setLoading(true);

        try {

            const response =
                await axios.get(
                    `${API_URL}/stores`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        params: {
                            ...customFilters,
                            sortBy:
                                customSortBy,
                            order:
                                customOrder,
                        },
                    }
                );

            setStores(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load stores:",
                error.response?.data ||
                    error.message
            );

            setStores([]);

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchStores();
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

        await fetchStores(
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
        };

        setFilters(emptyFilters);

        setSortBy("name");
        setOrder("ASC");

        await fetchStores(
            emptyFilters,
            "name",
            "ASC"
        );
    };


    /* =====================================================
       REMOVE FILTER
    ===================================================== */

    const removeFilter = async (
        filterName
    ) => {

        const updatedFilters = {
            ...filters,
            [filterName]: "",
        };

        setFilters(updatedFilters);

        await fetchStores(
            updatedFilters,
            sortBy,
            order
        );
    };


    /* =====================================================
       SORT
    ===================================================== */

    useEffect(() => {

        if (!loading) {
            fetchStores(
                filters,
                sortBy,
                order
            );
        }

    }, [sortBy, order]);


    /* =====================================================
       ACTIVE FILTERS
    ===================================================== */

    const activeFilters =
        useMemo(() => {

            const labels = {
                name: "Name",
                email: "Email",
                address: "Address",
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
                        value,
                    })
                );

        }, [filters]);


    return (
        <section className="stores-management">


            {/* =================================================
                MOBILE HEADER
            ================================================= */}

            <div className="stores-mobile-header">

                <div>

                    <h2>

                        Stores

                        <span className="stores-count-pill">
                            {stores.length}
                        </span>

                    </h2>

                    <p>
                        Review registered stores
                        and ratings
                    </p>

                </div>

            </div>


            {/* =================================================
                SEARCH / FILTER TOGGLE
            ================================================= */}

            <div className="stores-mobile-search">

                <button
                    type="button"
                    className={`stores-filter-toggle ${
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
                        Search & Filter
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
                FILTER CHIPS
            ================================================= */}

            {activeFilters.length > 0 && (

                <div className="stores-filter-chips">

                    {activeFilters.map(
                        (filter) => (

                            <button
                                type="button"
                                className="stores-filter-chip"
                                key={filter.key}
                                onClick={() =>
                                    removeFilter(
                                        filter.key
                                    )
                                }
                            >

                                <span>
                                    {filter.label}:{" "}
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

                <div className="stores-mobile-filter-panel">

                    <div className="stores-filter-panel-header">

                        <div>

                            <span>
                                SEARCH & FILTER
                            </span>

                            <h3>
                                Find stores
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


                    <div className="stores-filter-fields">

                        <div className="stores-filter-field">

                            <label htmlFor="store-name-filter">
                                Name
                            </label>

                            <input
                                id="store-name-filter"
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={
                                    handleFilterChange
                                }
                                placeholder="Search by store name"
                            />

                        </div>


                        <div className="stores-filter-field">

                            <label htmlFor="store-email-filter">
                                Email
                            </label>

                            <input
                                id="store-email-filter"
                                type="text"
                                name="email"
                                value={filters.email}
                                onChange={
                                    handleFilterChange
                                }
                                placeholder="Search by email"
                            />

                        </div>


                        <button
                            type="button"
                            className="stores-advanced-toggle"
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

                            <div className="stores-advanced-fields">

                                <div className="stores-filter-field">

                                    <label htmlFor="store-address-filter">
                                        Address
                                    </label>

                                    <input
                                        id="store-address-filter"
                                        type="text"
                                        name="address"
                                        value={
                                            filters.address
                                        }
                                        onChange={
                                            handleFilterChange
                                        }
                                        placeholder="Search by address"
                                    />

                                </div>

                            </div>
                        )}


                        <div className="stores-sort-row">

                            <div className="stores-filter-field">

                                <label htmlFor="store-sort">
                                    Sort by
                                </label>

                                <select
                                    id="store-sort"
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="name">
                                        Name
                                    </option>

                                    <option value="email">
                                        Email
                                    </option>

                                    <option value="address">
                                        Address
                                    </option>

                                    <option value="overallRating">
                                        Rating
                                    </option>

                                    <option value="createdAt">
                                        Created Date
                                    </option>

                                </select>

                            </div>


                            <div className="stores-filter-field">

                                <label htmlFor="store-order">
                                    Order
                                </label>

                                <select
                                    id="store-order"
                                    value={order}
                                    onChange={(event) =>
                                        setOrder(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="ASC">
                                        Ascending
                                    </option>

                                    <option value="DESC">
                                        Descending
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    <div className="stores-filter-actions-mobile">

                        <button
                            type="button"
                            className="stores-search-primary"
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
                            className="stores-clear-secondary"
                            onClick={
                                handleClear
                            }
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>
            )}


            {/* =================================================
                DIRECTORY
            ================================================= */}

            <div className="stores-directory">

                <div className="stores-directory-header-mobile">

                    <div>

                        <span>
                            REGISTERED STORES
                        </span>

                        <h3>
                            Store directory
                        </h3>

                    </div>


                    <span className="stores-record-count">
                        {stores.length}{" "}
                        {stores.length === 1
                            ? "record"
                            : "records"}
                    </span>

                </div>


                {/* =================================================
                    LOADING SKELETON
                ================================================= */}

                {loading && (

                    <div className="stores-mobile-list">

                        {Array.from({
                            length: 4,
                        }).map((_, index) => (

                            <div
                                className="store-mobile-card store-mobile-skeleton"
                                key={index}
                            >

                                <div className="store-skeleton-icon" />

                                <div className="store-skeleton-content">

                                    <div className="store-skeleton-name" />

                                    <div className="store-skeleton-email" />

                                    <div className="store-skeleton-location" />

                                </div>

                                <div className="store-skeleton-arrow" />

                            </div>

                        ))}

                    </div>
                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading &&
                    stores.length === 0 && (

                    <div className="stores-empty-mobile">

                        <div className="stores-empty-icon">

                            <Icon
                                name="store"
                                size={29}
                            />

                        </div>

                        <h3>
                            No stores found
                        </h3>

                        <p>
                            Try adjusting your
                            search filters
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
                    STORE CARDS
                ================================================= */}

                {!loading &&
                    stores.length > 0 && (

                    <div className="stores-mobile-list">

                        {stores.map((store) => (

                            <button
                                type="button"
                                className="store-mobile-card"
                                key={store.id}
                                onClick={() =>
                                    setSelectedStore(
                                        store
                                    )
                                }
                            >

                                <div className="store-mobile-icon">

                                    <Icon
                                        name="store"
                                        size={19}
                                    />

                                </div>


                                <div className="store-mobile-content">

                                    <strong>
                                        {formatStoreName(
                                            store.name
                                        )}
                                    </strong>

                                    <span className="store-mobile-email">
                                        {store.email}
                                    </span>

                                    <span className="store-mobile-location">
                                        {getLocation(
                                            store.address
                                        )}
                                    </span>

                                </div>


                                <div className="store-mobile-right">

                                    <span className="store-mobile-rating">

                                        <Icon
                                            name="star"
                                            size={12}
                                        />

                                        {formatRating(
                                            store.overallRating
                                        )}

                                    </span>

                                    <span className="store-mobile-chevron">

                                        <Icon
                                            name="chevron"
                                            size={18}
                                        />

                                    </span>

                                </div>

                            </button>

                        ))}

                    </div>
                )}

            </div>


            {/* =================================================
                STORE DETAIL SHEET
            ================================================= */}

            {selectedStore && (

                <div
                    className="store-detail-backdrop"
                    onClick={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedStore(
                                null
                            );
                        }

                    }}
                >

                    <div
                        className="store-detail-sheet"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div className="store-detail-top">

                            <div>

                                <span>
                                    STORE DETAILS
                                </span>

                                <h3>
                                    {formatStoreName(
                                        selectedStore.name
                                    )}
                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedStore(
                                        null
                                    )
                                }
                                aria-label="Close store details"
                            >
                                <Icon
                                    name="close"
                                    size={18}
                                />
                            </button>

                        </div>


                        <div className="store-detail-icon">

                            <Icon
                                name="store"
                                size={24}
                            />

                        </div>


                        <div className="store-detail-info">

                            <div>

                                <span>
                                    EMAIL
                                </span>

                                <strong>
                                    {selectedStore.email}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    ADDRESS
                                </span>

                                <strong>
                                    {selectedStore.address ||
                                        "-"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    OVERALL RATING
                                </span>

                                <strong>
                                    ★{" "}
                                    {formatRating(
                                        selectedStore.overallRating
                                    )}
                                </strong>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="store-detail-close"
                            onClick={() =>
                                setSelectedStore(
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

export default StoreList;