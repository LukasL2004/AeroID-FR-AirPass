import { useEffect, useRef, useState } from "react";
import "./Scanner.css";
import { IoCameraReverse } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { LuScanFace } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { IoMdCamera } from "react-icons/io";
import type { enroll } from "../../Services/Interfaces/EnrollInterface";
import enrollAPI from "../../Services/Impl/EnrollService";
export default function Scanner() {
  const [footer, setFooter] = useState<boolean>(true);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);

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
      navigate("/AeroId/BoardingPass");
    } catch (e) {
      console.log(e);
    }
  };

  const takePhoto = () => {
    const width = 1000;
    const height = width / (16 / 27);

    const video = videoRef.current;
    const photo = photoRef.current;

    if (!photo || !video) return;

    photo.width = width;
    photo.height = height;

    const ctx = photo.getContext("2d");
    ctx?.drawImage(video, 0, 0, width, height);
    console.log("photo");

    photo.toBlob(
      async (blob) => {
        if (!blob) {
          console.log("An error occured while creating the blob");
          return;
        }
        const data = {
          photo: blob,
          name: "Lukas Laza",
          flight: "RO409",
        };

        await enrollData(data);
        console.log("yupiii");
      },
      "image/jpg",
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
      {footer && (
        <div className="scannerFooter">
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
      )}
      <div className="photoBtn">
        <IoMdCamera onClick={takePhoto} className="photoIcon" />
      </div>
      <canvas ref={photoRef} style={{ display: "none" }}></canvas>
    </div>
  );
}
