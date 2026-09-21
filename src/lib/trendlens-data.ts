// Curated intelligence corpus + deterministic report generator.
// This is the local "database" of industries, trends, competitors, regions
// and source publications the report engine composes from.

export const suggestedResearch = [
  "Electric cars in South Africa",
  "AI startups in Africa",
  "Solar energy opportunities",
  "Sustainable fashion trends",
  "Food delivery market opportunities",
];

export const categoryChips = [
  "Technology",
  "Energy",
  "AI",
  "Africa",
  "Finance",
  "Consumer",
  "Startups",
];

export type Industry = {
  key: string;
  label: string;
  match: string[];
  thesis: string;
  secondary: string;
  competitors: { name: string; share: number; signal: string }[];
  opportunities: [string, string, string, string][];
  risks: [string, string][];
  insights: { impact: string; title: string; body: string }[];
  publications: { domain: string; title: string; snippet: string }[];
  signals: string[];
  nextSteps: string[];
};

export const regions = [
  { key: "south africa", label: "South Africa" },
  { key: "africa", label: "Africa" },
  { key: "nigeria", label: "Nigeria" },
  { key: "kenya", label: "Kenya" },
  { key: "europe", label: "Europe" },
  { key: "united states", label: "United States" },
  { key: "global", label: "Global" },
];

