import React, { useState, useEffect, useRef } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";

export default function CameraScanner({ onImageCaptured }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [facingMode, setFacingMode] = useState("environment"); // "user" or "environment"
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop current video stream
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Initialize camera
  const startCamera = async (mode = facingMode) => {
    setCameraLoading(true);
    setError(null);
    stopStream();

    try {
      const constraints = {
        video: {
          facingMode: mode === "environment" ? { ideal: "environment" } : "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.error("비디오 재생 오류:", e));
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("카메라 연결 실패:", err);
      setError("카메라에 접근할 수 없습니다. 권한이 거부되었거나 사용 중일 수 있습니다.");
      setIsCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  // Switch camera (front/back)
  const toggleCameraFacing = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  // Trigger when scanner mounts / starts
  useEffect(() => {
    startCamera();
    
    // Check for available media devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(deviceInfos => {
          const videoDevices = deviceInfos.filter(d => d.kind === "videoinput");
          setDevices(videoDevices);
        })
        .catch(err => console.error("디바이스 목록 조회 실패:", err));
    }

    return () => {
      stopStream();
    };
  }, []);

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement("canvas");
    // Match dimensions of video track
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack ? videoTrack.getSettings() : null;
    
    canvas.width = settings ? settings.width : videoRef.current.videoWidth || 640;
    canvas.height = settings ? settings.height : videoRef.current.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      stopStream();
      onImageCaptured(dataUrl);
    }
  };

  // Handle uploaded file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        stopStream();
        onImageCaptured(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>해충 진단 스캐너</h2>
      <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
        스캔 사각형 안에 해충이 잘 보이도록 초점을 맞춘 후 촬영해 주세요.
      </p>

      {/* Hidden File Input for triggers */}
      <input 
        type="file" 
        id="hidden-file-input"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Scanner Viewport */}
      <div className="scanner-viewport">
        {isCameraActive && !error ? (
          <>
            <video 
              ref={videoRef} 
              className="scanner-video" 
              autoPlay
              playsInline 
              muted
            />
            {/* Holographic Laser Grid Scanner Overlay */}
            <div className="scanner-overlay">
              <div className="scanner-target-box">
                <div className="scanner-target-bottom"></div>
                <div className="scan-line"></div>
              </div>
            </div>
          </>
        ) : (
          /* Camera Fallback UI (Upload Area) */
          <div 
            style={{ 
              width: "100%", 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "#FFF",
              padding: "24px",
              textAlign: "center",
              background: "linear-gradient(135deg, #18201B 0%, #0F1411 100%)"
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div 
              style={{ 
                width: "64px", 
                height: "64px", 
                borderRadius: "50%", 
                backgroundColor: "rgba(136, 176, 75, 0.15)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--color-secondary)",
                marginBottom: "16px",
                border: "1px dashed var(--color-secondary)",
                cursor: "pointer"
              }}
            >
              <Upload size={28} />
            </div>
            
            <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px" }}>사진 업로드 모드</h4>
            <p style={{ fontSize: "12px", color: "#95A59C", marginBottom: "16px", maxWidth: "240px" }}>
              {error ? "카메라 접근 차단으로 업로드로 대체합니다." : "데스크톱이나 모바일 갤러리의 해충 사진을 등록해 주세요."}
            </p>
            
            <button className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
              기기에서 사진 선택
            </button>
          </div>
        )}

        {/* Loading Spinner during switch */}
        {cameraLoading && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF"
          }}>
            <RefreshCw className="analysis-spinner" size={24} style={{ animation: "rotateSpinner 1s linear infinite" }} />
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="camera-controls">
        {/* Upload Fallback Button when camera is active */}
        {isCameraActive && (
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={() => fileInputRef.current?.click()}
            title="갤러리에서 파일 가져오기"
          >
            <ImageIcon size={20} />
          </button>
        )}

        {/* Capture Button */}
        {isCameraActive ? (
          <button className="capture-btn" onClick={capturePhoto} title="사진 촬영">
            <div className="capture-inner"></div>
          </button>
        ) : (
          /* Restart Camera Button if camera is failed or inactive */
          <button 
            className="btn btn-primary" 
            onClick={() => startCamera()}
            style={{ width: "160px" }}
          >
            <RefreshCw size={16} />
            카메라 다시 켜기
          </button>
        )}

        {/* Camera Face Swapping Button if multiple cameras exist */}
        {isCameraActive && devices.length > 1 && (
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={toggleCameraFacing}
            title="전/후면 카메라 전환"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="card" style={{ marginTop: "24px", display: "flex", gap: "10px", padding: "14px" }}>
        <Sparkles size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
          주변 조명을 밝게 하고, 벌레의 몸체가 뚜렷하게 보이도록 약 15cm 거리에서 흔들림 없이 찍어야 식별 성공률이 높아집니다.
        </p>
      </div>
    </div>
  );
}
