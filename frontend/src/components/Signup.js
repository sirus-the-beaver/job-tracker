import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';

const USER_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Signup = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, pwd);
        setSuccess(true);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-700 flex items-center justify-center p-4">
            {success ? (
                <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 mx-auto">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 text-3xl" />
                    </div>
                    <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-gray-900 mb-4">Registration Successful!</h1>
                    <p className="text-gray-600 mb-6">Your account has been created. You can now log in.</p>
                    <button 
                        onClick={() => navigate("/Login")}
                        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Log In
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto fade-in">
                    <div className="text-center mb-8">
                        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-gray-900">Create Account</h1>
                        <p className="mt-2 text-gray-600">Sign up to get started with Job Tracker</p>
                    </div>
                    
                    <p 
                        ref={errRef} 
                        className={`${errMsg ? 'block mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200' : 'hidden'}`}
                        aria-live="assertive"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        {errMsg}
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                Email:
                                <span className={validName ? "ml-2 text-green-500" : "hidden"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={!validName && user ? "ml-2 text-red-500" : "hidden"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </span>
                                <input
                                    type="text"
                                    id="email"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setUser(e.target.value)}
                                    required
                                    aria-invalid={!validName}
                                    aria-describedby="uidnote"
                                    onFocus={() => setUserFocus(true)}
                                    onBlur={() => setUserFocus(false)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                                        userFocus 
                                            ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20' 
                                            : validName 
                                                ? 'border-green-500' 
                                                : user 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <p id="uidnote" className={`text-xs mt-1 ${userFocus && user && !validName ? 'text-blue-600' : 'hidden'}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </p>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                Password:
                                <span className={validPwd ? "ml-2 text-green-500" : "hidden"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={!validPwd && pwd ? "ml-2 text-red-500" : "hidden"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                    aria-invalid={!validPwd}
                                    aria-describedby="pwdnote"
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                                        pwdFocus 
                                            ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20' 
                                            : validPwd 
                                                ? 'border-green-500' 
                                                : pwd 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300'
                                    }`}
                                    placeholder="Create a password"
                                />
                            </div>
                            <p id="pwdnote" className={`text-xs mt-1 ${pwdFocus && !validPwd ? 'text-blue-600' : 'hidden'}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: ! @ # $ %
                            </p>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirm_pwd" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                Confirm Password:
                                <span className={validMatch && matchPwd ? "ml-2 text-green-500" : "hidden"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={!validMatch && matchPwd ? "ml-2 text-red-500" : "hidden"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <input
                                    type="password"
                                    id="confirm_pwd"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    required
                                    aria-invalid={!validMatch}
                                    aria-describedby="confirmnote"
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                                        matchFocus 
                                            ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20' 
                                            : validMatch && matchPwd 
                                                ? 'border-green-500' 
                                                : matchPwd 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300'
                                    }`}
                                    placeholder="Confirm your password"
                                />
                            </div>
                            <p id="confirmnote" className={`text-xs mt-1 ${matchFocus && !validMatch ? 'text-blue-600' : 'hidden'}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                Must match the first password input field.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!validName || !validPwd || !validMatch}
                            className={`w-full py-3 px-6 font-medium rounded-lg shadow-md transition-all duration-200 transform flex items-center justify-center ${
                                !validName || !validPwd || !validMatch
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                        >
                            <span>Sign Up</span>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already signed up? 
                            <button 
                                onClick={() => navigate("/Login")}
                                className="ml-1 text-White-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
