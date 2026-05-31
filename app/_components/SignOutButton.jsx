// app/_components/SignOutButton.jsx
"use client";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import ModalSignOut from "./ModalSignOut";

function SignOutButton({ isNextAuthUser = false }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <ModalSignOut
                showModal={showModal}
                setShowModal={setShowModal}
                isNextAuthUser={isNextAuthUser}
            />

            <button
                onClick={() => setShowModal(true)}
                className="py-3 px-5 transition-colors font-semibold flex items-center gap-4 w-full text-red-600 dark:text-red-500 hover:cursor-pointer hover:bg-red-200 dark:hover:bg-red-200"
            >
                <FaSignOutAlt className="h-5 w-5 text-red-600 dark:text-red-500" />
                <span>Sign out</span>
            </button>
        </>
    );
}

export default SignOutButton;
