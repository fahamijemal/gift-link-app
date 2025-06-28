import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
    // State variables for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for showing incorrect login message
    const [incorrect, setIncorrect] = useState('');

    // Navigation hook for redirecting
    const navigate = useNavigate();

    // Read bearer token from session (used if available)
    const bearerToken = sessionStorage.getItem('bearer-token');

    // Global login state setter from context
    const { setIsLoggedIn } = useAppContext();

    // Auto redirect to /app if user is already logged in
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    // Handles form submission for login
    const handleLogin = async (e) => {
        e.preventDefault();

        // Send POST request to login API endpoint
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        const json = await res.json();
        console.log('Json', json);

        if (json.authtoken) {
            // Save user info and token in session storage
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);

            // Update login state and navigate to main app
            setIsLoggedIn(true);
            navigate('/app');
        } else {
            // Clear inputs and show error message
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            setIncorrect("Wrong password. Try again.");

            // Clear error message after 2 seconds
            setTimeout(() => {
                setIncorrect("");
            }, 2000);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Email input field */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIncorrect(""); // Clear error on input change
                                }}
                            />
                        </div>

                        {/* Password input field */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setIncorrect(""); // Clear error on input change
                                }}
                            />

                            {/* Display login error message */}
                            <span style={{
                                color: 'red',
                                height: '.5cm',
                                display: 'block',
                                fontStyle: 'italic',
                                fontSize: '12px'
                            }}>
                                {incorrect}
                            </span>
                        </div>

                        {/* Login button */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>

                        {/* Link to registration page */}
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
