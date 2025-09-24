export type MarketplacePreset =
  | 'gofood'
  | 'grabfood'
  | 'grabfood_cover'
  | 'shopeefood'
  | 'instagram'
  | 'general';

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
  // Output/Compliance
  format: 'jpeg' | 'png';
  flattenBackground: boolean; // flatten transparency to backgroundColor
  backgroundColor: string; // used when flattening or padding
  allowTransparency: boolean;
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
    format: 'jpeg',
    flattenBackground: true,
    backgroundColor: '#FFFFFF',
    allowTransparency: false,
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
    // Menu item photos: 1:1; Store cover commonly 9:5 (disiapkan terpisah di masa depan)
    dimensions: { width: 1200, height: 1200, aspectRatio: '1:1' },
    quality: 86,
    format: 'jpeg',
    flattenBackground: true,
    backgroundColor: '#FFFFFF',
    allowTransparency: false,
    optimization: {
      brightness: 1.07,
      saturation: 1.14,
      sharpness: 1.18,
      contrast: 1.05,
    },
    branding: {
      watermark: false,
      brandColors: true,
      logoOverlay: false,
    },
    fileSize: { max: 1.5, unit: 'MB' },
    description:
      'Optimized untuk GrabFood - foto menu 1:1 dengan enhancement balanced dan background putih',
  },
  grabfood_cover: {
    name: 'GrabFood Cover',
    // Store cover commonly uses 9:5 banner
    dimensions: { width: 1800, height: 1000, aspectRatio: '9:5' },
    quality: 85,
    format: 'jpeg',
    flattenBackground: true,
    backgroundColor: '#FFFFFF',
    allowTransparency: false,
    optimization: {
      brightness: 1.06,
      saturation: 1.12,
      sharpness: 1.15,
      contrast: 1.04,
    },
    branding: {
      watermark: false,
      brandColors: true,
      logoOverlay: false,
    },
    fileSize: { max: 2, unit: 'MB' },
    description: 'Banner cover GrabFood (9:5) dengan background putih dan visual bersih',
  },
  shopeefood: {
    name: 'ShopeeFood',
    dimensions: { width: 800, height: 800, aspectRatio: '1:1' },
    quality: 88,
    format: 'jpeg',
    flattenBackground: true,
    backgroundColor: '#FFFFFF',
    allowTransparency: false,
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
    format: 'jpeg',
    flattenBackground: true,
    backgroundColor: '#FFFFFF',
    allowTransparency: false,
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
    format: 'png',
    flattenBackground: false,
    backgroundColor: '#FFFFFF',
    allowTransparency: true,
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
