import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return;
    }

    fetch("http://localhost:5000/api/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to fetch tickets");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading tickets...</p>;

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Your Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets booked yet!</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {tickets.map((t) => (
            <div key={t.ticket_id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px", width: "250px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              <h3>{t.event}</h3>
              <p>Date: {t.date}</p>
              <p>Seat: {t.seat}</p>
              {t.image_url && <img src={t.image_url} alt={t.event} style={{ width: "200px", borderRadius: "5px", marginTop: "10px" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
