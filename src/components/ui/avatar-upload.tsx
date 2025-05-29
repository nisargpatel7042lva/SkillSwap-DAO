import React, { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string, file?: File) => void;
  name?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      if (onChange) onChange(url, file);
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
    </div>
  );
}; 