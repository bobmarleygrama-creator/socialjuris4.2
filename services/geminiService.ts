
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCaseDescription = async (description: string): Promise<{ area: string; title: string; summary: string; complexity: 'Baixa' | 'Média' | 'Alta' }> => {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this legal case description and extract: 
      1. The most likely legal area (e.g., Civil, Family, Criminal, Labor, Tax, Corporate). 
      2. A professional short title (max 5 words). 
      3. A one-sentence professional summary. 
      4. The complexity level (Baixa, Média, Alta) based on the description details.
      
      Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            area: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            complexity: { type: Type.STRING, enum: ["Baixa", "Média", "Alta"] }
          },
          required: ["area", "title", "summary", "complexity"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      area: "Direito Geral",
      title: "Nova Demanda Jurídica",
      summary: description.substring(0, 100) + "...",
      complexity: "Média"
    };
  }
};

export const calculateCasePrice = (complexity: string): number => {
    switch (complexity) {
        case 'Baixa': return 2.00;
        case 'Média': return 4.00;
        case 'Alta': return 6.00;
        default: return 4.00;
    }
};

// --- PRO TOOLS SERVICES ---

// Tool 1: Auto-Tagging for Docs
export const autoTagDocument = async (fileName: string): Promise<{ type: string; tags: string[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Categorize a legal document named "${fileName}". 
      Return the document Type (Peticao, Contrato, Sentenca, Procuracao, Outros) and 3 relevant tags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             type: { type: Type.STRING },
             tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"type": "Outros", "tags": []}');
  } catch (e) {
    return { type: "Outros", tags: ["Documento"] };
  }
};

// Tool 2: Jurisprudence Search
export const searchJurisprudence = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Simulate a jurisprudence search for the query: "${query}" in Brazilian courts.
      Return 3 representative cases with: Court Name, Summary of Decision, Outcome (Favorável/Desfavorável/Parcial) and Relevance Score (0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              court: { type: Type.STRING },
              summary: { type: Type.STRING },
              outcome: { type: Type.STRING, enum: ['Favorável', 'Desfavorável', 'Parcial'] },
              relevance: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

// Tool 3: Draft Creator
export const generateLegalDraft = async (config: { type: string; clientName: string; facts: string; tone: string }) => {
  const ai = getAI();
  const prompt = `Act as a senior Brazilian lawyer. Write a legal document of type "${config.type}".
  Client: ${config.clientName}.
  Facts: ${config.facts}.
  Tone: ${config.tone}.
  Structure: Header, Facts, Law, Requests, Footer.
  Language: Portuguese (Brazil).
  Format: Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });
  return response.text || "Erro ao gerar minuta.";
};

// Tool 5: CRM Risk Analysis
export const analyzeCRMRisk = async (profileName: string, type: string) => {
  // Simulation logic since we don't have real financial data
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a fictional risk analysis profile for a legal client named "${profileName}" (${type}).
      Return Risk Score (Baixo/Médio/Alto) and Conversion Probability (0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.STRING, enum: ['Baixo', 'Médio', 'Alto'] },
            conversionProbability: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"riskScore": "Baixo", "conversionProbability": 50}');
  } catch (e) {
    return { riskScore: "Médio", conversionProbability: 50 };
  }
};

// Tool 6: Intake Diagnosis
export const diagnoseIntake = async (answers: string) => {
   const ai = getAI();
   try {
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: `Analyze these intake answers: "${answers}".
       Return: 1. Legal Area. 2. Urgency. 3. Suggested Action.`,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
           type: Type.OBJECT,
           properties: {
             area: { type: Type.STRING },
             urgency: { type: Type.STRING },
             suggestedAction: { type: Type.STRING }
           }
         }
       }
     });
     return JSON.parse(response.text || '{}');
   } catch (e) {
     return {};
   }
}

// Tool 7: Calculators (AI Powered)
export const calculateLegalMath = async (category: string, type: string, inputs: any) => {
  const ai = getAI();
  const prompt = `Act as a Brazilian Forensic Accountant. Perform a legal calculation.
  Category: ${category}
  Type: ${type}
  Inputs: ${JSON.stringify(inputs)}
  
  Requirements:
  1. Use current Brazilian legislation (CLT, Civil Code, STJ Súmulas).
  2. Return a detailed JSON with the result.
  
  Output Schema:
  {
    "total": number,
    "summary": string,
    "details": [
      {"label": string, "value": string, "description": string} // Line items for the calculation memory
    ]
  }`;

  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      total: { type: Type.NUMBER },
                      summary: { type: Type.STRING },
                      details: {
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  label: { type: Type.STRING },
                                  value: { type: Type.STRING },
                                  description: { type: Type.STRING }
                              }
                          }
                      }
                  }
              }
          }
      });
      return JSON.parse(response.text || '{}');
  } catch(e) {
      console.error(e);
      return { total: 0, summary: "Erro no cálculo IA", details: [] };
  }
}