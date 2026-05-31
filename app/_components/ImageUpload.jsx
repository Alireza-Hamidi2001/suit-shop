// components/ImageUpload.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaUpload, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ImageUpload({ currentImage = null, userId }) {
    const router = useRouter();
    const [preview, setPreview] = useState(currentImage);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setPreview(currentImage);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [currentImage, userId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setSelectedFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setSelectedFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handleDeletePermanently = async () => {
        setIsDeleting(true);
        const loadingToast = toast.loading("Deleting avatar...");

        try {
            const res = await fetch(`/api/user/avatar?userId=${userId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Delete failed");
            }

            toast.success("Profile Image deleted successfully!", {
                id: loadingToast,
                duration: 3000,
            });

            setPreview(null);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            router.refresh();
        } catch (error) {
            toast.error(error.message, {
                id: loadingToast,
                duration: 4000,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Uploading...");

        try {
            const formData = new FormData();
            formData.append("avatar", selectedFile);

            const res = await fetch(`/api/user/avatar?userId=${userId}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            toast.success("Avatar updated successfully!", {
                id: loadingToast,
                duration: 3000,
            });

            router.refresh();

            // به‌روزرسانی آدرس عکس در پیش‌نمایش
            setPreview(data.avatarUrl);
            setSelectedFile(null);
        } catch (error) {
            toast.error(error.message, {
                id: loadingToast,
                duration: 4000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full">
            <label className="label">&mdash; Profile Picture</label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                    ${
                        dragActive
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-gray-400 dark:border-gray-700 hover:border-amber-500 dark:hover:border-zinc-600"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {preview ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="text-sm bg-orange-500 hover:bg-orange-700 hover:cursor-pointer text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaUpload className="w-3 h-3" />
                                Change
                            </button>
                            {/* <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <FaTrashAlt className="w-3 h-3" />
                                Remove
                            </button> */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePermanently();
                                }}
                                disabled={isDeleting}
                                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 hover:cursor-pointer rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaTimes className="w-3 h-3" />
                                {isDeleting ? "Deleting..." : "Delete image"}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                                disabled={isSaving || !selectedFile}
                                className="text-sm bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave className="w-3 h-3" />
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <FaUpload className="w-10 h-10 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click or drag & drop to upload
                        </p>
                        <p className="text-xs text-gray-400">
                            PNG, JPG, JPEG (Max 5MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
