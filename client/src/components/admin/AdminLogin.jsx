function AdminLogin({
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  adminError,
  adminLoading,
  adminLogin,
}) {
  return (
    <div className="adminPage">
      <div className="adminLoginContainer">
        <div className="adminLoginCard">
          <div className="adminLoginHeader">
            <h1>STAR STEPS</h1>
            <p>Online Assessments</p>
          </div>

          <h2>Admin Login</h2>

          <form onSubmit={adminLogin}>
            <div className="formGroup">
              <label htmlFor="adminEmail">Email</label>

              <input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(event) =>
                  setAdminEmail(event.target.value)
                }
                placeholder="Enter admin email"
                autoComplete="email"
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="adminPassword">Password</label>

              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(event) =>
                  setAdminPassword(event.target.value)
                }
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
            </div>

            {adminError && (
              <div className="adminError">
                {adminError}
              </div>
            )}

            <button
              type="submit"
              className="adminLoginButton"
              disabled={adminLoading}
            >
              {adminLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;