import { useEffect, useState } from "react";
import axios from "axios";
import "./AddStore.css";

function AddStore() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: "",
    });

    const [owners, setOwners] = useState([]);
    const [message, setMessage] = useState("");

    // Load Store Owners
    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/admin/users?role=STORE_OWNER",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setOwners(response.data.data);
            } catch (error) {
                console.error(
                    "Failed to load store owners:",
                    error.response?.data || error.message
                );
            }
        };

        fetchOwners();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/admin/stores",
                {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    ownerId: Number(formData.ownerId),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message);

            setFormData({
                name: "",
                email: "",
                address: "",
                ownerId: "",
            });
        } catch (error) {
            console.error(
                "Failed to create store:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to create store."
            );
        }
    };

    return (
        <div className="add-store-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="add-store-header">

                <span className="add-store-eyebrow">
                    STORE MANAGEMENT
                </span>

                <h2>
                    Add Store
                </h2>

                <p>
                    Create a new store and assign its platform owner.
                </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="add-store-form"
                onSubmit={handleSubmit}
            >

                {/* STORE NAME */}

                <div className="add-store-field">

                    <label htmlFor="add-store-name">
                        Store Name
                    </label>

                    <input
                        id="add-store-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter store name"
                        required
                    />

                </div>


                {/* STORE EMAIL */}

                <div className="add-store-field">

                    <label htmlFor="add-store-email">
                        Store Email
                    </label>

                    <input
                        id="add-store-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter store email"
                        required
                    />

                </div>


                {/* ADDRESS */}

                <div className="add-store-field">

                    <label htmlFor="add-store-address">
                        Address
                    </label>

                    <input
                        id="add-store-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter store address"
                        required
                    />

                </div>


                {/* STORE OWNER */}

                <div className="add-store-field">

                    <label htmlFor="add-store-owner">
                        Store Owner
                    </label>

                    <select
                        id="add-store-owner"
                        name="ownerId"
                        value={formData.ownerId}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Store Owner
                        </option>

                        {owners.map((owner) => (
                            <option
                                key={owner.id}
                                value={owner.id}
                            >
                                {owner.name} - {owner.email}
                            </option>
                        ))}

                    </select>

                </div>


                {/* SUBMIT */}

                <button
                    type="submit"
                    className="add-store-submit"
                >
                    Create Store
                </button>

            </form>


            {/* =================================================
                RESPONSE MESSAGE
            ================================================= */}

            {message && (
                <p className="add-store-message">
                    {message}
                </p>
            )}

        </div>
    );
}

export default AddStore;