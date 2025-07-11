"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  maxSize?: number // in MB
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "Upload an image or enter URL",
  maxSize = 5,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Image size must be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)

    try {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setUploadedFile(file)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setError("Failed to read file")
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      setError("Failed to process image")
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    setUploadedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlChange = (url: string) => {
    if (url) {
      setUploadedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
    onChange(url)
  }

  const isDataUrl = value.startsWith("data:")
  const hasImage = value.length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {/* File Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-transparent"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload from Device
              </>
            )}
          </Button>

          {hasImage && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveImage}
              size="sm"
              className="bg-transparent text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Image Preview */}
        {hasImage && (
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border">
            <img
              src={value || "/placeholder.svg"}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <div className="text-sm">
                {uploadedFile ? (
                  <>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    <p className="text-green-600">✓ Uploaded from device</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-900">External Image</p>
                    <p className="text-gray-500 break-all">{value.substring(0, 50)}...</p>
                    <p className="text-blue-600">🌐 From URL</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Alternative */}
      <div className="border-t pt-4">
        <Label htmlFor="imageUrl" className="text-sm text-gray-600">
          Or enter image URL
        </Label>
        <Input
          id="imageUrl"
          type="url"
          value={isDataUrl ? "" : value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
          disabled={isUploading}
        />
      </div>

      {/* Upload Guidelines */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum size: {maxSize}MB</p>
        <p>• Recommended: Square images (1:1 ratio) for best results</p>
      </div>
    </div>
  )
}
