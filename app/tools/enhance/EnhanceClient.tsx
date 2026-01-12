'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Maximize2 } from 'lucide-react';

export default function EnhanceClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const enhanceImage = (imageSrc: string) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = 2;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const sharpened = applySharpenFilter(imageData);
        ctx.putImageData(sharpened, 0, 0);

        ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
        ctx.drawImage(canvas, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageSrc;
    });
  };

  const applySharpenFilter = (imageData: ImageData): ImageData => {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);

    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIndex = (ky + 1) * 3 + (kx + 1);
              sum += pixels[pixelIndex] * kernel[kernelIndex];
            }
          }
          const outputIndex = (y * width + x) * 4 + c;
          output.data[outputIndex] = Math.min(255, Math.max(0, sum));
        }
        const alphaIndex = (y * width + x) * 4 + 3;
        output.data[alphaIndex] = pixels[alphaIndex];
      }
    }

    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) {
        output.data[x * 4 + c] = pixels[x * 4 + c];
        output.data[((height - 1) * width + x) * 4 + c] = pixels[((height - 1) * width + x) * 4 + c];
      }
    }
    for (let y = 0; y < height; y++) {
      for (let c = 0; c < 4; c++) {
        output.data[(y * width) * 4 + c] = pixels[(y * width) * 4 + c];
        output.data[(y * width + width - 1) * 4 + c] = pixels[(y * width + width - 1) * 4 + c];
      }
    }

    return output;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0]);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageSrc = event.target?.result as string;
      setOriginalImage(imageSrc);
      const enhanced = await enhanceImage(imageSrc);
      setEnhancedImage(enhanced);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.type === 'mousemove') return;
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const updateSliderPosition = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  const handleDownload = () => {
    if (!enhancedImage) return;

    const a = document.createElement('a');
    a.href = enhancedImage;
    a.download = `${fileName}-enhanced.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-7xl mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-center mb-2 sm:mb-3">
            <span className="bg-linear-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent">
              Enhance Image
            </span>
          </h1>
          <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
            Upscale and enhance your images with AI-powered quality improvements
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} className="sm:w-4.5 sm:h-4.5" />
              <span className="hidden xs:inline">Upload Image</span>
              <span className="xs:hidden">Upload</span>
            </button>

            {enhancedImage && !isProcessing && (
              <>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-linear-to-r from-sky-500/20 to-violet-500/20 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md transition-all hover:from-sky-500/30 hover:to-violet-500/30 cursor-pointer"
                >
                  <Download size={16} className="sm:w-4.5 sm:h-4.5" />
                  Download Enhanced
                </button>
              </>
            )}
          </div>
        </div>

        {originalImage && (
          <div className="w-full max-w-7xl px-2">
            <div
              className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
              style={{ height: '600px' }}
            >
              {isProcessing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <Maximize2 size={48} className="text-sky-400 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mt-6">Enhancing your image...</p>
                  <p className="text-white/50 text-xs mt-2">Upscaling and applying quality improvements</p>
                </div>
              ) : enhancedImage ? (
                <div className="relative w-full h-full flex flex-col">
                  <div
                    ref={containerRef}
                    className="relative flex-1 flex items-center justify-center overflow-hidden cursor-ew-resize select-none bg-black"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                  >
                    <img
                      src={enhancedImage}
                      alt="Enhanced"
                      className="w-full h-full object-contain"
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />

                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-full object-contain"
                      style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                      }}
                    />

                    <div className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg px-3 py-1.5 pointer-events-none z-20">
                      <span className="text-xs text-red-200 font-semibold">Before</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg px-3 py-1.5 pointer-events-none z-20">
                      <span className="text-xs text-green-200 font-semibold">After</span>
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto">
                        <div className="flex gap-1">
                          <div className="w-0.5 h-4 bg-gray-700"></div>
                          <div className="w-0.5 h-4 bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-3 bg-black/20 backdrop-blur-sm border-t border-white/10">
                    <p className="text-xs text-white/70 text-center">
                      Drag the slider to compare before and after
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {!originalImage && !isProcessing && (
          <div className="w-full max-w-7xl px-2">
            <div
              className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
              style={{ minHeight: '500px' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="rounded-full border-2 border-dashed border-white/20 p-12 mb-4">
                  <Upload size={48} className="text-white/40" />
                </div>
                <p className="text-white/50 text-sm">Upload an image to enhance it</p>
              </div>
            </div>
          </div>
        )}

        <section className="mt-16 w-full max-w-5xl border-t border-white/10 pt-8 text-sm text-white/70">
          <h1 className="sr-only">Enhance and upscale images online in your browser</h1>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Sharpen soft photos and upscale small images without complex software
          </h2>
          <p className="mt-3">
            The enhance tool uses upscaling, sharpening and gentle contrast
            boosts to refresh older screenshots and low-resolution photos so
            they look clearer on modern screens.
          </p>
        </section>
      </main>
    </div>
  );
}
