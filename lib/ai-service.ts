import { Brand } from './branding';

export interface AIProvider {
  name: string;
  apiKey?: string;
  available: boolean;
}

export interface CopyGenerationOptions {
  productName: string;
  category?: string;
  ingredients?: string[];
  price?: number;
  specialFeatures?: string[];
  tone: 'casual' | 'professional' | 'playful' | 'premium';
  language: 'id' | 'en';
  platform: 'gofood' | 'grabfood' | 'shopeefood' | 'instagram' | 'general';
  // Optional experimental toggle for new Gemini behavior
  bananaMode?: boolean;
}

export interface GeneratedCopy {
  title: string;
  description: string;
  hashtags?: string[];
  callToAction?: string;
  brandMessage?: string;
}

export class AIService {
  private geminiKey: string | undefined;

  constructor(geminiKey?: string) {
    this.geminiKey = geminiKey;
  }

  getAvailableProviders(): AIProvider[] {
    return [
      {
        name: 'Gemini',
        apiKey: this.geminiKey || '',
        available: Boolean(this.geminiKey),
      },
      // Always expose Local fallback so UI can indicate offline capability
      {
        name: 'Local',
        available: true,
      },
    ];
  }

  async generateCopy(options: CopyGenerationOptions): Promise<GeneratedCopy> {
    const prompt = this.buildPrompt(options);

    // Try Gemini first if available
    if (this.geminiKey) {
      try {
        return await this.callGemini(prompt, options);
      } catch (error) {
        console.error('Gemini API failed:', error);
      }
    }

    // Final fallback to local generation
    return this.generateLocalCopy(options);
  }

  private buildPrompt(options: CopyGenerationOptions): string {
    const brandContext = `
Brand: ${Brand.name}
Identity: Japanese-Indonesian fusion yakiniku restaurant
Brand Colors: Orange ${Brand.colors.primaryOrange}, Blue ${Brand.colors.primaryBlue}
Target Audience: Millennials & Gen Z, young families
Platform: ${options.platform}
Tone: ${options.tone}
Language: ${options.language}
`;

    const productContext = `
Product: ${options.productName}
${options.category ? `Category: ${options.category}` : ''}
${options.ingredients?.length ? `Ingredients: ${options.ingredients.join(', ')}` : ''}
${options.price ? `Price: Rp ${options.price.toLocaleString('id-ID')}` : ''}
${options.specialFeatures?.length ? `Special Features: ${options.specialFeatures.join(', ')}` : ''}
`;

    const jsonSchemaInstruction = `
You MUST respond strictly as minified JSON that conforms to this TypeScript type with no extra prose:
{
  "title": string,
  "description": string,
  "hashtags": string[],
  "callToAction": string,
  "brandMessage": string
}
`;

    const bananaNote = options.bananaMode
      ? options.language === 'id'
        ? 'Aktifkan mode BANANA: gunakan gaya ekstra catchy, dinamis, dan fun; prioritaskan kata kerja yang energik.'
        : 'Enable BANANA mode: extra catchy, dynamic, and fun tone; prioritize energetic verbs.'
      : '';

    const instructions =
      options.language === 'id'
        ? `
Generate marketing copy in Indonesian for a food delivery platform. Create:
1. Catchy title (max 60 characters)
2. Appetizing description (max 200 characters)
3. Relevant hashtags (5-8 hashtags)
4. Call-to-action button text
5. Brand message that reflects Yuki Yaki Corner's identity

Make it appetizing, authentic to the brand, and optimized for ${options.platform}.
${bananaNote}

${jsonSchemaInstruction}
`
        : `
Generate marketing copy in English for a food delivery platform. Create:
1. Catchy title (max 60 characters) 
2. Appetizing description (max 200 characters)
3. Relevant hashtags (5-8 hashtags)
4. Call-to-action button text
5. Brand message that reflects Yuki Yaki Corner's identity

Make it appetizing, authentic to the brand, and optimized for ${options.platform}.
${bananaNote}

${jsonSchemaInstruction}
`;

    return brandContext + productContext + instructions;
  }

