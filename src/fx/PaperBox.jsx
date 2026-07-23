import { useId } from "react";
import styles from "./PaperBox.module.css";

/**
 * Procedural paper background.
 *
 * Only the background surface is filtered.
 * Layout, positioning and content layering remain unchanged.
 */
export default function PaperBox({
    children,
    as: Component = "div",
    className = "",
    style,

    seed = 12,
    grain = 1,
    variation = 1,
    stains = 1,
    stainScale = 1,
    stainSoftness = 1,

    ...props
}) {
    const rawId = useId();
    const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
    const filterId = `paper-box-${safeId}`;

    const safeGrain = Math.max(0, grain);
    const safeVariation = Math.max(0, variation);
    const safeStains = Math.max(0, stains);
    const safeStainScale = Math.max(0.1, stainScale);
    const safeStainSoftness = Math.max(0.1, stainSoftness);

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
                            baseFrequency={`
                                ${0.006 * safeStainScale}
                                ${0.012 * safeStainScale}
                            `}
                            numOctaves="4"
                            seed={seed}
                            stitchTiles="stitch"
                            result="paperNoise"
                        />

                        <feColorMatrix
                            in="paperNoise"
                            type="matrix"
                            values={`
                                0.30 0    0    0 0.62
                                0    0.24 0    0 0.55
                                0    0    0.16 0 0.43
                                0    0    0    ${0.2 * safeVariation} 0
                            `}
                            result="colouredPaperNoise"
                        />

                        <feBlend
                            in="SourceGraphic"
                            in2="colouredPaperNoise"
                            mode="multiply"
                            result="texturedPaper"
                        />

                        {/* Large defined stains */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`
                                ${0.0035 * safeStainScale}
                                ${0.007 * safeStainScale}
                            `}
                            numOctaves="3"
                            seed={seed + 17}
                            stitchTiles="stitch"
                            result="largeStainNoise"
                        />

                        <feComponentTransfer
                            in="largeStainNoise"
                            result="largeStainThreshold"
                        >
                            <feFuncR
                                type="linear"
                                slope="4.4"
                                intercept="-2.35"
                            />
                            <feFuncG
                                type="linear"
                                slope="4.4"
                                intercept="-2.35"
                            />
                            <feFuncB
                                type="linear"
                                slope="4.4"
                                intercept="-2.35"
                            />
                            <feFuncA
                                type="linear"
                                slope="4.4"
                                intercept="-2.35"
                            />
                        </feComponentTransfer>

                        <feGaussianBlur
                            in="largeStainThreshold"
                            stdDeviation={8 * safeStainSoftness}
                            result="softLargeStains"
                        />

                        {/* Break up smooth stain edges */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`
                                ${0.014 * safeStainScale}
                                ${0.025 * safeStainScale}
                            `}
                            numOctaves="2"
                            seed={seed + 31}
                            stitchTiles="stitch"
                            result="stainDistortionNoise"
                        />

                        <feDisplacementMap
                            in="softLargeStains"
                            in2="stainDistortionNoise"
                            scale="34"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="distortedLargeStains"
                        />

                        <feFlood
                            floodColor="#76502c"
                            floodOpacity={Math.min(0.58, 0.31 * safeStains)}
                            result="largeStainColour"
                        />

                        <feComposite
                            in="largeStainColour"
                            in2="distortedLargeStains"
                            operator="in"
                            result="colouredLargeStains"
                        />

                        <feBlend
                            in="texturedPaper"
                            in2="colouredLargeStains"
                            mode="multiply"
                            result="paperWithLargeStains"
                        />

                        {/* Smaller dark stain fragments */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`
                                ${0.011 * safeStainScale}
                                ${0.021 * safeStainScale}
                            `}
                            numOctaves="3"
                            seed={seed + 53}
                            stitchTiles="stitch"
                            result="smallStainNoise"
                        />

                        <feComponentTransfer
                            in="smallStainNoise"
                            result="smallStainThreshold"
                        >
                            <feFuncR
                                type="linear"
                                slope="6.5"
                                intercept="-4.45"
                            />
                            <feFuncG
                                type="linear"
                                slope="6.5"
                                intercept="-4.45"
                            />
                            <feFuncB
                                type="linear"
                                slope="6.5"
                                intercept="-4.45"
                            />
                            <feFuncA
                                type="linear"
                                slope="6.5"
                                intercept="-4.45"
                            />
                        </feComponentTransfer>

                        <feGaussianBlur
                            in="smallStainThreshold"
                            stdDeviation={2.5 * safeStainSoftness}
                            result="softSmallStains"
                        />

                        <feFlood
                            floodColor="#563719"
                            floodOpacity={Math.min(0.46, 0.23 * safeStains)}
                            result="smallStainColour"
                        />

                        <feComposite
                            in="smallStainColour"
                            in2="softSmallStains"
                            operator="in"
                            result="colouredSmallStains"
                        />

                        <feBlend
                            in="paperWithLargeStains"
                            in2="colouredSmallStains"
                            mode="multiply"
                            result="stainedPaper"
                        />

                        {/* Crisp fine grain */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.34"
                            numOctaves="2"
                            seed={seed + 79}
                            stitchTiles="stitch"
                            result="fineNoise"
                        />

                        <feColorMatrix
                            in="fineNoise"
                            type="matrix"
                            values={`
                                0.16 0    0    0 0.55
                                0    0.13 0    0 0.49
                                0    0    0.09 0 0.40
                                0    0    0    ${0.065 * safeGrain} 0
                            `}
                            result="colouredFineNoise"
                        />

                        <feBlend
                            in="stainedPaper"
                            in2="colouredFineNoise"
                            mode="multiply"
                            result="finishedPaper"
                        />

                        {/* Slight contrast increase for a drier, crisper finish */}
                        <feComponentTransfer in="finishedPaper">
                            <feFuncR
                                type="linear"
                                slope="1.06"
                                intercept="-0.025"
                            />
                            <feFuncG
                                type="linear"
                                slope="1.06"
                                intercept="-0.025"
                            />
                            <feFuncB
                                type="linear"
                                slope="1.06"
                                intercept="-0.025"
                            />
                            <feFuncA type="identity" />
                        </feComponentTransfer>
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
