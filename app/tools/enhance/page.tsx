import type { Metadata } from 'next';
import EnhanceClient from './EnhanceClient';

export const metadata: Metadata = {
  title: 'Enhance Image Quality Online',
  description:
    'Upscale and enhance photos with sharpening, contrast and saturation improvements using the Everything Image enhance tool.',
  keywords: [
    'enhance image quality',
    'upscale image online',
    'sharpen photo in browser',
    'improve low resolution image',
  ],
  openGraph: {
    title: 'Enhance Image Quality Online | Everything Image',
    description:
      'Upload a photo to upscale, sharpen and gently boost contrast and saturation for a clearer result.',
    type: 'website',
  },
};

export default function EnhancePage() {
  return <EnhanceClient />;
}

