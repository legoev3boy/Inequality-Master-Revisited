
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Pencil } from 'lucide-react';

export const ScratchPad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        if (canvas.width !== container.clientWidth || canvas.height !== 300) {
            canvas.width = container.clientWidth;
            canvas.height = 300;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.strokeStyle = '#4f46e5';
              ctx.lineWidth = 2;
              setContext(ctx);
            }
        }
      }
    };

    initCanvas();
    
    let timeoutId: any;
    const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(initCanvas, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
    };
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    context?.beginPath();
    context?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    context?.lineTo(x, y);
    context?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    context?.closePath();
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.beginPath();
    }
  };

  return (
    <div ref={containerRef} className="w-full mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
           <Pencil size={18} />
           <span>Scratchpad</span>
        </div>
        <button 
          onClick={clearCanvas}
          type="button"
          className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={14} /> Clear
        </button>
      </div>
      <div className="relative border-2 border-dashed border-indigo-200 rounded-2xl bg-white overflow-hidden shadow-sm">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="block w-full touch-none cursor-crosshair relative z-10"
          style={{ height: '300px' }}
        />
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
             }}>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">Use this space for rough work. Calculations here are not graded.</p>
    </div>
  );
};
