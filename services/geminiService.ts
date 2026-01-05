
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTravelAdvice = async (userPrompt: string, locationContext?: { lat: number, lng: number }) => {
  try {
    const config: any = {
      tools: [{ googleSearch: {} }]
    };

    // Si on a un contexte géographique (ex: l'utilisateur regarde un logement à Alger)
    if (locationContext) {
      config.tools.push({ googleMaps: {} });
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: locationContext.lat,
            longitude: locationContext.lng
          }
        }
      };
    }

    // Maps grounding is only supported in Gemini 2.5 series models.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Vous êtes le Concierge Elite de LOCADZ Algérie. 
      Requête : "${userPrompt}". 
      Contexte géo : ${locationContext ? `Lat ${locationContext.lat}, Lng ${locationContext.lng}` : 'Global Algérie'}.
      Instructions :
      1. Donnez des recommandations ultra-locales (restaurants, musées, banques).
      2. Utilisez Google Maps pour trouver des lieux REELS et ouverts.
      3. Proposez des liens Google Maps si disponibles.
      4. Soyez élégant, chaleureux et précis.`,
      config
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      text,
      sources: groundingChunks.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
        return null;
      }).filter(Boolean)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Désolé, je rencontre une difficulté technique.", sources: [] };
  }
};

export const parseSmartSearch = async (query: string, categories: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyse : "${query}". Catégories : [${categories.join(', ')}]. ID le plus proche ? Réponse : un seul mot.`,
    });
    return response.text?.trim().toLowerCase();
  } catch (error) {
    return 'trending';
  }
};
