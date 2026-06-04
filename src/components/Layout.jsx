import React from "react";
import { Leaf, Sun, Moon, Home, Camera, BookOpen, History } from "lucide-react";

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  isDark, 
  setIsDark 
}) {
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-logo" onClick={() => setActiveTab("dashboard")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img 
            src="/wecheck.png" 
            alt="WeCheck Logo" 
            className="header-logo"
            style={{ height: "30px", width: "auto" }} 
          />
        </div>
        
        <div className="app-header-actions">
          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={toggleTheme}
            style={{ width: "32px", height: "32px" }}
            aria-label="테마 변경"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="app-nav">
        <button 
          className={`nav-item ${activeTab === "dashboard" ? "nav-item-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <Home size={20} />
          <span>홈</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "scanner" ? "nav-item-active" : ""}`}
          onClick={() => setActiveTab("scanner")}
        >
          <Camera size={20} />
          <span>스캐너</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "encyclopedia" ? "nav-item-active" : ""}`}
          onClick={() => setActiveTab("encyclopedia")}
        >
          <BookOpen size={20} />
          <span>해충도감</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "history" ? "nav-item-active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <History size={20} />
          <span>기록</span>
        </button>
      </nav>
    </>
  );
}
