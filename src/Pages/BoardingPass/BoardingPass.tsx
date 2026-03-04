import "./BoardingPass.css";
import { IoFingerPrintOutline } from "react-icons/io5";
import { IoIosAirplane } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function BoardingPass() {
  const location = useLocation();
  const [qrValue, setQrValue] = useState<string>();

  useEffect(() => {
    setTimeout(() => {
      setQrValue(location.state?.qrCode);
    }, 0);
  }, []);

  return (
    <div className="pass">
      <div className="passHeader">
        <IoFingerPrintOutline className="logo" />
        <h2 className="passTitle">AeroID</h2>
      </div>
      <div className="passContainer">
        <div className="info">
          <div className="date">
            <div>
              <label className="infoLabel">BOARDING PASS</label>
              <h2>RO 593</h2>
            </div>
            <div>
              <label className="infoLabel">DATE</label>
              <h2 className="date">Jan 26</h2>
            </div>
          </div>
          <div className="destination">
            <div className="location">
              <h1 className="cutNamed">OMR</h1>
              <p className="fullName">Oradea</p>
            </div>
            <div className="plane">
              <div className="planeComp">
                <IoIosAirplane className="planeIcn" />
                <p>1h 35m</p>
              </div>
            </div>
            <div className="location">
              <h1 className="cutNamed">OTP</h1>
              <p className="fullName">Bucharest</p>
            </div>
          </div>
          <div className="airportInfo">
            <div className="infomations">
              <label className="infomationsLabel">BOARDING</label>
              <p className="infomationsData">10: 45 AM</p>
            </div>
            <div className="infomations">
              <label className="infomationsLabel">GATE</label>
              <p className="infomationsData">G4</p>
            </div>
            <div className="infomations">
              <label className="infomationsLabel">SEAT</label>
              <p className="infomationsData">12A</p>
            </div>
          </div>
        </div>
        <div className="mainPass">
          <div className="names">
            <p className="status">PASSENGER</p>
            <h2 className="name">Laza Lukas</h2>
          </div>
          <div className="code">{qrValue && <QRCode value={qrValue} />}</div>
          <div className="security">
            <MdLockOutline />
            <p>Identity Encrypted</p>
          </div>
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
}
