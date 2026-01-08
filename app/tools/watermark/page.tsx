'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Type, RotateCw, Maximize2, Eye } from 'lucide-react';

type WatermarkType = 'none' | 'image' | 'text';
type Position = 'custom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

const FONT_OPTIONS = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif' },
  { name: 'Ubuntu', value: 'Ubuntu, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Bebas Neue', value: 'Bebas Neue, cursive' },
  { name: 'Pacifico', value: 'Pacifico, cursive' },
  { name: 'Dancing Script', value: 'Dancing Script, cursive' },
  { name: 'Indie Flower', value: 'Indie Flower, cursive' },
  { name: 'Lobster', value: 'Lobster, cursive' },
  { name: 'Righteous', value: 'Righteous, cursive' },
  { name: 'Permanent Marker', value: 'Permanent Marker, cursive' },
  { name: 'Anton', value: 'Anton, sans-serif' },
  { name: 'Cinzel', value: 'Cinzel, serif' },
  { name: 'Crimson Text', value: 'Crimson Text, serif' },
  { name: 'EB Garamond', value: 'EB Garamond, serif' },
  { name: 'Josefin Sans', value: 'Josefin Sans, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
  { name: 'PT Sans', value: 'PT Sans, sans-serif' },
  { name: 'Quicksand', value: 'Quicksand, sans-serif' },
  { name: 'Rubik', value: 'Rubik, sans-serif' },
  { name: 'Source Sans 3', value: 'Source Sans 3, sans-serif' },
  { name: 'Titillium Web', value: 'Titillium Web, sans-serif' },
  { name: 'Work Sans', value: 'Work Sans, sans-serif' },
  { name: 'Abril Fatface', value: 'Abril Fatface, cursive' },
  { name: 'Archivo Black', value: 'Archivo Black, sans-serif' },
  { name: 'Bangers', value: 'Bangers, cursive' },
  { name: 'Caveat', value: 'Caveat, cursive' },
  { name: 'Cormorant', value: 'Cormorant, serif' },
  { name: 'Fira Sans', value: 'Fira Sans, sans-serif' },
  { name: 'Kanit', value: 'Kanit, sans-serif' },
  { name: 'Outfit', value: 'Outfit, sans-serif' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light, cursive' },
  { name: 'Zilla Slab', value: 'Zilla Slab, serif' },
  // Italic & Script Fonts
  { name: 'Great Vibes', value: 'Great Vibes, cursive' },
  { name: 'Allura', value: 'Allura, cursive' },
  { name: 'Satisfy', value: 'Satisfy, cursive' },
  { name: 'Kaushan Script', value: 'Kaushan Script, cursive' },
  { name: 'Alex Brush', value: 'Alex Brush, cursive' },
  { name: 'Cookie', value: 'Cookie, cursive' },
  { name: 'Sacramento', value: 'Sacramento, cursive' },
  { name: 'Tangerine', value: 'Tangerine, cursive' },
  { name: 'Courgette', value: 'Courgette, cursive' },
  { name: 'Bad Script', value: 'Bad Script, cursive' },
  // Oxford/Classic Fonts
  { name: 'Libre Baskerville', value: 'Libre Baskerville, serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'Cardo', value: 'Cardo, serif' },
  { name: 'Spectral', value: 'Spectral, serif' },
  { name: 'Old Standard TT', value: 'Old Standard TT, serif' },
  { name: 'Crimson Pro', value: 'Crimson Pro, serif' },
  { name: 'Bentham', value: 'Bentham, serif' },
  { name: 'Unna', value: 'Unna, serif' },
  { name: 'Neuton', value: 'Neuton, serif' },
  { name: 'Sorts Mill Goudy', value: 'Sorts Mill Goudy, serif' },
  // Additional Cursive Fonts
  { name: 'Amatic SC', value: 'Amatic SC, cursive' },
  { name: 'Yellowtail', value: 'Yellowtail, cursive' },
  { name: 'Pinyon Script', value: 'Pinyon Script, cursive' },
  { name: 'Brush Script MT', value: 'Brush Script MT, cursive' },
  { name: 'Marck Script', value: 'Marck Script, cursive' },
  { name: 'Mr Dafoe', value: 'Mr Dafoe, cursive' },
  { name: 'Rochester', value: 'Rochester, cursive' },
  { name: 'Playball', value: 'Playball, cursive' },
  { name: 'Leckerli One', value: 'Leckerli One, cursive' },
  { name: 'Zeyada', value: 'Zeyada, cursive' },
  { name: 'Damion', value: 'Damion, cursive' },
  { name: 'Herr Von Muellerhoff', value: 'Herr Von Muellerhoff, cursive' },
  { name: 'Niconne', value: 'Niconne, cursive' },
  { name: 'Italianno', value: 'Italianno, cursive' },
  { name: 'Grand Hotel', value: 'Grand Hotel, cursive' },
];

export default function WatermarkPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('none');
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('WATERMARK');
  const [fileName, setFileName] = useState<string>('image');
  
  // Watermark properties
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(50);
  const [watermarkScale, setWatermarkScale] = useState<number>(100);
  const [watermarkRotation, setWatermarkRotation] = useState<number>(0);
  const [watermarkPosition, setWatermarkPosition] = useState<Position>('bottom-right');
  const [customX, setCustomX] = useState<number>(50);
  const [customY, setCustomY] = useState<number>(50);
  
  // Text watermark properties
  const [fontSize, setFontSize] = useState<number>(64);
  const [fontColor, setFontColor] = useState<string>('#ffffff');
  const [textShadow, setTextShadow] = useState<boolean>(true);
  const [fontWeight, setFontWeight] = useState<string>('bold');
  const [fontStyle, setFontStyle] = useState<string>('normal');
  const [fontFamily, setFontFamily] = useState<string>('Arial, sans-serif');
  
  // Canvas states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Load and draw image with watermark
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Draw watermark if exists
      if (watermarkType === 'image' && watermarkImage) {
        drawImageWatermark(ctx, img.width, img.height);
      } else if (watermarkType === 'text' && watermarkText) {
        drawTextWatermark(ctx, img.width, img.height);
      }
    };
    img.src = originalImage;
  };
  
  // Draw image watermark
  const drawImageWatermark = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const wmImg = new Image();
    wmImg.onload = () => {
      const scale = watermarkScale / 100;
      const wmWidth = wmImg.width * scale;
      const wmHeight = wmImg.height * scale;
      
      const pos = getWatermarkPosition(canvasWidth, canvasHeight, wmWidth, wmHeight);
      
      ctx.save();
      ctx.globalAlpha = watermarkOpacity / 100;
      
      // Apply rotation
      if (watermarkRotation !== 0) {
        ctx.translate(pos.x + wmWidth / 2, pos.y + wmHeight / 2);
        ctx.rotate((watermarkRotation * Math.PI) / 180);
        ctx.translate(-(pos.x + wmWidth / 2), -(pos.y + wmHeight / 2));
      }
      
      ctx.drawImage(wmImg, pos.x, pos.y, wmWidth, wmHeight);
      ctx.restore();
    };
    wmImg.src = watermarkImage!;
  };
  
  // Draw text watermark
  const drawTextWatermark = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.save();
    ctx.globalAlpha = watermarkOpacity / 100;
    
    // Apply scale to font size
    const scaledFontSize = fontSize * (watermarkScale / 100);
    
    // Set font
    ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Measure text
    const metrics = ctx.measureText(watermarkText);
    const textWidth = metrics.width;
    const textHeight = scaledFontSize;
    
    const pos = getWatermarkPosition(canvasWidth, canvasHeight, textWidth, textHeight);
    
    // Apply rotation
    if (watermarkRotation !== 0) {
      ctx.translate(pos.x + textWidth / 2, pos.y + textHeight / 2);
      ctx.rotate((watermarkRotation * Math.PI) / 180);
      ctx.translate(-(pos.x + textWidth / 2), -(pos.y + textHeight / 2));
    }
    
    // Draw shadow
    if (textShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    
    ctx.fillText(watermarkText, pos.x + textWidth / 2, pos.y + textHeight / 2);
    ctx.restore();
  };
  
  // Get watermark position
  const getWatermarkPosition = (canvasWidth: number, canvasHeight: number, wmWidth: number, wmHeight: number) => {
    const padding = 20;
    
    switch (watermarkPosition) {
      case 'top-left':
        return { x: padding, y: padding };
      case 'top-right':
        return { x: canvasWidth - wmWidth - padding, y: padding };
      case 'bottom-left':
        return { x: padding, y: canvasHeight - wmHeight - padding };
      case 'bottom-right':
        return { x: canvasWidth - wmWidth - padding, y: canvasHeight - wmHeight - padding };
      case 'center':
        return { x: (canvasWidth - wmWidth) / 2, y: (canvasHeight - wmHeight) / 2 };
      case 'custom':
        return { 
          x: (customX / 100) * (canvasWidth - wmWidth), 
          y: (customY / 100) * (canvasHeight - wmHeight) 
        };
      default:
        return { x: padding, y: padding };
    }
  };
  
  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0]);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle watermark image upload
  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setWatermarkImage(event.target?.result as string);
      setWatermarkType('image');
    };
    reader.readAsDataURL(file);

    if (watermarkInputRef.current) {
      watermarkInputRef.current.value = '';
    }
  };
  
  // Handle canvas drag for custom positioning
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (watermarkPosition !== 'custom') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setIsDragging(true);
    setDragOffset({ x, y });
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || watermarkPosition !== 'custom') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const newX = Math.max(0, Math.min(100, (x / canvas.width) * 100));
    const newY = Math.max(0, Math.min(100, (y / canvas.height) * 100));
    
    setCustomX(newX);
    setCustomY(newY);
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
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
      a.download = `${fileName}-watermarked.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };
  
  // Redraw canvas when properties change
  useEffect(() => {
    drawCanvas();
  }, [
    originalImage,
    watermarkType,
    watermarkImage,
    watermarkText,
    watermarkOpacity,
    watermarkScale,
    watermarkRotation,
    watermarkPosition,
    customX,
    customY,
    fontSize,
    fontColor,
    textShadow,
    fontWeight,
    fontStyle,
    fontFamily,
  ]);

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
                Watermark Editor
              </span>
            </h1>
            <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
              Add custom image or text watermarks to protect your content - fully customizable
            </p>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {/* Upload Image Button */}
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
          </div>

          {/* Main Content Area - Side by Side Layout */}
          {originalImage && (
            <div className="w-full max-w-7xl px-2">
              <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 sm:gap-6">
                {/* Left Side - Controls Panel */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Watermark Type Selection */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-white/60 mb-1">Watermark Type</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setWatermarkType('image')}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer ${
                          watermarkType === 'image'
                            ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <ImageIcon size={14} />
                        Image
                      </button>
                      <button
                        onClick={() => setWatermarkType('text')}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer ${
                          watermarkType === 'text'
                            ? 'border-purple-400/50 bg-purple-400/20 text-purple-200'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <Type size={14} />
                        Text
                      </button>
                    </div>
                  </div>

                  {/* Watermark Content */}
                  {watermarkType !== 'none' && (
                    <>
                      {/* Image Watermark Upload */}
                      {watermarkType === 'image' && (
                        <div>
                          <span className="text-xs text-white/60 mb-2 block">Watermark Image</span>
                          <input
                            ref={watermarkInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleWatermarkUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => watermarkInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-2.5 text-xs text-sky-200 backdrop-blur-md transition-all hover:bg-sky-400/20 cursor-pointer"
                          >
                            <ImageIcon size={16} />
                            {watermarkImage ? 'Change Image' : 'Upload Image'}
                          </button>
                        </div>
                      )}

                      {/* Text Watermark Input */}
                      {watermarkType === 'text' && (
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-white/60 mb-2 block">Watermark Text</span>
                            <div className="flex items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-400/10 px-3 py-2 backdrop-blur-md">
                              <Type size={16} className="text-purple-200" />
                              <input
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder="Enter text"
                                className="flex-1 bg-transparent text-xs text-purple-200 placeholder:text-purple-200/50 outline-none"
                              />
                            </div>
                          </div>
                          
                          {/* Text Style Controls */}
                          <div className="space-y-2">
                            <span className="text-xs text-white/60">Text Style</span>
                            
                            {/* Font Family Dropdown */}
                            <select
                              value={fontFamily}
                              onChange={(e) => setFontFamily(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/90 backdrop-blur-md cursor-pointer outline-none"
                              style={{ fontFamily: fontFamily }}
                            >
                              {FONT_OPTIONS.map((font) => (
                                <option 
                                  key={font.value} 
                                  value={font.value}
                                  style={{ 
                                    fontFamily: font.value,
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    padding: '8px'
                                  }}
                                >
                                  {font.name}
                                </option>
                              ))}
                            </select>
                            
                            <div className="flex gap-2">
                              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md flex-1">
                                <label className="text-[10px] text-white/60">Color:</label>
                                <input
                                  type="color"
                                  value={fontColor}
                                  onChange={(e) => setFontColor(e.target.value)}
                                  className="w-8 h-6 rounded cursor-pointer"
                                />
                              </div>
                              
                              <select
                                value={fontWeight}
                                onChange={(e) => setFontWeight(e.target.value)}
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/90 backdrop-blur-md cursor-pointer outline-none [&>option]:bg-black [&>option]:text-white flex-1"
                              >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="900">Extra Bold</option>
                              </select>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer ${
                                  fontStyle === 'italic'
                                    ? 'border-purple-400/50 bg-purple-400/20 text-purple-200'
                                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                              >
                                <Type size={12} className="italic" />
                                Italic
                              </button>
                              <button
                                onClick={() => setTextShadow(!textShadow)}
                                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer ${
                                  textShadow
                                    ? 'border-purple-400/50 bg-purple-400/20 text-purple-200'
                                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                              >
                                Shadow
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Common Controls */}
                      {((watermarkType === 'image' && watermarkImage) || (watermarkType === 'text' && watermarkText)) && (
                        <>
                          {/* Position Presets */}
                          <div>
                            <span className="text-xs text-white/60 mb-2 block">Position</span>
                            <div className="grid grid-cols-3 gap-2">
                              {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', 'custom'] as Position[]).map((pos) => (
                                <button
                                  key={pos}
                                  onClick={() => setWatermarkPosition(pos)}
                                  className={`rounded-lg border px-2 py-1.5 text-[10px] backdrop-blur-md transition-all cursor-pointer capitalize ${
                                    watermarkPosition === pos
                                      ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                                  }`}
                                >
                                  {pos.replace('-', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sliders */}
                          <div className="space-y-3">
                            {/* Opacity */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Eye size={12} className="text-white/60" />
                                  <span className="text-[10px] text-white/60">Opacity</span>
                                </div>
                                <span className="text-[10px] text-white/90">{watermarkOpacity}%</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={watermarkOpacity}
                                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                                className="w-full accent-sky-400"
                              />
                            </div>

                            {/* Scale */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Maximize2 size={12} className="text-white/60" />
                                  <span className="text-[10px] text-white/60">Scale</span>
                                </div>
                                <span className="text-[10px] text-white/90">{watermarkScale}%</span>
                              </div>
                              <input
                                type="range"
                                min={10}
                                max={1000}
                                value={watermarkScale}
                                onChange={(e) => setWatermarkScale(Number(e.target.value))}
                                className="w-full accent-sky-400"
                              />
                            </div>

                            {/* Rotation */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <RotateCw size={12} className="text-white/60" />
                                  <span className="text-[10px] text-white/60">Rotation</span>
                                </div>
                                <span className="text-[10px] text-white/90">{watermarkRotation}°</span>
                              </div>
                              <input
                                type="range"
                                min={-180}
                                max={180}
                                value={watermarkRotation}
                                onChange={(e) => setWatermarkRotation(Number(e.target.value))}
                                className="w-full accent-sky-400"
                              />
                            </div>
                          </div>

                          {/* Instructions */}
                          <div className="flex items-start gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-2 backdrop-blur-md">
                            <ImageIcon size={12} className="text-sky-300 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-sky-200/90 leading-relaxed">
                              <strong>Tip:</strong> {watermarkPosition === 'custom' 
                                ? 'Drag on canvas to reposition!' 
                                : 'Select "Custom" to drag freely.'}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Right Side - Canvas Preview */}
                <div
                  className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
                  style={{ minHeight: '500px', maxHeight: '700px' }}
                >
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                      className={`max-w-full max-h-full block ${
                        watermarkPosition === 'custom' ? 'cursor-move' : 'cursor-default'
                      }`}
                      style={{
                        background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!originalImage && (
            <div className="w-full max-w-7xl px-2">
              <div
                className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
                style={{ minHeight: '500px' }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="rounded-full border-2 border-dashed border-white/20 p-12 mb-4">
                    <Upload size={48} className="text-white/40" />
                  </div>
                  <p className="text-white/50 text-sm">Upload an image to get started</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
  );
}
