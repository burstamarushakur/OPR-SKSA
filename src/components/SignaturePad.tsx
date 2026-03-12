import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export interface SignaturePadRef {
  clear: () => void;
  getSignature: () => string | null;
  isEmpty: () => boolean;
}

// Custom function to trim transparent pixels from canvas
function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const pixels = ctx.getImageData(0, 0, width, height).data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = pixels[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  // If the canvas is empty, return the original canvas
  if (minX > maxX || minY > maxY) {
    return canvas;
  }

  // Add a small padding
  const padding = 10;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width, maxX + padding);
  maxY = Math.min(height, maxY + padding);

  const trimmedWidth = maxX - minX;
  const trimmedHeight = maxY - minY;

  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;
  const trimmedCtx = trimmedCanvas.getContext('2d');
  
  if (trimmedCtx) {
    trimmedCtx.drawImage(
      canvas,
      minX, minY, trimmedWidth, trimmedHeight,
      0, 0, trimmedWidth, trimmedHeight
    );
  }

  return trimmedCanvas;
}

export const SignaturePad = forwardRef<SignaturePadRef, {}>((props, ref) => {
  const sigPad = useRef<SignatureCanvas>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      sigPad.current?.clear();
    },
    getSignature: () => {
      if (sigPad.current?.isEmpty()) {
        return null;
      }
      const canvas = sigPad.current?.getCanvas();
      if (!canvas) return null;
      
      const trimmed = trimCanvas(canvas);
      return trimmed.toDataURL('image/png');
    },
    isEmpty: () => {
      return sigPad.current?.isEmpty() || true;
    }
  }));

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      <SignatureCanvas
        ref={sigPad}
        canvasProps={{
          className: 'signature-canvas w-full h-40'
        }}
      />
      <div className="bg-gray-50 p-2 text-right border-t border-gray-300">
        <button
          type="button"
          onClick={() => sigPad.current?.clear()}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          PADAM TANDATANGAN
        </button>
      </div>
    </div>
  );
});
