import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post(
                "https://retailiq-thru.onrender.com/api/auth/login",
                {
                    email,
                    password,
                }
            );

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "SYSTEM_ADMIN") {
                navigate("/admin");
            } else if (user.role === "STORE_OWNER") {
                navigate("/owner");
            } else if (user.role === "NORMAL_USER") {
                navigate("/user");
            }
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );

            setErrorMessage(
                error.response?.data?.message ||
                    "Unable to sign in. Please check your credentials."
            );
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-orbit auth-orbit-one"></div>
            <div className="auth-orbit auth-orbit-two"></div>

            <section className="auth-layout">

                {/* Product introduction */}

                <div className="auth-intro">

                    <div className="auth-brand auth-brand-left">

                        <div className="brand-mark">
                            R
                        </div>

                        <span>
                            RetailIQ
                        </span>

                    </div>

                    <div className="intro-content">

                        <span className="intro-kicker">
                            RETAIL INTELLIGENCE PLATFORM
                        </span>

                        <h1>
                            Turn customer
                            <span> ratings </span>
                            into insight.
                        </h1>

                        <p>
                            A focused workspace for managing stores,
                            understanding customer feedback and
                            keeping every rating in one place.
                        </p>

                    </div>

                    <div className="intro-metrics">

                        <div className="intro-metric">
                            <strong>01</strong>
                            <span>Stores</span>
                        </div>

                        <div className="intro-metric">
                            <strong>02</strong>
                            <span>Customers</span>
                        </div>

                        <div className="intro-metric">
                            <strong>03</strong>
                            <span>Ratings</span>
                        </div>

                    </div>

                    <div className="intro-line">
                        <span></span>

                        <p>
                            Built for better retail decisions.
                        </p>
                    </div>

                </div>


                {/* Login */}

                <div className="auth-panel">

                    <div className="auth-card">

                        <div className="auth-card-header">

                            <span className="auth-eyebrow">
                                WELCOME BACK
                            </span>

                            <h2>
                                Sign in
                            </h2>

                            <p>
                                Access your RetailIQ workspace.
                            </p>

                        </div>


                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="field-group">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />

                            </div>


                            <div className="field-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />

                            </div>


                            {errorMessage && (
                                <div className="auth-error">
                                    {errorMessage}
                                </div>
                            )}


                            <button
                                className="auth-submit"
                                type="submit"
                            >
                                <span>
                                    Sign in to RetailIQ
                                </span>

                                <span className="button-arrow">
                                    →
                                </span>
                            </button>

                        </form>


                        <div className="auth-divider">
                            <span>
                                New to RetailIQ?
                            </span>
                        </div>


                        <button
                            className="auth-secondary"
                            type="button"
                            onClick={() => navigate("/signup")}
                        >
                            <span>
                                Create a Normal User account
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

export default Login;