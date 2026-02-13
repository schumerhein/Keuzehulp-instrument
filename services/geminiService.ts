
import { GoogleGenAI, Type } from "@google/genai";
import { UserConfig, ConfigResult, GroundingSource } from "../types";

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

export const getPianoRecommendations = async (config: UserConfig): Promise<ConfigResult> => {
  const ai = getAI();
  
  const prompt = `
    Je bent een deskundige piano-adviseur voor "Schumer Piano's & Vleugels".
    Jouw taak is om 3 specifieke aanbevelingen te doen op basis van de ONDERSTAANDE LIJST MET PRODUCTEN.
    
    PRODUCTEN LIJST (GEBRUIK ALLEEN DEZE LINKS):
    ${PRODUCT_LIST.join('\n')}

    Gebruikersprofiel:
    - Type instrument: ${config.instrumentType === 'acoustic' ? 'Akoestische piano' : config.instrumentType}
    - Speelniveau: ${config.skillLevel}
    - Ruimte: ${config.space}
    - Budget: ${config.budget}
    - Conditie: ${config.condition === 'new' ? 'Nieuw' : config.condition === 'used' ? 'Tweedehands' : 'Nieuw of tweedehands'}
    - Prioriteiten: ${config.priorities.join(', ')}

    INSTRUCTIES:
    1. Selecteer uit de lijst met producten de 3 meest passende instrumenten voor dit profiel.
    2. Voor elk instrument: Geef de modelnaam, een overtuigende motivatie van 2 zinnen waarom dit bij de klant past, en de URL uit de lijst.
    3. Antwoord MOET een geldig JSON-object zijn.

    JSON STRUCTUUR:
    {
      "title": "Uw persoonlijk advies van Schumer",
      "intro": "Op basis van uw voorkeuren hebben wij drie bijzondere instrumenten uit onze collectie voor u geselecteerd:",
      "showShowroomCTA": true,
      "recommendations": [
        {
          "model": "Modelnaam",
          "motivation": "Motivatie...",
          "link": "https://www.schumer.nl/product/...",
          "type": "product",
          "ctaText": "Bekijk dit model"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Geen JSON gevonden");
    
    const result: ConfigResult = JSON.parse(jsonMatch[0]);

    // Ensure all links returned are valid links from our list
    result.recommendations = result.recommendations.map(rec => {
      const validLink = PRODUCT_LIST.find(l => rec.link.includes(l.split('/product/')[1])) || rec.link;
      return { ...rec, link: validLink };
    });

    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "Onze selectie voor u",
      intro: "We hebben drie topmodellen uit onze collectie voor u geselecteerd die aansluiten bij uw wensen:",
      showShowroomCTA: true,
      recommendations: [
        {
          model: "Yamaha U1 Silent",
          motivation: "De ideale keuze voor wie de touch van een echte piano zoekt, maar ook in stilte wil kunnen oefenen.",
          link: "https://www.schumer.nl/product/yamaha-u1-silent/",
          type: "product",
          ctaText: "Bekijk dit model"
        },
        {
          model: "Schimmel 174T Vleugel",
          motivation: "Een prachtige Duitse vleugel met een rijke, warme klank die perfect past in een gemiddelde woonkamer.",
          link: "https://www.schumer.nl/product/schimmel-174t/",
          type: "product",
          ctaText: "Ontdek dit model"
        },
        {
          model: "Yamaha C3X",
          motivation: "Een concertvleugel-ervaring voor thuis. Onovertroffen in expressie en dynamiek.",
          link: "https://www.schumer.nl/product/yamaha-c3x/",
          type: "product",
          ctaText: "Bekijk details"
        }
      ]
    };
  }
};
