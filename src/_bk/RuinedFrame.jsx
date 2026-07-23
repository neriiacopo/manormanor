import { useId } from "react";
import styles from "./RuinedFrame.module.css";

export default function RuinedFrame({
    children,
    className = "",
    roughness = 18,
    frequency = 0.012,
    octaves = 3,
    seed = 4,
    padding = "2rem",
    background = "#d8c08a",
}) {
    const rawId = useId();
    const filterId = `ruined-frame-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    return (
        <div
            className={`${styles.frame} ${className}`}
            style={{
                "--ruined-padding": padding,
                "--ruined-background": background,
            }}
        >
            <div
                className={styles.surface}
                style={{
                    filter: `url(#${filterId})`,
                }}
                aria-hidden="true"
            />

            <div
                className={styles.damage}
                aria-hidden="true"
            />
            <div className={styles.content}>{children}</div>

            <svg
                className={styles.filters}
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-15%"
                        y="-15%"
                        width="130%"
                        height="130%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={frequency}
                            numOctaves={octaves}
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
        </div>
    );
}
