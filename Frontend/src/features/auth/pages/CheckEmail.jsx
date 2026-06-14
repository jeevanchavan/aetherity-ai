import React from 'react';
import { useLocation, useNavigate } from 'react-router';

const CheckEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">

                <div className="text-5xl mb-4">
                    📩
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    Check your email
                </h1>

                <p className="text-gray-600 mb-6">
                    We've sent a verification link to
                    <span className="font-semibold">
                        {' '}
                        {email || 'your email address'}
                    </span>.
                </p>

                <p className="text-sm text-gray-500 mb-8">
                    Please verify your email before logging in.
                </p>

                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-black text-white cursor-pointer py-3 rounded-lg hover:opacity-90 transition"
                >
                    Go to Login
                </button>

            </div>
        </div>
    );
};

export default CheckEmail;