
import { GoogleGenAI, Type } from "@google/genai";
import { UserConfig, ConfigResult, Recommendation, Budget, PianoProduct } from "../types";

const PRODUCTS: PianoProduct[] = [
  // Uprights - New
  { name: "Wilh. Steinberg Upright", url: "https://www.schumer.nl/product/wilh-steinberg/", priceRange: '7.5-15k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Schimmel C 130T", url: "https://www.schumer.nl/product/schimmel-c-130t/", priceRange: '15k+', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Yamaha SU-118 C Professional", url: "https://www.schumer.nl/product/yamaha-su-118-c-2/", priceRange: '15k+', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Ritmüller UP 177 M", url: "https://www.schumer.nl/product/ritmuller-up-177-m/", priceRange: '7.5-15k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Schimmel 130T", url: "https://www.schumer.nl/product/schimmel-130t/", priceRange: '7.5-15k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Schumer UP-118M", url: "https://www.schumer.nl/product/schumer-up-118m/", priceRange: '3-7.5k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Schumer UP-117M", url: "https://www.schumer.nl/product/schumer-up-117m/", priceRange: '3-7.5k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Wilh. Steinberg 118", url: "https://www.schumer.nl/product/wilh-steinberg-118/", priceRange: '7.5-15k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Yamaha B3 Silent SC2", url: "https://www.schumer.nl/product/yamaha-b3-silent-2/", priceRange: '7.5-15k', isSilent: true, condition: 'new', type: 'acoustic' },
  { name: "Yamaha P121T Silent", url: "https://www.schumer.nl/product/yamaha-p121t-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'new', type: 'acoustic' },
  { name: "Yamaha B3 Silent", url: "https://www.schumer.nl/product/yamaha-b3-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'new', type: 'acoustic' },
  { name: "Yamaha U1 Professional", url: "https://www.schumer.nl/product/yamaha-u1-2/", priceRange: '7.5-15k', isSilent: false, condition: 'new', type: 'acoustic' },
  { name: "Yamaha P121 Ebony", url: "https://www.schumer.nl/product/yamaha-p121/", priceRange: '7.5-15k', isSilent: false, condition: 'new', type: 'acoustic' },
  
  // Uprights - Used
  { name: "Yamaha SU-118C Heritage", url: "https://www.schumer.nl/product/yamaha-su-118c/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Rameau Piano (Occasion)", url: "https://www.schumer.nl/product/rameau/", priceRange: '1-3k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Seiler 116 Konsole", url: "https://www.schumer.nl/product/seiler-116/", priceRange: '3-7.5k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Eterna ER30", url: "https://www.schumer.nl/product/eterna-er30/", priceRange: '1-3k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Eterna ER10", url: "https://www.schumer.nl/product/eterna-er10/", priceRange: '1-3k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Petrof 118 G1", url: "https://www.schumer.nl/product/petrof-118-g1/", priceRange: '3-7.5k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Grotrian Steinweg 4", url: "https://www.schumer.nl/product/grotrian-steinweg-4/", priceRange: '7.5-15k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Yamaha U1 Silent (Used)", url: "https://www.schumer.nl/product/yamaha-u1-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'used', type: 'acoustic' },
  { name: "Römhildt Piano", url: "https://www.schumer.nl/product/romhildt/", priceRange: '1-3k', isSilent: false, condition: 'used', type: 'acoustic' },
  { name: "Seiler 122 Silent (Used)", url: "https://www.schumer.nl/product/seiler-122-konsole-met-yamaha-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'used', type: 'acoustic' },
  { name: "Yamaha U3 Silent (Used)", url: "https://www.schumer.nl/product/yamaha-u3-silent/", priceRange: '15k+', isSilent: true, condition: 'used', type: 'acoustic' },

  // Vleugels
  { name: "Bösendorfer 200", url: "https://www.schumer.nl/product/bosendorfer-200/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Yamaha C3X Conservatory", url: "https://www.schumer.nl/product/yamaha-c3x/", priceRange: '15k+', isSilent: false, condition: 'new', type: 'vleugel' },
  { name: "George Steck Vleugel", url: "https://www.schumer.nl/product/george-steck/", priceRange: '3-7.5k', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Steinway & Sons B211", url: "https://www.schumer.nl/product/steinway-sons-b211-2/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Boston 156 Performance Edition", url: "https://www.schumer.nl/product/boston-156/", priceRange: '15k+', isSilent: false, condition: 'new', type: 'vleugel' },
  { name: "Yamaha C6X Enspire Pro Silent", url: "https://www.schumer.nl/product/yamaha-c6x-enspire-pro-silent/", priceRange: '15k+', isSilent: true, condition: 'new', type: 'vleugel' },
  { name: "C. Bechstein Vleugel", url: "https://www.schumer.nl/product/c-bechstein/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Blüthner Meestervleugel", url: "https://www.schumer.nl/product/bluthner/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Schimmel 208T", url: "https://www.schumer.nl/product/schimmel-208t/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Schimmel 174T", url: "https://www.schumer.nl/product/schimmel-174t/", priceRange: '7.5-15k', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "Yamaha C3 Classic", url: "https://www.schumer.nl/product/yamaha-c3/", priceRange: '7.5-15k', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "C. Bechstein B203 Premium", url: "https://www.schumer.nl/product/c-bechstein-b203-2/", priceRange: '15k+', isSilent: false, condition: 'used', type: 'vleugel' },
  { name: "W. Hoffmann 190 Professional", url: "https://www.schumer.nl/product/w-hoffmann-190/", priceRange: '15k+', isSilent: false, condition: 'new', type: 'vleugel' }
];

const findBestMatches = (config: UserConfig): PianoProduct[] => {
  const wantsSilent = config.priorities.includes('silent');
  const targetType = config.instrumentType === 'vleugel' ? 'vleugel' : 'acoustic';
  
  // Stap 1: Filter op type (Strikt)
  let pool = PRODUCTS.filter(p => p.type === targetType);
  if (pool.length === 0) pool = PRODUCTS;

  // Stap 2: Probeer Budget + Conditie + Silent
  let result = pool.filter(p => {
    const conditionMatch = config.condition === 'any' || p.condition === config.condition;
    const budgetMatch = p.priceRange === config.budget;
    const silentMatch = !wantsSilent || p.isSilent;
    return conditionMatch && budgetMatch && silentMatch;
  });

  // Stap 3: Laat Silent los
  if (result.length === 0) {
    result = pool.filter(p => {
      const conditionMatch = config.condition === 'any' || p.condition === config.condition;
      return p.priceRange === config.budget && conditionMatch;
    });
  }

  // Stap 4: Laat Conditie los
  if (result.length === 0) {
    result = pool.filter(p => p.priceRange === config.budget);
  }

  // Stap 5: Laat Budget los (pak de dichtstbijzijnde items uit de pool)
  if (result.length === 0) {
    result = pool.slice(0, 3);
  }

  return result.slice(0, 3);
};

export const getPianoRecommendations = async (config: UserConfig): Promise<ConfigResult> => {
  if (config.instrumentType === 'digital') {
    return {
      title: "Digitale Piano's",
      intro: "Op dit moment tonen wij onze digitale piano's niet in deze online selectie. We nodigen u echter graag uit in onze showroom om de nieuwste Roland en Yamaha modellen zelf te vergelijken.",
      recommendations: [], 
      showShowroomCTA: true
    };
  }

  // Lokale matches zijn de basis - dit werkt ALTIJD
  const bestMatches = findBestMatches(config);
  
  const defaultResult: ConfigResult = {
    title: "Uw persoonlijk advies van Schumer",
    intro: "Op basis van uw voorkeuren hebben wij deze instrumenten uit onze collectie voor u geselecteerd. Elk instrument is door onze eigen technici gecontroleerd en speelklaar gemaakt.",
    recommendations: bestMatches.map(p => ({
      model: p.name,
      motivation: `Een uitstekende keuze die past bij uw budget (${p.priceRange}) en voorkeur voor een ${p.condition === 'new' ? 'nieuw' : 'tweedehands'} instrument.`,
      link: p.url,
      type: 'product',
      ctaText: 'Bekijk model'
    })),
    showShowroomCTA: true
  };

  // AI Verrijking (veilig verpakt)
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    console.warn("Geen geldige API key gevonden, gebruik lokale fallback.");
    return defaultResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const productsContext = bestMatches.map(p => `- ${p.name} (URL: ${p.url})`).join('\n');

    const prompt = `
      Je bent een senior piano-adviseur bij Schumer. Schrijf een kort advies.
      Klant: ${config.instrumentType}, Budget: ${config.budget}, Conditie: ${config.condition}.
      
      GEBRUIK EXACT DEZE PRODUCTEN:
      ${productsContext}

      JSON SCHEMA:
      {
        "title": "Titel",
        "intro": "Introductie (max 2 zinnen)",
        "recommendations": [
          { "model": "Naam", "motivation": "Motivatie (max 2 zinnen)", "link": "URL" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  model: { type: Type.STRING },
                  motivation: { type: Type.STRING },
                  link: { type: Type.STRING }
                },
                required: ["model", "motivation", "link"]
              }
            }
          },
          required: ["title", "intro", "recommendations"]
        }
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    
    // Validatie: AI mag geen links verzinnen die niet in onze match-set zitten
    const validRecs = (parsed.recommendations || [])
      .filter((r: any) => bestMatches.some(p => p.url === r.link))
      .map((r: any) => ({
        ...r,
        type: 'product',
        ctaText: 'Bekijk model'
      }));

    if (validRecs.length === 0) return defaultResult;

    return {
      title: parsed.title || defaultResult.title,
      intro: parsed.intro || defaultResult.intro,
      recommendations: validRecs,
      showShowroomCTA: true
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return defaultResult;
  }
};
