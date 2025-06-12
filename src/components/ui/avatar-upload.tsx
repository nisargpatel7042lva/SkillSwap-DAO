import React, { useRef, useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Cropper from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";
import type { Area } from "react-easy-crop";

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string, file?: File) => void;
  name?: string;
}

function getCroppedImg(imageSrc: string, crop: Area, zoom: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = image.naturalWidth / image.width;
      const cropX = crop.x * scale;
      const cropY = crop.y * scale;
      const cropWidth = crop.width * scale;
      const cropHeight = crop.height * scale;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject();
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject();
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRawImage(url);
      setShowCrop(true);
    }
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels, zoom);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setPreview(croppedUrl);
    setShowCrop(false);
    setRawImage(null);
    if (onChange) {
      const croppedFile = new File([croppedBlob], uuidv4() + ".jpg", { type: "image/jpeg" });
      onChange(croppedUrl, croppedFile);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="w-24 h-24 border-2 border-dashed border-gray-300 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <AvatarImage src={preview || value} alt="Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        name={name}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="text-xs text-blue-600 underline mt-1"
        onClick={() => fileInputRef.current?.click()}
      >
        Change Avatar
      </button>
      {showCrop && rawImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="relative w-[300px] h-[300px] bg-gray-100">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-xs">Zoom</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleCropConfirm}
              >
                Crop & Save
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                onClick={() => { setShowCrop(false); setRawImage(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 