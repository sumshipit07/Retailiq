import { useEffect, useState } from "react";
import "./UserList.css";
import axios from "axios";

function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: "",
    });

    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("DESC");

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        const params = {
            ...filters,
            sortBy,
            order,
        };

        try {
            const response = await axios.get(
                "http://localhost:5000/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params,
                }
            );

            setUsers(response.data.data);
        } catch (error) {
            console.error(
                "Failed to load users:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [sortBy, order]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        fetchUsers();
    };

    const handleClear = () => {
        const defaultFilters = {
            name: "",
            email: "",
            address: "",
            role: "",
        };

        setFilters(defaultFilters);
        setSortBy("createdAt");
        setOrder("DESC");
    };

    const handleViewDetails = async (userId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `http://localhost:5000/api/admin/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedUser(response.data.data);
        } catch (error) {
            console.error(
                "Failed to load user details:",
                error.response?.data || error.message
            );
        }
    };

    const formatRole = (role) => {
        if (role === "SYSTEM_ADMIN") {
            return "System Admin";
        }

        if (role === "STORE_OWNER") {
            return "Store Owner";
        }

        return "Normal User";
    };

    return (
        <section className="users-page">

            {/* PAGE HEADER */}

            <div className="users-page-header">

                <div className="users-header-copy">
                    <span className="section-eyebrow">
                        ACCOUNT MANAGEMENT
                    </span>

                    <h2>Users</h2>

                    <p>
                        Manage registered accounts, roles and
                        user access across the RetailIQ platform.
                    </p>
                </div>

                <div className="users-count">
                    <strong>{users.length}</strong>
                    <span>visible users</span>
                </div>

            </div>


            {/* FILTER PANEL */}

            <div className="users-filter-card">

                <div className="filter-card-header">
                    <div>
                        <span>SEARCH & FILTER</span>
                        <h3>Find users</h3>
                    </div>
                </div>

                <div className="user-filter-grid">

                    <div className="user-field">
                        <label htmlFor="user-name">
                            Name
                        </label>

                        <input
                            id="user-name"
                            type="text"
                            name="name"
                            placeholder="Search by name"
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                    </div>


                    <div className="user-field">
                        <label htmlFor="user-email">
                            Email
                        </label>

                        <input
                            id="user-email"
                            type="text"
                            name="email"
                            placeholder="Search by email"
                            value={filters.email}
                            onChange={handleFilterChange}
                        />
                    </div>


                    <div className="user-field">
                        <label htmlFor="user-address">
                            Address
                        </label>

                        <input
                            id="user-address"
                            type="text"
                            name="address"
                            placeholder="Search by address"
                            value={filters.address}
                            onChange={handleFilterChange}
                        />
                    </div>


                    <div className="user-field">
                        <label htmlFor="user-role">
                            Role
                        </label>

                        <select
                            id="user-role"
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                All Roles
                            </option>

                            <option value="SYSTEM_ADMIN">
                                System Admin
                            </option>

                            <option value="NORMAL_USER">
                                Normal User
                            </option>

                            <option value="STORE_OWNER">
                                Store Owner
                            </option>
                        </select>
                    </div>

                </div>


                <div className="user-filter-footer">

                    <div className="user-sort-group">

                        <div className="user-field">
                            <label htmlFor="user-sort">
                                Sort by
                            </label>

                            <select
                                id="user-sort"
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(event.target.value)
                                }
                            >
                                <option value="name">
                                    Name
                                </option>

                                <option value="email">
                                    Email
                                </option>

                                <option value="role">
                                    Role
                                </option>

                                <option value="createdAt">
                                    Created Date
                                </option>
                            </select>
                        </div>


                        <div className="user-field">
                            <label htmlFor="user-order">
                                Order
                            </label>

                            <select
                                id="user-order"
                                value={order}
                                onChange={(event) =>
                                    setOrder(event.target.value)
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


                    <div className="user-filter-actions">

                        <button
                            type="button"
                            className="user-btn user-btn-primary"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="user-btn user-btn-secondary"
                            onClick={handleClear}
                        >
                            Clear
                        </button>

                    </div>

                </div>

            </div>


            {/* USER DIRECTORY */}

            <div className="user-directory-card">

                <div className="directory-header">

                    <div>
                        <span>REGISTERED ACCOUNTS</span>

                        <h3>User directory</h3>
                    </div>

                    <div className="directory-records">
                        {users.length} records
                    </div>

                </div>


                <div className="users-table-container">

                    <table className="professional-users-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="users-empty-state"
                                    >
                                        No users found.
                                    </td>
                                </tr>

                            ) : (

                                users.map((user) => (

                                    <tr key={user.id}>

                                        <td
                                            data-label="Name"
                                            className="table-user-name"
                                        >
                                            {user.name}
                                        </td>

                                        <td
                                            data-label="Email"
                                            className="table-user-email"
                                        >
                                            {user.email}
                                        </td>

                                        <td
                                            data-label="Address"
                                            className="table-user-address"
                                        >
                                            {user.address || "-"}
                                        </td>

                                        <td data-label="Role">
                                            <span
                                                className={`user-role-badge role-${user.role.toLowerCase()}`}
                                            >
                                                {formatRole(user.role)}
                                            </span>
                                        </td>

                                        <td
                                            data-label="Action"
                                            className="table-user-action"
                                        >
                                            <button
                                                type="button"
                                                className="view-user-button"
                                                onClick={() =>
                                                    handleViewDetails(user.id)
                                                }
                                            >
                                                View details
                                                <span>→</span>
                                            </button>
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* USER DETAILS */}

            {selectedUser && (

                <div
                    className="user-modal-backdrop"
                    onClick={() => setSelectedUser(null)}
                >

                    <div
                        className="user-details-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-top">

                            <div>
                                <span>
                                    ACCOUNT DETAILS
                                </span>

                                <h3>User details</h3>
                            </div>

                            <button
                                type="button"
                                className="modal-x"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="user-profile-row">

                            <div className="user-profile-avatar">
                                {selectedUser.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="user-profile-info">

                                <h4>
                                    {selectedUser.name}
                                </h4>

                                <span
                                    className={`user-role-badge role-${selectedUser.role.toLowerCase()}`}
                                >
                                    {formatRole(selectedUser.role)}
                                </span>

                            </div>

                        </div>


                        <div className="user-detail-grid">

                            <div className="user-detail-item">
                                <span>Email</span>
                                <strong>
                                    {selectedUser.email}
                                </strong>
                            </div>

                            <div className="user-detail-item">
                                <span>Address</span>
                                <strong>
                                    {selectedUser.address || "-"}
                                </strong>
                            </div>

                        </div>


                        {selectedUser.role === "STORE_OWNER" &&
                            selectedUser.store && (

                                <div className="owner-store-panel">

                                    <div className="owner-store-top">

                                        <div>
                                            <span>
                                                STORE INFORMATION
                                            </span>

                                            <h4>
                                                {
                                                    selectedUser
                                                        .store
                                                        .name
                                                }
                                            </h4>
                                        </div>

                                        <div className="owner-rating">
                                            ★{" "}
                                            {
                                                selectedUser
                                                    .store
                                                    .overallRating
                                            }
                                        </div>

                                    </div>


                                    <div className="owner-store-details">

                                        <div>
                                            <span>
                                                Store email
                                            </span>

                                            <strong>
                                                {
                                                    selectedUser
                                                        .store
                                                        .email
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Store address
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
                            className="modal-done-button"
                            onClick={() =>
                                setSelectedUser(null)
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