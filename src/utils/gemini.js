import { pestsData } from "./pestsData";

/**
 * Call local backend API to identify pest
 */
export async function identifyPest(base64ImageUrl, demoTargetId = null) {
  // 만약 데모 타겟이 강제 지정된 경우(샘플 테스트)는 무조건 로컬 데모 모드로 작동
  if (demoTargetId) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const match = pestsData.find((p) => p.id === demoTargetId);
    if (match) return { ...match, isDemo: true, isSampleDemo: true };
  }

  try {
    // 로컬 백엔드 서버(Server-to-Server 프록시)로 요청 전송
    const response = await fetch("/api/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64ImageUrl
      }),
    });

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.error || response.statusText;
      } catch (e) {
        errorDetail = response.statusText;
      }
      throw new Error(errorDetail);
    }

    const data = await response.json();
    return { ...data, isDemo: false }; // 실제 AI가 식별한 결과
  } catch (error) {
    console.error("해충 식별 백엔드 호출 오류:", error);

    // API 호출 오류가 발생했을 때 상세 정보 리턴
    return {
      id: "error",
      name: "식별 오류 발생",
      scientificName: "Backend API Failed",
      riskLevel: "safe",
      isError: true,
      errorMessage: error.message,
      description: `서버(Server-to-Server)를 통한 AI 분석 요청 중 에러가 발생했습니다. 백엔드 설정(.env) 또는 등록된 API 키의 유효성을 검토하세요.`,
      habits: [
        "에러 메시지: " + error.message,
        "원인 분석: 서버에 탑재된 Gemini API Key가 유효하지 않거나 Google AI Studio 프로젝트에 Generative Language API 권한이 활성화되어 있지 않을 수 있습니다."
      ],
      combatGuide: [
        "루트 디렉토리의 .env 파일 내부의 GEMINI_API_KEY 값을 점검해 주세요.",
        "Google AI Studio(https://aistudio.google.com/)에서 정상적으로 발급된 API 키인지 체크해 주세요.",
        "로컬 개발 환경의 경우 server.js가 3001 포트에서 켜져 있는지 확인하세요."
      ],
      preventionGuide: [
        "네트워크 및 인터넷 연결 상태를 점검하세요.",
        "API 키에 할당된 쿼터(Quota) 초과 여부를 파악해 보세요."
      ],
      recommendProduct: "서버 관리자에게 문의하여 백엔드 설정을 다시 확인해 주세요."
    };
  }
}
