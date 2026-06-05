"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ScaleReveal({
    children,
    delay = 0,
    className = "",
    startScale = 0,
}) {
    const ref = useRef(null);

    const isInView = useInView(ref, {
        once: false,
        margin: "-120px",
    });

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                scale: startScale,
            }}
            animate={
                isInView
                    ? {
                          opacity: 1,
                          scale: 1,
                      }
                    : {
                          opacity: 0,
                          scale: startScale,
                      }
            }
            transition={{
                duration: 0.7,
                delay,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
