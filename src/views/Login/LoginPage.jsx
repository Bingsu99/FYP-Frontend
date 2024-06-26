import React, { useState, useContext } from 'react';
import AccountToggle from '../../components/AccountToggle/AccountToggle';
import AuthContext from "../../context/AuthContext";
import { serverURL } from "../../Constants";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('patient');
  const [authError, setAuthError] = useState(false); // State to handle auth error message

  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError(false); // Reset auth error state on new submission
    try {
      const response = await fetch('http://' + serverURL + "/IAM/Login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: user, email: email, password: password }),
      });

      console.log({ type: user, email: email, password: password })
      const result = await response.json();
      console.log(result)
      if (result["status"] === "success") {
        login(user, result["data"]["_id"], result["data"]["name"]);
        navigate('/' + user);
      } else {
        setAuthError(true); // Set auth error if login is not successful
      }
      
    } catch (error) {
      console.error('Error fetching data: ', error);
      setAuthError(true); // Set auth error on fetch error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          <AccountToggle setUser={setUser}/>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {authError && (
              <div className="text-red-500 text-sm text-center mt-2">
                Invalid email or password.
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
