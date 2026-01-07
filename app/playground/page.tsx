"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crop, Image as ImageIcon, Redo2, Undo2 } from "lucide-react";

type EditorState = {
  blob: Blob;
  zoom: number;
  offset: { x: number; y: number };
};

type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function PlaygroundPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanningPreview, setIsPanningPreview] = useState(false);
  const [editorHistory, setEditorHistory] = useState<{
    entries: EditorState[];
    index: number;
  }>({ entries: [], index: -1 });
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const panInitialOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const cropDragStateRef = useRef<{
    startX: number;
    startY: number;
    startRect: CropRect;
    mode: "move" | "nw" | "ne" | "sw" | "se";
    containerWidth: number;
    containerHeight: number;
  } | null>(null);

  const currentState: EditorState | null = useMemo(() => {
    if (editorHistory.index < 0) return null;
    return editorHistory.entries[editorHistory.index] ?? null;
  }, [editorHistory]);

  const canUndo = editorHistory.index > 0;
  const canRedo =
    editorHistory.index >= 0 &&
    editorHistory.index < editorHistory.entries.length - 1;

  const pushNewState = useCallback((getNext: (current: EditorState | null) => EditorState) => {
    setEditorHistory((prev) => {
      const base =
        prev.index >= 0 && prev.entries[prev.index]
          ? prev.entries[prev.index]
          : null;
      const next = getNext(base);
      const entries = prev.entries.slice(0, prev.index + 1);
      entries.push(next);
      return { entries, index: entries.length - 1 };
    });
  }, []);

  const applyFromCurrent = useCallback(
    (updater: (current: EditorState) => EditorState) => {
      setEditorHistory((prev) => {
        if (prev.index < 0 || !prev.entries[prev.index]) return prev;
        const current = prev.entries[prev.index];
        const next = updater(current);
        const entries = prev.entries.slice(0, prev.index + 1);
        entries.push(next);
        return { entries, index: entries.length - 1 };
      });
    },
    [],
  );

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    setFileName(file.name);
    setIsCropping(false);
    setCropRect(null);
    setImageDimensions(null);
    pushNewState(() => ({
      blob: file,
      zoom: 1,
      offset: { x: 0, y: 0 },
    }));
  }, [pushNewState]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      handleFile(file);
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePreviewMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!currentState) return;
      event.preventDefault();
      setIsPanningPreview(true);
      panStartRef.current = { x: event.clientX, y: event.clientY };
      panInitialOffsetRef.current = { ...currentState.offset };
    },
    [currentState],
  );

  const handlePreviewMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!panStartRef.current || !panInitialOffsetRef.current || !currentState) return;
    event.preventDefault();
    const dx = event.clientX - panStartRef.current.x;
    const dy = event.clientY - panStartRef.current.y;

    const newOffset = {
      x: panInitialOffsetRef.current.x + dx,
      y: panInitialOffsetRef.current.y + dy,
    };

    setEditorHistory((prev) => {
      if (prev.index < 0 || !prev.entries[prev.index]) return prev;
      const base = prev.entries[prev.index];
      const updated: EditorState = {
        ...base,
        offset: newOffset,
      };
      const entries = prev.entries.slice();
      entries[prev.index] = updated;
      return { ...prev, entries };
    });
  }, [currentState]);

  const handlePreviewWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (!currentState) return;
      event.preventDefault();
      event.stopPropagation();

      const direction = event.deltaY;

      applyFromCurrent((state) => {
        const step = 0.1;
        let nextZoom = state.zoom + (direction < 0 ? step : -step);
        nextZoom = Math.min(4, Math.max(0.5, nextZoom));
        if (nextZoom === state.zoom) return state;
        return {
          ...state,
          zoom: nextZoom,
        };
      });
    },
    [applyFromCurrent, currentState],
  );

  const stopPanning = useCallback(() => {
    if (!panInitialOffsetRef.current || !currentState) {
      setIsPanningPreview(false);
      panStartRef.current = null;
      panInitialOffsetRef.current = null;
      return;
    }

    const hasMoved =
      currentState.offset.x !== panInitialOffsetRef.current.x ||
      currentState.offset.y !== panInitialOffsetRef.current.y;

    if (hasMoved) {
      applyFromCurrent((state) => ({ ...state }));
    }

    setIsPanningPreview(false);
    panStartRef.current = null;
    panInitialOffsetRef.current = null;
  }, [applyFromCurrent, currentState]);

  const previewUrl = useMemo(() => {
    if (!currentState) return null;
    return URL.createObjectURL(currentState.blob);
  }, [currentState]);

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    },
    [],
  );

  const startCrop = useCallback(() => {
    if (!currentState || !previewContainerRef.current) return;

    const bounds = previewContainerRef.current.getBoundingClientRect();
    const size = Math.min(bounds.width, bounds.height) * 0.6;
    const rect: CropRect = {
      x: (bounds.width - size) / 2,
      y: (bounds.height - size) / 2,
      width: size,
      height: size,
    };

    setCropRect(rect);
    setIsCropping(true);
  }, [currentState]);

  const handleCropMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, mode: "move" | "nw" | "ne" | "sw" | "se") => {
      if (!cropRect || !previewContainerRef.current) return;
      event.preventDefault();
      event.stopPropagation();

      const bounds = previewContainerRef.current.getBoundingClientRect();
      cropDragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startRect: cropRect,
        mode,
        containerWidth: bounds.width,
        containerHeight: bounds.height,
      };
    },
    [cropRect],
  );

  const handleCropMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const dragState = cropDragStateRef.current;
      if (!dragState) return;

      event.preventDefault();

      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      const minSize = 20;

      let { x, y, width, height } = dragState.startRect;

      if (dragState.mode === "move") {
        x = Math.min(
          Math.max(0, dragState.startRect.x + dx),
          dragState.containerWidth - dragState.startRect.width,
        );
        y = Math.min(
          Math.max(0, dragState.startRect.y + dy),
          dragState.containerHeight - dragState.startRect.height,
        );
      } else if (dragState.mode === "se") {
        width = Math.max(
          minSize,
          Math.min(
            dragState.containerWidth - dragState.startRect.x,
            dragState.startRect.width + dx,
          ),
        );
        height = Math.max(
          minSize,
          Math.min(
            dragState.containerHeight - dragState.startRect.y,
            dragState.startRect.height + dy,
          ),
        );
      } else if (dragState.mode === "sw") {
        const maxDx = dragState.startRect.width - minSize;
        const clampedDx = Math.min(Math.max(dx, -dragState.startRect.x), maxDx);
        x = dragState.startRect.x + clampedDx;
        width = dragState.startRect.width - clampedDx;
        height = Math.max(
          minSize,
          Math.min(
            dragState.containerHeight - dragState.startRect.y,
            dragState.startRect.height + dy,
          ),
        );
      } else if (dragState.mode === "ne") {
        const maxDy = dragState.startRect.height - minSize;
        const clampedDy = Math.min(Math.max(dy, -dragState.startRect.y), maxDy);
        y = dragState.startRect.y + clampedDy;
        height = dragState.startRect.height - clampedDy;
        width = Math.max(
          minSize,
          Math.min(
            dragState.containerWidth - dragState.startRect.x,
            dragState.startRect.width + dx,
          ),
        );
      } else if (dragState.mode === "nw") {
        const maxDx = dragState.startRect.width - minSize;
        const maxDy = dragState.startRect.height - minSize;
        const clampedDx = Math.min(Math.max(dx, -dragState.startRect.x), maxDx);
        const clampedDy = Math.min(Math.max(dy, -dragState.startRect.y), maxDy);

        x = dragState.startRect.x + clampedDx;
        y = dragState.startRect.y + clampedDy;
        width = dragState.startRect.width - clampedDx;
        height = dragState.startRect.height - clampedDy;
      }

      setCropRect({ x, y, width, height });
    },
    [],
  );

  const stopCroppingDrag = useCallback(() => {
    cropDragStateRef.current = null;
  }, []);

  const applyCrop = useCallback(async () => {
    if (!currentState || !cropRect || !imageDimensions || !previewImageRef.current) {
      setIsCropping(false);
      return;
    }

    const imgElement = previewImageRef.current;
    const renderWidth = imgElement.clientWidth;
    const renderHeight = imgElement.clientHeight;

    const naturalWidth = imageDimensions.width;
    const naturalHeight = imageDimensions.height;

    if (!naturalWidth || !naturalHeight || !renderWidth || !renderHeight) {
      setIsCropping(false);
      return;
    }

    const scale = Math.min(renderWidth / naturalWidth, renderHeight / naturalHeight);
    const displayedWidth = naturalWidth * scale;
    const displayedHeight = naturalHeight * scale;
    const offsetX = (renderWidth - displayedWidth) / 2;
    const offsetY = (renderHeight - displayedHeight) / 2;

    const x0 = (cropRect.x - offsetX) / scale;
    const y0 = (cropRect.y - offsetY) / scale;
    const x1 = (cropRect.x + cropRect.width - offsetX) / scale;
    const y1 = (cropRect.y + cropRect.height - offsetY) / scale;

    const sx = Math.max(0, Math.min(naturalWidth, x0));
    const sy = Math.max(0, Math.min(naturalHeight, y0));
    const ex = Math.max(0, Math.min(naturalWidth, x1));
    const ey = Math.max(0, Math.min(naturalHeight, y1));

    const sw = Math.max(1, ex - sx);
    const sh = Math.max(1, ey - sy);

    const sourceBlob = currentState.blob;
    const imageBitmap = await createImageBitmap(sourceBlob);

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsCropping(false);
      return;
    }

    ctx.drawImage(
      imageBitmap,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      sw,
      sh,
    );

    const croppedBlob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png"),
    );

    if (!croppedBlob) {
      setIsCropping(false);
      return;
    }

    pushNewState(() => ({
      blob: croppedBlob,
      zoom: 1,
      offset: { x: 0, y: 0 },
    }));

    setIsCropping(false);
    setCropRect(null);
  }, [currentState, cropRect, imageDimensions, pushNewState]);

  const handleUndo = useCallback(() => {
    setEditorHistory((prev) => {
      if (prev.index <= 0) return prev;
      return { ...prev, index: prev.index - 1 };
    });
    setIsCropping(false);
    setCropRect(null);
  }, []);

  const handleRedo = useCallback(() => {
    setEditorHistory((prev) => {
      if (prev.index < 0 || prev.index >= prev.entries.length - 1) return prev;
      return { ...prev, index: prev.index + 1 };
    });
    setIsCropping(false);
    setCropRect(null);
  }, []);

  const emptyState = (
    <section className="w-full max-w-2xl">
      <h1 className="mb-4 text-center text-xl font-semibold text-white sm:mb-6 sm:text-2xl">
        One image in. All the boring fixes here.
      </h1>

      <div
        className={`rounded-3xl border border-dashed bg-white/5 p-8 text-center text-sm text-white/70 backdrop-blur-sm sm:p-10 ${
          isDragging ? "border-sky-400/80 bg-sky-400/10" : "border-white/25"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-white sm:h-16 sm:w-16">
          <ImageIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <p className="mt-5 text-lg font-semibold text-white sm:text-2xl">
          Drop your image to get started
        </p>
        <p className="mt-3 text-xs text-white/65 sm:text-sm">
          Drag a JPG, PNG, or WebP onto this area, or use the button below.
          This will turn into a simple live preview as features land.
        </p>
        <button
          type="button"
          onClick={handleButtonClick}
          className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-2.5 text-xs font-semibold text-white transition hover:border-sky-400/80 hover:bg-sky-400/25 sm:text-sm"
        >
          Choose image from computer
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </section>
  );

  const editingState = (
    <section className="w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Editing image
          </p>
          {fileName && (
            <p className="text-sm text-white/70">{fileName}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleButtonClick}
          className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-sky-400/80 hover:bg-sky-400/25 sm:text-sm"
        >
          Change image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-4">
          <div className="flex h-full items-start justify-start rounded-2xl border border-white/12 bg-white/5 p-4 text-xs text-white/70 backdrop-blur-sm sm:p-5">
            <button
              type="button"
              disabled={!currentState || !previewUrl || isCropping}
              onClick={startCrop}
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent p-2 text-white/80 transition cursor-pointer hover:bg-[#285ed450] hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
              aria-label="Start crop"
            >
              <Crop className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex items-center justify-between text-xs text-white/60">
            <p>Preview</p>
            {isCropping && cropRect && (
              <button
                type="button"
                onClick={applyCrop}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white transition hover:border-sky-400/80 hover:bg-sky-500/70"
              >
                Apply crop
              </button>
            )}
          </div>
          <div
            ref={previewContainerRef}
            className={`mt-4 flex h-[260px] items-center justify-center rounded-2xl bg-black/40 p-3 sm:h-[340px] sm:p-4 overflow-hidden relative ${
              currentState
                ? isPanningPreview
                  ? "cursor-grabbing"
                  : isCropping
                    ? "cursor-crosshair"
                    : "cursor-grab"
                : ""
            }`}
            onMouseDown={handlePreviewMouseDown}
            onWheel={handlePreviewWheel}
            onMouseMove={(event) => {
              if (cropDragStateRef.current) {
                handleCropMouseMove(event);
              } else {
                handlePreviewMouseMove(event);
              }
            }}
            onMouseUp={() => {
              if (cropDragStateRef.current) {
                stopCroppingDrag();
              }
              if (panStartRef.current) {
                stopPanning();
              }
            }}
            onMouseLeave={() => {
              if (cropDragStateRef.current) {
                stopCroppingDrag();
              }
              if (panStartRef.current) {
                stopPanning();
              }
            }}
          >
            

            {previewUrl && currentState && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={previewImageRef}
                src={previewUrl}
                alt={fileName ?? "Uploaded image"}
                className="h-full w-full rounded-xl object-contain"
                style={{
                  transform: `translate3d(${currentState.offset.x}px, ${currentState.offset.y}px, 0) scale(${currentState.zoom})`,
                  transformOrigin: "center center",
                  transition: isPanningPreview ? "none" : "transform 120ms ease-out",
                }}
                onLoad={handleImageLoad}
              />
            )}

            {isCropping && cropRect && (
              <div
                className="absolute inset-0"
                aria-hidden
              >
                <div
                  className="absolute border border-sky-400/90 bg-sky-400/10"
                  style={{
                    left: `${cropRect.x}px`,
                    top: `${cropRect.y}px`,
                    width: `${cropRect.width}px`,
                    height: `${cropRect.height}px`,
                  }}
                  onMouseDown={(event) => handleCropMouseDown(event, "move")}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    <div className="border-b border-r border-white/20" />
                    <div className="border-b border-r border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-b border-r border-white/20" />
                    <div className="border-b border-r border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                    <div />
                  </div>

                  <div
                    className="absolute -top-1 -left-1 h-3 w-3 cursor-nwse-resize rounded-full border border-sky-300 bg-sky-400"
                    onMouseDown={(event) => handleCropMouseDown(event, "nw")}
                  />
                  <div
                    className="absolute -top-1 -right-1 h-3 w-3 cursor-nesw-resize rounded-full border border-sky-300 bg-sky-400"
                    onMouseDown={(event) => handleCropMouseDown(event, "ne")}
                  />
                  <div
                    className="absolute -bottom-1 -left-1 h-3 w-3 cursor-nesw-resize rounded-full border border-sky-300 bg-sky-400"
                    onMouseDown={(event) => handleCropMouseDown(event, "sw")}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 h-3 w-3 cursor-nwse-resize rounded-full border border-sky-300 bg-sky-400"
                    onMouseDown={(event) => handleCropMouseDown(event, "se")}
                  />
                </div>
              </div>
            )}
          </div>

          {currentState && (
            <div className="mt-4 flex items-center gap-3 text-[11px] text-white/60">
              <span className="whitespace-nowrap">Zoom</span>
              <input
                type="range"
                min={50}
                max={400}
                step={10}
                value={Math.round(currentState.zoom * 100)}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (Number.isNaN(value)) return;
                  const nextZoom = value / 100;
                  applyFromCurrent((state) => ({
                    ...state,
                    zoom: nextZoom,
                  }));
                }}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
              />
              <span className="w-10 text-right">{Math.round(currentState.zoom * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 items-center justify-center px-6 pb-20 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center sm:top-8">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs text-white/70 backdrop-blur-md">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white disabled:cursor-not-allowed disabled:text-white/30"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <div className="h-4 w-px bg-white/20" />
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white disabled:cursor-not-allowed disabled:text-white/30"
            >
              <Redo2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>
        </div>

        {currentState ? editingState : emptyState}
      </main>
    </div>
  );
}
