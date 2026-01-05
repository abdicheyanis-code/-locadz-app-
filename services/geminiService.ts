import { GoogleGenAI } from "@google/genai";

// Avec Vite, les variables d'environnement utilisables dans le navigateur
// doivent commencer par VITE_
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// On ne crée le client que si la clé existe
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!apiKey) {
  console.warn(
    "VITE_GEMINI_API_KEY est manquante. Le concierge LOCADZ sera désactivé (mais l'app continuera de fonctionner)."
  );
}

type LocationContext = { lat: number; lng: number };

export const getTravelAdvice = async (
  userPrompt: string,
  locationContext?: LocationContext
) => {
  // Si pas de clé, on renvoie un message gentil au lieu de planter
  if (!ai) {
    return {
      text:
        "Le concierge LOCADZ n'est pas disponible pour le moment (clé API manquante).",
      sources: [],
    };
  }

  try {
    const config: any = {
      tools: [{ googleSearch: {} }],
    };

    if (locationContext) {
      config.tools.push({ googleMaps: {} });
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: locationContext.lat,
            longitude: locationContext.lng,
          },
        },
      };
    }

    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Vous êtes le Concierge Elite de LOCADZ Algérie. 
      Requête : "${userPrompt}". 
      Contexte géo : ${
        locationContext
          ? `Lat ${locationContext.lat}, Lng ${locationContext.lng}`
          : "Global Algérie"
      }.
      Instructions :
      1. Donnez des recommandations ultra-locales (restaurants, musées, banques).
      2. Utilisez Google Maps pour trouver des lieux REELS et ouverts.
      3. Proposez des liens Google Maps si disponibles.
      4. Soyez élégant, chaleureux et précis.`,
      config,
    });

    const text = response.text;
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      sources: groundingChunks
        .map((chunk: any) => {
          if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
          if (chunk.maps)
            return { title: chunk.maps.title, uri: chunk.maps.uri };
          return null;
        })
        .filter(Boolean),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Désolé, je rencontre une difficulté technique.",
      sources: [],
    };
  }
};

export const parseSmartSearch = async (
  query: string,
  categories: string[]
) => {
  // Sans clé, on ne tente rien et on ne casse pas l'app
  if (!ai) {
    return "trending";
  }

  try {
    const response: any = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyse : "${query}". Catégories : [${categories.join(
        ", "
      )}]. ID le plus proche ? Réponse : un seul mot.`,
    });

    return response.text?.trim().toLowerCase();
  } catch (error) {
    console.error("SmartSearch error:", error);
    return "trending";
  }
};
