import { useId } from "react";
import styles from "./StainedBox.module.css";

export default function StainedBox({
    children,
    as: Component = "div",
    className = "",
    style,
    seed = 14,
    intensity = 1,
    stainScale = 1,
    stainSoftness = 1,
    distortion = 4,
    edgeRoughness = 14,
    edgeFrequency = 0.012,
    bleed = 12,
    ...props
}) {
    const reactId = useId();
    const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");

    const filterId = `stained-paper-${safeId}`;

    const safeIntensity = Math.max(0, intensity);
    const safeScale = Math.max(0.1, stainScale);
    const safeSoftness = Math.max(0.1, stainSoftness);
    const safeDistortion = Math.max(0, distortion);
    const safeEdgeRoughness = Math.max(0, edgeRoughness);

    const componentStyle = {
        "--stain-intensity": safeIntensity,
        "--paper-filter": `url("#${filterId}")`,
        "--paper-bleed": `${Math.max(0, bleed)}px`,
        ...style,
    };

    return (
        <Component
            className={`${styles.root} ${className}`.trim()}
            style={componentStyle}
            {...props}
        >
            <svg
                className={styles.filterDefinitions}
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                        colorInterpolationFilters="sRGB"
                    >
                        {/* Broad paper variation */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`${0.006 * safeScale} ${0.012 * safeScale}`}
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
                                0    0    0    ${0.2 * safeIntensity} 0
                            `}
                            result="coloredPaperNoise"
                        />

                        <feBlend
                            in="SourceGraphic"
                            in2="coloredPaperNoise"
                            mode="multiply"
                            result="texturedPaper"
                        />

                        {/* Large stains */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`${0.0035 * safeScale} ${0.007 * safeScale}`}
                            numOctaves="3"
                            seed={seed + 17}
                            stitchTiles="stitch"
                            result="stainNoise"
                        />

                        <feComponentTransfer
                            in="stainNoise"
                            result="stainThreshold"
                        >
                            <feFuncR
                                type="linear"
                                slope="3.8"
                                intercept="-2.05"
                            />
                            <feFuncG
                                type="linear"
                                slope="3.8"
                                intercept="-2.05"
                            />
                            <feFuncB
                                type="linear"
                                slope="3.8"
                                intercept="-2.05"
                            />
                            <feFuncA
                                type="linear"
                                slope="3.8"
                                intercept="-2.05"
                            />
                        </feComponentTransfer>

                        <feGaussianBlur
                            in="stainThreshold"
                            stdDeviation={18 * safeSoftness}
                            result="softStains"
                        />

                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`${0.014 * safeScale} ${0.025 * safeScale}`}
                            numOctaves="2"
                            seed={seed + 31}
                            stitchTiles="stitch"
                            result="stainDistortionNoise"
                        />

                        <feDisplacementMap
                            in="softStains"
                            in2="stainDistortionNoise"
                            scale={10.5 * safeDistortion}
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="distortedStains"
                        />

                        <feFlood
                            floodColor="#76502c"
                            floodOpacity={Math.min(0.52, 0.27 * safeIntensity)}
                            result="stainColor"
                        />

                        <feComposite
                            in="stainColor"
                            in2="distortedStains"
                            operator="in"
                            result="coloredStains"
                        />

                        <feBlend
                            in="texturedPaper"
                            in2="coloredStains"
                            mode="multiply"
                            result="paperWithStains"
                        />

                        {/* Fine grain */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.28"
                            numOctaves="2"
                            seed={seed + 79}
                            stitchTiles="stitch"
                            result="fineNoise"
                        />

                        <feColorMatrix
                            in="fineNoise"
                            type="matrix"
                            values={`
                                0.15 0    0    0 0.55
                                0    0.12 0    0 0.49
                                0    0    0.08 0 0.40
                                0    0    0    ${0.055 * safeIntensity} 0
                            `}
                            result="coloredFineNoise"
                        />

                        <feBlend
                            in="paperWithStains"
                            in2="coloredFineNoise"
                            mode="multiply"
                            result="finishedPaper"
                        />

                        {/*
                         * Displace the completed paper surface.
                         * This must be the last operation so stains, grain and
                         * background all share the same ruined outline.
                         */}
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={edgeFrequency}
                            numOctaves="3"
                            seed={seed + 101}
                            result="edgeNoise"
                        />

                        <feDisplacementMap
                            in="finishedPaper"
                            in2="edgeNoise"
                            scale={safeEdgeRoughness}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            <span
                className={`${styles.surface} ${styles.ruinedMask}`}
                aria-hidden="true"
            />

            <span
                className={`${styles.edges} ${styles.ruinedMask}`}
                aria-hidden="true"
            />

            <div className={styles.content}>{children}</div>
        </Component>
    );
}
