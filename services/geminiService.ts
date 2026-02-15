
import { GoogleGenAI } from "@google/genai";
import { UserConfig, ConfigResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const UPRIGHT_PIANOS = [
  "https://www.schumer.nl/product/wilh-steinberg/",
  "https://www.schumer.nl/product/schimmel-c-130t/",
  "https://www.schumer.nl/product/yamaha-su-118-c-2/",
  "https://www.schumer.nl/product/ritmuller-up-177-m/",
  "https://www.schumer.nl/product/schimmel-130t/",
  "https://www.schumer.nl/product/schumer-up-118m/",
  "https://www.schumer.nl/product/yamaha-su-118c/",
  "https://www.schumer.nl/product/rameau/",
  "https://www.schumer.nl/product/seiler-116/",
  "https://www.schumer.nl/product/eterna-er30/",
  "https://www.schumer.nl/product/yamaha-p121t-silent/",
  "https://www.schumer.nl/product/eterna-er10/",
  "https://www.schumer.nl/product/petrof-118-g1/",
  "https://www.schumer.nl/product/grotrian-steinweg-4/",
  "https://www.schumer.nl/product/schumer-up-117m/",
  "https://www.schumer.nl/product/wilh-steinberg-118/",
  "https://www.schumer.nl/product/yamaha-b3-silent-2/",
  "https://www.schumer.nl/product/yamaha-u1-silent/",
  "https://www.schumer.nl/product/yamaha-u1-2/",
  "https://www.schumer.nl/product/yamaha-p121/",
  "https://www.schumer.nl/product/romhildt/",
  "https://www.schumer.nl/product/seiler-122-konsole-met-yamaha-silent/",
  "https://www.schumer.nl/product/yamaha-u3-silent/",
  "https://www.schumer.nl/product/yamaha-b3-silent/"
];

const VLEUGEL_PIANOS = [
  "https://www.schumer.nl/product/bosendorfer-200/",
  "https://www.schumer.nl/product/yamaha-c3x/",
  "https://www.schumer.nl/product/george-steck/",
  "https://www.schumer.nl/product/steinway-sons-b211-2/",
  "https://www.schumer.nl/product/boston-156/",
  "https://www.schumer.nl/product/yamaha-c6x-enspire-pro-silent/",
  "https://www.schumer.nl/product/c-bechstein/",
  "https://www.schumer.nl/product/bluthner/",
  "https://www.schumer.nl/product/schimmel-208t/",
  "https://www.schumer.nl/product/schimmel-174t/",
  "https://www.schumer.nl/product/yamaha-c3/",
  "https://www.schumer.nl/product/c-bechstein-b203-2/",
  "https://www.schumer.nl/product/w-hoffmann-190/"
];

const ALL_PRODUCTS = [...UPRIGHT_PIANOS, ...VLEUGEL_PIANOS];

const FALLBACK_RESULTS: ConfigResult = {
  title: "Onze aanbevelingen voor u",
  intro: "Op basis van onze expertise hebben we drie instrumenten geselecteerd die uitstekend passen bij uw profiel. Deze piano's staan bekend om hun betrouwbaarheid en muzikale kwaliteit.",
  showShowroomCTA: true,
  recommendations: [
    {
      model: "Yamaha U1 Professional",
      motivation: "De absolute referentie voor de moderne pianist. Bekend om zijn heldere klank en ongekende betrouwbaarheid.",
      link: "https://www.schumer.nl/product/yamaha-u1-2/",
      type: "product",
      ctaText: "Bekijk model"
    },
    {
      model: "Schimmel 174T Vleugel",
      motivation: "Een karaktervolle Duitse vleugel met een rijke, zingende toon. De perfecte keuze voor de ultieme speelervaring.",
      link: "https://www.schumer.nl/product/schimmel-174t/",
      type: "product",
      ctaText: "Ontdek vleugel"
    },
    {
      model: "Yamaha B3 Silent",
      motivation: "De ideale gezins-piano met professionele prestaties. Dankzij het Silent systeem kunt u op elk moment van de dag oefenen.",
      link: "https://www.schumer.nl/product/yamaha-b3-silent/",
      type: "product",
      ctaText: "Bekijk details"
    }
  ]
};

export const getPianoRecommendations = async (config: UserConfig): Promise<ConfigResult> => {
  // Direct return for Digital Piano as requested
  if (config.instrumentType === 'digital') {
    return {
      title: "Digitale Piano's",
      intro: "Helaas liggen digitale piano's op dit moment niet in ons standaard online assortiment. We helpen u echter graag persoonlijk verder om te kijken naar de mogelijkheden of een passend akoestisch alternatief.",
      recommendations: [], // Signal special empty state
      showShowroomCTA: true
    };
  }

  const ai = getAI();
  
  // Select the appropriate list based on instrument type
  let relevantUrls: string[] = [];
  if (config.instrumentType === 'acoustic') {
    relevantUrls = UPRIGHT_PIANOS;
  } else if (config.instrumentType === 'vleugel') {
    relevantUrls = VLEUGEL_PIANOS;
  } else {
    relevantUrls = ALL_PRODUCTS;
  }

  const prompt = `
    Je bent een senior piano-adviseur bij Schumer Piano's & Vleugels.
    De klant heeft gekozen voor type: ${config.instrumentType}.
    
    Op basis van de onderstaande selectie van de klant moet je exact 3 instrumenten kiezen uit de verstrekte lijst.
    
    KLANTPROFIEL:
    - Gekozen categorie: ${config.instrumentType === 'vleugel' ? 'Vleugel' : 'Akoestische piano'}
    - Niveau: ${config.skillLevel}
    - Budget: ${config.budget}
    - Prioriteiten: ${config.priorities.join(', ')}

    LIJST MET BESCHIKBARE PRODUCTEN (URLS):
    ${relevantUrls.join('\n')}

    GEEF ANTWOORD IN DIT JSON FORMAAT:
    {
      "title": "Uw persoonlijk advies van Schumer",
      "intro": "Een korte inleidende zin die de klant complimenteert met hun interesse in een ${config.instrumentType === 'vleugel' ? 'vleugel' : 'akoestische piano'}.",
      "recommendations": [
        {
          "model": "Volledige Naam van Model",
          "motivation": "Max 2 korte zinnen waarom dit instrument perfect past bij hun ${config.skillLevel} niveau en budget. Noem de klank.",
          "link": "DE EXACTE URL UIT DE BOVENSTAANDE LIJST",
          "ctaText": "Bekijk model"
        }
      ]
    }

    STRIKTE CATEGORIE REGELS: 
    1. Als de klant een 'vleugel' zoekt, mag je ONLY URLs uit de vleugel-lijst gebruiken.
    2. Als de klant een 'acoustic' piano zoekt, mag je ONLY URLs uit de piano-lijst gebruiken.
    3. Kies precies 3 instrumenten.
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
      // If AI fails but isn't digital, provide fallback within the correct category
      const fallbackSubset = config.instrumentType === 'vleugel' 
        ? VLEUGEL_PIANOS.slice(0, 3) 
        : UPRIGHT_PIANOS.slice(0, 3);
      
      return {
        ...FALLBACK_RESULTS,
        recommendations: FALLBACK_RESULTS.recommendations.map((rec, i) => ({
          ...rec,
          link: fallbackSubset[i] || rec.link
        }))
      };
    }

    // Double check URLs consistency
    result.recommendations = result.recommendations.map(rec => {
      const isValidLink = relevantUrls.includes(rec.link);
      return {
        ...rec,
        link: isValidLink ? rec.link : (relevantUrls[0] || ALL_PRODUCTS[0]),
        ctaText: rec.ctaText || "Bekijk model"
      };
    }).slice(0, 3);

    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return FALLBACK_RESULTS;
  }
};
