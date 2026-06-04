import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck, HelpCircle, HeartPulse, RefreshCw, History, Flame, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export default function AnalysisResult({ 
  image, 
  result, 
  isAnalyzing, 
  onRestartScan, 
  setActiveTab 
}) {
  const [activeSubTab, setActiveSubTab] = useState("info"); // "info", "combat", "prevention"
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const getPestEmoji = (id) => {
    switch (id) {
      case "cockroach": return "🪳";
      case "mosquito": return "🦟";
      case "bedbug": return "🪲";
      case "fruitfly": return "🪰";
      case "drugstore_beetle": return "🐞";
      default: return "🐛";
    }
  };

  const loadingMessages = [
    "해충 사진 분석 중...",
    "이미지 픽셀 매칭 중...",
    "AI 유전자 및 형태적 특징 파악 중...",
    "친환경 퇴치법 및 최적 가이드 설계 중...",
    "스캔 리포트 작성 완료하는 중..."
  ];

  // Rotate loading texts every 700ms
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (isAnalyzing || !result) {
    return (
      <div className="card analysis-status-card" style={{ animation: "fadeIn 0.3s ease-out" }}>
        {/* Holographic Laser Grid Scanner Preview while processing */}
        <div className="scanner-viewport" style={{ width: "100%", height: "240px" }}>
          {image && (
            <img 
              src={image} 
              alt="스캔 대상 이미지" 
              className="scanner-image-preview"
            />
          )}
          <div className="scanner-overlay">
            <div className="scanner-target-box">
              <div className="scanner-target-bottom"></div>
              <div className="scan-line"></div>
            </div>
          </div>
        </div>

        <div className="analysis-spinner"></div>
        <div className="analysis-status-text">
          {loadingMessages[loadingTextIndex]}
        </div>
        <div className="analysis-status-subtext">
          Gemini AI 기술을 사용하여 실시간으로 해충을 파악하고 있습니다. 잠시만 기다려 주세요.
        </div>
      </div>
    );
  }

  // Handle API connection errors gracefully
  if (result.isError) {
    return (
      <div style={{ animation: "fadeIn 0.4s ease-out" }}>
        <div className="card" style={{ borderColor: "var(--color-danger)", backgroundColor: "var(--color-danger-light)", padding: "24px", textAlign: "center" }}>
          <AlertTriangle size={48} style={{ color: "var(--color-danger)", marginBottom: "16px", display: "inline-block" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--color-danger)", marginBottom: "8px" }}>AI 분석 서비스 오류</h3>
          <p style={{ fontSize: "14px", color: "var(--color-text-main)", marginBottom: "16px", lineHeight: 1.5 }}>
            {result.description}
          </p>
          <div style={{ backgroundColor: "rgba(0,0,0,0.04)", padding: "12px", borderRadius: "8px", textAlign: "left", fontFamily: "monospace", fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "20px", wordBreak: "break-all" }}>
            <strong>상세 에러 원인:</strong> {result.errorMessage}
          </div>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={onRestartScan} style={{ flex: 1 }}>
              다시 시도
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                alert("루트 폴더의 .env 파일에 올바른 API 키를 등록하셨는지 확인해 주세요. 키를 수정한 후에는 백엔드 서버(Express)를 반드시 재시작해 주셔야 합니다.");
              }}
              style={{ flex: 1.5 }}
            >
              서버 설정 안내
            </button>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="card" style={{ marginTop: "16px", padding: "16px 20px" }}>
          <h4 style={{ fontSize: "14.5px", fontWeight: "700", marginBottom: "12px", color: "var(--color-primary)" }}>자가 진단 문제 해결</h4>
          <ul className="detail-list">
            <li className="detail-item" style={{ marginBottom: "10px" }}>
              <div className="detail-item-icon">1</div>
              <div className="detail-item-text" style={{ fontSize: "13px", lineHeight: 1.4 }}>
                <strong>서버 환경변수(.env) 확인:</strong> 루트 디렉토리에 있는 <code>.env</code> 파일을 열어 <code>GEMINI_API_KEY</code> 항목에 Google AI Studio에서 발급받은 올바른 API 키(일반적으로 <code>AIzaSy</code>로 시작함)를 정확하게 입력했는지 확인하세요.
              </div>
            </li>
            <li className="detail-item">
              <div className="detail-item-icon">2</div>
              <div className="detail-item-text" style={{ fontSize: "13px", lineHeight: 1.4 }}>
                <strong>백엔드 서버 재시작:</strong> <code>.env</code> 파일의 API 키를 수정한 경우에는 터미널에서 기존 실행 중인 백엔드 서버(Express) 프로세스를 중지(Ctrl+C)하고, <code>npm run server</code> 명령어로 백엔드를 <strong>반드시 재시작</strong>해 주셔야만 변경된 키가 적용됩니다.
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Get risk badge parameters
  const getRiskStyles = (level) => {
    switch (level) {
      case "danger":
        return {
          className: "danger",
          icon: <Flame size={32} />,
          badgeColor: "badge-danger",
          title: "위험 (Danger)"
        };
      case "warning":
        return {
          className: "warning",
          icon: <ShieldAlert size={32} />,
          badgeColor: "badge-warning",
          title: "경고 (Warning)"
        };
      case "mild":
        return {
          className: "mild",
          icon: <AlertTriangle size={32} />,
          badgeColor: "badge-mild",
          title: "주의 (Mild)"
        };
      default:
        return {
          className: "safe",
          icon: <ShieldCheck size={32} />,
          badgeColor: "badge-safe",
          title: "안전 (Safe)"
        };
    }
  };

  const risk = getRiskStyles(result.riskLevel);

  return (
    <div style={{ animation: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      {/* Demo Mode Notice Banner */}
      {result.isSampleDemo && (
        <div 
          className="card" 
          style={{ 
            borderColor: "var(--color-accent)", 
            backgroundColor: "var(--color-accent-light)", 
            padding: "12px 16px", 
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-accent)", fontWeight: "700", fontSize: "14px" }}>
            <AlertTriangle size={16} />
            <span>샘플 진단 데모 모드</span>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--color-text-main)", lineHeight: 1.4 }}>
            대시보드에서 선택하신 샘플 해충의 리포트를 로드했습니다. 직접 촬영하거나 업로드한 사진은 서버에 탑재된 API 키를 통해 실시간 AI 분석이 이루어집니다.
          </p>
        </div>
      )}

      {/* Result Hero Header Card */}
      <div className={`result-header-card ${risk.className}`} style={{ marginBottom: "20px" }}>
        <div 
          className="result-image-holder"
          style={result.isSampleDemo ? {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            fontSize: "56px"
          } : undefined}
        >
          {result.isSampleDemo ? (
            getPestEmoji(result.id)
          ) : (
            <img src={image || result.imageUrl} alt={result.name} />
          )}
        </div>
        <h2 className="result-name-kr">{result.name}</h2>
        <div className="result-name-sci">{result.scientificName || "Scientific Name Unknown"}</div>
        <span className={`badge ${risk.badgeColor}`} style={{ border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(4px)" }}>
          {risk.icon}
          <span>{risk.title}</span>
        </span>
      </div>

      {/* Quick Summary Description */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <p style={{ fontSize: "14px", lineHeight: "1.6", fontWeight: "500" }}>
          {result.description}
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="result-tabs">
        <button 
          className={`result-tab ${activeSubTab === "info" ? "result-tab-active" : ""}`}
          onClick={() => setActiveSubTab("info")}
        >
          해충 특징
        </button>
        <button 
          className={`result-tab ${activeSubTab === "combat" ? "result-tab-active" : ""}`}
          onClick={() => setActiveSubTab("combat")}
        >
          친환경 퇴치
        </button>
        <button 
          className={`result-tab ${activeSubTab === "prevention" ? "result-tab-active" : ""}`}
          onClick={() => setActiveSubTab("prevention")}
        >
          예방 요령
        </button>
      </div>

      {/* Tab Content Cards */}
      <div className="card" style={{ minHeight: "160px", marginBottom: "20px" }}>
        {activeSubTab === "info" && (
          <ul className="detail-list">
            {result.habits && result.habits.length > 0 ? (
              result.habits.map((habit, idx) => (
                <li key={idx} className="detail-item">
                  <div className="detail-item-icon">{idx + 1}</div>
                  <div className="detail-item-text">{habit}</div>
                </li>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>특징 정보를 제공하지 않습니다.</p>
            )}
          </ul>
        )}

        {activeSubTab === "combat" && (
          <ul className="detail-list">
            {result.combatGuide && result.combatGuide.length > 0 ? (
              result.combatGuide.map((step, idx) => (
                <li key={idx} className="detail-item">
                  <div className="detail-item-icon" style={{ backgroundColor: "rgba(226, 149, 120, 0.15)", color: "var(--color-accent)" }}>
                    {idx + 1}
                  </div>
                  <div className="detail-item-text">{step}</div>
                </li>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>퇴치 가이드를 제공하지 않습니다.</p>
            )}
          </ul>
        )}

        {activeSubTab === "prevention" && (
          <ul className="detail-list">
            {result.preventionGuide && result.preventionGuide.length > 0 ? (
              result.preventionGuide.map((step, idx) => (
                <li key={idx} className="detail-item">
                  <div className="detail-item-icon" style={{ backgroundColor: "var(--color-secondary-light)", color: "var(--color-primary)" }}>
                    {idx + 1}
                  </div>
                  <div className="detail-item-text">{step}</div>
                </li>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>예방 요령을 제공하지 않습니다.</p>
            )}
          </ul>
        )}
      </div>

      {/* Recommended Products/Active Ingredients */}
      {result.recommendProduct && result.id !== "unknown" && (
        <div className="product-recommend-box" style={{ marginBottom: "24px" }}>
          <Sparkles size={20} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 className="product-recommend-title">추천 친환경 대응 솔루션</h4>
            <p className="product-recommend-text">{result.recommendProduct}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button 
          className="btn btn-secondary" 
          onClick={onRestartScan}
          style={{ flex: 1 }}
        >
          <RefreshCw size={16} />
          다시 스캔
        </button>
        
        <button 
          className="btn btn-primary" 
          onClick={() => setActiveTab("history")}
          style={{ flex: 1 }}
        >
          <History size={16} />
          기록 확인
        </button>
      </div>
    </div>
  );
}
