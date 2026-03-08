import { useState, useRef, useCallback } from "react";
import "./PhotoUpload.css";
import { useNavigate, useLocation } from "react-router-dom";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FaArrowRight, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export default function PhotoUpload() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const passengerName: string = state?.name || "";
  const passengerFlight: string = state?.flight || "";

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    // Nicio validare pe nume, acceptă orice imagine
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const clearPhoto = () => {
    setPreview(null);
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Please select a photo before continuing.");
      return;
    }
    navigate("/AeroID/Scanner", {
      state: {
        name: passengerName,
        flight: passengerFlight,
      },
    });
  };

  return (
    <div className="photoUpload">
      <div className="pu-header">
        <GiAirplaneDeparture className="pu-icon" />
        <h1 className="pu-title">Upload Your Photo</h1>
        <p className="pu-subtext">
          Provide a clear, front-facing photo to link <br />
          your biometric identity to your flight.
        </p>
      </div>

      {passengerName && (
        <div className="pu-badge">
          <MdOutlinePersonOutline className="pu-badge-icon" />
          <span className="pu-badge-name">{passengerName}</span>
          <span className="pu-badge-dot">·</span>
          <span className="pu-badge-flight">{passengerFlight}</span>
        </div>
      )}

      <div className="pu-card">
        {!preview ? (
          <div
            className={`pu-dropzone ${dragging ? "pu-dropzone--active" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <div className="pu-dropzone-inner">
              <div className="pu-upload-icon-wrap">
                <FaCloudUploadAlt className="pu-upload-icon" />
              </div>
              <p className="pu-dropzone-title">
                {dragging ? "Drop it here!" : "Drop your photo here"}
              </p>
              <p className="pu-dropzone-sub">
                or <span className="pu-browse-link">browse files</span>
              </p>
              <p className="pu-dropzone-hint">JPEG, PNG, WEBP · Max 10 MB</p>
            </div>
          </div>
        ) : (
          <div className="pu-preview-wrap">
            <div className="pu-preview-img-container">
              <img src={preview} alt="Selected" className="pu-preview-img" />
              <div className="pu-preview-badge">
                <FaCheck className="pu-check-icon" />
              </div>
              <button className="pu-remove-btn" onClick={clearPhoto} title="Remove photo">
                <IoClose />
              </button>
            </div>
            <p className="pu-preview-name">{file?.name}</p>
            <button className="pu-change-btn" onClick={() => fileInputRef.current?.click()}>
              Change photo
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />

        {error && <div className="pu-error">{error}</div>}

        <div className="pu-actions">
          <button
            className={`pu-submit-btn ${!file ? "pu-submit-btn--disabled" : ""}`}
            onClick={handleSubmit}
            disabled={!file}
          >
            Continue to Scanner <FaArrowRight className="pu-btn-arrow" />
          </button>
        </div>

        <div className="pu-footer-note">
          <span className="pu-lock-dot" />
          <span className="pu-lock-text">Your biometric data is encrypted end-to-end</span>
        </div>
      </div>
    </div>
  );
}
