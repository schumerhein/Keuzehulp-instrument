
import { GoogleGenAI, Type } from "@google/genai";
import { UserConfig, ConfigResult, Recommendation, Budget, PianoProduct } from "../types";

const INVENTORY_URL = "https://www.schumer.nl/wp-json/schumer/v1/keuzehulp-instrumenten";

const budgetFor = (price: number | null): Budget | null => {
  if (price === null || price <= 0) return null;
  if (price < 3000) return '1-3k';
  if (price < 7500) return '3-7.5k';
  if (price < 15000) return '7.5-15k';
  return '15k+';
};

// Haalt de actuele voorraad live op van schumer.nl. Er is bewust GEEN vaste lijst als terugval:
// een verkocht of offline gehaald instrument mag nooit meer in het advies terugkomen.
const fetchInventory = async (): Promise<PianoProduct[]> => {
  const res = await fetch(INVENTORY_URL, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Voorraad ophalen mislukt (${res.status})`);
  const data = await res.json();
  const list = Array.isArray(data?.instrumenten) ? data.instrumenten : [];
  const products: PianoProduct[] = [];
  for (const i of list) {
    const priceRange = budgetFor(typeof i.prijs === 'number' ? i.prijs : null);
    if (!priceRange || !i.naam || !i.url) continue;
    products.push({
      name: i.naam,
      url: i.url,
      priceRange,
      isSilent: !!i.silent,
      condition: i.conditie === 'new' ? 'new' : 'used',
      type: i.type === 'vleugel' ? 'vleugel' : 'acoustic',
    });
  }
  return products;
};

const BUDGET_ORDER: Budget[] = ['1-3k', '3-7.5k', '7.5-15k', '15k+'];

const findBestMatches = (config: UserConfig, products: PianoProduct[]): PianoProduct[] => {
  const wantsSilent = config.priorities.includes('silent');
  const targetType = config.instrumentType === 'vleugel' ? 'vleugel' : 'acoustic';

  // Stap 1: Filter op type (strikt). Is er van dit type niets in voorraad, dan is er niets om te tonen.
  const pool = products.filter(p => p.type === targetType);
  if (pool.length === 0) return [];

  const conditionOk = (p: PianoProduct) => config.condition === 'any' || p.condition === config.condition;

  // Stap 2: Budget + Conditie + Silent
  let result = pool.filter(p => p.priceRange === config.budget && conditionOk(p) && (!wantsSilent || p.isSilent));

  // Stap 3: Laat Silent los
  if (result.length === 0) result = pool.filter(p => p.priceRange === config.budget && conditionOk(p));

  // Stap 4: Laat Conditie los
  if (result.length === 0) result = pool.filter(p => p.priceRange === config.budget);

  // Stap 5: Laat Budget los: neem de instrumenten met het dichtstbijzijnde budget
  if (result.length === 0) {
    const target = BUDGET_ORDER.indexOf(config.budget);
    result = [...pool].sort((a, b) =>
      Math.abs(BUDGET_ORDER.indexOf(a.priceRange) - target) - Math.abs(BUDGET_ORDER.indexOf(b.priceRange) - target)
    );
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

  // Actuele voorraad live van schumer.nl
  let inventory: PianoProduct[] = [];
  try {
    inventory = await fetchInventory();
  } catch (error) {
    console.error("Voorraad ophalen mislukt:", error);
  }

  const bestMatches = findBestMatches(config, inventory);

  if (bestMatches.length === 0) {
    return {
      title: "Kom langs in onze showroom",
      intro: "Op dit moment kunnen wij u online geen passend instrument tonen. Ons aanbod wisselt regelmatig, dus laat u persoonlijk adviseren in onze showroom in Hengelo.",
      recommendations: [],
      showShowroomCTA: true
    };
  }
  
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
