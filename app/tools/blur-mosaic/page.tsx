'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Droplets, Grid3x3, Eraser, RotateCcw } from 'lucide-react';
import { canvasRGBA } from 'stackblur-canvas';

type Mode = 'blur' | 'mosaic';

export default function BlurMosaicPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('blur');
  const [brushSize, setBrushSize] = useState<number>(30);
  const [brushFeather, setBrushFeather] = useState<number>(10);
  const [blurStrength, setBlurStrength] = useState<number>(20);
  const [mosaicSize, setMosaicSize] = useState<number>(15);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fileName, setFileName] = useState<string>('image');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Load image to canvas
  const loadImageToCanvas = (imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = originalCanvasRef.current;
      const displayCanvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      
      if (!canvas || !displayCanvas || !maskCanvas) return;
      
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      displayCanvas.width = img.width;
      displayCanvas.height = img.height;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;
      
      // Draw original image
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const displayCtx = displayCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || !displayCtx) return;
      
      ctx.drawImage(img, 0, 0);
      displayCtx.drawImage(img, 0, 0);
      
      // Force canvas to update display
      displayCanvas.style.display = 'block';
      
      // Clear mask
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
    };
    img.src = imageSrc;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0]);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      setOriginalImage(imageSrc);
      loadImageToCanvas(imageSrc);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Apply blur effect to a specific area
  const applyBlurAtPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    
    if (!canvas || !originalCanvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx || !originalCtx) return;
    
    // Create a temporary canvas for the blur area
    const tempCanvas = document.createElement('canvas');
    const padding = blurStrength;
    const size = brushSize * 2 + padding * 2;
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!tempCtx) return;
    
    // Calculate the area to blur
    const sx = Math.max(0, x - brushSize - padding);
    const sy = Math.max(0, y - brushSize - padding);
    const sw = Math.min(size, originalCanvas.width - sx);
    const sh = Math.min(size, originalCanvas.height - sy);
    
    // Draw the area from original image
    tempCtx.drawImage(
      originalCanvas,
      sx, sy, sw, sh,
      0, 0, sw, sh
    );
    
    // Apply blur using stackblur
    canvasRGBA(tempCanvas, 0, 0, sw, sh, blurStrength);
    
    // Create a mask for the circular brush with feathering
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = sw;
    maskCanvas.height = sh;
    const maskCtx = maskCanvas.getContext('2d');
    
    if (!maskCtx) return;
    
    // Draw gradient mask
    const centerX = x - sx;
    const centerY = y - sy;
    
    if (brushFeather > 0) {
      const gradient = maskCtx.createRadialGradient(
        centerX, centerY, Math.max(0, brushSize - brushFeather),
        centerX, centerY, brushSize
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      maskCtx.fillStyle = gradient;
      maskCtx.fillRect(0, 0, sw, sh);
    } else {
      // No feather - solid circle
      maskCtx.fillStyle = 'black';
      maskCtx.beginPath();
      maskCtx.arc(centerX, centerY, brushSize, 0, Math.PI * 2);
      maskCtx.fill();
    }
    
    // Apply mask to blurred image
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(maskCanvas, 0, 0);
    
    // Draw the masked blur onto the main canvas
    ctx.drawImage(tempCanvas, 0, 0, sw, sh, sx, sy, sw, sh);
  };

  // Apply mosaic effect to a specific area
  const applyMosaicAtPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    
    if (!canvas || !originalCanvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx || !originalCtx) return;
    
    // Apply mosaic within the brush area
    const startX = Math.max(0, Math.floor(x - brushSize));
    const startY = Math.max(0, Math.floor(y - brushSize));
    const endX = Math.min(originalCanvas.width, Math.ceil(x + brushSize));
    const endY = Math.min(originalCanvas.height, Math.ceil(y + brushSize));
    
    for (let my = startY; my < endY; my += mosaicSize) {
      for (let mx = startX; mx < endX; mx += mosaicSize) {
        // Check if point is within brush circle
        const dx = mx + mosaicSize / 2 - x;
        const dy = my + mosaicSize / 2 - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= brushSize) {
          // Get average color of the mosaic block
          const blockWidth = Math.min(mosaicSize, originalCanvas.width - mx);
          const blockHeight = Math.min(mosaicSize, originalCanvas.height - my);
          
          const imageData = originalCtx.getImageData(mx, my, blockWidth, blockHeight);
          const pixels = imageData.data;
          
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
            count++;
          }
          
          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);
          
          // Apply feathering based on distance from center
          let alpha = 1;
          if (brushFeather > 0 && distance > brushSize - brushFeather) {
            alpha = 1 - (distance - (brushSize - brushFeather)) / brushFeather;
          }
          
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(mx, my, blockWidth, blockHeight);
          ctx.globalAlpha = 1;
        }
      }
    }
  };

  // Handle mouse/touch events
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getPointFromEvent(e);
    if (point) {
      if (mode === 'blur') {
        applyBlurAtPoint(point.x, point.y);
      } else {
        applyMosaicAtPoint(point.x, point.y);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const point = getPointFromEvent(e);
    if (point) {
      if (mode === 'blur') {
        applyBlurAtPoint(point.x, point.y);
      } else {
        applyMosaicAtPoint(point.x, point.y);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Get canvas coordinates from event
  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  // Reset to original
  const handleReset = () => {
    if (!originalImage) return;
    loadImageToCanvas(originalImage);
  };

  // Download image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}-${mode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
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
                Blur & Mosaic Editor
              </span>
            </h1>
            <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
              Apply blur or mosaic effects by dragging your mouse over the image - perfect for privacy protection
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
                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-orange-200 backdrop-blur-md transition-all hover:bg-orange-500/20 cursor-pointer"
                  >
                    <RotateCcw size={16} className="sm:w-4.5 sm:h-4.5" />
                    Reset
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 backdrop-blur-md transition-all hover:bg-green-500/20 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse hover:animate-none"
                  >
                    <Download size={16} className="sm:w-4.5 sm:h-4.5" />
                    Download
                  </button>
                </>
              )}
            </div>

            {/* Mode Selection */}
            {originalImage && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 px-2">
                <button
                  onClick={() => setMode('blur')}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer ${
                    mode === 'blur'
                      ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Droplets size={14} className="sm:w-4 sm:h-4" />
                  Blur
                </button>
                <button
                  onClick={() => setMode('mosaic')}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer ${
                    mode === 'mosaic'
                      ? 'border-purple-400/50 bg-purple-400/20 text-purple-200'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Grid3x3 size={14} className="sm:w-4 sm:h-4" />
                  Mosaic
                </button>
              </div>
            )}

            {/* Brush Controls */}
            {originalImage && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 px-2">
                  {/* Brush Size */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                    <span className="text-[10px] sm:text-xs text-white/60 whitespace-nowrap">Brush Size:</span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={1}
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-32 sm:w-40 accent-sky-400"
                      />
                      <span className="text-[10px] sm:text-xs text-white/90 w-8 sm:w-10">{brushSize}px</span>
                    </div>
                  </div>

                  {/* Brush Feather */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                    <span className="text-[10px] sm:text-xs text-white/60 whitespace-nowrap">Feather:</span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="range"
                        min={0}
                        max={50}
                        step={1}
                        value={brushFeather}
                        onChange={(e) => setBrushFeather(Number(e.target.value))}
                        className="w-32 sm:w-40 accent-sky-400"
                      />
                      <span className="text-[10px] sm:text-xs text-white/90 w-8 sm:w-10">{brushFeather}px</span>
                    </div>
                  </div>
                </div>

                {/* Mode-specific controls */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 px-2">
                  {mode === 'blur' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                      <span className="text-[10px] sm:text-xs text-sky-200/80 whitespace-nowrap">Blur Strength:</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="range"
                          min={5}
                          max={50}
                          step={1}
                          value={blurStrength}
                          onChange={(e) => setBlurStrength(Number(e.target.value))}
                          className="w-32 sm:w-40 accent-sky-400"
                        />
                        <span className="text-[10px] sm:text-xs text-sky-200/90 w-8 sm:w-10">{blurStrength}</span>
                      </div>
                    </div>
                  )}

                  {mode === 'mosaic' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-400/10 px-3 sm:px-4 py-2 backdrop-blur-md w-full sm:w-auto">
                      <span className="text-[10px] sm:text-xs text-purple-200/80 whitespace-nowrap">Block Size:</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="range"
                          min={5}
                          max={50}
                          step={1}
                          value={mosaicSize}
                          onChange={(e) => setMosaicSize(Number(e.target.value))}
                          className="w-32 sm:w-40 accent-purple-400"
                        />
                        <span className="text-[10px] sm:text-xs text-purple-200/90 w-8 sm:w-10">{mosaicSize}px</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="flex items-start gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-md max-w-2xl mx-auto">
                  <Droplets size={14} className="text-sky-300 mt-0.5 shrink-0 sm:w-4 sm:h-4" />
                  <p className="text-[10px] sm:text-xs text-sky-200/90 leading-relaxed">
                    <strong>How to use:</strong> Click and drag over the image to apply {mode} effect. 
                    Adjust brush size and feather for smooth transitions. Use reset to start over.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Preview */}
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

              {originalImage && (
                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                  <div className="relative max-w-full max-h-150 md:max-h-200">
                    {/* Hidden canvases for processing */}
                    <canvas
                      ref={originalCanvasRef}
                      className="hidden"
                    />
                    <canvas
                      ref={maskCanvasRef}
                      className="hidden"
                    />
                    
                    {/* Display canvas */}
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handlePointerDown}
                      onMouseMove={handlePointerMove}
                      onMouseUp={handlePointerUp}
                      onMouseLeave={handlePointerUp}
                      onTouchStart={handlePointerDown}
                      onTouchMove={handlePointerMove}
                      onTouchEnd={handlePointerUp}
                      className="max-w-full max-h-150 md:max-h-200 cursor-crosshair block"
                      style={{
                        background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                        touchAction: 'none',
                        imageRendering: 'auto',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}
