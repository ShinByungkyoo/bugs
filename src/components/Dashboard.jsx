import React, { useMemo } from "react";
import { pestsData, preventionTips } from "../utils/pestsData";
import { Camera, Upload, AlertCircle, Play, Info } from "lucide-react";

export default function Dashboard({ setActiveTab, onStartDemoScan }) {
  // Get tip of the day based on date
  const dailyTip = useMemo(() => {
    const today = new Date();
    const index = today.getDate() % preventionTips.length;
    return preventionTips[index];
  }, []);

  // Filter 3 popular pests for quick testing
  const samplePests = useMemo(() => {
    return pestsData.filter(p => ["cockroach", "mosquito", "bedbug"].includes(p.id));
  }, []);

  const getRiskClass = (level) => {
    switch (level) {
      case "danger": return "badge-danger";
      case "warning": return "badge-warning";
      case "mild": return "badge-mild";
      default: return "badge-safe";
    }
  };

  const getPestEmoji = (id) => {
    switch (id) {
      case "cockroach": return "🪳";
      case "mosquito": return "🦟";
      case "bedbug": return "🪲"; // closest emoji for bedbug
      case "fruitfly": return "🪰";
      default: return "🐛";
    }
  };

  const getPestNameKo = (id) => {
    switch (id) {
      case "cockroach": return "바퀴벌레";
      case "mosquito": return "모기";
      case "bedbug": return "빈대";
      default: return "해충";
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>안심하는 친환경 공간,<br />EcoPest와 함께 만드세요</h2>
        <p>집안이나 야외에서 만난 해충, 당황하지 말고 사진을 찍어보세요. 인공지능이 정확히 식별하고 조치법을 안내해 드립니다.</p>
      </div>

      {/* Daily Eco Tip */}
      <div className="card tip-card">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="tip-title">오늘의 친환경 예방 가이드</div>
          <div className="tip-content">{dailyTip}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="section-title" style={{ marginTop: "8px" }}>
        <Camera size={18} style={{ color: "var(--color-primary)" }} />
        <span>해충 진단하기</span>
      </h3>
      
      <div className="quick-scan-section">
        <button className="quick-scan-btn" onClick={() => setActiveTab("scanner")}>
          <Camera size={28} />
          <span className="quick-scan-label">카메라 촬영</span>
        </button>
        
        <button 
          className="quick-scan-btn" 
          onClick={() => {
            setActiveTab("scanner");
            // We will let App state know we want file selector triggered
            setTimeout(() => {
              const fileInput = document.getElementById("hidden-file-input");
              if (fileInput) fileInput.click();
            }, 100);
          }}
        >
          <Upload size={28} />
          <span className="quick-scan-label">갤러리 업로드</span>
        </button>
      </div>

      {/* Sample Pests for Quick Testing */}
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "8px" }}>
        <h3 className="section-title" style={{ margin: 0 }}>
          <Play size={18} style={{ color: "var(--color-primary)" }} />
          <span>샘플로 즉시 진단 체험</span>
        </h3>
      </div>
      
      <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "12px" }}>
        스캐닝 및 상세 분석 리포트를 미리 체험할 수 있는 데모 기능입니다.
      </p>

      <div className="sample-grid">
        {samplePests.map((pest) => (
          <div 
            key={pest.id} 
            className="sample-card" 
            onClick={() => onStartDemoScan(pest.id)}
            title={`${pest.name} 스캔 시뮬레이션 시작`}
          >
            <div className="sample-avatar">
              {getPestEmoji(pest.id)}
            </div>
            <div className="sample-name">{pest.name}</div>
            <span className={`sample-badge ${getRiskClass(pest.riskLevel)}`}>
              {pest.riskLevel === "danger" ? "위험" : "경고"}
            </span>
          </div>
        ))}
      </div>

      {/* Extra Eco Info Card */}
      <div className="card" style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px", marginTop: "4px" }}>
        <AlertCircle size={20} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>화학 약품은 최소한으로!</h4>
          <p style={{ fontSize: "12.5px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            에코페스트는 가급적 유독성 화학 살충제의 남용을 줄이고 물리적인 트랩 설치 및 환경 정비를 통한 자연 친화적 해충 근절 방식을 지향합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
