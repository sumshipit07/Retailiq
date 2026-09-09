import { useState } from "react";
import axios from "axios";
import "./AddUser.css";

function AddUser() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "NORMAL_USER",
    });

    const [message, setMessage] = useState("");

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
                "http://localhost:5000/api/admin/users",
                formData,
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
                password: "",
                address: "",
                role: "NORMAL_USER",
            });
        } catch (error) {
            console.error(
                "Failed to create user:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to create user."
            );
        }
    };

    return (
        <div className="add-user-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="add-user-header">

                <span className="add-user-eyebrow">
                    ACCOUNT MANAGEMENT
                </span>

                <h2>
                    Add User
                </h2>

                <p>
                    Create a new RetailIQ account and assign
                    its platform role.
                </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="add-user-form"
                onSubmit={handleSubmit}
            >

                {/* NAME */}

                <div className="add-user-field">

                    <label htmlFor="add-user-name">
                        Name
                    </label>

                    <input
                        id="add-user-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                    />

                </div>


                {/* EMAIL */}

                <div className="add-user-field">

                    <label htmlFor="add-user-email">
                        Email
                    </label>

                    <input
                        id="add-user-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                    />

                </div>


                {/* PASSWORD */}

                <div className="add-user-field">

                    <label htmlFor="add-user-password">
                        Password
                    </label>

                    <input
                        id="add-user-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />

                </div>


                {/* ADDRESS */}

                <div className="add-user-field">

                    <label htmlFor="add-user-address">
                        Address
                    </label>

                    <input
                        id="add-user-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                    />

                </div>


                {/* ROLE */}

                <div className="add-user-field">

                    <label htmlFor="add-user-role">
                        Role
                    </label>

                    <select
                        id="add-user-role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="NORMAL_USER">
                            Normal User
                        </option>

                        <option value="SYSTEM_ADMIN">
                            System Admin
                        </option>

                        <option value="STORE_OWNER">
                            Store Owner
                        </option>
                    </select>

                </div>


                {/* SUBMIT */}

                <button
                    type="submit"
                    className="add-user-submit"
                >
                    Create User
                </button>

            </form>


            {/* =================================================
                RESPONSE MESSAGE
            ================================================= */}

            {message && (
                <p className="add-user-message">
                    {message}
                </p>
            )}

        </div>
    );
}

export default AddUser;