export const industries: Industry[] = [
  {
    key: "mobility",
    label: "Mobility",
    match: ["ev", "electric", "car", "vehicle", "mobility", "transport", "fleet", "charging"],
    thesis:
      "The electric mobility market is entering a decisive growth phase—still constrained by affordability and infrastructure, but increasingly propelled by commercial demand, new entrants and policy momentum.",
    secondary:
      "The strongest near-term value sits beyond vehicle retail. Charging infrastructure, fleet conversion and financing models have clearer structural gaps and more defensible routes to scale.",
    competitors: [
      { name: "BYD", share: 31, signal: "Price leader" },
      { name: "BMW", share: 24, signal: "Premium reach" },
      { name: "Tesla", share: 18, signal: "Brand demand" },
      { name: "Volvo", share: 15, signal: "Safety equity" },
      { name: "Volkswagen", share: 12, signal: "Local scale" },
    ],
    opportunities: [
      ["EV charging infrastructure", "High", "Medium", "Severe"],
      ["Affordable EV imports", "Very high", "High", "Wide"],
      ["Fleet electrification", "High", "Low", "Underserved"],
      ["Battery second-life", "Medium", "High", "Emerging"],
    ],
    risks: [
      ["High vehicle costs", "High"],
      ["Charging infrastructure", "High"],
      ["Grid reliability", "Moderate"],
      ["Regulation and duties", "Moderate"],
      ["Consumer adoption pace", "Moderate"],
    ],
    insights: [
      {
        impact: "High impact",
        title: "Price parity is moving closer",
        body: "New entrants and more accessible imports are compressing the premium historically attached to electric vehicles.",
      },
      {
        impact: "Structural",
        title: "Charging is the market unlock",
        body: "Reliability and coverage—not consumer awareness—now represent the clearest constraint on category growth.",
      },
      {
        impact: "Emerging",
        title: "Commercial fleets lead adoption",
        body: "Predictable routes and measurable operating savings make logistics fleets the strongest near-term customer segment.",
      },
      {
        impact: "Watch",
        title: "Policy direction is improving",
        body: "Local assembly incentives and evolving import frameworks could materially change unit economics through 2027.",
      },
    ],
    publications: [
      {
        domain: "reuters.com",
        title: "Electric vehicle sales accelerate from a low base",
        snippet:
          "Registrations reveal a decisive shift in premium and commercial fleet demand across the region.",
      },
      {
        domain: "bloomberg.com",
        title: "Battery prices fall again, reshaping EV economics",
        snippet:
          "Analysts expect cost curves to bring mass-market price parity forward by several quarters.",
      },
      {
        domain: "iea.org",
        title: "Global EV Outlook 2026",
        snippet:
          "Electric vehicle adoption continues to reshape energy and transport systems worldwide.",
      },
      {
        domain: "techcrunch.com",
        title: "Charging startups raise record rounds",
        snippet:
          "Investors are backing infrastructure operators rather than vehicle brands as the durable layer.",
      },
      {
        domain: "engineeringnews.co.za",
        title: "Charging networks expand across transport corridors",
        snippet:
          "New public-private investment targets national coverage and higher-capacity charging.",
      },
      {
        domain: "mckinsey.com",
        title: "Fleet electrification: the profitable first mover",
        snippet:
          "Total-cost-of-ownership crossovers now favour electrified commercial fleets on most duty cycles.",
      },
    ],
    signals: [
      "EV registrations accelerating",
      "Fleet enquiries rising",
      "Highway corridor investment",
    ],
    nextSteps: [
      "Validate two anchor fleet customers before any capital deployment",
      "Map underserved charging corridors and secure site options",
      "Model solar-plus-storage sites to de-risk grid exposure",
      "Design a leasing product that removes upfront cost objections",
      "Publish a monthly market index to build category authority",
    ],
  },
  {
    key: "ai",
    label: "Technology & AI",
    match: ["ai", "artificial intelligence", "startup", "software", "saas", "tech", "llm", "data"],
    thesis:
      "AI adoption has moved from experimentation to procurement. Buyers now reward focused products with measurable workflow outcomes over general-purpose assistants.",
    secondary:
      "Distribution and proprietary data—not model access—decide winners. Vertical operators with regulated or messy workflows retain the widest defensibility.",
    competitors: [
      { name: "OpenAI", share: 34, signal: "Model gravity" },
      { name: "Google", share: 27, signal: "Distribution" },
      { name: "Anthropic", share: 19, signal: "Enterprise trust" },
      { name: "Mistral", share: 11, signal: "Open weights" },
      { name: "Regional players", share: 9, signal: "Local context" },
    ],
    opportunities: [
      ["Vertical AI workflows", "Very high", "Medium", "Wide"],
      ["Data infrastructure", "High", "High", "Severe"],
      ["AI compliance tooling", "High", "Medium", "Underserved"],
      ["Localised language models", "Medium", "High", "Emerging"],
    ],
    risks: [
      ["Model commoditisation", "High"],
      ["Compute and cost exposure", "High"],
      ["Talent concentration", "Moderate"],
      ["Regulatory uncertainty", "Moderate"],
      ["Buyer fatigue", "Moderate"],
    ],
    insights: [
      {
        impact: "High impact",
        title: "Budgets moved to line-of-business",
        body: "AI spend is being approved by operating teams with outcome targets rather than innovation budgets.",
      },
      {
        impact: "Structural",
        title: "Proprietary data is the moat",
        body: "Products embedded in daily workflows accumulate the data advantage models alone cannot replicate.",
      },
      {
        impact: "Emerging",
        title: "Local capital is deepening",
        body: "Regional funds and corporate venture arms are underwriting later-stage rounds previously unavailable.",
      },
      {
        impact: "Watch",
        title: "Inference costs keep falling",
        body: "Sustained price declines change which product categories become economically viable each quarter.",
      },
    ],
    publications: [
      {
        domain: "techcrunch.com",
        title: "AI startups post record funding quarter",
        snippet:
          "Vertical applications captured the majority of new capital as infrastructure valuations cooled.",
      },
      {
        domain: "bloomberg.com",
        title: "Enterprises shift AI spend to production workloads",
        snippet:
          "CIO surveys show pilots converting into multi-year contracts at unusually high rates.",
      },
      {
        domain: "reuters.com",
        title: "Regulators sharpen focus on AI accountability",
        snippet:
          "New guidance raises documentation duties for high-risk automated decision systems.",
      },
      {
        domain: "a16z.com",
        title: "The vertical AI opportunity map",
        snippet:
          "Category analysis argues workflow depth outperforms horizontal assistants on retention.",
      },
      {
        domain: "statista.com",
        title: "AI market sizing and adoption index",
        snippet:
          "Adoption data tracks accelerating deployment across mid-market services businesses.",
      },
      {
        domain: "disrupt-africa.com",
        title: "African AI ecosystem report",
        snippet: "Founder density and enterprise pilots grew sharply across three regional hubs.",
      },
    ],
    signals: [
      "Enterprise pilots converting",
      "Inference costs falling",
      "Vertical funding concentration",
    ],
    nextSteps: [
      "Choose one workflow and instrument its measurable outcome",
      "Secure three design partners with production data access",
      "Build an evaluation harness before scaling the model layer",
      "Price on outcomes rather than seats to shorten procurement",
      "Establish compliance documentation early for enterprise buyers",
    ],
  },
  {
    key: "energy",
    label: "Energy",
    match: ["solar", "energy", "power", "renewable", "battery", "storage", "grid"],
    thesis:
      "Energy resilience is now a commercial requirement rather than a sustainability preference, and that shift is what makes distributed generation bankable.",
    secondary:
      "Financing structures, not panels, decide adoption. Whoever removes the upfront cost barrier captures the installed base and the long-term service annuity.",
    competitors: [
      { name: "Utility incumbents", share: 29, signal: "Scale" },
      { name: "Independent producers", share: 25, signal: "Speed" },
      { name: "Installer networks", share: 21, signal: "Reach" },
      { name: "Financing platforms", share: 15, signal: "Capital" },
      { name: "Hardware importers", share: 10, signal: "Cost" },
    ],
    opportunities: [
      ["Solar-as-a-service", "Very high", "Medium", "Wide"],
      ["Commercial storage", "High", "High", "Severe"],
      ["Grid-services software", "High", "Medium", "Underserved"],
      ["Maintenance networks", "Medium", "Low", "Emerging"],
    ],
    risks: [
      ["Capital intensity", "High"],
      ["Tariff and policy change", "High"],
      ["Import currency exposure", "Moderate"],
      ["Installer quality variance", "Moderate"],
      ["Grid interconnection delay", "Moderate"],
    ],
    insights: [
      {
        impact: "High impact",
        title: "Resilience drives procurement",
        body: "Outage exposure has turned distributed generation into an operating-continuity purchase.",
      },
      {
        impact: "Structural",
        title: "Storage economics crossed over",
        body: "Falling cell prices make commercial storage viable on shorter payback windows than before.",
      },
      {
        impact: "Emerging",
        title: "Financing is the bottleneck",
        body: "Demand outpaces available structured capital, leaving well-capitalised operators unusually advantaged.",
      },
      {
        impact: "Watch",
        title: "Regulation is loosening",
        body: "Wheeling and self-generation reforms expand who can sell power and on what terms.",
      },
    ],
    publications: [
      {
        domain: "reuters.com",
        title: "Renewables investment reaches new high",
        snippet:
          "Distributed generation captured a record share of new installed capacity this year.",
      },
      {
        domain: "bloomberg.com",
        title: "Battery storage costs keep falling",
        snippet:
          "BNEF data shows commercial payback periods shortening across most tariff structures.",
      },
      {
        domain: "iea.org",
        title: "Renewables 2026 market update",
        snippet: "Policy reform and corporate procurement are the two dominant demand drivers.",
      },
      {
        domain: "esi-africa.com",
        title: "Wheeling reforms open private power trade",
        snippet:
          "New frameworks allow independent producers to sell directly to commercial offtakers.",
      },
      {
        domain: "techcrunch.com",
        title: "Climate-tech financing platforms scale",
        snippet:
          "Investors back originators that bundle installation, credit and long-term service.",
      },
      {
        domain: "irena.org",
        title: "Renewable capacity statistics",
        snippet: "Global dataset confirms accelerating deployment in emerging market economies.",
      },
    ],
    signals: [
      "Commercial procurement rising",
      "Storage payback improving",
      "Regulatory reform underway",
    ],
    nextSteps: [
      "Structure a financing product before scaling installation capacity",
      "Target commercial offtakers with measurable outage cost",
      "Lock hardware supply against currency volatility",
      "Build a certified installer network with quality guarantees",
      "Develop monitoring software as the recurring revenue layer",
    ],
  },
  {
    key: "consumer",
    label: "Consumer",
    match: [
      "fashion",
      "food",
      "delivery",
      "retail",
      "consumer",
      "ecommerce",
      "brand",
      "hospitality",
    ],
    thesis:
      "Consumer categories are polarising: value-led offers and genuinely differentiated premium propositions are growing, while the undifferentiated middle is losing share.",
    secondary:
      "Unit economics decide survival. Operators with owned demand channels and disciplined fulfilment costs are compounding while discount-driven competitors stall.",
    competitors: [
      { name: "Marketplace leaders", share: 33, signal: "Traffic" },
      { name: "Vertical brands", share: 22, signal: "Margin" },
      { name: "Retail incumbents", share: 20, signal: "Logistics" },
      { name: "Independent operators", share: 14, signal: "Community" },
      { name: "Social commerce", share: 11, signal: "Discovery" },
    ],
    opportunities: [
      ["Owned-channel brands", "High", "Medium", "Wide"],
      ["Fulfilment services", "High", "High", "Underserved"],
      ["Resale and circularity", "Medium", "Medium", "Emerging"],
      ["Loyalty infrastructure", "Medium", "Low", "Emerging"],
    ],
    risks: [
      ["Discount-led competition", "High"],
      ["Fulfilment cost inflation", "High"],
      ["Consumer spending pressure", "Moderate"],
      ["Channel dependency", "Moderate"],
      ["Supply chain volatility", "Moderate"],
    ],
    insights: [
      {
        impact: "High impact",
        title: "The middle is disappearing",
        body: "Growth concentrates at clear value and clear premium; generic positioning loses pricing power.",
      },
      {
        impact: "Structural",
        title: "Fulfilment defines margin",
        body: "Delivery density and returns handling now explain most of the profitability gap between operators.",
      },
      {
        impact: "Emerging",
        title: "Social discovery converts",
        body: "Creator-led channels are producing lower acquisition costs than paid search for new brands.",
      },
      {
        impact: "Watch",
        title: "Circular models gain traction",
        body: "Resale and repair programmes are moving from marketing gestures to measurable revenue lines.",
      },
    ],
    publications: [
      {
        domain: "reuters.com",
        title: "Retail sales data signals cautious consumers",
        snippet: "Spending shifts toward value formats while premium niches hold resilient demand.",
      },
      {
        domain: "bloomberg.com",
        title: "Delivery platforms chase profitability",
        snippet:
          "Operators cut subsidies and raise take rates as investors demand contribution margin.",
      },
      {
        domain: "businessoffashion.com",
        title: "Sustainable fashion moves to the mainstream",
        snippet:
          "Resale and repair programmes shift from pilot projects to core commercial channels.",
      },
      {
        domain: "techcrunch.com",
        title: "Commerce infrastructure startups expand",
        snippet: "Fulfilment and loyalty tooling attract funding as brands seek owned demand.",
      },
      {
        domain: "statista.com",
        title: "E-commerce penetration index",
        snippet:
          "Category data highlights uneven online adoption across regional consumer markets.",
      },
      {
        domain: "nielseniq.com",
        title: "Consumer outlook report",
        snippet: "Panel data shows trade-down behaviour alongside selective premium spending.",
      },
    ],
    signals: ["Value polarisation", "Fulfilment cost pressure", "Creator-led acquisition"],
    nextSteps: [
      "Define a sharp value or premium position and remove the middle",
      "Model contribution margin per order before scaling spend",
      "Build owned channels to reduce marketplace dependency",
      "Pilot a resale or repair line for retention and margin",
      "Negotiate fulfilment rates against realistic volume commitments",
    ],
  },
];

