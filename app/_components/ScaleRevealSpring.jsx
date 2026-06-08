// components/ScaleRevealSpring.jsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function ScaleRevealSpring({
    children,
    delay = 0,
    className = "",
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0 }}
            animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
