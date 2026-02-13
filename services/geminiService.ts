
import { GoogleGenAI } from "@google/genai";
import { UserConfig, ConfigResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const PRODUCT_LIST = [
  "https://www.schumer.nl/product/yamaha-b3-silent/",
  "https://www.schumer.nl/product/w-hoffmann-190/",
  "https://www.schumer.nl/product/c-bechstein-b203-2/",
  "https://www.schumer.nl/product/yamaha-c3/",
  "https://www.schumer.nl/product/yamaha-u3-silent/",
  "https://www.schumer.nl/product/seiler-122-konsole-met-yamaha-silent/",
  "https://www.schumer.nl/product/schimmel-174t/",
  "https://www.schumer.nl/product/schimmel-208t/",
  "https://www.schumer.nl/product/bluthner/",
  "https://www.schumer.nl/product/c-bechstein/",
  "https://www.schumer.nl/product/yamaha-c6x-enspire-pro-silent/",
  "https://www.schumer.nl/product/boston-156/",
  "https://www.schumer.nl/product/romhildt/",
  "https://www.schumer.nl/product/yamaha-p121/",
  "https://www.schumer.nl/product/yamaha-u1-2/",
  "https://www.schumer.nl/product/yamaha-u1-silent/",
  "https://www.schumer.nl/product/yamaha-b3-silent-2/",
  "https://www.schumer.nl/product/wilh-steinberg-118/",
  "https://www.schumer.nl/product/schumer-up-117m/",
  "https://www.schumer.nl/product/grotrian-steinweg-4/",
  "https://www.schumer.nl/product/petrof-118-g1/",
  "https://www.schumer.nl/product/eterna-er10/",
  "https://www.schumer.nl/product/yamaha-p121t-silent/",
  "https://www.schumer.nl/product/eterna-er30/",
  "https://www.schumer.nl/product/seiler-116/",
  "https://www.schumer.nl/product/rameau/",
  "https://www.schumer.nl/product/yamaha-su-118c/",
  "https://www.schumer.nl/product/schumer-up-118m/",
  "https://www.schumer.nl/product/schimmel-130t/",
  "https://www.schumer.nl/product/ritmuller-up-177-m/",
  "https://www.schumer.nl/product/yamaha-su-118-c-2/",
  "https://www.schimmel-c-130t/",
  "https://www.schumer.nl/product/steinway-sons-b211-2/",
  "https://www.schumer.nl/product/george-steck/",
  "https://www.schumer.nl/product/yamaha-c3x/",
  "https://www.schumer.nl/product/bosendorfer-200/",
  "https://www.schumer.nl/product/wilh-steinberg/"
];

const FALLBACK_RESULTS: ConfigResult = {
  title: "Onze aanbevelingen voor u",
  intro: "Op basis van onze expertise hebben we drie instrumenten geselecteerd die uitstekend passen bij uw profiel. Deze piano's staan bekend om hun betrouwbaarheid en muzikale kwaliteit.",
  showShowroomCTA: true,
  recommendations: [
    {
      model: "Yamaha U1 Silent",
      motivation: "De absolute referentie voor de moderne pianist. Het Silent systeem laat u elk moment van de dag oefenen met een prachtige digitale klank via de hoofdtelefoon.",
      link: "https://www.schumer.nl/product/yamaha-u1-silent/",
      type: "product",
      ctaText: "Bekijk model"
    },
    {
      model: "Schimmel 174T Vleugel",
      motivation: "Een karaktervolle Duitse vleugel met een rijke, zingende toon. De perfecte keuze voor de pianist die droomt van de ultieme speelervaring in de woonkamer.",
      link: "https://www.schumer.nl/product/schimmel-174t/",
      type: "product",
      ctaText: "Ontdek vleugel"
    },
    {
      model: "Yamaha B3 Silent",
      motivation: "De ideale gezins-piano met professionele prestaties. Dankzij het grotere klankbord heeft dit model een verrassend diepe en volle klank.",
      link: "https://www.schumer.nl/product/yamaha-b3-silent/",
      type: "product",
      ctaText: "Bekijk details"
    }
  ]
};

export const getPianoRecommendations = async (config: UserConfig): Promise<ConfigResult> => {
  const ai = getAI();
  
  const prompt = `
    Je bent een senior piano-adviseur bij Schumer Piano's & Vleugels.
    Op basis van de onderstaande selectie van de klant moet je exact 3 piano's of vleugels kiezen uit de verstrekte lijst.
    
    KLANTPROFIEL:
    - Instrument: ${config.instrumentType} (akoestisch, vleugel of digitaal)
    - Niveau: ${config.skillLevel}
    - Budget: ${config.budget}
    - Prioriteiten: ${config.priorities.join(', ')}

    LIJST MET BESCHIKBARE PRODUCTEN (URLS):
    ${PRODUCT_LIST.join('\n')}

    GEEF ANTWOORD IN DIT JSON FORMAAT:
    {
      "title": "Uw persoonlijk advies van Schumer",
      "intro": "Een korte inleidende zin die de klant complimenteert met hun keuzes.",
      "recommendations": [
        {
          "model": "Volledige Naam van Model",
          "motivation": "Max 2 zinnen waarom dit instrument perfect past bij hun ${config.skillLevel} niveau en budget van ${config.budget}.",
          "link": "DE EXACTE URL UIT DE LIJST",
          "ctaText": "Bekijk model"
        }
      ]
    }

    BELANGRIJK: 
    1. Kies alleen instrumenten die passen bij het budget.
    2. Als ze een vleugel zoeken, kies dan bij voorkeur urls waar 'vleugel' of specifieke vleugelmodellen (C3, B211, 174T, 208T, 200) in staan.
    3. Zorg dat de motivatie deskundig en warm overkomt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const result = JSON.parse(text) as ConfigResult;

    if (!result.recommendations || result.recommendations.length === 0) {
      return FALLBACK_RESULTS;
    }

    // Double check that we have 3 results and valid links
    if (result.recommendations.length > 3) {
      result.recommendations = result.recommendations.slice(0, 3);
    }
    
    // Safety check for links
    result.recommendations = result.recommendations.map(rec => ({
      ...rec,
      link: PRODUCT_LIST.includes(rec.link) ? rec.link : "https://www.schumer.nl/producten/",
      ctaText: rec.ctaText || "Bekijk model"
    }));

    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return FALLBACK_RESULTS;
  }
};
