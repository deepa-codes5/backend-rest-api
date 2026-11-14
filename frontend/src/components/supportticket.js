
import { useState, useEffect } from "react";
import "./supportticket.css";

function SupportTicket() {
  const API = "http://localhost:5000/supportTicket";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical Issue");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const token = localStorage.getItem("token");

  // FETCH MY TICKETS
  const fetchTickets = async () => {
    try {
      setLoading(true);

      if (!token) {
        setFeedback("Please login to view your tickets.");
        return;
      }

      const response = await fetch(
        `${API}/my-tickets`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tickets");
      }

      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  // LOAD TICKETS WHEN PAGE OPENS
  useEffect(() => {
    fetchTickets();
  }, []);

  // SUBMIT SUPPORT TICKET
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setFeedback("Please login first.");
      return;
    }

    try {
      setSubmitting(true);
      setFeedback("");

      const response = await fetch(
        `${API}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            category,
            priority,
            message
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ticket submission failed");
      }

      setFeedback("Support ticket submitted successfully!");

      // CLEAR FORM
      setName("");
      setEmail("");
      setSubject("");
      setCategory("Technical Issue");
      setPriority("Medium");
      setMessage("");

      // REFRESH TICKETS
      await fetchTickets();

    } catch (error) {
      console.error("Submit ticket error:", error);
      setFeedback(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // STATUS CLASS
  const getStatusClass = (status) => {
    const value = (status || "open").toLowerCase();

    if (value === "resolved" || value === "closed") {
      return "resolved";
    }

    if (value === "in progress" || value === "in-progress") {
      return "progress";
    }

    return "open";
  };

  return (
    <div className="support-page">
      <div className="support-container">

        {/* CREATE SUPPORT TICKET */}

        <div className="ticket-form">

          <h1>Create Support Ticket</h1>

          <p className="description">
            Please describe your problem and our support team will help you.
          </p>

          {feedback && (
            <p className="support-feedback" role="status">
              {feedback}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter problem subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Technical Issue</option>
              <option>Payment Issue</option>
              <option>Delivery Issue</option>
              <option>Account Issue</option>
              <option>Other</option>
            </select>

            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Message</label>
            <textarea
              placeholder="Describe your problem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>

          </form>
        </div>

        {/* MY SUPPORT TICKETS */}

        <div className="my-tickets">

          <div className="ticket-header">
            <h2>My Tickets</h2>

            <span onClick={fetchTickets} style={{ cursor: "pointer" }}>
              Refresh ↻
            </span>
          </div>

          {loading ? (
            <p>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p>No support tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <div className="ticket-card" key={ticket._id}>

                <div>
                  <h3>
                    #{ticket.ticketId || ticket._id}
                  </h3>

                  <p>{ticket.subject}</p>

                  <small>
                    {ticket.category || "General"} •{" "}
                    {formatDate(ticket.createdAt)}
                  </small>

                  <p className="ticket-message">
                    {ticket.message}
                  </p>

                  <small>
                    Priority: {ticket.priority || "Medium"}
                  </small>
                </div>

                <span
                  className={`status ${getStatusClass(ticket.status)}`}
                >
                  {ticket.status || "Open"}
                </span>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default SupportTicket;
