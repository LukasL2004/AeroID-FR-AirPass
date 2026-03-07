import "./Login.css";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { MdOutlinePersonOutline } from "react-icons/md";
import { MdAirplaneTicket } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import type React from "react";
import { useState } from "react";
import enrollAPI from "../../Services/Impl/EnrollService";

export default function Login() {
  const navigate = useNavigate();
  const [form,setForm] = useState({name:"",flight:""});

  // const toPass = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   navigate("/AeroID/BoardingPass");
  // };

  const [error, setError] = useState<string>("");

  const toScanner = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", form);
    setError(""); // reset error on submit
    
    try {
      const response = await enrollAPI.enrollVerify(form);
      console.log("enrollVerify response:", response);
      navigate("/AeroID/Scanner", { state: { name: form.name, flight: form.flight } });
    } catch(error: any) {
      console.error("Error inside toScanner:", error);
      const errorMsg = error?.message || "Failed to find your flight. Please try again!";
      setError(errorMsg);
    }
  };

  return (
    <div className="login">
      <div className="header">
        <GiAirplaneDeparture className="icon" />
        <h1 className="title">
          Your Face, Your <br /> Ticket.
        </h1>
        <p className="subtext">
          Secure your seat with decentralized <br /> biometric identity. No
          passports, no <br /> paper.
        </p>
      </div>
      <div className="container">
        <div className="body">
          <form onSubmit={toScanner}>
            {error && (
              <div style={{ color: "red", fontSize: "0.85rem", textAlign: "center", backgroundColor: "#ffe6e6", padding: "0.5rem", borderRadius: "0.5rem" }}>
                {error}
              </div>
            )}
            <div className="inp">
              <label htmlFor="" className="inputLabel">
                FULL LEGAL NAME
              </label>
              <div className="helper">
                <MdOutlinePersonOutline className="formIcon" />
                <input onChange={(e) => {setForm({...form,name:e.target.value})}} placeholder="Laza Lukas" type="text" className="input" />
              </div>
            </div>
            <div className="inp">
              <label htmlFor="" className="inputLabel">
                FLIGHT NUMBER
              </label>
              <div className="helper">
                <MdAirplaneTicket className="formIcon" />
                <input onChange={(e) => {setForm({...form,flight:e.target.value})}} placeholder="RO 410" type="text" className="input" />
              </div>
            </div>
            <div className="btn">
              <button type="submit">
                Create Secure ID <FaArrowRight />
              </button>
            </div>
          </form>
        </div>
        <div className="footer">
          <div className="securityMessage">
            <FaLock />
            <p>Your data is encrypted and stored locally</p>
          </div>
        </div>
      </div>
      <div className="appStatus">
        <div className="point"></div>
        <p className="status">SYSTEM OPERATIONAL</p>
      </div>
    </div>
  );
}
