import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./GoogleWalletModal.css";
import { IoIosAirplane } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";

interface GoogleWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue?: string;
  flightData?: any;
  passengerName?: string;
}

export default function GoogleWalletModal({
  isOpen,
  onClose,
  qrValue,
  flightData,
  passengerName,
}: GoogleWalletModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle animate out before actually unmounting
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 400); // Matches CSS animation duration
  };

  const handleAdd = () => {
    // Show success toast, then slide down and close
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose();
    }, 2000); // Display toast for 2 seconds before closing
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !isClosing && !showSuccess) return null;

  return (
    <div className={`gw-modal-overlay ${isOpen && !isClosing ? "open" : ""}`}>
      {/* Success Toast */}
      {showSuccess && (
        <div className="gw-toast">
          <div className="gw-toast-icon">✓</div>
          <span>Pass added to Google Wallet</span>
        </div>
      )}

      {/* Slide-up Container */}
      <div className={`gw-modal-container ${isClosing ? "slide-down" : "slide-up"}`}>
        {/* Modal Controls */}
        <div className="gw-modal-header">
          <button className="gw-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <span className="gw-modal-title">Add Pass</span>
          <button className="gw-btn-add" onClick={handleAdd}>
            Add
          </button>
        </div>

        {/* The Pass (Simulated) */}
        <div className="gw-pass-card">
          {/* Card Header */}
          <div className="gw-card-header">
            <div className="gw-card-brand">
              <span className="gw-brand-logo"><FcGoogle size={24} /></span>
              <span className="gw-brand-name">AeroID</span>
            </div>
            <IoIosAirplane className="gw-card-icon" />
          </div>

          {/* Card Body */}
          <div className="gw-card-body">
            <div className="gw-route-row">
              <div className="gw-route-point">
                <h1>{flightData?.departure?.substring(0, 3).toUpperCase() || "JFK"}</h1>
                <p>{flightData?.departure || "New York"}</p>
              </div>
              <div className="gw-route-icon">
                <IoIosAirplane />
              </div>
              <div className="gw-route-point text-right">
                <h1>{flightData?.arrival?.substring(0, 3).toUpperCase() || "LHR"}</h1>
                <p>{flightData?.arrival || "London"}</p>
              </div>
            </div>

            <div className="gw-details-row">
              <div className="gw-detail-item">
                <label>PASSENGER</label>
                <span>{passengerName || "N/A"}</span>
              </div>
              <div className="gw-detail-item text-right">
                <label>FLIGHT</label>
                <span>{flightData?.flightId || "N/A"}</span>
              </div>
            </div>

            <div className="gw-details-grid">
              <div className="gw-detail-item">
                <label>DATE</label>
                <span>{flightData?.flightDate || "N/A"}</span>
              </div>
              <div className="gw-detail-item">
                <label>BOARDING</label>
                <span>{flightData?.boardingHour || "N/A"}</span>
              </div>
              <div className="gw-detail-item">
                <label>GATE</label>
                <span>{flightData?.gate || "N/A"}</span>
              </div>
              <div className="gw-detail-item">
                <label>SEAT</label>
                <span>{flightData?.seat || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Card Footer (QR) */}
          <div className="gw-card-footer">
            <div className="gw-qr-container">
              {qrValue ? (
                <QRCode value={qrValue} size={180} level="M" />
              ) : (
                <div className="gw-qr-placeholder" />
              )}
            </div>
            <p className="gw-pass-hint">SMART BOARDING PASS</p>
          </div>
        </div>
      </div>
    </div>
  );
}