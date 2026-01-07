'use client';

import { useRef, useState, useEffect } from 'react';
import { Upload, Download, Eraser, ZoomIn, ZoomOut, Loader2, Info, RotateCcw } from 'lucide-react';

export default function RemoveBackgroundPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [brushSize, setBrushSize] = useState(20);
  const [showHint, setShowHint] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasImage, setCanvasImage] = useState<HTMLImageElement | null>(null);
  const [originalProcessedImage, setOriginalProcessedImage] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show original image
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process the image
    setIsProcessing(true);
    setProcessedImage(null);
    setOriginalProcessedImage(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove background');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      setOriginalProcessedImage(url);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load processed image onto canvas
  useEffect(() => {
    if (processedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setCanvasImage(img);
      };
      img.src = processedImage;
    }
  }, [processedImage]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isErasing) return;
    setIsDrawing(true);
    erase(e);
    setShowHint(false);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const erase = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(prev => Math.max(50, Math.min(300, prev + delta)));
    }
  };

  // Reset to original processed image
  const handleReset = () => {
    if (originalProcessedImage) {
      setProcessedImage(originalProcessedImage);
    }
  };

  // Download image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'removed-background.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
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
        <div className="w-full max-w-7xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-3">
            <span className="bg-linear-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent">
              Background Remover
            </span>
          </h1>
          <p className="text-center text-white/60 text-sm sm:text-base mb-8">
            Upload an image to automatically remove its background, then refine manually
          </p>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
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
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Upload size={18} />
              Upload Image
            </button>

            {/* Eraser Toggle */}
            {processedImage && (
              <>
                <button
                  onClick={() => setIsErasing(!isErasing)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm backdrop-blur-md transition-all cursor-pointer ${
                    isErasing
                      ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                      : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Eraser size={18} />
                  {isErasing ? 'Erasing Mode' : 'Manual Erase'}
                </button>

                {/* Brush Size */}
                {isErasing && (
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
                    <span className="text-xs text-white/60">Brush:</span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20 accent-sky-400"
                    />
                    <span className="text-xs text-white/90 w-6">{brushSize}</span>
                  </div>
                )}

                {/* Zoom Controls */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
                  <button
                    onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-24 accent-sky-400"
                  />
                  <button
                    onClick={() => setZoom(prev => Math.min(300, prev + 10))}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <span className="text-xs text-white/90 w-10 text-right">{zoom}%</span>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
                >
                  <RotateCcw size={18} />
                  Reset
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
          </div>

          {/* Hint */}
          {processedImage && isErasing && showHint && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
              <Info size={14} />
              <span>Drag over the image to manually erase parts • Ctrl+Scroll to zoom</span>
            </div>
          )}
        </div>

        {/* Preview Pane */}
        <div className="w-full max-w-7xl">
          <div
            ref={containerRef}
            className="relative w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {!originalImage && !isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="rounded-full border-2 border-dashed border-white/20 p-12 mb-4">
                  <Upload size={48} className="text-white/40" />
                </div>
                <p className="text-white/50 text-sm">Upload an image to get started</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-sky-400 animate-spin mb-4" />
                <p className="text-white/70 text-sm">Removing background...</p>
                <p className="text-white/50 text-xs mt-2">This may take a few seconds</p>
              </div>
            )}

            {processedImage && (
              <div
                className="w-full h-full flex items-center justify-center p-8 overflow-auto"
                onWheel={handleWheel}
              >
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={erase}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className={`max-w-full h-auto ${
                      isErasing ? 'cursor-crosshair' : 'cursor-default'
                    }`}
                    style={{
                      imageRendering: 'crisp-edges',
                      background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        
      </main>
    </div>
    </>
  );
}
