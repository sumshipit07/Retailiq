import { useState } from "react";

function StoreFilters({ onSearch }) {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        sortBy: "name",
        order: "ASC",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        onSearch(filters);
    };

    const handleClear = () => {
        const defaultFilters = {
            name: "",
            email: "",
            address: "",
            sortBy: "name",
            order: "ASC",
        };

        setFilters(defaultFilters);
        onSearch(defaultFilters);
    };

    return (
        <div className="store-filters">

            {/* SEARCH FIELDS */}

            <div className="store-filter-grid">

                <div className="store-filter-field">
                    <label htmlFor="store-filter-name">
                        Name
                    </label>

                    <input
                        id="store-filter-name"
                        type="text"
                        name="name"
                        placeholder="Search by name"
                        value={filters.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="store-filter-field">
                    <label htmlFor="store-filter-email">
                        Email
                    </label>

                    <input
                        id="store-filter-email"
                        type="text"
                        name="email"
                        placeholder="Search by email"
                        value={filters.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="store-filter-field">
                    <label htmlFor="store-filter-address">
                        Address
                    </label>

                    <input
                        id="store-filter-address"
                        type="text"
                        name="address"
                        placeholder="Search by address"
                        value={filters.address}
                        onChange={handleChange}
                    />
                </div>

            </div>


            {/* SORT + ACTIONS — SINGLE ROW */}

            <div className="store-filter-bottom">

                <div className="store-filter-field store-sort-field">

                    <label htmlFor="store-filter-sort">
                        Sort by
                    </label>

                    <select
                        id="store-filter-sort"
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleChange}
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


                <div className="store-filter-field store-sort-field">

                    <label htmlFor="store-filter-order">
                        Order
                    </label>

                    <select
                        id="store-filter-order"
                        name="order"
                        value={filters.order}
                        onChange={handleChange}
                    >
                        <option value="ASC">
                            Ascending
                        </option>

                        <option value="DESC">
                            Descending
                        </option>
                    </select>

                </div>


                <div className="store-filter-actions">

                    <button
                        type="button"
                        className="store-filter-search"
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        className="store-filter-clear"
                        onClick={handleClear}
                    >
                        Clear
                    </button>

                </div>

            </div>

        </div>
    );
}

export default StoreFilters;