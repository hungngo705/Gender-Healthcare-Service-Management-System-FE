import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    alert("Login submitted!");
  };

  return (
    <div className="login-page" style={{ maxWidth: 400, margin: "40px auto", background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 24 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;