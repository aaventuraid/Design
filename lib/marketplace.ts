export type MarketplacePreset = 'gofood' | 'grabfood' | 'shopeefood' | 'instagram' | 'general';

export interface MarketplaceConfig {
  name: string;
  dimensions: { width: number; height: number; aspectRatio: string };
  quality: number;
  optimization: {
    brightness: number;
    saturation: number;
    sharpness: number;
    contrast: number;
  };
  branding?: {
    watermark: boolean;
    brandColors: boolean;
    logoOverlay: boolean;
  };
  fileSize: { max: number; unit: 'KB' | 'MB' };
  description: string;
}

export const MarketplacePresets: Record<MarketplacePreset, MarketplaceConfig> = {
  gofood: {
    name: 'GoFood',
    dimensions: { width: 1080, height: 1080, aspectRatio: '1:1' },
    quality: 90,
    optimization: {
      brightness: 1.08,
      saturation: 1.15,
      sharpness: 1.2,
      contrast: 1.05,
    },
    branding: {
      watermark: false,
      brandColors: true,
      logoOverlay: false,
    },
    fileSize: { max: 2, unit: 'MB' },
    description:
      'Optimized untuk GoFood - foto square berkualitas tinggi dengan warna cerah yang menggugah selera',
  },
  grabfood: {
    name: 'GrabFood',
    dimensions: { width: 1200, height: 900, aspectRatio: '4:3' },
    quality: 85,
    optimization: {
      brightness: 1.06,
      saturation: 1.12,
      sharpness: 1.1,
      contrast: 1.03,
    },
    branding: {
      watermark: false,
      brandColors: true,
      logoOverlay: false,
    },
    fileSize: { max: 1.5, unit: 'MB' },
    description: 'Optimized untuk GrabFood - format landscape dengan enhancement balanced',
  },
  shopeefood: {
    name: 'ShopeeFood',
    dimensions: { width: 800, height: 800, aspectRatio: '1:1' },
    quality: 88,
    optimization: {
      brightness: 1.05,
      saturation: 1.18,
      sharpness: 1.0,
      contrast: 1.02,
    },
    branding: {
      watermark: false,
      brandColors: true,
      logoOverlay: false,
    },
    fileSize: { max: 1, unit: 'MB' },
    description: 'Optimized untuk ShopeeFood - ukuran compact dengan saturasi tinggi',
  },
  instagram: {
    name: 'Instagram',
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    quality: 92,
    optimization: {
      brightness: 1.1,
      saturation: 1.25,
      sharpness: 1.3,
      contrast: 1.08,
    },
    branding: {
      watermark: true,
      brandColors: true,
      logoOverlay: true,
    },
    fileSize: { max: 3, unit: 'MB' },
    description: 'Optimized untuk Instagram - vertical format dengan branding Yuki Yaki Corner',
  },
  general: {
    name: 'General',
    dimensions: { width: 1024, height: 1024, aspectRatio: '1:1' },
    quality: 85,
    optimization: {
      brightness: 1.05,
      saturation: 1.12,
      sharpness: 1.0,
      contrast: 1.0,
    },
    branding: {
      watermark: false,
      brandColors: false,
      logoOverlay: false,
    },
    fileSize: { max: 2, unit: 'MB' },
    description: 'Preset umum dengan enhancement minimal',
  },
};

export function getPresetOptions(): {
  value: MarketplacePreset;
  label: string;
  description: string;
}[] {
  return Object.entries(MarketplacePresets).map(([key, config]) => ({
    value: key as MarketplacePreset,
    label: config.name,
    description: config.description,
  }));
}

export function getPresetConfig(preset: MarketplacePreset): MarketplaceConfig {
  return MarketplacePresets[preset];
}
