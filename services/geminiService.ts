
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
      recommendations: [], 
      showShowroomCTA: true
    };
  }

  const ai = getAI();
  
  // Deterministic URL selection based on category
  let relevantUrls: string[] = [];
  let categoryLabel = "";
  
  if (config.instrumentType === 'vleugel') {
    relevantUrls = VLEUGEL_PIANOS;
    categoryLabel = "VLEUGEL";
  } else {
    // Treat 'acoustic' and 'unsure' as Upright Piano search by default for Schumer context
    relevantUrls = UPRIGHT_PIANOS;
    categoryLabel = "AKOESTISCHE (STAANDE) PIANO";
  }

  const prompt = `
    Je bent een senior piano-adviseur bij Schumer Piano's & Vleugels.
    STRIKTE OPDRACHT: De klant zoekt uitsluitend een ${categoryLabel}.
    Je MOET precies 3 instrumenten kiezen die EXCLUSIEF voorkomen in de onderstaande lijst.

    KLANTPROFIEL:
    - Niveau: ${config.skillLevel}
    - Budget: ${config.budget}
    - Voorkeur: ${config.condition === 'new' ? 'Nieuw' : 'Tweedehands'}
    - Prioriteiten: ${config.priorities.join(', ')}

    LIJST MET TOEGESTANE PRODUCTEN (URLS):
    ${relevantUrls.join('\n')}

    GEEF ANTWOORD IN DIT JSON FORMAAT:
    {
      "title": "Uw persoonlijk advies van Schumer",
      "intro": "Een korte, deskundige zin waarom deze 3 modellen het beste passen bij een zoektocht naar een ${categoryLabel}.",
      "recommendations": [
        {
          "model": "Naam van Model",
          "motivation": "Max 2 korte zinnen motivatie.",
          "link": "DE EXACTE URL UIT DE BOVENSTAANDE LIJST",
          "ctaText": "Bekijk model"
        }
      ]
    }

    BELANGRIJK: 
    - Als de klant een ${categoryLabel} zoekt, mag er GEEN ANDER TYPE instrument in het resultaat staan.
    - Gebruik alleen de URL's die ik je heb gegeven.
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
      throw new Error("Geen aanbevelingen gegenereerd");
    }

    // Hard validation check: Force the correct category if AI hallucinated
    result.recommendations = result.recommendations.map((rec, index) => {
      const isCorrectCategory = relevantUrls.includes(rec.link);
      
      if (!isCorrectCategory) {
        // AI proposed a link from the wrong category or a non-existent link
        // We replace it with a valid one from the intended category
        const safeLink = relevantUrls[index % relevantUrls.length];
        return {
          ...rec,
          link: safeLink,
          // Clean model name if it's clearly wrong (optional, but link is most important)
          ctaText: rec.ctaText || (config.instrumentType === 'vleugel' ? 'Ontdek vleugel' : 'Bekijk piano')
        };
      }
      return rec;
    }).slice(0, 3);

    return result;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    
    // Category-specific fallback
    const fallbackSubset = config.instrumentType === 'vleugel' 
      ? VLEUGEL_PIANOS.slice(0, 3) 
      : UPRIGHT_PIANOS.slice(0, 3);

    return {
      ...FALLBACK_RESULTS,
      title: `Onze selectie ${config.instrumentType === 'vleugel' ? 'vleugels' : "piano's"}`,
      recommendations: FALLBACK_RESULTS.recommendations.map((rec, i) => ({
        ...rec,
        model: config.instrumentType === 'vleugel' ? `Schimmel Vleugel Model ${i+1}` : rec.model,
        link: fallbackSubset[i] || fallbackSubset[0]
      }))
    };
  }
};
