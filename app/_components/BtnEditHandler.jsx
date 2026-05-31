"use client";

import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditSuitModal from "./EditSuitModal";
import DeleteSuitModal from "./DeleteSuitModal";

function BtnEditHandler({ suit }) {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    return (
        <div className="flex gap-2 items-center absolute top-4 right-4">
            <FaEdit
                onClick={() => setEditModalShow(true)}
                className="w-5 h-5 text-amber-500 hover:text-amber-600 duration-200 transition-all cursor-pointer"
            />
            <FaTrashAlt
                onClick={() => setDeleteModalShow(true)}
                className="w-5 h-5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 duration-200 transition-all cursor-pointer"
            />

            <EditSuitModal
                showModal={editModalShow}
                setShowModal={setEditModalShow}
                suit={suit}
                onUpdate={() => window.location.reload()}
            />

            <DeleteSuitModal
                deleteModalShow={deleteModalShow}
                setDeleteModalShow={setDeleteModalShow}
                suitId={suit.id}
                onDelete={() => window.location.reload()}
            />
        </div>
    );
}

export default BtnEditHandler;
