import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const navigate = useNavigate();

    const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  


  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // =========================
  // LOGIN / REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(
           isRegister
            ? {
                username: formData.username,
                email: formData.email,
                password: formData.password
              }
            : {
                email: formData.email,
                password: formData.password
              }
        )
      });

      const data = await response.json();


      // =========================
      // HANDLE ERROR
      // =========================

      if (!response.ok) {
        setError(
          data.message || "Something went wrong"
        );
        return;
      }

      
      // =========================
      // Update auth context
      // =========================
       
      login(data.user, data.token);
      
      // =========================
      // SUCCESS MESSAGE
      // =========================

      setSuccess(
        isRegister
          ? "Registration successful!"
          : "Login successful!"
      );

      // =========================
      // GO TO HOME PAGE
      // =========================

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError("Unable to connect to server");
    }
  
  
    // =========================
      // SAVE JWT TOKEN
      // =========================

      // localStorage.setItem(
      //   "token",
      //   data.token
      // );


      // =========================
      // SAVE USER
      // =========================

      // localStorage.setItem(
      //   "user",
      //   JSON.stringify(data.user)
      // );


      // =========================
      // GO TO HOME PAGE
      // =========================

    //   navigate("/");

    // } catch (error) {

    //   console.error(error);

    //   setError(
    //     "Unable to connect to server"
    //   );
    // }
  };


  return (
    <div className="signin-page">
      <div className="signin-card">

        <h1>
          {isRegister
            ? "Create your account"
            : "Sign in"}
        </h1>


        <p>
          {isRegister
            ? "Register to continue"
            : "Sign in to continue to YouTube Clone"}
        </p>


        <form onSubmit={handleSubmit}>

          {/* Username only for registration */}

          {isRegister && (
            <input type="text" name="username"  placeholder="Username" value={formData.username}  onChange={handleChange} required />
          )}
          {/* Email */}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          {/* Password */}
          <input  type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          {/* Error */}

          {error && (
            <p className="signin-error">
              {error}
            </p>
          )}


          {/* Submit */}

          <button type="submit">
            {isRegister
              ? "Register"
              : "Sign in"}
          </button>

        </form>


        {/* Login/Register switch */}

        <div className="signin-switch">

          {isRegister ? "Already have an account?" : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {setIsRegister(!isRegister);
               setError("");
              setSuccess("");
            }}
          >
            {isRegister
              ? "Sign in"
              : "Create account"}
          </button>

        </div>

      </div>

    </div>
  );
}


export default SignIn;