export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f1f1f1",
        color: "#333",
        textAlign: "center",
        padding: "15px 0",
        position: "fixed",
        bottom: "0",
        width: "100%",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <p>© {new Date().getFullYear()} Smart Ticket System. All rights reserved.</p>
    </footer>
  );
}