  private async callGemini(prompt: string, options: CopyGenerationOptions): Promise<GeneratedCopy> {
    if (!this.geminiKey) return this.generateLocalCopy(options);

    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.bananaMode ? 1.1 : 0.8,
        topP: 0.9,
        maxOutputTokens: 512,
      },
    } as const;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as any;
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      // Try to parse strict JSON; strip code fences if present
      const cleaned = text
        .trim()
        .replace(/^```(json)?/i, '')
        .replace(/```$/i, '')
        .trim();
      try {
        const parsed = JSON.parse(cleaned);
        // Basic normalization
        return {
          title: String(parsed.title || ''),
          description: String(parsed.description || ''),
          hashtags: Array.isArray(parsed.hashtags)
            ? parsed.hashtags.map((h: any) => String(h))
            : [],
          callToAction: String(parsed.callToAction || 'Pesan Sekarang'),
          brandMessage: String(parsed.brandMessage || ''),
        };
      } catch {
        // Fallback: attempt to heuristically build a copy
        return this.generateLocalCopy(options);
      }
    }

    return this.generateLocalCopy(options);
  }

  private generateLocalCopy(options: CopyGenerationOptions): GeneratedCopy {
    const { productName, tone, platform } = options;

    // Enhanced local copy generation based on brand guidelines
    const templates = {
      id: {
        casual: {
          title: `${productName} Segar dari ${Brand.name}! 🍖`,
          description: `Nikmati kelezatan ${productName} dengan cita rasa autentik Jepang. Daging berkualitas, bumbu istimewa, harga terjangkau!`,
          callToAction: 'Pesan Sekarang',
          brandMessage: `${Brand.name} - Cita Rasa Jepang di Indonesia`,
        },
        professional: {
          title: `${productName} Premium - ${Brand.name}`,
          description: `${productName} berkualitas tinggi dengan standar Jepang. Diolah dengan teknik tradisional yakiniku untuk pengalaman kuliner terbaik.`,
          callToAction: 'Order Sekarang',
          brandMessage: `${Brand.name} - Kualitas Terjamin, Rasa Autentik`,
        },
        playful: {
          title: `${productName} Bikin Nagih! 😋🔥`,
          description: `Siap-siap ketagihan sama ${productName} dari ${Brand.name}! Juicy, flavorful, dan bikin pengen lagi terus!`,
          callToAction: 'Yuk Cobain!',
          brandMessage: `${Brand.name} - Bikin Hari-hari Lebih Yummy!`,
        },
        premium: {
          title: `${productName} Eksklusif ${Brand.name}`,
          description: `Rasakan kemewahan ${productName} dengan kualitas premium. Setiap gigitan adalah perjalanan kuliner ke Jepang yang sesungguhnya.`,
          callToAction: 'Reservasi Sekarang',
          brandMessage: `${Brand.name} - Premium Japanese Dining Experience`,
        },
      },
    };

    const template = templates.id[tone];

    const platformHashtags = {
      gofood: ['#GoFood', '#DeliveryMakanan', '#YakinikuEnak'],
      grabfood: ['#GrabFood', '#OrderOnline', '#JapaneseCuisine'],
      shopeefood: ['#ShopeeFood', '#MakanEnak', '#YukiYaki'],
      instagram: ['#YukiYakiCorner', '#Yakiniku', '#JapaneseFood', '#Foodie', '#Instafood'],
      general: ['#YukiYakiCorner', '#DeliciousFood', '#OrderNow'],
    };

    return {
      title: template.title,
      description: template.description,
      hashtags: [...platformHashtags[platform], '#MakananJepang', '#Halal', '#Fresh', '#Authentic'],
      callToAction: template.callToAction,
      brandMessage: template.brandMessage,
    };
  }
}
