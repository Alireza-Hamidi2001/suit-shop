// components/DeleteCommentButton.jsx
"use client";

import { useState } from "react";
import { FaRegTrashAlt  } from "react-icons/fa";
import ModalDeleteComment from "./ModalDeleteComment";

function DeleteCommentButton({ commentId }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 absolute top-3 right-3"
                title="Delete comment"
            >
                <FaRegTrashAlt  className="w-4 h-4" />
            </button>

            <ModalDeleteComment
                showModal={showModal}
                setShowModal={setShowModal}
                commentId={commentId}
            />
        </>
    );
}

export default DeleteCommentButton;
