import "./BoardingPass.css";
import { IoFingerPrintOutline } from "react-icons/io5";
import { IoIosAirplane } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import enrollAPI from "../../Services/Impl/EnrollService";

export default function BoardingPass() {
  const location = useLocation();
  const [qrValue, setQrValue] = useState<string>();
  const [flightData, setFlightData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrExpanded, setQrExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchInfo = async () => {
      const { name, flight, qrCode } = location.state || {};
      if (qrCode) setQrValue(qrCode);

      if (name && flight) {
        try {
          const data = await enrollAPI.enrollVerify({ name, flight });
          setFlightData(data);
        } catch (error) {
          console.error("Failed to fetch flight info for boarding pass", error);
        }
      }
      setLoading(false);
    };

    fetchInfo();
  }, [location.state]);

  if (loading) {
    return <div className="pass"><h2 style={{color: "white", textAlign: "center", marginTop: "50%"}}>Loading your pass...</h2></div>;
  }

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
              <h2>{flightData?.flightId || "N/A"}</h2>
            </div>
            <div>
              <label className="infoLabel">DATE</label>
              <h2 className="date">{flightData?.flightDate || "N/A"}</h2>
            </div>
          </div>
          <div className="destination">
            <div className="location">
              <h1 className="cutNamed">{flightData?.departure?.substring(0,3).toUpperCase() || "N/A"}</h1>
              <p className="fullName">{flightData?.departure || "N/A"}</p>
            </div>
            <div className="plane">
              <div className="planeComp">
                <IoIosAirplane className="planeIcn" />
                <p>{flightData?.flightTime || "1h 35m"}</p>
              </div>
            </div>
            <div className="location">
              <h1 className="cutNamed">{flightData?.arrival?.substring(0,3).toUpperCase() || "N/A"}</h1>
              <p className="fullName">{flightData?.arrival || "N/A"}</p>
            </div>
          </div>
          <div className="airportInfo">
            <div className="infomations">
              <label className="infomationsLabel">BOARDING</label>
              <p className="infomationsData">{flightData?.boardingHour || "N/A"}</p>
            </div>
            <div className="infomations">
              <label className="infomationsLabel">GATE</label>
              <p className="infomationsData">{flightData?.gate || "N/A"}</p>
            </div>
            <div className="infomations">
              <label className="infomationsLabel">SEAT</label>
              <p className="infomationsData">{flightData?.seat || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="mainPass">
          <div className="names">
            <p className="status">PASSENGER</p>
            <h2 className="name">
              {(flightData?.passengerName || location.state?.name || "N/A")
                .split(' ')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')}
            </h2>
          </div>
          <div className="code" onClick={() => qrValue && setQrExpanded(true)} style={{ cursor: qrValue ? 'pointer' : 'default' }} title="Click to expand">
            {qrValue && <QRCode value={qrValue} />}
          </div>
          {qrValue && <span className="qr-hint">Tap to zoom</span>}

          {qrExpanded && (
            <div className="qr-overlay" onClick={() => setQrExpanded(false)}>
              <div className="qr-modal" onClick={e => e.stopPropagation()}>
                <QRCode value={qrValue!} size={260} />
                <button className="qr-close" onClick={() => setQrExpanded(false)}>✕ Close</button>
              </div>
            </div>
          )}
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
