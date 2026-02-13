
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
  "https://www.schumer.nl/product/schimmel-c-130t/",
  "https://www.schumer.nl/product/steinway-sons-b211-2/",
  "https://www.schumer.nl/product/george-steck/",
  "https://www.schumer.nl/product/yamaha-c3x/",
  "https://www.schumer.nl/product/bosendorfer-200/",
  "https://www.schumer.nl/product/wilh-steinberg/"
];

// Robuuste Fallback met 3 verschillende producten
const FALLBACK_RESULTS: ConfigResult = {
  title: "Onze aanbevelingen voor u",
  intro: "Op basis van onze expertise hebben we drie instrumenten geselecteerd die uitstekend passen bij uw profiel:",
  showShowroomCTA: true,
  recommendations: [
    {
      model: "Yamaha U1 Silent",
      motivation: "De gouden standaard voor zowel beginners als gevorderden. Dankzij het Silent systeem speelt u op elk moment van de dag zonder anderen te storen.",
      link: "https://www.schumer.nl/product/yamaha-u1-silent/",
      type: "product",
      ctaText: "Bekijk model"
    },
    {
      model: "Schimmel 174T Vleugel",
      motivation: "Een karaktervolle Duitse vleugel met een ongekende klankrijkdom. De perfecte keuze voor de veeleisende pianist die een statement in de woonkamer zoekt.",
      link: "https://www.schumer.nl/product/schimmel-174t/",
      type: "product",
      ctaText: "Ontdek vleugel"
    },
    {
      model: "Yamaha B3 Silent",
      motivation: "Uitmuntende prijs-kwaliteitverhouding. Een robuust instrument met een heldere klank en de vertrouwde Yamaha kwaliteit.",
      link: "https://www.schumer.nl/product/yamaha-b3-silent/",
      type: "product",
      ctaText: "Bekijk details"
    }
  ]
};

export const getPianoRecommendations = async (config: UserConfig): Promise<ConfigResult> => {
  const ai = getAI();
  
  const prompt = `
    Je bent een deskundige piano-adviseur voor "Schumer Piano's & Vleugels".
    Selecteer 3 instrumenten uit de onderstaande lijst die het beste passen bij dit profiel:
    - Type: ${config.instrumentType}
    - Niveau: ${config.skillLevel}
    - Budget: ${config.budget}
    - Prioriteiten: ${config.priorities.join(', ')}

    LIJST MET PRODUCTEN:
    ${PRODUCT_LIST.join('\n')}

    Antwoord in JSON formaat met deze velden:
    {
      "title": "Uw persoonlijk advies van Schumer",
      "intro": "...",
      "recommendations": [
        { "model": "Modelnaam", "motivation": "2 zinnen waarom dit past", "link": "link uit de lijst", "ctaText": "Bekijk model" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}") as ConfigResult;

    // Controleer of we 3 aanbevelingen hebben, anders fallback
    if (!result.recommendations || result.recommendations.length < 3) {
      return FALLBACK_RESULTS;
    }

    // Valideer de links
    result.recommendations = result.recommendations.map(rec => {
      const match = PRODUCT_LIST.find(url => url.toLowerCase().includes(rec.model.toLowerCase().replace(/\s/g, '-'))) || 
                    PRODUCT_LIST.find(url => rec.link && url.includes(rec.link.split('/product/')[1])) || 
                    rec.link;
      return { ...rec, link: match || "https://www.schumer.nl/producten/", ctaText: rec.ctaText || "Bekijk model" };
    });

    return result;
  } catch (error) {
    console.error("AI Error:", error);
    return FALLBACK_RESULTS;
  }
};
