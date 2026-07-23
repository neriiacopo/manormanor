// RuinedPaper.jsx
import { useId } from "react";
import styles from "./RuinedPaper.module.css";

export default function RuinedPaper({
    children,
    className = "",
    roughness = 18,
    frequency = 0.015,
    seed = 8,
}) {
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const filterId = `ruined-paper-${id}`;

    return (
        <article className={`${styles.paper} ${className}`}>
            <div
                className={styles.surface}
                style={{ filter: `url("#${filterId}")` }}
                aria-hidden="true"
            />

            <div className={styles.content}>{children}</div>

            <svg
                className={styles.filters}
                width="0"
                height="0"
                aria-hidden="true"
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-15%"
                        y="-15%"
                        width="130%"
                        height="130%"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={frequency}
                            numOctaves="4"
                            seed={seed}
                            result="noise"
                        />

                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={roughness}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>
        </article>
    );
}
