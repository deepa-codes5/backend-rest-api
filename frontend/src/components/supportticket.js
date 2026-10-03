import { useState } from "react";
import "./supportticket.css";

function SupportTicket() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical Issue");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      name,
      email,
      subject,
      category,
      priority,
      message
    });

    alert("Support ticket submitted!");
  };

  return (
    <div className="support-page">

      <div className="support-container">

        <div className="ticket-form">

          <h1>Create Support Ticket</h1>

          <p className="description">
            Please describe your problem and our support team will help you.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter problem subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
            ></textarea>

            <button type="submit">
              Submit Ticket
            </button>

          </form>

        </div>


        {/* My Tickets */}

        <div className="my-tickets">

          <div className="ticket-header">
            <h2>My Tickets</h2>
            <span>View All →</span>
          </div>

          <div className="ticket-card">
            <div>
              <h3>#TK1025</h3>
              <p>Unable to login</p>
              <small>Technical Issue • 02 Oct 2026</small>
            </div>

            <span className="status open">
              Open
            </span>
          </div>


          <div className="ticket-card">
            <div>
              <h3>#TK1024</h3>
              <p>Payment not received</p>
              <small>Payment Issue • 01 Oct 2026</small>
            </div>

            <span className="status progress">
              In Progress
            </span>
          </div>


          <div className="ticket-card">
            <div>
              <h3>#TK1023</h3>
              <p>Delivery delayed</p>
              <small>Delivery Issue • 30 Sep 2026</small>
            </div>

            <span className="status resolved">
              Resolved
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SupportTicket;