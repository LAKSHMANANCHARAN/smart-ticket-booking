import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#007bff",
        color: "white",
        padding: "15px 0",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <h1 style={{ margin: 0 }}>🎫 Smart Ticket System</h1>
      <nav style={{ marginTop: "10px" }}>
        <Link
          to="/"
          style={{
            color: "white",
            margin: "0 15px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Home
        </Link>  
      </nav>
    </header>
  );
}
