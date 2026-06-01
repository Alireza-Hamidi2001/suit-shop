"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/app/_components/ImageUpload";
import { updateProfileAction } from "@/lib/actions";

export default function ProfileForm({ user }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const role = user?.role ?? "user";

    // state برای مقادیر فرم
    const [formData, setFormData] = useState({
        phone: user?.phone || "",
        description: user?.description || "",
        address: user?.address || "",
        building_number: user?.building_number || "",
        postal_code: user?.postal_code || "",
        unit: user?.unit || "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                phone: user?.phone || "",
                description: user?.description || "",
                address: user?.address || "",
                building_number: user?.building_number || "",
                postal_code: user?.postal_code || "",
                unit: user?.unit || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading("Updating profile...");

        try {
            const formDataObj = new FormData();
            formDataObj.append("phone", formData.phone);
            formDataObj.append("description", formData.description);
            formDataObj.append("address", formData.address);
            formDataObj.append("building_number", formData.building_number);
            formDataObj.append("postal_code", formData.postal_code);
            formDataObj.append("unit", formData.unit);

            const result = await updateProfileAction(formDataObj);

            if (result.success) {
                toast.success("Profile updated successfully!", {
                    id: loadingToast,
                    duration: 3000,
                });
                router.refresh();
            }
        } catch (error) {
            toast.error(error.message || "Failed to update profile", {
                id: loadingToast,
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="title">&bull; Update profile</h2>

            <p className="text-sm tracking-wide mb-28 text-paragraph-light dark:text-paragraph-dark">
                Providing the following information will make your check-in
                process faster and smoother. See you soon!
            </p>

            <form
                onSubmit={handleSubmit}
                className="bg-amber-100 dark:bg-zinc-900 text-title-dark dark:text-title-light py-8 px-12 text-sm gap-6 grid grid-cols-2"
            >
                <div className="col-span-2 space-y-2">
                    <ImageUpload
                        currentImage={user.avatar}
                        userId={user.id}
                    />
                </div>

                <div className="space-y-2">
                    <label className="label">&mdash; Full name</label>
                    <input
                        disabled
                        className="disabled:bg-gray-200 disabled:dark:bg-zinc-600 input text-blue-700 dark:text-blue-200"
                        value={user.name || ""}
                    />
                </div>

                <div className="space-y-2">
                    <label className="label">&mdash; Email address</label>
                    <input
                        disabled
                        className="disabled:bg-gray-200 disabled:dark:bg-zinc-600 input text-blue-700 dark:text-blue-200"
                        value={user.email || ""}
                    />
                </div>
                {role === "user" && (
                    <>
                        {" "}
                        <div className="space-y-2">
                            <label
                                className="label"
                                htmlFor="phone"
                            >
                                &mdash; Phone number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="input"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                className="label"
                                htmlFor="description"
                            >
                                &mdash; Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="input"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid col-span-2 grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-4">
                                <label
                                    className="label"
                                    htmlFor="address"
                                >
                                    &mdash; Address *
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="input"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="label"
                                    htmlFor="building_number"
                                >
                                    Building Number*
                                </label>
                                <input
                                    type="text"
                                    id="building_number"
                                    name="building_number"
                                    className="input"
                                    value={formData.building_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="label"
                                    htmlFor="postal_code"
                                >
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    className="input"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="label"
                                    htmlFor="unit"
                                >
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    id="unit"
                                    name="unit"
                                    className="input"
                                    value={formData.unit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="flex col-span-2 justify-center items-center gap-6">
                    <button
                        type="submit"
                        className="button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
