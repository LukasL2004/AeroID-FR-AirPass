import "./BoardingPass.css";
import { IoFingerPrintOutline } from "react-icons/io5";
import { IoIosAirplane } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import QRCode from "react-qr-code";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import enrollAPI from "../../Services/Impl/EnrollService";
import { toPng } from "html-to-image";
import AppleWalletModal from "../../Components/AppleWalletModal/AppleWalletModal";
import GoogleWalletModal from "../../Components/GoogleWalletModal/GoogleWalletModal";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineDownload } from "react-icons/hi";

export default function BoardingPass() {
  const location = useLocation();
  const [qrValue, setQrValue] = useState<string>();
  const [flightData, setFlightData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrExpanded, setQrExpanded] = useState<boolean>(false);
  const [appleWalletOpen, setAppleWalletOpen] = useState(false);
  const [googleWalletOpen, setGoogleWalletOpen] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const passRef = useRef<HTMLDivElement>(null);

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

  const handleSaveImage = async () => {
    if (!passRef.current) return;
    
    setIsSavingImage(true);
    
    // Ascundem butoanele de wallet si galerie inainte de screenshot
    const buttonsContainer = document.querySelector('.wallet-buttons-container') as HTMLElement;
    if (buttonsContainer) {
      buttonsContainer.style.display = 'none';
      buttonsContainer.style.opacity = '0'; // Extra precaution
    }

    try {
      // html-to-image natively renders exactly what the browser shows (SVGs, blur, gradients)
      const dataUrl = await toPng(passRef.current, { 
        cacheBust: true,
        pixelRatio: 2 // for high-quality export
      });
      
      const link = document.createElement("a");
      link.download = flightData?.flightId ? `AeroID-BoardingPass-${flightData.flightId}.png` : "AeroID-BoardingPass.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to save high-fidelity image", error);
    } finally {
      // Restore buttons layout immediately after processing
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.opacity = '1';
      }
      setIsSavingImage(false);
    }
  };

  if (loading) {
    return <div className="pass"><h2 style={{color: "white", textAlign: "center", marginTop: "50%"}}>Loading your pass...</h2></div>;
  }

  return (
    <div className="pass-page-wrapper">
    <div className="pass" ref={passRef}>
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

          <div className="wallet-buttons-container" data-html2canvas-ignore="true">
            <div className="wallet-buttons-row">
                <button className="apple-wallet-btn" onClick={() => setAppleWalletOpen(true)}>
                    <FaApple className="wallet-icon" />
                    <span>Add to Apple Wallet</span>
                </button>
                <button className="google-wallet-btn" onClick={() => setGoogleWalletOpen(true)}>
                    <FcGoogle className="wallet-icon" />
                    <span>Add to Google Wallet</span>
                </button>
            </div>
            
            <button 
                className={`save-gallery-btn ${isSavingImage ? 'saving' : ''}`}
                onClick={handleSaveImage}
                disabled={isSavingImage}
            >
                <HiOutlineDownload className="gallery-icon" />
                <span>{isSavingImage ? "Saving Image..." : "Save Image to Gallery"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="footer"></div>
    </div>

    <AppleWalletModal 
        isOpen={appleWalletOpen} 
        onClose={() => setAppleWalletOpen(false)} 
        flightData={flightData}
        qrValue={qrValue}
    />
    
    <GoogleWalletModal 
        isOpen={googleWalletOpen} 
        onClose={() => setGoogleWalletOpen(false)} 
        flightData={flightData}
        qrValue={qrValue}
    />
    </div>
  );
}
