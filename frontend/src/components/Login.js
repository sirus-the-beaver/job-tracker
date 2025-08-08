// Citation for the following:
// Date: 07/10/2025
// Based on:
// Source: YouTube
// Author(s): Dave Gray
// YouTube tutorial video: React User Login and Authentication with Axios (00:00 - 13:52)
// YouTube URL: https://www.youtube.com/watch?v=X3qyxo_UTR4


import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserPlus, faCircleExclamation, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';


const Login = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUser('');
        setPwd('');
        setSuccess(true);
        const response = await auth.login({ email: user, password: pwd });
        if (response.success) {
                navigate('/');
        } else {
            setErrMsg(response.message);
            errRef.current.focus();
            setSuccess(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-gray-900">Job Tracker</h1>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>
                
                <p 
                    ref={errRef} 
                    className={`${errMsg ? 'block' : 'hidden'} mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200`}
                    aria-live="assertive"
                >
                    <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
                    {errMsg}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <input 
                                type="text" 
                                id="username" 
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-lg" />
                            </button>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <span>Sign In</span>
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need an account? <button 
                            onClick={() => navigate("/Signup")}
                            className="inline-flex items-center text-white-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