export const fallbackIndustry: Industry = {
  key: "general",
  label: "General business",
  match: [],
  thesis:
    "This query does not match a supported industry example. Treat this briefing as a research checklist, not a finding about the market.",
  secondary:
    "Start with customer interviews and reliable local evidence before estimating demand or investing.",
  competitors: [],
  publications: [],
  opportunities: [],
  risks: [
    ["Demand has not been validated", "High"],
    ["Costs and competitors are unknown", "High"],
  ],
  insights: [
    {
      impact: "Research needed",
      title: "Define your customer",
      body: "Identify a specific customer segment and the problem they would pay to solve.",
    },
  ],
  signals: ["No live evidence collected"],
  nextSteps: [
    "Define a narrow target customer",
    "Interview potential buyers",
    "Research existing alternatives",
    "Estimate costs and test willingness to pay",
  ],
};

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function pick(seed: number, min: number, max: number) {
  return min + (seed % (max - min + 1));
}

export function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => (word.length > 3 ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function resolveIndustry(query: string): Industry {
  const q = ` ${query.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  let best = fallbackIndustry;
  let bestScore = 0;
  for (const industry of industries) {
    const score = industry.match.reduce(
      (acc, token) => (q.includes(` ${token} `) ? acc + token.length : acc),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = industry;
    }
  }
  return best;
}

export function resolveRegion(query: string) {
  const q = query.toLowerCase();
  return regions.find((region) => q.includes(region.key))?.label ?? "Global";
}

export type ReportSource = {
  domain: string;
  title: string;
  snippet: string;
  rank: number;
  url: string;
};

export type Report = {
  decisionTests?: {
    assumption: string;
    counterargument: string;
    experiment: string;
    successCriterion: string;
  }[];
  evidence?: { claim: string; sourceRanks: number[] }[];
  saved?: boolean;
  live?: boolean;
  engine?: "corpus" | "serpapi" | "gemini" | "serpapi+gemini";
  id: string;
  kind: "report" | "opportunity";
  query: string;
  title: string;
  industry: string;
  region: string;
  createdAt: number;
  summary: string;
  secondary: string;
  metrics: {
    trend: number | null;
    sentiment: number | null;
    opportunity: number | null;
    confidence: number | null;
  };
  growth: string;
  sourceCount: number;
  signalCount: number;
  insights: Industry["insights"];
  competitors: { name: string; share: number | null; signal: string }[];
  opportunities: Industry["opportunities"];
  risks: Industry["risks"];
  sources: ReportSource[];
  verdict: { label: string; headline: string; body: string };
  signals: string[];
  nextSteps: string[];
  demand: string;
  pressure: string;
  gap: string;
};

const verdicts = [
  { label: "PROMISING OPPORTUNITY", headline: "Promising market", min: 78 },
  { label: "NICHE MARKET", headline: "Niche but viable", min: 62 },
  { label: "HIGH RISK", headline: "High risk entry", min: 0 },
];

export function generateReport(
  rawQuery: string,
  kind: "report" | "opportunity" = "report",
): Report {
  const query = rawQuery.trim() || "Market intelligence";
  const industry = resolveIndustry(query);
  const region = resolveRegion(query);
  const seed = hash(query.toLowerCase());

  const trend = pick(seed, 63, 94);
  const sentiment = pick(seed >> 3, 55, 89);
  const opportunity = pick(seed >> 6, 58, 93);
  const confidence = pick(seed >> 9, 71, 96);
  const verdict = verdicts.find((entry) => opportunity >= entry.min)!;

  const sourceCount = 4 + (seed % 3); // 4–6 source cards
  const rotated = industry.publications
    .slice(seed % industry.publications.length)
    .concat(industry.publications.slice(0, seed % industry.publications.length));

  const sources: ReportSource[] = rotated.slice(0, sourceCount).map((publication, index) => ({
    ...publication,
    rank: index + 1,
    url: `https://${publication.domain}`,
  }));

  return {
    id: `${seed.toString(36)}-${kind}`,
    kind,
    query,
    title: titleCase(query),
    industry: industry.label,
    region,
    createdAt: Date.now(),
    summary: industry.thesis,
    secondary: industry.secondary,
    metrics: { trend, sentiment, opportunity, confidence },
    growth: `+${pick(seed >> 12, 9, 44)}% YoY`,
    sourceCount: sources.length,
    signalCount: industry.signals.length,
    live: false,
    engine: "corpus",
    insights: industry.insights,
    competitors: industry.competitors,
    opportunities: industry.opportunities,
    risks: industry.risks,
    sources,
    verdict: {
      label: verdict.label,
      headline: verdict.headline,
      body: industry.secondary,
    },
    signals: industry.signals,
    nextSteps: industry.nextSteps,
    demand: opportunity > 80 ? "Accelerating" : opportunity > 68 ? "Steady" : "Early",
    pressure: industry.competitors[0]!.share > 30 ? "Concentrated" : "Fragmented",
    gap:
      opportunity > 80 ? "Wide and underserved" : opportunity > 68 ? "Defensible niche" : "Narrow",
  };
}

// Backwards-compatible exports used by the static landing preview.
const showcase = generateReport("Electric cars in South Africa");
export const reportInsights = showcase.insights;
export const competitors = showcase.competitors;
export const sources = showcase.sources;
