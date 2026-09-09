import { useEffect, useState } from "react";
import axios from "axios";
import StoreFilters from "./StoreFilters";
import "./StoreList.css";

function StoreList() {
    const [stores, setStores] = useState([]);

    const loadStores = async (filters = {}) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://retailiq-thru.onrender.com/api/admin/stores",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: filters,
                }
            );

            console.log("Admin stores:", response.data);

            setStores(response.data.data);
        } catch (error) {
            console.error(
                "Failed to load stores:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        loadStores({
            sortBy: "name",
            order: "ASC",
        });
    }, []);

    return (
        <div className="stores-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="stores-page-header">

                <div className="stores-header-copy">

                    <span className="stores-eyebrow">
                        STORE NETWORK
                    </span>

                    <h2>
                        Stores
                    </h2>

                    <p>
                        Review registered stores, ratings and
                        store information across the RetailIQ platform.
                    </p>

                </div>

                <div className="stores-count">

                    <strong>
                        {stores.length}
                    </strong>

                    <span>
                        Visible stores
                    </span>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="stores-filter-card">

                <div className="stores-filter-header">

                    <span>
                        SEARCH & FILTER
                    </span>

                    <h3>
                        Find stores
                    </h3>

                </div>

                <StoreFilters onSearch={loadStores} />

            </div>


            {/* =================================================
                STORE DIRECTORY
            ================================================= */}

            <div className="store-directory-card">

                <div className="store-directory-header">

                    <div>

                        <span>
                            REGISTERED STORES
                        </span>

                        <h3>
                            Store directory
                        </h3>

                    </div>

                    <div className="store-record-count">
                        {stores.length} records
                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="stores-table-container">

                    <table className="professional-stores-table">

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Address
                                </th>

                                <th>
                                    Rating
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {stores.length > 0 ? (

                                stores.map((store) => (

                                    <tr key={store.id}>

                                        <td className="table-store-name">
                                            {store.name}
                                        </td>

                                        <td className="table-store-email">
                                            {store.email}
                                        </td>

                                        <td className="table-store-address">
                                            {store.address}
                                        </td>

                                        <td>

                                            <span className="store-rating-badge">

                                                {Number(
                                                    store.overallRating || 0
                                                ).toFixed(1)}

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="stores-empty-state"
                                    >
                                        No stores found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default StoreList;