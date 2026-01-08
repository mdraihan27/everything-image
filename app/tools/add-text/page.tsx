'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Type, Plus, Trash2, Eye, Maximize2, RotateCw } from 'lucide-react';

type TextLayer = {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  opacity: number;
  rotation: number;
  textShadow: boolean;
};

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

export default function AddTextPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add new text layer
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: nextId,
      text: 'New Text',
      x: 50,
      y: 50,
      fontSize: 64,
      fontFamily: 'Arial, sans-serif',
      fontColor: '#ffffff',
      fontWeight: 'bold',
      fontStyle: 'normal',
      opacity: 100,
      rotation: 0,
      textShadow: true,
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedLayerId(nextId);
    setNextId(nextId + 1);
  };

  // Delete text layer
  const deleteTextLayer = (id: number) => {
    setTextLayers(textLayers.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  // Update text layer
  const updateTextLayer = (id: number, updates: Partial<TextLayer>) => {
    setTextLayers(textLayers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };

  // Get selected layer
  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId);

  // Draw canvas
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

      // Draw all text layers
      textLayers.forEach(layer => {
        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;

        // Set font
        ctx.font = `${layer.fontStyle} ${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.fontColor;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        // Calculate position
        const x = (layer.x / 100) * canvas.width;
        const y = (layer.y / 100) * canvas.height;

        // Apply rotation
        if (layer.rotation !== 0) {
          ctx.translate(x, y);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.translate(-x, -y);
        }

        // Draw shadow
        if (layer.textShadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        ctx.fillText(layer.text, x, y);
        
        // Draw selection outline if selected
        if (layer.id === selectedLayerId) {
          const metrics = ctx.measureText(layer.text);
          const textWidth = metrics.width;
          const textHeight = layer.fontSize;
          
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(x - textWidth / 2 - 5, y - textHeight / 2 - 5, textWidth + 10, textHeight + 10);
        }

        ctx.restore();
      });
    };
    img.src = originalImage;
  };

  // Handle file upload
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

  // Handle canvas drag
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if clicked on any layer (reverse order to check top layers first)
    let clickedLayerId: number | null = null;
    
    for (let i = textLayers.length - 1; i >= 0; i--) {
      const layer = textLayers[i];
      const layerX = (layer.x / 100) * canvas.width;
      const layerY = (layer.y / 100) * canvas.height;

      ctx.font = `${layer.fontStyle} ${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
      const metrics = ctx.measureText(layer.text);
      const textWidth = metrics.width;
      const textHeight = layer.fontSize;

      // Check if click is within text bounds
      if (
        clickX >= layerX - textWidth / 2 &&
        clickX <= layerX + textWidth / 2 &&
        clickY >= layerY - textHeight / 2 &&
        clickY <= layerY + textHeight / 2
      ) {
        clickedLayerId = layer.id;
        setSelectedLayerId(layer.id);
        setIsDragging(true);
        setDragOffset({ x: clickX - layerX, y: clickY - layerY });
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedLayerId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const newX = ((mouseX - dragOffset.x) / canvas.width) * 100;
    const newY = ((mouseY - dragOffset.y) / canvas.height) * 100;

    updateTextLayer(selectedLayerId, {
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY)),
    });
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
      a.download = `${fileName}-with-text.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  // Redraw canvas when anything changes
  useEffect(() => {
    drawCanvas();
  }, [originalImage, textLayers, selectedLayerId]);

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
              Add Text to Image
            </span>
          </h1>
          <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
            Add multiple text layers with custom fonts, colors, and effects - fully draggable
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
                {/* Add Text Button */}
                <button
                  onClick={addTextLayer}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-purple-200 backdrop-blur-md transition-all hover:bg-purple-500/20 cursor-pointer"
                >
                  <Plus size={16} className="sm:w-4.5 sm:h-4.5" />
                  Add Text
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
        </div>

        {/* Main Content Area - Side by Side Layout */}
        {originalImage && (
          <div className="w-full max-w-7xl px-2">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 sm:gap-6">
              {/* Left Side - Controls Panel */}
              <div className="space-y-3 sm:space-y-4">
                {/* Text Layers List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Text Layers ({textLayers.length})</span>
                    <button
                      onClick={addTextLayer}
                      className="flex items-center gap-1 rounded-lg border border-purple-400/30 bg-purple-400/10 px-2 py-1 text-[10px] text-purple-200 backdrop-blur-md transition-all hover:bg-purple-400/20 cursor-pointer"
                    >
                      <Plus size={12} />
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {textLayers.length === 0 ? (
                      <div className="text-center py-8 text-white/40 text-xs">
                        No text layers yet. Click "Add Text" to start.
                      </div>
                    ) : (
                      textLayers.map((layer) => (
                        <div
                          key={layer.id}
                          onClick={() => setSelectedLayerId(layer.id)}
                          className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 backdrop-blur-md transition-all cursor-pointer ${
                            selectedLayerId === layer.id
                              ? 'border-sky-400/50 bg-sky-400/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/90 truncate">{layer.text || 'Empty Text'}</p>
                            <p className="text-[10px] text-white/50">{layer.fontFamily.split(',')[0]}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTextLayer(layer.id);
                            }}
                            className="flex items-center justify-center rounded p-1 text-red-400 hover:bg-red-400/20 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Selected Layer Controls */}
                {selectedLayer && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Edit Layer #{selectedLayer.id}</span>
                    </div>

                    {/* Text Input */}
                    <div>
                      <span className="text-xs text-white/60 mb-2 block">Text Content</span>
                      <div className="flex items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-400/10 px-3 py-2 backdrop-blur-md">
                        <Type size={16} className="text-purple-200" />
                        <input
                          type="text"
                          value={selectedLayer.text}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { text: e.target.value })}
                          placeholder="Enter text"
                          className="flex-1 bg-transparent text-xs text-purple-200 placeholder:text-purple-200/50 outline-none"
                        />
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <span className="text-xs text-white/60 mb-2 block">Font Family</span>
                      <select
                        value={selectedLayer.fontFamily}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { fontFamily: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/90 backdrop-blur-md cursor-pointer outline-none"
                        style={{ fontFamily: selectedLayer.fontFamily }}
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
                    </div>

                    {/* Style Controls */}
                    <div className="space-y-2">
                      <span className="text-xs text-white/60">Text Style</span>
                      
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md flex-1">
                          <label className="text-[10px] text-white/60">Color:</label>
                          <input
                            type="color"
                            value={selectedLayer.fontColor}
                            onChange={(e) => updateTextLayer(selectedLayer.id, { fontColor: e.target.value })}
                            className="w-8 h-6 rounded cursor-pointer"
                          />
                        </div>

                        <select
                          value={selectedLayer.fontWeight}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { fontWeight: e.target.value })}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/90 backdrop-blur-md cursor-pointer outline-none [&>option]:bg-black [&>option]:text-white flex-1"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                          <option value="900">Extra Bold</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTextLayer(selectedLayer.id, { 
                            fontStyle: selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic' 
                          })}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer ${
                            selectedLayer.fontStyle === 'italic'
                              ? 'border-purple-400/50 bg-purple-400/20 text-purple-200'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <Type size={12} className="italic" />
                          Italic
                        </button>
                        <button
                          onClick={() => updateTextLayer(selectedLayer.id, { textShadow: !selectedLayer.textShadow })}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer ${
                            selectedLayer.textShadow
                              ? 'border-purple-400/50 bg-purple-400/20 text-purple-200'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          Shadow
                        </button>
                      </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-3">
                      {/* Font Size */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Type size={12} className="text-white/60" />
                            <span className="text-[10px] text-white/60">Font Size</span>
                          </div>
                          <span className="text-[10px] text-white/90">{selectedLayer.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min={12}
                          max={1000}
                          value={selectedLayer.fontSize}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { fontSize: Number(e.target.value) })}
                          className="w-full accent-purple-400"
                        />
                      </div>

                      {/* Opacity */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Eye size={12} className="text-white/60" />
                            <span className="text-[10px] text-white/60">Opacity</span>
                          </div>
                          <span className="text-[10px] text-white/90">{selectedLayer.opacity}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selectedLayer.opacity}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
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
                          <span className="text-[10px] text-white/90">{selectedLayer.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          value={selectedLayer.rotation}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                          className="w-full accent-sky-400"
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="flex items-start gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-2 backdrop-blur-md">
                      <Type size={12} className="text-sky-300 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-sky-200/90 leading-relaxed">
                        <strong>Tip:</strong> Click and drag text on the canvas to reposition. Select a layer to edit its properties.
                      </p>
                    </div>
                  </div>
                )}

                {!selectedLayer && textLayers.length > 0 && (
                  <div className="text-center py-8 text-white/40 text-xs">
                    Select a text layer to edit its properties
                  </div>
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
                    className="max-w-full max-h-full block cursor-move"
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
