import type { Metadata } from 'next';
import RemoveBackgroundClient from './RemoveBackgroundClient';

export const metadata: Metadata = {
  title: 'Remove Image Background Online',
  description:
    'Automatically remove the background from photos, then refine the cutout manually with an eraser and zoom controls.',
  keywords: [
    'remove background online',
    'background remover tool',
    'cut out subject from photo',
    'transparent PNG generator',
  ],
  openGraph: {
    title: 'Online Background Remover | Everything Image',
    description:
      'Upload an image to remove the background in one click and fine-tune the result directly in your browser.',
    type: 'website',
  },
};

export default function RemoveBackgroundPage() {
  return <RemoveBackgroundClient />;
}

