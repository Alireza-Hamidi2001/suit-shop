"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateModalPost from "./CreateModalPost";

function CreatePost() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowCreateModal(true)}
                className="group relative overflow-hidden bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium py-2.5 px-5 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
                <FaPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Create New Product</span>
                {/* افکت hover gradient */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </button>

            <CreateModalPost
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
            />
        </>
    );
}

export default CreatePost;
