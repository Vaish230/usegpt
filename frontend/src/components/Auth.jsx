import { useState, useContext, useEffect } from "react";
import { Context } from "./Context";
import "./Auth.css";

function Auth() {
  const { setToken, showAuth, setShowAuth, resetChatState, setUser } = useContext(Context);

  const [isLogin, setIsLogin] = useState(showAuth === "login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync state with parent state when it changes
  useEffect(() => {
    setIsLogin(showAuth === "login");
    setError("");
    setSuccess("");
  }, [showAuth]);

  const validateInputs = () => {
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!isLogin) {
      if (!username) {
        setError("Username is required for signup.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInputs()) return;

    setLoading(true);
    const url = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/signup";

    const body = isLogin ? { email, password } : { email, username, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setSuccess(isLogin ? "Logged in successfully!" : "Account created successfully!");
        setTimeout(() => {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setUser(data.user);
          resetChatState();
          setShowAuth(null);
        }, 1000);
      } else {
        setError(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authOverlay">
      <div className="authCard">
        <button className="closeBtn" onClick={() => setShowAuth(null)} title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="authTabs">
          <button
            className={`authTab ${isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={`authTab ${!isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <h3 className="authTitle">
          {isLogin ? "Welcome Back" : "Join UseGPT"}
        </h3>
        <p className="authSubtitle">
          {isLogin ? "Sign in to save and sync your chats" : "Create an account to keep your history"}
        </p>

        {error && (
          <div className="authAlert errorAlert">
            <i className="fa-solid fa-circle-exclamation"></i> &nbsp; {error}
          </div>
        )}

        {success && (
          <div className="authAlert successAlert">
            <i className="fa-solid fa-circle-check"></i> &nbsp; {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="authForm">
          <div className="inputGroup">
            <label>Email Address</label>
            <div className="inputWrapper">
              <i className="fa-regular fa-envelope inputIcon"></i>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="inputGroup">
              <label>Username</label>
              <div className="inputWrapper">
                <i className="fa-regular fa-user inputIcon"></i>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="inputGroup">
            <label>Password</label>
            <div className="inputWrapper">
              <i className="fa-solid fa-lock inputIcon"></i>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="inputGroup">
              <label>Confirm Password</label>
              <div className="inputWrapper">
                <i className="fa-solid fa-lock inputIcon"></i>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button type="submit" className="authSubmitBtn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : isLogin ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="authFooter">
          {isLogin ? "New to UseGPT?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="toggleLink"
          >
            {isLogin ? "Sign up now" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
