'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, ArrowRight } from 'lucide-react';

const IMAGE_FORMATS = [
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'JPEG/JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' },
  { label: 'GIF', value: 'image/gif', ext: 'gif' },
  { label: 'BMP', value: 'image/bmp', ext: 'bmp' },
  { label: 'TIFF', value: 'image/tiff', ext: 'tiff' },
  { label: 'ICO', value: 'image/x-icon', ext: 'ico' },
  { label: 'SVG', value: 'image/svg+xml', ext: 'svg' },
  { label: 'AVIF', value: 'image/avif', ext: 'avif' },
  { label: 'HEIC/HEIF', value: 'image/heic', ext: 'heic' },
  { label: 'JPEG 2000', value: 'image/jp2', ext: 'jp2' },
  { label: 'JPEG XL', value: 'image/jxl', ext: 'jxl' },
  { label: 'APNG', value: 'image/apng', ext: 'apng' },
  { label: 'PBM', value: 'image/x-portable-bitmap', ext: 'pbm' },
  { label: 'PGM', value: 'image/x-portable-graymap', ext: 'pgm' },
  { label: 'PPM', value: 'image/x-portable-pixmap', ext: 'ppm' },
  { label: 'PAM', value: 'image/x-portable-anymap', ext: 'pam' },
  { label: 'XBM', value: 'image/x-xbitmap', ext: 'xbm' },
  { label: 'XPM', value: 'image/x-xpixmap', ext: 'xpm' },
  { label: 'TGA/TARGA', value: 'image/x-tga', ext: 'tga' },
  { label: 'PCX', value: 'image/x-pcx', ext: 'pcx' },
  { label: 'WBMP', value: 'image/vnd.wap.wbmp', ext: 'wbmp' },
  { label: 'DDS', value: 'image/vnd-ms.dds', ext: 'dds' },
  { label: 'HDR/Radiance', value: 'image/vnd.radiance', ext: 'hdr' },
  { label: 'EXR', value: 'image/x-exr', ext: 'exr' },
  { label: 'PSD', value: 'image/vnd.adobe.photoshop', ext: 'psd' },
  { label: 'JPEG XR', value: 'image/jxr', ext: 'jxr' },
  { label: 'FLIF', value: 'image/flif', ext: 'flif' },
];

