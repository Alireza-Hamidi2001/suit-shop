// app/_components/DeleteMenu.jsx
"use client";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import ModalDeleteAccount from "./ModalDeleteAccount";

function DeleteMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModalWindow, setShowDeleteModalWindow] = useState(false);

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteModalWindow(true);
    };

    return (
        <>
            <div className="relative">
                {/* دکمه سه نقطه */}
                <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <HiDotsVertical className="text-zinc-800 dark:text-amber-100 w-6 h-6 hover:scale-110 transition-all" />
                </button>

                {/* منوی بازشونده */}
                {showMenu && (
                    <div className="flex flex-col gap-2 p-2 absolute right-0 mt-2 bg-amber-100 dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-20 min-w-75">
                        <button
                            onClick={handleDeleteClick}
                            className="flex gap-2 hover:cursor-pointer text-white justify-center rounded-sm items-center px-4 py-2 bg-red-500  transition-colors font-comic"
                        >
                            <FaTrashAlt className="w-4 h-4" />
                            <span>Delete account</span>
                        </button>
                    </div>
                )}
            </div>

            <ModalDeleteAccount
                showDeleteModalWindow={showDeleteModalWindow}
                setShowDeleteModalWindow={setShowDeleteModalWindow}
            />
        </>
    );
}

export default DeleteMenu;
