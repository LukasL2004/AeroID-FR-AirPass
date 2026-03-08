import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./AppleWalletModal.css";
import { IoIosAirplane } from "react-icons/io";

interface AppleWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue?: string;
  flightData?: any;
  passengerName?: string;
}

export default function AppleWalletModal({
  isOpen,
  onClose,
  qrValue,
  flightData,
  passengerName,
}: AppleWalletModalProps) {
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
    <div className={`aw-modal-overlay ${isOpen && !isClosing ? "open" : ""}`}>
      {/* Success Toast */}
      {showSuccess && (
        <div className="aw-toast">
          <div className="aw-toast-icon">✓</div>
          <span>Pass added to Apple Wallet</span>
        </div>
      )}

      {/* Slide-up Container */}
      <div className={`aw-modal-container ${isClosing ? "slide-down" : "slide-up"}`}>
        {/* Modal Controls */}
        <div className="aw-modal-header">
          <button className="aw-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <span className="aw-modal-title">Add Pass</span>
          <button className="aw-btn-add" onClick={handleAdd}>
            Add
          </button>
        </div>

        {/* The Pass (Simulated) */}
        <div className="aw-pass-card">
          {/* Card Header */}
          <div className="aw-card-header">
            <div className="aw-card-brand">
              <span className="aw-brand-logo">✈</span>
              <span className="aw-brand-name">AeroID</span>
            </div>
            <IoIosAirplane className="aw-card-icon" />
          </div>

          {/* Card Body */}
          <div className="aw-card-body">
            <div className="aw-route-row">
              <div className="aw-route-point">
                <h1>{flightData?.departure?.substring(0, 3).toUpperCase() || "JFK"}</h1>
                <p>{flightData?.departure || "New York"}</p>
              </div>
              <div className="aw-route-icon">
                <IoIosAirplane />
              </div>
              <div className="aw-route-point text-right">
                <h1>{flightData?.arrival?.substring(0, 3).toUpperCase() || "LHR"}</h1>
                <p>{flightData?.arrival || "London"}</p>
              </div>
            </div>

            <div className="aw-details-row">
              <div className="aw-detail-item">
                <label>PASSENGER</label>
                <span>{passengerName || "N/A"}</span>
              </div>
              <div className="aw-detail-item text-right">
                <label>FLIGHT</label>
                <span>{flightData?.flightId || "N/A"}</span>
              </div>
            </div>

            <div className="aw-details-grid">
              <div className="aw-detail-item">
                <label>DATE</label>
                <span>{flightData?.flightDate || "N/A"}</span>
              </div>
              <div className="aw-detail-item">
                <label>BOARDING</label>
                <span>{flightData?.boardingHour || "N/A"}</span>
              </div>
              <div className="aw-detail-item">
                <label>GATE</label>
                <span>{flightData?.gate || "N/A"}</span>
              </div>
              <div className="aw-detail-item">
                <label>SEAT</label>
                <span>{flightData?.seat || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Card Footer (QR) */}
          <div className="aw-card-footer">
            <div className="aw-qr-container">
              {qrValue ? (
                <QRCode value={qrValue} size={180} level="M" />
              ) : (
                <div className="aw-qr-placeholder" />
              )}
            </div>
            <p className="aw-pass-hint">SMART BOARDING PASS</p>
          </div>
        </div>
      </div>
    </div>
  );
}