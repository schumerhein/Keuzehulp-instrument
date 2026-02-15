
import { GoogleGenAI } from "@google/genai";
import { UserConfig, ConfigResult, Recommendation, Budget, Condition } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

interface PianoProduct {
  name: string;
  url: string;
  priceRange: Budget;
  isSilent: boolean;
  condition: 'new' | 'used';
}

const UPRIGHT_PRODUCTS: PianoProduct[] = [
  { name: "Wilh. Steinberg Upright", url: "https://www.schumer.nl/product/wilh-steinberg/", priceRange: '7.5-15k', isSilent: false, condition: 'new' },
  { name: "Schimmel C 130T", url: "https://www.schumer.nl/product/schimmel-c-130t/", priceRange: '15k+', isSilent: false, condition: 'new' },
  { name: "Yamaha SU-118 C Professional", url: "https://www.schumer.nl/product/yamaha-su-118-c-2/", priceRange: '15k+', isSilent: false, condition: 'new' },
  { name: "Ritmüller UP 177 M", url: "https://www.schumer.nl/product/ritmuller-up-177-m/", priceRange: '7.5-15k', isSilent: false, condition: 'new' },
  { name: "Schimmel 130T", url: "https://www.schumer.nl/product/schimmel-130t/", priceRange: '7.5-15k', isSilent: false, condition: 'new' },
  { name: "Schumer UP-118M", url: "https://www.schumer.nl/product/schumer-up-118m/", priceRange: '3-7.5k', isSilent: false, condition: 'new' },
  { name: "Yamaha SU-118C Heritage", url: "https://www.schumer.nl/product/yamaha-su-118c/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "Rameau Piano (Occasion)", url: "https://www.schumer.nl/product/rameau/", priceRange: '1-3k', isSilent: false, condition: 'used' },
  { name: "Seiler 116 Konsole", url: "https://www.schumer.nl/product/seiler-116/", priceRange: '3-7.5k', isSilent: false, condition: 'used' },
  { name: "Eterna ER30", url: "https://www.schumer.nl/product/eterna-er30/", priceRange: '1-3k', isSilent: false, condition: 'used' },
  { name: "Yamaha P121T Silent", url: "https://www.schumer.nl/product/yamaha-p121t-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'new' },
  { name: "Eterna ER10", url: "https://www.schumer.nl/product/eterna-er10/", priceRange: '1-3k', isSilent: false, condition: 'used' },
  { name: "Petrof 118 G1", url: "https://www.schumer.nl/product/petrof-118-g1/", priceRange: '3-7.5k', isSilent: false, condition: 'used' },
  { name: "Grotrian Steinweg 4", url: "https://www.schumer.nl/product/grotrian-steinweg-4/", priceRange: '7.5-15k', isSilent: false, condition: 'used' },
  { name: "Schumer UP-117M", url: "https://www.schumer.nl/product/schumer-up-117m/", priceRange: '3-7.5k', isSilent: false, condition: 'new' },
  { name: "Wilh. Steinberg 118", url: "https://www.schumer.nl/product/wilh-steinberg-118/", priceRange: '7.5-15k', isSilent: false, condition: 'new' },
  { name: "Yamaha B3 Silent SC2", url: "https://www.schumer.nl/product/yamaha-b3-silent-2/", priceRange: '7.5-15k', isSilent: true, condition: 'new' },
  { name: "Yamaha U1 Silent", url: "https://www.schumer.nl/product/yamaha-u1-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'used' },
  { name: "Yamaha U1 Professional", url: "https://www.schumer.nl/product/yamaha-u1-2/", priceRange: '7.5-15k', isSilent: false, condition: 'new' },
  { name: "Yamaha P121 Ebony", url: "https://www.schumer.nl/product/yamaha-p121/", priceRange: '7.5-15k', isSilent: false, condition: 'new' },
  { name: "Römhildt Piano", url: "https://www.schumer.nl/product/romhildt/", priceRange: '1-3k', isSilent: false, condition: 'used' },
  { name: "Seiler 122 Konsole Silent", url: "https://www.schumer.nl/product/seiler-122-konsole-met-yamaha-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'used' },
  { name: "Yamaha U3 Silent", url: "https://www.schumer.nl/product/yamaha-u3-silent/", priceRange: '15k+', isSilent: true, condition: 'used' },
  { name: "Yamaha B3 Silent", url: "https://www.schumer.nl/product/yamaha-b3-silent/", priceRange: '7.5-15k', isSilent: true, condition: 'new' }
];

const VLEUGEL_PRODUCTS: PianoProduct[] = [
  { name: "Bösendorfer 200", url: "https://www.schumer.nl/product/bosendorfer-200/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "Yamaha C3X Conservatory", url: "https://www.schumer.nl/product/yamaha-c3x/", priceRange: '15k+', isSilent: false, condition: 'new' },
  { name: "George Steck Vleugel (Occasion)", url: "https://www.schumer.nl/product/george-steck/", priceRange: '3-7.5k', isSilent: false, condition: 'used' },
  { name: "Steinway & Sons B211", url: "https://www.schumer.nl/product/steinway-sons-b211-2/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "Boston 156 Performance Edition", url: "https://www.schumer.nl/product/boston-156/", priceRange: '15k+', isSilent: false, condition: 'new' },
  { name: "Yamaha C6X Enspire Pro Silent", url: "https://www.schumer.nl/product/yamaha-c6x-enspire-pro-silent/", priceRange: '15k+', isSilent: true, condition: 'new' },
  { name: "C. Bechstein Vleugel", url: "https://www.schumer.nl/product/c-bechstein/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "Blüthner Meestervleugel", url: "https://www.schumer.nl/product/bluthner/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "Schimmel 208T", url: "https://www.schumer.nl/product/schimmel-208t/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "Schimmel 174T", url: "https://www.schumer.nl/product/schimmel-174t/", priceRange: '7.5-15k', isSilent: false, condition: 'used' },
  { name: "Yamaha C3 Classic", url: "https://www.schumer.nl/product/yamaha-c3/", priceRange: '7.5-15k', isSilent: false, condition: 'used' },
  { name: "C. Bechstein B203 Premium", url: "https://www.schumer.nl/product/c-bechstein-b203-2/", priceRange: '15k+', isSilent: false, condition: 'used' },
  { name: "W. Hoffmann 190 Professional", url: "https://www.schumer.nl/product/w-hoffmann-190/", priceRange: '15k+', isSilent: false, condition: 'new' }
];

export const getPianoRecommendations = async (config: UserConfig): Promise<ConfigResult> => {
  if (config.instrumentType === 'digital') {
    return {
      title: "Digitale Piano's",
      intro: "Op dit moment tonen wij onze digitale piano's niet in deze online selectie. We nodigen u echter graag uit in onze showroom om het verschil tussen digitaal en akoestisch zelf te ervaren.",
      recommendations: [], 
      showShowroomCTA: true
    };
  }

  const ai = getAI();
  
  // 1. Initial Filtering based on hard category constraint
  let filteredProducts: PianoProduct[] = config.instrumentType === 'vleugel' ? VLEUGEL_PRODUCTS : UPRIGHT_PRODUCTS;
  
  // 2. Filter by Silent system if requested
  const wantsSilent = config.priorities.includes('silent');
  if (wantsSilent) {
    filteredProducts = filteredProducts.filter(p => p.isSilent);
  }

  // 3. Filter by Condition (New vs Used)
  if (config.condition !== 'any') {
    filteredProducts = filteredProducts.filter(p => p.condition === config.condition);
  }

  // 4. Budget Match Check
  const exactMatches = filteredProducts.filter(p => p.priceRange === config.budget);
  const noExactMatches = exactMatches.length === 0;

  // We provide the AI with the list of *actually available* products based on the hard filters.
  // If the list is empty, we give them the broader category list to find an alternative.
  const productsToConsider = noExactMatches ? (config.instrumentType === 'vleugel' ? VLEUGEL_PRODUCTS : UPRIGHT_PRODUCTS) : exactMatches;

  const productsContext = productsToConsider
    .map(p => `- ${p.name} (Prijs: ${p.priceRange}, Silent: ${p.isSilent ? 'Ja' : 'Nee'}, Conditie: ${p.condition === 'new' ? 'Nieuw' : 'Occasion'}, URL: ${p.url})`)
    .join('\n');

  const prompt = `
    Je bent een senior piano-adviseur bij Schumer.
    DE KLANT ZOEKT: ${config.instrumentType === 'vleugel' ? 'Vleugel' : 'Akoestische piano'}.
    GEKOZEN BUDGET: ${config.budget}.
    CONDITIE VOORKEUR: ${config.condition === 'any' ? 'Maakt niet uit' : (config.condition === 'new' ? 'Nieuw' : 'Tweedehands/Occasion')}.
    SILENT SYSTEEM NODIG: ${wantsSilent ? 'JA' : 'NEE'}.

    STRIKTE OPDRACHT:
    1. Controleer of de gevraagde combinatie (Budget + Conditie + Silent) op voorraad is in de lijst hieronder.
    2. Zo NEE: Meld dit DIRECT in de inleiding ("Helaas hebben wij op dit moment geen [Nieuwe/Tweedehands] [Piano's/Vleugels] met Silent systeem in de prijsklasse ${config.budget} op voorraad.").
    3. Zo NEE: Doe in dat geval 1 of 2 sterke VOORSTEL(LEN) voor een vergelijkbaar alternatief uit de lijst (bijv. een andere prijsklasse of conditie) en leg uit waarom dit de beste optie is.
    4. Zo JA: Toon de exacte matches (max 3).
    5. SPECIFIEKE CASE: Als een klant een Piano >15k zoekt en die is er niet, adviseer dan een vleugel of een exclusief handgebouwd model als alternatief.

    LIJST VAN PRODUCTEN OM UIT TE KIEZEN:
    ${productsContext}

    GEEF ANTWOORD IN DIT JSON FORMAAT:
    {
      "title": "Uw persoonlijk advies van Schumer",
      "intro": "Schrijf een eerlijk en deskundig advies. Benoem het als een combinatie niet direct leverbaar is en leg het alternatief uit.",
      "recommendations": [
        {
          "model": "EXACTE NAAM UIT LIJST",
          "motivation": "Korte motivatie gericht op de specifieke wensen.",
          "link": "URL UIT LIJST",
          "ctaText": "Bekijk model"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });

    const result = JSON.parse(response.text || "{}") as ConfigResult;

    // Validation to ensure absolute categorical integrity
    result.recommendations = (result.recommendations || []).map((rec, index) => {
      const allPossible = [...UPRIGHT_PRODUCTS, ...VLEUGEL_PRODUCTS];
      const match = allPossible.find(p => p.url === rec.link || p.name === rec.model);
      
      if (!match) {
        // Safe fallback in case AI hallucinated a product
        const safeList = config.instrumentType === 'vleugel' ? VLEUGEL_PRODUCTS : UPRIGHT_PRODUCTS;
        const fallback = safeList[index % safeList.length];
        return {
          model: fallback.name,
          motivation: rec.motivation || "Een hoogwaardig instrument uit onze collectie.",
          link: fallback.url,
          type: 'product',
          ctaText: 'Bekijk model'
        } as Recommendation;
      }
      return { 
        ...rec, 
        model: match.name, 
        link: match.url, 
        type: 'product' 
      } as Recommendation;
    }).slice(0, 3);

    return result;
  } catch (error) {
    console.error("Config Engine Error:", error);
    return {
      title: "Persoonlijk advies op maat",
      intro: "Onze excuses, we kunnen op dit moment geen automatische match maken. We adviseren u graag persoonlijk over onze actuele showroomvoorraad.",
      recommendations: [
        {
          model: config.instrumentType === 'vleugel' ? "Yamaha C3X Conservatory" : "Yamaha U1 Professional",
          motivation: "Een van onze meest gevraagde modellen, bekend om zijn ongekende kwaliteit.",
          link: config.instrumentType === 'vleugel' ? "https://www.schumer.nl/product/yamaha-c3x/" : "https://www.schumer.nl/product/yamaha-u1-2/",
          type: 'product',
          ctaText: 'Bekijk model'
        }
      ],
      showShowroomCTA: true
    };
  }
};
