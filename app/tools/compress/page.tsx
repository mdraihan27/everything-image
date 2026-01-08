'use client';

import { useState, useRef } from 'react';
import { Upload, Download, Minimize2, Info } from 'lucide-react';
import imageCompression from 'browser-image-compression';

type CompressionPreset = {
  label: string;
  maxSizeMB: number;
  quality: number;
};

const COMPRESSION_PRESETS: CompressionPreset[] = [
  { label: 'Light (High Quality)', maxSizeMB: 2, quality: 0.9 },
  { label: 'Medium (Balanced)', maxSizeMB: 1, quality: 0.8 },
  { label: 'Heavy (Small Size)', maxSizeMB: 0.5, quality: 0.7 },
  { label: 'Maximum (Tiny)', maxSizeMB: 0.2, quality: 0.6 },
];

export default function CompressPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<CompressionPreset>(COMPRESSION_PRESETS[1]);
  const [customSize, setCustomSize] = useState<number>(1);
  const [customQuality, setCustomQuality] = useState<number>(80);
  const [useCustom, setUseCustom] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  
  // File size states
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate compression ratio
  const getCompressionRatio = (): string => {
    if (originalSize === 0 || compressedSize === 0) return '0%';
    const ratio = ((originalSize - compressedSize) / originalSize) * 100;
    return ratio.toFixed(1) + '%';
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0]);
    setOriginalFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setCompressedImage(null);
      setCompressedFile(null);
      setCompressedSize(0);
    };
    reader.readAsDataURL(file);

    // Reset the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Compress image
  const handleCompress = async () => {
    if (!originalFile) return;

    setIsCompressing(true);

    try {
      const options = useCustom
        ? {
            maxSizeMB: customSize,
            maxWidthOrHeight: 4096,
            useWebWorker: true,
            initialQuality: customQuality / 100,
          }
        : {
            maxSizeMB: selectedPreset.maxSizeMB,
            maxWidthOrHeight: 4096,
            useWebWorker: true,
            initialQuality: selectedPreset.quality,
          };

      const compressed = await imageCompression(originalFile, options);
      
      setCompressedFile(compressed);
      setCompressedSize(compressed.size);

      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompressedImage(event.target?.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Failed to compress image. Please try again.');
    }

    setIsCompressing(false);
  };

  // Download compressed image
  const handleDownload = () => {
    if (!compressedFile) return;

    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}-compressed.${originalFile?.type.split('/')[1] || 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                Image Compressor
              </span>
            </h1>
            <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
              Reduce image file size while maintaining quality - supports PNG, JPEG, WebP, and more
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
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
              >
                <Upload size={16} className="sm:w-4.5 sm:h-4.5" />
                <span className="hidden xs:inline">Upload Image</span>
                <span className="xs:hidden">Upload</span>
              </button>

              {originalImage && (
                <>
                  {/* Compress Button */}
                  <button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 backdrop-blur-md transition-all hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:animate-none"
                  >
                    <Minimize2 size={16} className={`sm:w-4.5 sm:h-4.5 ${isCompressing ? 'animate-pulse' : ''}`} />
                    {isCompressing ? 'Compressing...' : 'Compress'}
                  </button>

                  {/* Download Button */}
                  {compressedImage && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-linear-to-r from-sky-500/20 to-violet-500/20 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md transition-all hover:from-sky-500/30 hover:to-violet-500/30 cursor-pointer"
                    >
                      <Download size={16} className="sm:w-4.5 sm:h-4.5" />
                      Download
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Compression Settings */}
            {originalImage && (
              <div className="space-y-4">
                {/* Preset/Custom Toggle */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 px-2">
                  <button
                    onClick={() => setUseCustom(false)}
                    className={`rounded-lg border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer ${
                      !useCustom
                        ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    onClick={() => setUseCustom(true)}
                    className={`rounded-lg border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer ${
                      useCustom
                        ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Preset Buttons */}
                {!useCustom && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4 px-2">
                    {COMPRESSION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setSelectedPreset(preset)}
                        className={`rounded-lg border px-3 py-1.5 text-[10px] sm:text-xs backdrop-blur-md transition-all cursor-pointer ${
                          selectedPreset.label === preset.label
                            ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom Controls */}
                {useCustom && (
                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 px-2">
                    {/* Target Size */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                      <span className="text-[10px] sm:text-xs text-white/60">Max Size (MB):</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="range"
                          min={0.1}
                          max={5}
                          step={0.1}
                          value={customSize}
                          onChange={(e) => setCustomSize(Number(e.target.value))}
                          className="w-32 sm:w-40 accent-sky-400"
                        />
                        <span className="text-[10px] sm:text-xs text-white/90 w-12 sm:w-16">{customSize.toFixed(1)} MB</span>
                      </div>
                    </div>

                    {/* Quality */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                      <span className="text-[10px] sm:text-xs text-white/60">Quality:</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="range"
                          min={10}
                          max={100}
                          step={5}
                          value={customQuality}
                          onChange={(e) => setCustomQuality(Number(e.target.value))}
                          className="w-32 sm:w-40 accent-sky-400"
                        />
                        <span className="text-[10px] sm:text-xs text-white/90 w-10 sm:w-12">{customQuality}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Card */}
                <div className="flex items-start gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-md max-w-2xl mx-auto">
                  <Info size={14} className="text-sky-300 mt-0.5 shrink-0 sm:w-4 sm:h-4" />
                  <p className="text-[10px] sm:text-xs text-sky-200/90 leading-relaxed">
                    {useCustom
                      ? `Compressing to approximately ${customSize.toFixed(1)} MB with ${customQuality}% quality. Lower quality = smaller file size.`
                      : `${selectedPreset.label}: Target size ~${selectedPreset.maxSizeMB} MB with ${Math.round(selectedPreset.quality * 100)}% quality`}
                  </p>
                </div>
              </div>
            )}

            {/* File Size Comparison */}
            {compressedImage && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 backdrop-blur-md">
                  <span className="text-[10px] sm:text-xs text-white/60">Original:</span>
                  <span className="text-xs sm:text-sm font-semibold text-white/90">{formatFileSize(originalSize)}</span>
                </div>
                
                <div className="text-white/40 hidden sm:block">→</div>
                <div className="text-white/40 sm:hidden">↓</div>
                
                <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-3 sm:px-4 py-2 backdrop-blur-md">
                  <span className="text-[10px] sm:text-xs text-green-300/80">Compressed:</span>
                  <span className="text-xs sm:text-sm font-semibold text-green-200">{formatFileSize(compressedSize)}</span>
                </div>
                
                <div className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 sm:px-4 py-2 backdrop-blur-md">
                  <span className="text-[10px] sm:text-xs text-sky-300/80">Saved:</span>
                  <span className="text-xs sm:text-sm font-semibold text-sky-200">{getCompressionRatio()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Preview Pane */}
          <div className="w-full max-w-7xl px-2">
            <div
              className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
              style={{ minHeight: '400px', height: 'auto' }}
            >
              {!originalImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="rounded-full border-2 border-dashed border-white/20 p-12 mb-4">
                    <Upload size={48} className="text-white/40" />
                  </div>
                  <p className="text-white/50 text-sm">Upload an image to get started</p>
                </div>
              )}

              {originalImage && !compressedImage && (
                <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 min-h-100">
                  <p className="text-white/60 text-xs sm:text-sm mb-4">Original Image</p>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-50 sm:max-h-75 md:max-h-125 object-contain"
                    style={{
                      background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              )}

              {compressedImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 md:p-8 min-h-100 md:min-h-150">
                  {/* Original */}
                  <div className="flex flex-col items-center justify-center min-h-45 md:min-h-0">
                    <p className="text-white/60 text-[10px] sm:text-xs mb-2">
                      Original ({formatFileSize(originalSize)})
                    </p>
                    <img
                      src={originalImage!}
                      alt="Original"
                      className="max-w-full max-h-50 sm:max-h-75 md:max-h-125 object-contain"
                      style={{
                        background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                      }}
                    />
                  </div>

                  {/* Compressed */}
                  <div className="flex flex-col items-center justify-center min-h-45 md:min-h-0">
                    <p className="text-white/60 text-[10px] sm:text-xs mb-2">
                      Compressed ({formatFileSize(compressedSize)})
                    </p>
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="max-w-full max-h-50 sm:max-h-75 md:max-h-125 object-contain"
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
