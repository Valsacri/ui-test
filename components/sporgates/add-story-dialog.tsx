"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Upload, Loader2, ImagePlus } from "lucide-react"

interface AddStoryDialogProps {
    open: boolean
    onClose: () => void
    onCreateStory: (file: File) => Promise<void>
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_VIDEO_DURATION_SEC = 30
const ACCEPTED_TYPES = "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"

export function AddStoryDialog({ open, onClose, onCreateStory }: AddStoryDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)

        // Validate type
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            setError("Only image and video files are supported.")
            return
        }

        // Validate size
        const isVideo = file.type.startsWith("video/")
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
        if (file.size > maxSize) {
            setError(`File size must not exceed ${isVideo ? "50MB" : "10MB"}.`)
            return
        }

        const url = URL.createObjectURL(file)

        if (isVideo) {
            const metadataUrl = URL.createObjectURL(file)
            const video = document.createElement("video")
            video.preload = "metadata"
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(metadataUrl)
                const durationSec = video.duration
                if (durationSec > MAX_VIDEO_DURATION_SEC) {
                    setError(`Video must be ${MAX_VIDEO_DURATION_SEC} seconds or less. Yours is ${Math.ceil(durationSec)}s.`)
                    URL.revokeObjectURL(url)
                    return
                }
                setSelectedFile(file)
                setPreview(url)
            }
            video.onerror = () => {
                setError("Could not read video file.")
                URL.revokeObjectURL(metadataUrl)
                URL.revokeObjectURL(url)
            }
            video.src = metadataUrl
            return
        }

        setSelectedFile(file)
        setPreview(url)
    }

    const handleSubmit = async () => {
        if (!selectedFile) return

        try {
            setIsUploading(true)
            setError(null)
            await onCreateStory(selectedFile)
            handleClose()
        } catch (err: unknown) {
            const msg =
                err && typeof err === "object" && "response" in err &&
                err.response && typeof err.response === "object" && "data" in err.response &&
                err.response.data && typeof err.response.data === "object" && "error" in err.response.data &&
                typeof (err.response.data as { error: string }).error === "string"
                    ? (err.response.data as { error: string }).error
                    : "Failed to create story. Please try again."
            setError(msg)
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        setSelectedFile(null)
        setPreview(null)
        setError(null)
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80">
            <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white">Add Story</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!preview ? (
                        /* File picker */
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-6 py-16 transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                                <ImagePlus className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-white">
                                    Choose a photo or video
                                </p>
                                <p className="mt-1 text-xs text-white/50">
                                    JPEG, PNG, GIF, WebP, MP4, or WebM · Video max {MAX_VIDEO_DURATION_SEC}s
                                </p>
                            </div>
                        </button>
                    ) : (
                        /* Preview */
                        <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-xl bg-black">
                            {selectedFile?.type.startsWith("video/") ? (
                                <video
                                    src={preview}
                                    className="h-full w-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={preview}
                                    alt="Story preview"
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null)
                                    setPreview(null)
                                    if (fileInputRef.current) fileInputRef.current.value = ""
                                }}
                                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                                aria-label="Remove selected file"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES}
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Error */}
                    {error && (
                        <p className="mt-4 text-center text-sm text-red-400">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedFile || isUploading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading…
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Share Story
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
