import { useId } from "react";
import styles from "./StainedBox.module.css";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 * @param {number} [props.seed] SVG noise seed.
 * @param {number} [props.intensity] Effect strength, recommended range: 0–2.
 * @param {string} [props.as] HTML element rendered by the component.
 */
export default function StainedBox({
    children,
    className = "",
    style,
    seed = 14,
    intensity = 10,
    as: Component = "div",
    ...rest
}) {
    const reactId = useId();
    const filterId = `stained-paper-${reactId.replace(/:/g, "")}`;

    const safeIntensity = Math.max(0, intensity);

    const componentStyle = {
        "--stain-intensity": safeIntensity,
        "--paper-filter": `url("#${filterId}")`,
        ...style,
    };

    return (
        <Component
            className={`${styles.stainedPaper} ${className}`}
            style={componentStyle}
            {...rest}
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
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008 0.018"
                        numOctaves="4"
                        seed={seed}
                        stitchTiles="stitch"
                        result="largeNoise"
                    />

                    <feColorMatrix
                        in="largeNoise"
                        type="matrix"
                        values="
              0.46 0    0    0 0.32
              0    0.36 0    0 0.27
              0    0    0.22 0 0.16
              0    0    0    0.24 0
            "
                        result="coloredLargeNoise"
                    />

                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.22"
                        numOctaves="2"
                        seed={seed + 37}
                        stitchTiles="stitch"
                        result="fineNoise"
                    />

                    <feColorMatrix
                        in="fineNoise"
                        type="matrix"
                        values="
              0.22 0    0    0 0.45
              0    0.18 0    0 0.39
              0    0    0.12 0 0.30
              0    0    0    0.07 0
            "
                        result="coloredFineNoise"
                    />

                    <feBlend
                        in="SourceGraphic"
                        in2="coloredLargeNoise"
                        mode="multiply"
                        result="paperWithClouds"
                    />

                    <feBlend
                        in="paperWithClouds"
                        in2="coloredFineNoise"
                        mode="multiply"
                    />
                </filter>
            </svg>

            <span
                className={styles.stains}
                aria-hidden="true"
            />
            <span
                className={styles.speckles}
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
