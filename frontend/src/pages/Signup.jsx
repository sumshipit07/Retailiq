import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setMessage("");
    };

    const nameInvalid =
        formData.name.length > 0 &&
        formData.name.length < 5;

    const passwordInvalid =
        formData.password.length > 0 &&
        (
            formData.password.length < 8 ||
            formData.password.length > 16 ||
            !/[A-Z]/.test(formData.password) ||
            !/[^A-Za-z0-9]/.test(formData.password)
        );

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setIsError(false);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/signup",
                formData
            );

            setMessage(response.data.message);

            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            console.error(
                "Signup failed:",
                error.response?.data || error.message
            );

            setIsError(true);

            setMessage(
                error.response?.data?.message ||
                "Signup failed."
            );
        }
    };

    return (
        <main className="auth-page signup-page">

            <div className="auth-orbit auth-orbit-one"></div>
            <div className="auth-orbit auth-orbit-two"></div>

            <section className="auth-layout signup-layout">

                {/* =================================================
                    LEFT — PRODUCT INTRO
                ================================================= */}

                <div className="auth-intro signup-intro">

                    <div className="auth-brand auth-brand-left">
                        <div className="brand-mark">R</div>
                        <span>RetailIQ</span>
                    </div>

                    <div className="intro-content">

                        <span className="intro-kicker">
                            JOIN RETAILIQ
                        </span>

                        <h1>
                            Make every
                            <span> rating </span>
                            count.
                        </h1>

                        <p>
                            Create your RetailIQ account and get a
                            simple workspace for discovering stores,
                            sharing feedback and keeping track of
                            your ratings.
                        </p>

                    </div>


                    {/* =================================================
                        SIGNUP BENEFITS
                    ================================================= */}

                    <div className="signup-benefits">

                        <div className="signup-benefit">

                            <div className="benefit-number">
                                01
                            </div>

                            <div className="benefit-content">

                                <strong>
                                    Discover stores
                                </strong>

                                <p>
                                    Find stores by name or address.
                                </p>

                            </div>

                            <span className="benefit-arrow">
                                ↗
                            </span>

                        </div>


                        <div className="signup-benefit">

                            <div className="benefit-number">
                                02
                            </div>

                            <div className="benefit-content">

                                <strong>
                                    Share your experience
                                </strong>

                                <p>
                                    Rate stores from 1 to 5.
                                </p>

                            </div>

                            <span className="benefit-arrow">
                                ↗
                            </span>

                        </div>


                        <div className="signup-benefit">

                            <div className="benefit-number">
                                03
                            </div>

                            <div className="benefit-content">

                                <strong>
                                    Change your rating
                                </strong>

                                <p>
                                    Update your feedback whenever needed.
                                </p>

                            </div>

                            <span className="benefit-arrow">
                                ↗
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT — SIGNUP
                ================================================= */}

                <div className="auth-panel signup-panel">

                    <div className="auth-card signup-card">

                        <div className="auth-card-header">

                            <span className="auth-eyebrow">
                                CREATE ACCOUNT
                            </span>

                            <h2>
                                Get started.
                            </h2>

                            <p>
                                Create your Normal User account.
                            </p>

                        </div>


                        <form
                            className="auth-form signup-form"
                            onSubmit={handleSubmit}
                        >

                            {/* NAME */}

                            <div className="field-group">

                                <label htmlFor="name">
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    minLength={5}
                                    maxLength={60}
                                    autoComplete="name"
                                    required
                                />

                                {nameInvalid && (
                                    <span className="field-validation">
                                        Name must contain at least 5 characters.
                                    </span>
                                )}

                            </div>


                            {/* EMAIL */}

                            <div className="field-group">

                                <label htmlFor="signup-email">
                                    Email address
                                </label>

                                <input
                                    id="signup-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="field-group">

                                <label htmlFor="address">

                                    <span>
                                        Address
                                    </span>

                                    <span className="optional-label">
                                        Optional
                                    </span>

                                </label>

                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="City, state or full address"
                                    maxLength={400}
                                    autoComplete="street-address"
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="field-group">

                                <label htmlFor="signup-password">
                                    Password
                                </label>

                                <input
                                    id="signup-password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    minLength={8}
                                    maxLength={16}
                                    autoComplete="new-password"
                                    required
                                />

                                {passwordInvalid && (
                                    <span className="field-validation">
                                        Password must be 8–16 characters with
                                        one uppercase letter and one special character.
                                    </span>
                                )}

                            </div>


                            {/* MESSAGE */}

                            {message && (
                                <div
                                    className={
                                        isError
                                            ? "auth-error"
                                            : "auth-success"
                                    }
                                >
                                    {message}
                                </div>
                            )}


                            {/* CREATE */}

                            <button
                                className="auth-submit"
                                type="submit"
                            >
                                <span>
                                    Create account
                                </span>

                                <span className="button-arrow">
                                    →
                                </span>
                            </button>

                        </form>


                        {/* DIVIDER */}

                        <div className="auth-divider">
                            <span>
                                Already have an account?
                            </span>
                        </div>


                        {/* BACK TO LOGIN */}

                        <button
                            className="auth-secondary"
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            <span>
                                Back to sign in
                            </span>

                            <span>
                                →
                            </span>
                        </button>

                    </div>


                    <p className="auth-footer">
                        RetailIQ · Store ratings & intelligence
                    </p>

                </div>

            </section>

        </main>
    );
}

export default Signup;