export default function ConvertPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<string>('image/png');
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0]);
    const detectedFormat = file.type || 'image/png';
    setSourceFormat(detectedFormat);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setConvertedImage(null);
    };
    reader.readAsDataURL(file);

    // Reset the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Convert image
  const handleConvert = async () => {
    if (!originalImage) return;

    setIsConverting(true);

    try {
      // Special handling for SVG
      if (sourceFormat === 'image/svg+xml' && targetFormat !== 'image/svg+xml') {
        await convertFromSVG();
      } else if (sourceFormat !== 'image/svg+xml' && targetFormat === 'image/svg+xml') {
        // Can't convert raster to SVG
        alert('Cannot convert raster images to SVG format');
        setIsConverting(false);
        return;
      } else {
        await convertRasterImage();
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert image. Please try again.');
    }

    setIsConverting(false);
  };

  // Convert from SVG to raster
  const convertFromSVG = async () => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas not found'));
          return;
        }

        canvas.width = img.width || 1000;
        canvas.height = img.height || 1000;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No 2d context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const converted = canvas.toDataURL(targetFormat, 1.0);
        setConvertedImage(converted);
        resolve();
      };
      img.onerror = reject;
      img.src = originalImage!;
    });
  };

  // Convert raster to raster
  const convertRasterImage = async () => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas not found'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No 2d context'));
          return;
        }

        // For formats that don't support transparency, fill with white
        if (targetFormat === 'image/jpeg' || targetFormat === 'image/bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        // Set quality based on format
        const quality = targetFormat === 'image/jpeg' ? 0.95 : 1.0;
        const converted = canvas.toDataURL(targetFormat, quality);
        setConvertedImage(converted);
        resolve();
      };
      img.onerror = reject;
      img.src = originalImage!;
    });
  };

  // Download converted image
  const handleDownload = () => {
    if (!convertedImage) return;

    const format = IMAGE_FORMATS.find(f => f.value === targetFormat);
    const ext = format?.ext || 'png';
    const downloadName = `${fileName}-converted.${ext}`;

    // Direct anchor method (more reliable than fetch for data URLs)
    const a = document.createElement('a');
    a.href = convertedImage;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getFormatLabel = (mimeType: string) => {
    return IMAGE_FORMATS.find(f => f.value === mimeType)?.label || 'Unknown';
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

        {/* Hidden canvas for conversion */}
        <canvas ref={canvasRef} className="hidden" />

        <main className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-20 pt-28 sm:pt-32">
          {/* Header Section */}
          <div className="w-full max-w-7xl mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-3">
              <span className="bg-linear-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent">
                Image Format Converter
              </span>
            </h1>
            <p className="text-center text-white/60 text-sm sm:text-base mb-8">
              Convert images between 28+ formats including PNG, JPEG, WebP, AVIF, HEIC, GIF, BMP, TIFF, and more
            </p>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
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

              {originalImage && (
                <>
                  {/* Convert Button */}
                  <button
                    onClick={handleConvert}
                    disabled={isConverting || sourceFormat === targetFormat}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw size={18} className={isConverting ? 'animate-spin' : ''} />
                    {isConverting ? 'Converting...' : 'Convert'}
                  </button>

                  {/* Download Button */}
                  {convertedImage && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-linear-to-r from-sky-500/20 to-violet-500/20 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:from-sky-500/30 hover:to-violet-500/30 cursor-pointer"
                    >
                      <Download size={18} />
                      Download
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Format Selection */}
            {originalImage && (
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                {/* Source Format Display */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="text-xs text-white/60">From:</span>
                  <span className="text-sm font-medium text-white/90">
                    {getFormatLabel(sourceFormat)}
                  </span>
                </div>

                <ArrowRight size={20} className="text-white/40" />

                {/* Target Format Dropdown */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="text-xs text-white/60">To:</span>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="bg-transparent text-sm font-medium text-white/90 outline-none cursor-pointer"
                  >
                    {IMAGE_FORMATS.map((format) => (
                      <option
                        key={format.value}
                        value={format.value}
                        className="bg-gray-900 text-white"
                      >
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Info message */}
            {sourceFormat === targetFormat && originalImage && (
              <div className="text-center mb-4">
                <p className="text-xs text-yellow-400/70">
                  Source and target formats are the same. Please select a different format.
                </p>
              </div>
            )}
          </div>

          {/* Preview Pane */}
          <div className="w-full max-w-7xl">
            <div
              className="relative w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
              style={{ minHeight: '600px', height: '600px' }}
            >
              {!originalImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="rounded-full border-2 border-dashed border-white/20 p-12 mb-4">
                    <Upload size={48} className="text-white/40" />
                  </div>
                  <p className="text-white/50 text-sm">Upload an image to get started</p>
                </div>
              )}

              {originalImage && !convertedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <p className="text-white/60 text-sm mb-4">Original Image</p>
                  <img
                    src={originalImage!}
                    alt="Original"
                    className="max-w-full max-h-125 object-contain"
                    style={{
                      background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              )}

              {convertedImage && (
                <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
                  {/* Original */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white/60 text-xs mb-2">
                      Original ({getFormatLabel(sourceFormat)})
                    </p>
                    <img
                      src={originalImage!}
                      alt="Original"
                      className="max-w-full max-h-125 object-contain"
                      style={{
                        background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                      }}
                    />
                  </div>

                  {/* Converted */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white/60 text-xs mb-2">
                      Converted ({getFormatLabel(targetFormat)})
                    </p>
                    <img
                      src={convertedImage}
                      alt="Converted"
                      className="max-w-full max-h-125 object-contain"
                      style={{
                        background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
