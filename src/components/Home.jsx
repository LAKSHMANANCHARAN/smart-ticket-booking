import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Welcome to Smart Ticket System</h1>
      <p>Book and manage your tickets easily!</p>
      <div>
        <Link to="/login">
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#28a745",
              color: "white",
              cursor: "pointer",
            }}
          >
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}
