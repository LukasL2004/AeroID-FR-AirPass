import { useEffect, useRef, useState } from "react";
import "./Scanner.css";
import { IoCameraReverse } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { LuScanFace } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdCamera } from "react-icons/io";
import type { enroll } from "../../Services/Interfaces/EnrollInterface";
import enrollAPI from "../../Services/Impl/EnrollService";

export default function Scanner() {
  const [footer, setFooter] = useState<boolean>(true);
  // NOU: Starea de loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);

  const { state } = useLocation();
  const passengerName = state?.name || "";
  const passengerFlight = state?.flight || "";

  const GetVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      .then((stream) => {
        const video = videoRef.current;

        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const enrollData = async (formData: enroll) => {
    try {
      const response = await enrollAPI.enroll(formData);
      console.log(response);
      navigate("/AeroId/BoardingPass", { 
        state: { 
          qrCode: response.token,
          name: passengerName,
          flight: passengerFlight
        } 
      });
    } catch (e) {
      console.log(e);
      // NOU: Oprire loading in caz de eroare
      setIsLoading(false);
    }
  };

  const takePhoto = () => {
    // NOU: Pornire loading
    setIsLoading(true);

    const width = 1000;
    const height = width / (16 / 27);

    const video = videoRef.current;
    const photo = photoRef.current;

    if (!photo || !video) {
      setIsLoading(false);
      return;
    }

    photo.width = width;
    photo.height = height;

    const ctx = photo.getContext("2d");
    ctx?.drawImage(video, 0, 0, width, height);
    console.log("photo");

    photo.toBlob(
      async (blob) => {
        if (!blob) {
          console.log("An error occured while creating the blob");
          setIsLoading(false);
          return;
        }

        console.log("====== INFO POZA ======");
        console.log("Marime poza:", (blob.size / 1024).toFixed(2), "KB");
        console.log("Tip poza:", blob.type);
        console.log("=======================");

        const data = {
          photo: blob,
          name: passengerName,
          flight: passengerFlight,
        };

        await enrollData(data);
        console.log("yupiii");
      },
      "image/jpeg", // Modificat în jpeg pentru siguranță
      0.9,
    );
  };

  useEffect(() => {
    GetVideo();
  }, [videoRef]);

  const toLogin = () => {
    navigate("/AeroId/Login");
  };

  return (
    <div className="scanner">
      {/* OVERLAY LOADING */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="fullscreen-spinner">
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
            <div className="fs-dot"></div>
          </div>
          <p>Processing Data...</p>
        </div>
      )}

      <div className="scannerHeader">
        <div onClick={toLogin} className="closeBtn hdElement">
          <IoCloseSharp />
        </div>
        <div className="scanState hdElement">
          <div className="point"></div>
          <div className="scanStatus">ENCRYPTED LIVE LINK</div>
        </div>
        <div className="revCamera hdElement">
          <IoCameraReverse />
        </div>
      </div>
      <div className="scannerMain">
        <div className="videoContainer" style={{ position: "relative" }}>
          <video ref={videoRef} className="screen" playsInline muted />
          <div className="face"></div>
        </div>
      </div>
      <div className={`scannerFooter ${!footer ? 'footer-hidden' : ''}`}>
          <div
            className="line"
            onClick={() => {
              setFooter(false);
            }}
          ></div>
          <div className="footerHelper">
            <h2>Position your face</h2>
            <p>
              Align your head with the guide above. Ensure your eyes are clearly
              visible and avoid wearing masks or heavy eyewear.
            </p>
          </div>
          <div className="footerImg">
            <LuScanFace />
          </div>
          <ul className="footerCredentials">
            <li>Secure</li>
            <li>Decentralized</li>
            <li>AeroId verified</li>
          </ul>
        </div>
      <div className={`photoBtn ${footer ? 'photoBtn-hidden' : ''}`}>
        <IoMdCamera onClick={takePhoto} className="photoIcon" />
      </div>
      <canvas ref={photoRef} style={{ opacity: 0, position: "absolute", zIndex: -1 }}></canvas>
    </div>
  );
}
