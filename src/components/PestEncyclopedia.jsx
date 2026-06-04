import React, { useState, useMemo } from "react";
import { pestsData } from "../utils/pestsData";
import { Search, X, BookOpen, Flame, ShieldAlert, AlertTriangle, ShieldCheck, Play } from "lucide-react";

export default function PestEncyclopedia({ onStartDemoScan }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("all");
  const [selectedPest, setSelectedPest] = useState(null);

  // Filter logic
  const filteredPests = useMemo(() => {
    return pestsData.filter((pest) => {
      const matchesSearch = 
        pest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        pest.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = 
        selectedRiskFilter === "all" || 
        pest.riskLevel === selectedRiskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [searchQuery, selectedRiskFilter]);

  const getRiskDetails = (level) => {
    switch (level) {
      case "danger":
        return {
          class: "badge-danger",
          label: "위험",
          icon: <Flame size={12} />
        };
      case "warning":
        return {
          class: "badge-warning",
          label: "경고",
          icon: <ShieldAlert size={12} />
        };
      case "mild":
        return {
          class: "badge-mild",
          label: "주의",
          icon: <AlertTriangle size={12} />
        };
      default:
        return {
          class: "badge-safe",
          label: "안전",
          icon: <ShieldCheck size={12} />
        };
    }
  };

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

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>해충 백과사전</h2>
      <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
        가정이나 일상에서 자주 만나는 해충들의 특징과 퇴치법을 찾아보세요.
      </p>

      {/* Search Input */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="해충 이름 또는 학명 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="filter-pills">
        <button 
          className={`filter-pill ${selectedRiskFilter === "all" ? "filter-pill-active" : ""}`}
          onClick={() => setSelectedRiskFilter("all")}
        >
          전체
        </button>
        <button 
          className={`filter-pill ${selectedRiskFilter === "danger" ? "filter-pill-active" : ""}`}
          onClick={() => setSelectedRiskFilter("danger")}
        >
          위험
        </button>
        <button 
          className={`filter-pill ${selectedRiskFilter === "warning" ? "filter-pill-active" : ""}`}
          onClick={() => setSelectedRiskFilter("warning")}
        >
          경고
        </button>
        <button 
          className={`filter-pill ${selectedRiskFilter === "mild" ? "filter-pill-active" : ""}`}
          onClick={() => setSelectedRiskFilter("mild")}
        >
          주의
        </button>
      </div>

      {/* Encyclopedia List */}
      <div className="encyclopedia-list">
        {filteredPests.length > 0 ? (
          filteredPests.map((pest) => {
            const risk = getRiskDetails(pest.riskLevel);
            return (
              <div 
                key={pest.id} 
                className="card encyclopedia-card" 
                onClick={() => setSelectedPest(pest)}
                style={{ cursor: "pointer" }}
              >
                <div className="encyclopedia-thumb">
                  {getPestEmoji(pest.id)}
                </div>
                
                <div className="encyclopedia-info">
                  <div className="encyclopedia-title-row">
                    <span className="encyclopedia-name">{pest.name}</span>
                    <span className={`badge ${risk.class}`} style={{ fontSize: "11px", padding: "3px 8px" }}>
                      {risk.icon}
                      <span style={{ marginLeft: "2px" }}>{risk.label}</span>
                    </span>
                  </div>
                  <div className="encyclopedia-sci">{pest.scientificName}</div>
                  <div className="encyclopedia-desc">{pest.description}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-muted)" }}>
            <BookOpen size={48} style={{ opacity: 0.2, marginBottom: "12px" }} />
            <p>검색 결과와 매칭되는 해충 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Detail Bottom Sheet Modal */}
      {selectedPest && (
        <div className="modal-backdrop" onClick={() => setSelectedPest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedPest.name} 상세 정보</h3>
              <button 
                className="btn btn-secondary btn-icon" 
                style={{ width: "32px", height: "32px" }}
                onClick={() => setSelectedPest(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                <div className="encyclopedia-thumb" style={{ width: "72px", height: "72px", fontSize: "36px" }}>
                  {getPestEmoji(selectedPest.id)}
                </div>
                <div>
                  <h4 style={{ fontSize: "20px", fontWeight: "800" }}>{selectedPest.name}</h4>
                  <p style={{ fontSize: "13px", color: "var(--color-text-muted)", fontStyle: "italic", marginBottom: "4px" }}>
                    {selectedPest.scientificName}
                  </p>
                  <span className={`badge ${getRiskDetails(selectedPest.riskLevel).class}`}>
                    {getRiskDetails(selectedPest.riskLevel).icon}
                    <span style={{ marginLeft: "4px" }}>{getRiskDetails(selectedPest.riskLevel).label} 수준</span>
                  </span>
                </div>
              </div>

              <div className="card" style={{ padding: "14px 18px", marginBottom: "16px", backgroundColor: "var(--color-primary-light)", border: "none" }}>
                <p style={{ fontSize: "13.5px", lineHeight: "1.5", color: "var(--color-text-main)" }}>
                  {selectedPest.description}
                </p>
              </div>

              {/* Detail Items */}
              <div style={{ marginBottom: "16px" }}>
                <h5 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "var(--color-primary)" }}>주요 습성 및 출현 위치</h5>
                <ul className="detail-list">
                  {selectedPest.habits.map((item, idx) => (
                    <li key={idx} className="detail-item" style={{ marginBottom: "6px" }}>
                      <div className="detail-item-icon">{idx + 1}</div>
                      <div className="detail-item-text" style={{ fontSize: "13px" }}>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h5 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "var(--color-accent)" }}>친환경 퇴치법</h5>
                <ul className="detail-list">
                  {selectedPest.combatGuide.map((item, idx) => (
                    <li key={idx} className="detail-item" style={{ marginBottom: "6px" }}>
                      <div className="detail-item-icon" style={{ backgroundColor: "rgba(226,149,120,0.12)", color: "var(--color-accent)" }}>{idx + 1}</div>
                      <div className="detail-item-text" style={{ fontSize: "13px" }}>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h5 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "var(--color-safe)" }}>예방 요령</h5>
                <ul className="detail-list">
                  {selectedPest.preventionGuide.map((item, idx) => (
                    <li key={idx} className="detail-item" style={{ marginBottom: "6px" }}>
                      <div className="detail-item-icon" style={{ backgroundColor: "var(--color-safe-light)", color: "var(--color-safe)" }}>{idx + 1}</div>
                      <div className="detail-item-text" style={{ fontSize: "13px" }}>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Run Scan Demo from Modal */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setSelectedPest(null)}
                >
                  닫기
                </button>
                
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1.5 }}
                  onClick={() => {
                    setSelectedPest(null);
                    onStartDemoScan(selectedPest.id);
                  }}
                >
                  <Play size={16} />
                  이 해충으로 스캔 데모
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
