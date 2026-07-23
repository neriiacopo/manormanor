import { useId } from "react";
import styles from "./PaperBox.module.css";

/**
 * Procedural paper background.
 *
 * The filter affects only the generated background layer.
 * Children remain visually unchanged.
 */
export default function PaperBox({
    children,
    as: Component = "div",
    className = "",
    style,

    seed = 12,
    grain = 1,
    variation = 1,
    stains = 100,

    ...props
}) {
    const rawId = useId();
    const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
    const filterId = `paper-box-${safeId}`;

    const safeGrain = Math.max(0, grain);
    const safeVariation = Math.max(0, variation);
    const safeStains = Math.max(0, stains);

    return (
        <Component
            className={`${styles.root} ${className}`.trim()}
            style={{
                "--paper-filter": `url("#${filterId}")`,
                ...style,
            }}
            {...props}
        >
            <svg
                className={styles.definitions}
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                        colorInterpolationFilters="sRGB"
                    >
                        {/* Broad paper colour variation */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.008 0.015"
                            numOctaves="4"
                            seed={seed}
                            stitchTiles="stitch"
                            result="paperNoise"
                        />

                        <feColorMatrix
                            in="paperNoise"
                            type="matrix"
                            values={`
                                0.28 0    0    0 0.61
                                0    0.22 0    0 0.54
                                0    0    0.15 0 0.43
                                0    0    0    ${0.22 * safeVariation} 0
                            `}
                            result="paperVariation"
                        />

                        <feBlend
                            in="SourceGraphic"
                            in2="paperVariation"
                            mode="multiply"
                            result="texturedPaper"
                        />

                        {/* Large diffuse stains */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.004 0.009"
                            numOctaves="3"
                            seed={seed + 17}
                            stitchTiles="stitch"
                            result="stainNoise"
                        />

                        <feComponentTransfer
                            in="stainNoise"
                            result="stainMask"
                        >
                            <feFuncR
                                type="linear"
                                slope="4"
                                intercept="-2.35"
                            />
                            <feFuncG
                                type="linear"
                                slope="4"
                                intercept="-2.35"
                            />
                            <feFuncB
                                type="linear"
                                slope="4"
                                intercept="-2.35"
                            />
                            <feFuncA
                                type="linear"
                                slope="4"
                                intercept="-2.35"
                            />
                        </feComponentTransfer>

                        <feGaussianBlur
                            in="stainMask"
                            stdDeviation="18"
                            result="softStains"
                        />

                        <feFlood
                            floodColor="#75502f"
                            floodOpacity={0.24 * safeStains}
                            result="stainColour"
                        />

                        <feComposite
                            in="stainColour"
                            in2="softStains"
                            operator="in"
                            result="colouredStains"
                        />

                        <feBlend
                            in="texturedPaper"
                            in2="colouredStains"
                            mode="multiply"
                            result="stainedPaper"
                        />

                        {/* Fine fibre and grain */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.32"
                            numOctaves="2"
                            seed={seed + 31}
                            stitchTiles="stitch"
                            result="grainNoise"
                        />

                        <feColorMatrix
                            in="grainNoise"
                            type="matrix"
                            values={`
                                0.12 0    0    0 0.56
                                0    0.10 0    0 0.50
                                0    0    0.07 0 0.42
                                0    0    0    ${0.07 * safeGrain} 0
                            `}
                            result="paperGrain"
                        />

                        <feBlend
                            in="stainedPaper"
                            in2="paperGrain"
                            mode="multiply"
                        />
                    </filter>
                </defs>
            </svg>

            <span
                className={styles.surface}
                aria-hidden="true"
            />

            <div className={styles.content}>{children}</div>
        </Component>
    );
}
