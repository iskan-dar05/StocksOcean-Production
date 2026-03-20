'use client'

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Notification from '@/components/ui/Notification'

interface UploadFormData {
  title: string
  description: string
  tags: string[]
  license: string
  category: string
}

interface UploadFormProps {
  onSuccess?: (assetId: string) => void
  onError?: (error: string) => void
}

/**
 * UploadForm Component
 * 
 * Handles file uploads to Supabase Storage and creates asset records.
 * Supports images (preview), MP4 videos, and GLB 3D models.
 */
export default function UploadForm({ onSuccess, onError }: UploadFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    tags: [],
    license: 'standard',
    category: '',
  })
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; icon: string | null }>>([])
  
  // UI state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (data) {
        setCategories(data)
      }
    }
    fetchCategories()
  }, [])

  /**
   * Validates file type and size
   */
  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'model/gltf-binary',
      'application/octet-stream', // For .glb files
    ]
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.glb']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    // Check file extension
    if (!allowedExtensions.includes(fileExtension)) {
      return `File type not supported. Allowed types: ${allowedExtensions.join(', ')}`
    }
    
    // Check MIME type if available
    if (file.type && !allowedTypes.includes(file.type)) {
      // Allow .glb files even if MIME type is not recognized
      if (fileExtension !== '.glb') {
        return `File type ${file.type} is not supported`
      }
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    if (file.size > maxSize) {
      return `File size exceeds 50MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    }
    
    return null
  }

  /**
   * Process selected file
   */
  const processFile = (file: File) => {
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  /**
   * Handles file selection and creates preview for images
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  /**
   * Handles adding tags
   */
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      })
      setTagInput('')
    }
  }

  /**
   * Removes a tag
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("CLIENT +++++============= 1")
    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      // Validate required fields
      if (!selectedFile) {
        throw new Error('Please select a file to upload')
      }

      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }

      // Get current user
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to upload assets')
      }

      // Determine file type from extension
      const fileExtension = selectedFile.name
        .toLowerCase()
        .substring(selectedFile.name.lastIndexOf('.'))
      let fileType = 'other'
      
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(fileExtension)) {
        fileType = 'image'
      } else if (fileExtension === '.mp4') {
        fileType = 'video'
      } else if (fileExtension === '.glb') {
        fileType = '3d'
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedFilename = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `contributors/${user.id}/${timestamp}-${sanitizedFilename}`

      // Upload file to Supabase Storage
      setUploadProgress(10)



      setUploadProgress(60)

      setUploadProgress(70)

      const uploadData = new FormData()

      uploadData.append("file", selectedFile)
      uploadData.append("title", formData.title.trim())
      uploadData.append("description", formData.description.trim() || "")
      uploadData.append("type", fileType)
      uploadData.append("license", formData.license)
      uploadData.append("category", formData.category || "")
      uploadData.append("tags", JSON.stringify(formData.tags))

      // Create asset record via API
      const response = await fetch('/api/assets/create', {
        method: 'POST',
        
        body: uploadData
      })

      setUploadProgress(90)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to create asset: ${response.statusText}`)
      }

      const { assetId } = await response.json()

      setUploadProgress(100)

      // Success callback
      if (onSuccess) {
        onSuccess(assetId)
      } else {
        // Default: redirect to dashboard
        router.push('/contributor/dashboard')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during upload'
      setError(errorMessage)
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          File <span className="text-red-500">*</span>
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            name="file"
            accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.glb"
            onChange={handleFileChange}
            disabled={uploading}
            required
            className="hidden"
          />
          {!selectedFile ? (
            <label
              htmlFor="file"
              className="cursor-pointer flex flex-col items-center"
            >
              {isDragging ? (
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Drop file here
                </p>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Click to upload or drag and drop
                  </span>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Images (JPG, PNG, WebP, GIF), MP4 videos, or GLB 3D models
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Maximum file size: 50MB
                  </p>
                </>
              )}
            </label>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              {uploading && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
          placeholder="Enter asset title"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
          placeholder="Enter asset description"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTag()
              }
            }}
            disabled={uploading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={uploading || !tagInput.trim()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {tag}
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
        >
          <option value="">Select a category (optional)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* License */}
      <div>
        <label
          htmlFor="license"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          License
        </label>
        <select
          id="license"
          name="license"
          value={formData.license}
          onChange={(e) =>
            setFormData({ ...formData, license: e.target.value })
          }
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
        >
          <option value="standard">Standard</option>
          <option value="extended">Extended</option>
          <option value="editorial">Editorial</option>
          <option value="free">Free</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Asset'}
        </button>
      </div>
    </form>
  )
}

