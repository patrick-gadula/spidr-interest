import React, { useState } from "react";
import "./index.css";


function formatPin(pin) {
  return pin.replace(/\D/g, '').replace(/(.{4})/g, '$1-').replace(/-$/, '').slice(0, 19);
}

export default function App() {
  const [form, setForm] = useState({
    first: "",
    last: "",
    phone: "",
    email: "",
    guess: "",
    pin: ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success"


  function handleChange(e) {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "pin") {
      newValue = formatPin(value);
    }

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm({ ...form, [name]: newValue });
  }

  function formatPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 10);
    if (digits.length > 6) return `(${part1}) ${part2}-${part3}`;
    if (digits.length > 3) return `(${part1}) ${part2}`;
    if (digits.length > 0) return `(${part1}`;
    return "";
  }


  function validate() {
    const errs = {};
    if (!form.first.trim()) errs.first = "First name required.";
    if (!form.last.trim()) errs.last = "Last name required.";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = "Phone required (10 digits).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required.";
    if (!form.guess || isNaN(form.guess) || Number(form.guess) <= 0) errs.guess = "Enter a valid cost.";
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(form.pin)) errs.pin = "16-digit PIN required.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setStatus("loading");
      setTimeout(() => {
        console.log(
          `
  ---- Spidr Air Fryer Form Submission ----
  First Name : ${form.first}
  Last Name  : ${form.last}
  Phone      : ${formatPhone(form.phone)}
  Email      : ${form.email}
  Guess ($)  : ${form.guess}
  Spidr PIN  : ${form.pin}
  -----------------------------------------
          `.trim()
        );
        setStatus("success");
        setForm({ first: "", last: "", phone: "", email: "", guess: "", pin: "" });
      }, 2000); // 2 seconds loading
    }
  }


  return (
    <div className="form-container">
      {/* LOADING state */}
      {status === "loading" && (
        <div className="form-feedback" role="status" aria-live="polite" style={{
          textAlign: "center",
          padding: "2rem 0",
          color: "#8fd3dd",
          fontWeight: 600,
          fontSize: "1.22em"
        }}>
          <span className="loading-spinner" style={{
            display: "inline-block",
            width: 28,
            height: 28,
            border: "3px solid #8fd3dd",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginRight: "0.5em",
            verticalAlign: "middle"
          }}></span>
          Submitting...
        </div>
      )}

      {/* SUCCESS state */}
      {status === "success" && (
        <div className="form-feedback" role="status" aria-live="polite" style={{
          textAlign: "center",
          padding: "2rem 0",
          color: "#59efad",
          fontWeight: 700,
          fontSize: "1.22em"
        }}>
          Successfully sent!
        </div>
      )}

      {/* FORM (idle state) */}
      {status === "idle" && (
        <form onSubmit={handleSubmit} autoComplete="off">
          <label>First Name</label>
          <input 
            name="first" 
            value={form.first} 
            onChange={handleChange} 
            autoCapitalize="words"
          />
          {errors.first && <div className="error-message">{errors.first}</div>}

          <label>Last Name</label>
          <input 
            name="last" 
            value={form.last} 
            onChange={handleChange} 
            autoCapitalize="words"
          />
          {errors.last && <div className="error-message">{errors.last}</div>}

          <label>Phone Number</label>
          <input
            name="phone"
            value={formatPhone(form.phone)}
            onChange={handleChange}
            maxLength={14}
            type="tel"
            placeholder="(555) 555-5555"
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}

          <label>Email Address</label>
          <input 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            type="email"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}

          <label>Guess the Air Fryer’s Cost</label>
          <input
            name="guess"
            value={form.guess}
            onChange={handleChange}
            type="text"
            inputMode="decimal"
            placeholder="e.g., 10.99"
          />
          {errors.guess && <div className="error-message">{errors.guess}</div>}

          <label>Very, Very Secret 16-digit Spidr PIN</label>
          <input 
            name="pin" 
            value={form.pin} 
            onChange={handleChange} 
            placeholder="####-####-####-####" 
            maxLength={19}
          />
          {errors.pin && <div className="error-message">{errors.pin}</div>}

          <button type="submit">Submit Interest</button>
        </form>
      )}
    </div>
  );
}
