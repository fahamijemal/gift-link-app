import React, { useState } from 'react';
import { urlConfig } from '../../config'; // Backend API URL
import { useAppContext } from '../../context/AuthContext'; // App-wide login state
import { useNavigate } from 'react-router-dom'; // For page redirection

import './RegisterPage.css';

function RegisterPage() {
    // States to hold form input values
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showerr, setShowerr] = useState(''); // For displaying error message
    const navigate = useNavigate(); // Hook for navigation
    const { setIsLoggedIn } = useAppContext(); // Access global login state

    // Function to handle registration form submission
    const handleRegister = async () => {
        // Send POST request to backend register endpoint
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });

        const json = await response.json(); // Get response data
        console.log('json data', json);
        console.log('er', json.error);

        if (json.authtoken) {
            // Store user data in session storage
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', firstName);
            sessionStorage.setItem('email', json.email);

            setIsLoggedIn(true); // Update login state
            navigate('/app');    // Redirect to main app
        }

        // Display error if registration fails
        if (json.error) {
            setShowerr(json.error);
        }
    }

    // JSX to render the registration form
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* First Name input */}
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">FirstName</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* Last Name input */}
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">LastName</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* Email input */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Error message shown here */}
                            <div className="text-danger">{showerr}</div>
                        </div>

                        {/* Password input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Register button */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>

                        {/* Link to login page */}
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
