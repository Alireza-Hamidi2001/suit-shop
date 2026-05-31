// components/ScrollReveal.jsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ScrollReveal({
    children,
    direction = "left",
    delay = 0,
    className = "",
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    const directionOffset = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: 50 },
        down: { x: 0, y: -50 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...directionOffset[direction] }}
            animate={
                isInView
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 0, ...directionOffset[direction] }
            }
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
