/**
 * AvatarUpload - компонент загрузки аватара
 * 
 * Функции:
 * - Предпросмотр изображения
 * - Drag & Drop
 * - Валидация размера и формата
 * - Обрезка изображения (опционально)
 */

import React, { useState, useRef } from 'react';
import { Upload, User, X } from 'lucide-react';
import { uploadAvatar } from '../lib/api';
import { useSessionStore } from '../lib/store';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (url: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  onUploadSuccess 
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateUser = useSessionStore((state) => state.updateUser);

  const handleFileSelect = async (file: File) => {
    // Валидация
    if (!file.type.startsWith('image/')) {
      setError('Выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setError(null);

    // Предпросмотр
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Загрузка
    try {
      setUploading(true);
      console.log('Загрузка аватара:', file.name, file.size, file.type);
      
      const response = await uploadAvatar(file);
      console.log('Ответ сервера:', response);
      
      // Обновляем пользователя в store
      updateUser({ avatar_url: response.url });
      
      if (onUploadSuccess) {
        onUploadSuccess(response.url);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки аватара:', err);
      console.error('Детали ошибки:', {
        response: err.response,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      
      const errorMessage = err.response?.data?.error || err.message || 'Ошибка загрузки';
      setError(errorMessage);
      setPreview(currentAvatar || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Avatar preview" 
              className="w-full h-full object-cover"
            />
            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <User className="w-12 h-12 mb-2" />
            <Upload className="w-6 h-6" />
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Нажмите или перетащите изображение
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG или WEBP (макс. 5MB)
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};
