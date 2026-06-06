"use client";

import { useState, useEffect, useRef } from "react";
import { FaSave, FaUpload, FaTrashAlt, FaMale, FaFemale } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoWarning } from "react-icons/io5";

function EditSuitModal({ showModal, setShowModal, suit, onUpdate }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        discount: "",
        description: "",
        fabric: "",
        category: "male",
    });

    

    useEffect(() => {
        if (suit) {
            setFormData({
                name: suit.name || "",
                price: suit.price || "",
                discount: suit.discount || "",
                description: suit.description || "",
                fabric: suit.fabric || "",
                category: suit.category || "male",
            });
            setImagePreview(suit.image || null);
        }
    }, [suit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) return null;
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);
        const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: uploadFormData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading("Updating suit...");

        try {
            let imageUrl = suit.image;
            if (selectedFile) {
                imageUrl = await uploadImage();
            }

            const res = await fetch(`/api/admin/suits/${suit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, image: imageUrl }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");

            toast.success("Suit updated successfully!", {
                id: loadingToast,
                duration: 3000,
            });

            setShowModal(false);
            onUpdate?.();
            router.refresh();
        } catch (error) {
            toast.error(error.message, {
                id: loadingToast,
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!suit) return null;

    return (
        <div
            className={`${
                showModal
                    ? "flex fixed inset-0 justify-center items-center z-50 bg-black/50 dark:bg-white/50 backdrop-blur-sm"
                    : "hidden"
            }`}
        >
            <div className="relative w-full max-w-2xl mx-4 flex flex-col rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white shadow-2xl">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-8 pt-6 pb-4 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <IoWarning className="h-8 w-8 error" />
                        Edit suit
                    </div>
                    <button
                        onClick={() => setShowModal(false)}
                        className="times"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </div>

                <div className="px-8 pb-6 max-h-[70vh] overflow-y-auto">
                    <div className="flex flex-col items-center justify-center py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border-4 border-amber-200 dark:border-amber-800">
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="Product preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors flex items-center gap-2 text-sm"
                            >
                                <FaUpload className="w-4 h-4" />
                                Change Image
                            </button>
                            {imagePreview && imagePreview !== suit?.image && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setImagePreview(suit?.image || null);
                                    }}
                                    className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <FaTrashAlt className="w-4 h-4" />
                                    Cancel
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            PNG, JPG, JPEG (Max 5MB)
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 pt-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Suit Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="input"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Fabric
                                </label>
                                <input
                                    type="text"
                                    name="fabric"
                                    value={formData.fabric}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                        {formData.category === "male" ? (
                                            <FaMale className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <FaFemale className="w-4 h-4 text-pink-500" />
                                        )}
                                    </div>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500 focus:outline-none appearance-none"
                                    >
                                        <option value="male">
                                            Men (Gentlemen)
                                        </option>
                                        <option value="female">
                                            Women (Ladies)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <FaSave className="w-4 h-4" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditSuitModal;
