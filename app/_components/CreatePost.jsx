"use client";

import { useState } from "react";
import CreateModalPost from "./CreateModalPost";

function CreatePost() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    return (
        <>
            <button
                onClick={() => setShowCreateModal((prev) => !prev)}
                className="bg-teal-500 hover:bg-teal-600 duration-200 transition-all hover:cursor-pointer text-white py-2 px-3 mb-4 text-sm"
            >
                Create a new product
            </button>
            <CreateModalPost
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
            />
        </>
    );
}

export default CreatePost;
