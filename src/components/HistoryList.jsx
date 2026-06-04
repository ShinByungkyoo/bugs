import React from "react";
import { Trash2, AlertTriangle, ShieldCheck, Flame, ShieldAlert, History, ArrowRight, Camera } from "lucide-react";

export default function HistoryList({ 
  historyList, 
  onDeleteHistoryItem, 
  onClearAllHistory, 
  onViewHistoryDetail,
  setActiveTab
}) {

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

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Header with Clear All Action */}
      <div className="history-header">
        <h2 style={{ fontSize: "20px", fontWeight: "800" }}>진단 기록</h2>
        {historyList.length > 0 && (
          <button 
            className="btn btn-secondary" 
            style={{ 
              padding: "6px 12px", 
              fontSize: "12px", 
              color: "var(--color-danger)",
              borderColor: "rgba(224, 122, 95, 0.2)",
              backgroundColor: "var(--color-danger-light)"
            }}
            onClick={onClearAllHistory}
          >
            <Trash2 size={12} />
            전체 삭제
          </button>
        )}
      </div>

      <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
        과거에 카메라나 갤러리를 통해 진단했던 내역들입니다.
      </p>

      {/* History Items Container */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {historyList.length > 0 ? (
          historyList.map((item) => {
            const risk = getRiskDetails(item.result.riskLevel);
            return (
              <div 
                key={item.id} 
                className="card history-card"
                onClick={() => onViewHistoryDetail(item)}
                style={{ cursor: "pointer" }}
              >
                {/* Saved Photo Thumbnail */}
                <div className="history-thumb">
                  <img src={item.image} alt={item.result.name} />
                </div>

                {/* Diagnostic Info */}
                <div className="history-info">
                  <div className="history-name-row">
                    <span className="history-name">{item.result.name}</span>
                    <span className={`badge ${risk.class}`} style={{ fontSize: "10px", padding: "2px 6px" }}>
                      {risk.icon}
                      <span style={{ marginLeft: "2px" }}>{risk.label}</span>
                    </span>
                  </div>
                  <div className="history-date">
                    {new Date(item.timestamp).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>

                {/* Delete button (stopPropagation to prevent viewing detail on click) */}
                <button 
                  className="history-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteHistoryItem(item.id);
                  }}
                  title="기록 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="card history-empty">
            <History size={48} />
            <h4 style={{ fontSize: "15px", fontWeight: "700" }}>진단 기록이 비어 있습니다</h4>
            <p style={{ fontSize: "12.5px", maxWidth: "240px", marginBottom: "8px" }}>
              아직 진단해본 벌레 사진이 없습니다. 카메라 스캐너를 통해 진단을 시작해보세요.
            </p>
            <button 
              className="btn btn-primary"
              style={{ fontSize: "13px", padding: "8px 16px" }}
              onClick={() => setActiveTab("scanner")}
            >
              <Camera size={14} />
              진단 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
