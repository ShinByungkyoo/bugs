// Vercel Serverless Function for Pest Identification
import dotenv from "dotenv";

dotenv.config();

// Helper to convert base64 image
function parseBase64Image(base64DataUrl) {
  const matches = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches) {
    return {
      mimeType: "image/jpeg",
      data: base64DataUrl
    };
  }
  return {
    mimeType: matches[1],
    data: matches[2]
  };
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "이미지 데이터가 필요합니다." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ 
        error: "서버에 API 키가 등록되어 있지 않습니다. Vercel 설정에서 GEMINI_API_KEY 환경변수를 입력해 주세요." 
      });
    }

    const { mimeType, data } = parseBase64Image(image);

    const prompt = `
      사진 속의 벌레(해충)를 식별하고 정보를 분석해주세요.
      만약 사진에 벌레나 해충이 전혀 찍혀있지 않거나 판독할 수 없는 이미지라면, JSON 포맷 내의 name을 "식별 불가", riskLevel="safe", description을 "사진에서 식별 가능한 벌레나 해충을 찾지 못했습니다. 보다 선명한 사진을 촬영해 주시거나 다른 사진으로 시도해 주세요."로 설정해 돌려주세요.

      반드시 다음과 같은 JSON 형식으로만 응답해야 하며, 어떠한 마크다운 코드 블록이나 앞뒤 설명글 없이 오직 순수한 JSON 문자열만 출력해야 합니다.
      
      JSON 구조 스펙:
      {
        "id": "해충의 식별코드 (예: cockroach, mosquito, bedbug, fruitfly, drugstore_beetle 또는 식별 불가의 경우 unknown)",
        "name": "해충의 한국어 이름 (예: 독일바퀴, 빨간집모기, 빈대 등 구체적인 종류)",
        "scientificName": "학명 (예: Blattella germanica)",
        "riskLevel": "위험도 레벨 (safe, mild, warning, danger 중 하나 선택)",
        "riskLabel": "위험도 레벨 표시 (예: '위험 (Danger)', '경고 (Warning)', '주의 (Mild)', '안전 (Safe)')",
        "description": "이 벌레에 대한 한 줄 요약 및 설명 (한국어)",
        "habits": [
          "습성 및 특징에 대한 구체적인 문장 1 (한국어)",
          "습성 및 특징에 대한 구체적인 문장 2 (한국어)",
          "습성 및 특징에 대한 구체적인 문장 3 (한국어)"
        ],
        "combatGuide": [
          "퇴치 방법에 대한 구체적인 지침 1 (한국어)",
          "퇴치 방법에 대한 구체적인 지침 2 (한국어)",
          "퇴치 방법에 대한 구체적인 지침 3 (한국어)"
        ],
        "preventionGuide": [
          "예방 조치에 대한 구체적인 지침 1 (한국어)",
          "예방 조치에 대한 구체적인 지침 2 (한국어)",
          "예방 조치에 대한 구체적인 지침 3 (한국어)"
        ],
        "recommendProduct": "추천하는 퇴치 성분이나 약제 종류 설명 (예: '피프로닐 성분의 독먹이 겔')"
      }
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.error?.message || response.statusText;
      } catch (e) {
        errorDetail = response.statusText;
      }
      return res.status(response.status).json({ 
        error: `Google API 오류 (${response.status}): ${errorDetail}` 
      });
    }

    const json = await response.json();
    const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return res.status(500).json({ error: "API 응답 형식이 올바르지 않거나 빈 응답을 받았습니다." });
    }

    const parsedData = JSON.parse(responseText.trim());
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error("Vercel 서버리스 해충 식별 중 에러 발생:", error);
    return res.status(500).json({ error: `서버 내부 분석 오류: ${error.message}` });
  }
}
