'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Crop, RotateCw, Maximize2, Check, X } from 'lucide-react';
import ReactCrop, { type Crop as CropType, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type Mode = 'view' | 'crop' | 'rotate' | 'resize';
type AspectRatio = { label: string; value: number | undefined };

const ASPECT_RATIOS: AspectRatio[] = [
  { label: '16:9', value: 16 / 9 },
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: 'Custom', value: undefined },
];

const ROTATE_PRESETS = [90, 180, 270, 360];

export default function CropRotateResizePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(ASPECT_RATIOS[3]);
  
  // Crop states
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  
  // Rotate state
  const [rotation, setRotation] = useState(0);
  
  // Resize states
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [initialDimensions, setInitialDimensions] = useState({ width: 0, height: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);

  // Adjust crop to new aspect ratio when it changes
  useEffect(() => {
    if (mode === 'crop' && cropImgRef.current && selectedAspect.value) {
      const imgWidth = cropImgRef.current.width;
      const imgHeight = cropImgRef.current.height;
      const imgAspect = imgWidth / imgHeight;
      const targetAspect = selectedAspect.value;
      
      let newWidth, newHeight;
      
      if (imgAspect > targetAspect) {
        // Image is wider, fit to height
        newHeight = 100;
        newWidth = (targetAspect / imgAspect) * 100;
      } else {
        // Image is taller, fit to width
        newWidth = 100;
        newHeight = (imgAspect / targetAspect) * 100;
      }
      
      setCrop({
        unit: '%',
        width: newWidth,
        height: newHeight,
        x: (100 - newWidth) / 2,
        y: (100 - newHeight) / 2
      });
    } else if (mode === 'crop' && !selectedAspect.value) {
      // Custom aspect ratio - reset to full
      setCrop({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0
      });
    }
  }, [selectedAspect, mode]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setInitialDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = event.target?.result as string;
      
      setOriginalImage(event.target?.result as string);
      setProcessedImage(event.target?.result as string);
      setMode('view');
      setRotation(0);
      setCrop(undefined);
    };
    reader.readAsDataURL(file);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Apply crop
  const handleApplyCrop = async () => {
    if (!completedCrop || !cropImgRef.current) return;

    try {
      const croppedImage = await getCroppedImg(cropImgRef.current, completedCrop);
      setProcessedImage(croppedImage);
      setOriginalImage(croppedImage);
      setMode('view');
      setCrop(undefined);
      
      // Update dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = croppedImage;
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // Apply rotation
  const handleApplyRotate = async () => {
    if (!processedImage) return;

    try {
      const rotatedImage = await getRotatedImg(processedImage, rotation);
      setProcessedImage(rotatedImage);
      setOriginalImage(rotatedImage);
      setMode('view');
      setRotation(0);
      
      // Update dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = rotatedImage;
    } catch (error) {
      console.error('Error rotating image:', error);
    }
  };

  // Apply resize
  const handleApplyResize = async () => {
    if (!processedImage) return;

    try {
      // Directly resize to specified dimensions (stretching if needed)
      const resizedImage = await getResizedImg(processedImage, resizeWidth, resizeHeight);
      setProcessedImage(resizedImage);
      setOriginalImage(resizedImage);
      setMode('view');
      setCrop(undefined);
      
      // Update dimensions
      setOriginalDimensions({ width: resizeWidth, height: resizeHeight });
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  // Cancel current operation
  const handleCancel = () => {
    setMode('view');
    setRotation(0);
    setCrop(undefined);
  };

  // Download image
  const handleDownload = () => {
    if (!processedImage) return;
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = 'edited-image.png';
    a.click();
  };

  // Helper to create image from data URL
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  // Get cropped image
  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/png');
  };

  // Get rotated image
  const getRotatedImg = async (imageSrc: string, rotation: number): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));

    canvas.width = image.height * sin + image.width * cos;
    canvas.height = image.height * cos + image.width * sin;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    return canvas.toDataURL('image/png');
  };

  // Get resized image
  const getResizedImg = async (
    imageSrc: string,
    width: number,
    height: number
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL('image/png');
  };

  return (
    <>
      <style jsx global>{`
        body > div > footer {
          display: none !important;
        }
      `}</style>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
        {/* Background gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
          }}
        />

        <main className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-20 pt-28 sm:pt-32">
          {/* Header Section */}
          <div className="w-full max-w-7xl mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-center mb-2 sm:mb-3">
              <span className="bg-linear-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent">
                Crop, Rotate & Resize
              </span>
            </h1>
            <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
              Transform your images with precise cropping, rotation, and resizing tools
            </p>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
              >
                <Upload size={18} />
                Upload Image
              </button>

              {processedImage && mode === 'view' && (
                <>
                  {/* Crop Button */}
                  <button
                    onClick={() => {
                      setMode('crop');
                      setCrop({
                        unit: '%',
                        width: 100,
                        height: 100,
                        x: 0,
                        y: 0
                      });
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
                  >
                    <Crop size={18} />
                    Crop
                  </button>

                  {/* Rotate Button */}
                  <button
                    onClick={() => setMode('rotate')}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
                  >
                    <RotateCw size={18} />
                    Rotate
                  </button>

                  {/* Resize Button */}
                  <button
                    onClick={() => setMode('resize')}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
                  >
                    <Maximize2 size={18} />
                    Resize
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-linear-to-r from-sky-500/20 to-violet-500/20 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:from-sky-500/30 hover:to-violet-500/30 cursor-pointer"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </>
              )}

              {/* Cancel & Apply buttons for active modes */}
              {mode !== 'view' && (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-200 backdrop-blur-md transition-all hover:bg-red-500/20 cursor-pointer"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={mode === 'crop' ? handleApplyCrop : mode === 'rotate' ? handleApplyRotate : handleApplyResize}
                    className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-200 backdrop-blur-md transition-all hover:bg-green-500/20 cursor-pointer"
                  >
                    <Check size={18} />
                    Apply
                  </button>
                </>
              )}
            </div>

            {/* Mode-specific controls */}
            {mode === 'crop' && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 px-2">
                <span className="text-[10px] sm:text-xs text-white/60 w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0">Aspect Ratio:</span>
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setSelectedAspect(ratio)}
                    className={`rounded-lg border px-3 py-1.5 text-xs backdrop-blur-md transition-all cursor-pointer ${
                      selectedAspect.label === ratio.label
                        ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            )}

            {mode === 'rotate' && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 px-2">
                <span className="text-[10px] sm:text-xs text-white/60 w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0">Quick Rotate:</span>
                {ROTATE_PRESETS.map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotation(deg)}
                    className={`rounded-lg border px-3 py-1.5 text-xs backdrop-blur-md transition-all cursor-pointer ${
                      rotation === deg
                        ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md w-full sm:w-auto">
                  <span className="text-[10px] sm:text-xs text-white/60">Custom:</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-24 sm:w-32 accent-sky-400"
                  />
                  <span className="text-[10px] sm:text-xs text-white/90 w-8 sm:w-10">{rotation}°</span>
                </div>
              </div>
            )}

            {mode === 'resize' && (
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 px-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                  <span className="text-[10px] sm:text-xs text-white/60">Target Size:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-white/60">W:</span>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => setResizeWidth(Number(e.target.value))}
                      className="w-16 sm:w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] sm:text-xs text-white/90 outline-none focus:border-sky-400/50"
                      min={1}
                    />
                    <span className="text-[10px] sm:text-xs text-white/60">H:</span>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => setResizeHeight(Number(e.target.value))}
                      className="w-16 sm:w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] sm:text-xs text-white/90 outline-none focus:border-sky-400/50"
                      min={1}
                    />
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs text-white/40 text-center">
                  Original: {initialDimensions.width} × {initialDimensions.height}
                </span>
              </div>
            )}

            {/* Current dimensions display - only in view mode */}
            {processedImage && mode === 'view' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 px-2">
                <span className="text-[10px] sm:text-xs text-white/60 text-center">
                  Current: {originalDimensions.width} × {originalDimensions.height}
                </span>
                <span className="text-xs text-white/40">
                  Original: {initialDimensions.width} × {initialDimensions.height}
                </span>
              </div>
            )}
          </div>

          {/* Preview Pane */}
          <div className="w-full max-w-7xl px-2">
            <div
              className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
              style={{ minHeight: '400px', height: 'auto' }}
            >
              {!processedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="rounded-full border-2 border-dashed border-white/20 p-12 mb-4">
                    <Upload size={48} className="text-white/40" />
                  </div>
                  <p className="text-white/50 text-sm">Upload an image to get started</p>
                </div>
              )}

              {processedImage && mode === 'view' && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    ref={imgRef}
                    src={processedImage}
                    alt="Processed"
                    className="max-w-full max-h-full object-contain"
                    style={{
                      background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              )}

              {processedImage && mode === 'crop' && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div style={{ maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ReactCrop
                      key={selectedAspect.label}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={selectedAspect.value}
                    >
                      <img
                        ref={cropImgRef}
                        src={processedImage}
                        alt="Crop"
                        style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                      />
                    </ReactCrop>
                  </div>
                </div>
              )}

              {processedImage && mode === 'resize' && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    ref={imgRef}
                    src={processedImage}
                    alt="Resize preview"
                    className="max-w-full max-h-full object-contain"
                    style={{
                      background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              )}

              {processedImage && mode === 'rotate' && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={processedImage}
                    alt="Rotate preview"
                    className="max-w-full max-h-full object-contain transition-transform duration-300"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
