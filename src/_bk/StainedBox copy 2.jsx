import { useId } from "react";
import styles from "./StainedBox.module.css";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ElementType} [props.as]
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 * @param {number} [props.seed]
 * @param {number} [props.intensity]
 * @param {number} [props.stainScale]
 * @param {number} [props.stainSoftness]
 * @param {number} [props.distortion]
 */
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
    ...props
}) {
    const reactId = useId();
    const filterId = `stained-paper-${reactId.replace(/:/g, "")}`;

    const safeIntensity = Math.max(0, intensity);
    const safeScale = Math.max(0.1, stainScale);
    const safeSoftness = Math.max(0.1, stainSoftness);
    const safeDistortion = Math.max(0, distortion);

    const componentStyle = {
        "--stain-intensity": safeIntensity,
        "--paper-filter": `url("#${filterId}")`,
        ...style,
    };

    return (
        <Component
            className={`${styles.root} ${className}`}
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
                <filter
                    id={filterId}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    colorInterpolationFilters="sRGB"
                >
                    {/* Broad cloudy paper variation */}
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

                    {/* Primary stain field */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={`${0.0035 * safeScale} ${0.007 * safeScale}`}
                        numOctaves="3"
                        seed={seed + 17}
                        stitchTiles="stitch"
                        result="stainNoise"
                    />

                    {/*
            Convert the continuous noise into sparse organic regions.
            Higher slope values produce more isolated stains.
          */}
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

                    {/* Distortion prevents the stain boundaries from looking too smooth */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={`${0.014 * safeScale} ${0.025 * safeScale}`}
                        numOctaves="2"
                        seed={seed + 31}
                        stitchTiles="stitch"
                        result="distortionNoise"
                    />

                    <feDisplacementMap
                        in="softStains"
                        in2="distortionNoise"
                        scale={42 * safeDistortion}
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="distortedStains"
                    />

                    {/* Brown stain color, masked by the generated stain field */}
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

                    {/* Smaller, darker stain fragments */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={`${0.009 * safeScale} ${0.018 * safeScale}`}
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
                            slope="6"
                            intercept="-4.25"
                        />
                        <feFuncG
                            type="linear"
                            slope="6"
                            intercept="-4.25"
                        />
                        <feFuncB
                            type="linear"
                            slope="6"
                            intercept="-4.25"
                        />
                        <feFuncA
                            type="linear"
                            slope="6"
                            intercept="-4.25"
                        />
                    </feComponentTransfer>

                    <feGaussianBlur
                        in="smallStainThreshold"
                        stdDeviation={4 * safeSoftness}
                        result="softSmallStains"
                    />

                    <feFlood
                        floodColor="#60401f"
                        floodOpacity={Math.min(0.4, 0.18 * safeIntensity)}
                        result="smallStainColor"
                    />

                    <feComposite
                        in="smallStainColor"
                        in2="softSmallStains"
                        operator="in"
                        result="coloredSmallStains"
                    />

                    <feBlend
                        in="paperWithStains"
                        in2="coloredSmallStains"
                        mode="multiply"
                        result="stainedPaper"
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
                        in="stainedPaper"
                        in2="coloredFineNoise"
                        mode="multiply"
                    />
                </filter>
            </svg>

            <span
                className={styles.paper}
                aria-hidden="true"
            />
            <span
                className={styles.edges}
                aria-hidden="true"
            />

            <div className={styles.content}>{children}</div>
        </Component>
    );
}
