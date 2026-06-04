import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CameraScanner from "./components/CameraScanner";
import AnalysisResult from "./components/AnalysisResult";
import PestEncyclopedia from "./components/PestEncyclopedia";
import HistoryList from "./components/HistoryList";
import { identifyPest } from "./utils/gemini";
import { pestsData } from "./utils/pestsData";

export default function App() {
  // App navigation state: 'dashboard' | 'scanner' | 'encyclopedia' | 'history' | 'analysis-result'
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Theme state
  const [isDark, setIsDark] = useState(false);
  
  // Active Scan states
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Scan History state
  const [historyList, setHistoryList] = useState([]);

  // Load configuration on mount
  useEffect(() => {
    // 1. Theme
    const savedTheme = localStorage.getItem("eco_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark-theme");
    }
    
    // 2. Scan History
    const savedHistory = localStorage.getItem("pest_history");
    if (savedHistory) {
      try {
        setHistoryList(JSON.parse(savedHistory));
      } catch (e) {
        console.error("히스토리 데이터 파싱 실패:", e);
      }
    }
  }, []);

  // Save theme changes
  useEffect(() => {
    localStorage.setItem("eco_theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Execute scanning/analysis
  const handleStartAnalysis = async (imageSrc, demoTargetId = null) => {
    // Switch to result tab to show laser scan loader immediately
    setCapturedImage(imageSrc);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setActiveTab("analysis-result");

    try {
      // Call identification helper (performs local proxy server fetch call)
      const result = await identifyPest(imageSrc, demoTargetId);
      setAnalysisResult(result);
      setIsAnalyzing(false);

      // Append to local history list (unless it was a diagnostic error)
      if (result && !result.isError) {
        const newHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          image: imageSrc,
          result: result
        };

        const updatedHistory = [newHistoryItem, ...historyList];
        setHistoryList(updatedHistory);
        localStorage.setItem("pest_history", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error("진단 과정 에러:", err);
      setIsAnalyzing(false);
    }
  };

  // Demo Scan handler (mock pest data selected from dashboard or encyclopedia)
  const handleStartDemoScan = (pestId) => {
    const pest = pestsData.find((p) => p.id === pestId);
    if (!pest) return;
    
    // Use the preset image url as the captured image
    handleStartAnalysis(pest.imageUrl, pestId);
  };

  // Clear all history logs
  const handleClearAllHistory = () => {
    if (window.confirm("정말로 모든 진단 기록을 지우시겠습니까?")) {
      setHistoryList([]);
      localStorage.removeItem("pest_history");
    }
  };

  // Remove a single history item
  const handleDeleteHistoryItem = (id) => {
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem("pest_history", JSON.stringify(updated));
  };

  // View specific history entry details
  const handleViewHistoryDetail = (item) => {
    setCapturedImage(item.image);
    setAnalysisResult(item.result);
    setIsAnalyzing(false);
    setActiveTab("analysis-result");
  };

  // Switch back to scan mode
  const handleRestartScan = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setActiveTab("scanner");
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      isDark={isDark}
      setIsDark={setIsDark}
    >
      {/* Route Views */}
      {activeTab === "dashboard" && (
        <Dashboard 
          setActiveTab={setActiveTab} 
          onStartDemoScan={handleStartDemoScan}
        />
      )}

      {activeTab === "scanner" && (
        <CameraScanner 
          onImageCaptured={(imgUrl) => handleStartAnalysis(imgUrl)}
        />
      )}

      {activeTab === "analysis-result" && (
        <AnalysisResult 
          image={capturedImage}
          result={analysisResult}
          isAnalyzing={isAnalyzing}
          onRestartScan={handleRestartScan}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "encyclopedia" && (
        <PestEncyclopedia 
          onStartDemoScan={handleStartDemoScan}
        />
      )}

      {activeTab === "history" && (
        <HistoryList 
          historyList={historyList}
          onDeleteHistoryItem={handleDeleteHistoryItem}
          onClearAllHistory={handleClearAllHistory}
          onViewHistoryDetail={handleViewHistoryDetail}
          setActiveTab={setActiveTab}
        />
      )}
    </Layout>
  );
}
