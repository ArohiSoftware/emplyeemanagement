
import {toast} from "sonner";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function EmpLogin({ setUserType }) {
  const [employeeEmail, setEmployeeEmail] = useState("");
  
  const [employeePassword, setEmployeePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const submitEmployee = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true

    };

    const body = {
      email: employeeEmail,
      
      password: employeePassword,
    };

    try {
      
      const response = await axios.post(
        "http://localhost:5200/api/v1/user/login",
        body,
        config
      );

      console.log(response);
      console.log(response.data);

      if (response.data.success) {
        setUserType = "employee";
        alert("Employee Login Successful");
        toast.success("Employee Login Successful");
        navigate("/emp-dashboard");
      } 

      else if(response.data.success === false) {
        setErrorMessage(
          response.data.message ||
            "email or password is incorrect. Please try again."
        );
      }
      else {
        setErrorMessage(
          response.data.message ||
            "Login failed. Please check your credentials and try again."
        );
      }

    } 
    
    catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(
        "An error occurred during login. Please try again later."
      );
    }
  };

  return (
    <div>
      <div className='grid shadow-2xl border max-w-[900px] mx-auto translate-y-24  grid-cols-1 lg:grid-cols-2'>
        <img className="hidden lg:block md:col-span-1 object-cover" src="https://images.unsplash.com/photo-1644224076179-31d622e21511?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Login background" />
        <div className="col-span-2 lg:col-span-1 p-6">
          <div className="w-full p-6">
            <h2 className="text-2xl font-light text-center mb-6">Employee Login</h2>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
            )}
            <form onSubmit={submitEmployee}>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-black"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-black"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Login
              </button>
              <h4 className="text-center mt-2 font-medium text-xl">Or</h4>
              <div className="mt-4 text-center">
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmpLogin;
