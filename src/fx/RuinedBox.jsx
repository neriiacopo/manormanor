import { useMemo } from "react";
import styles from "./RuinedBox.module.css";

function createRuinedMask({ seed, frequency, roughness, octaves, inset }) {
    /*
     * A fixed internal coordinate system makes the filter predictable.
     * The result is stretched to the dimensions of the HTML element.
     */
    const size = 1000;
    const safeInset = Math.max(0, Math.min(200, inset));
    const rectangleSize = size - safeInset * 2;

    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 ${size} ${size}"
            preserveAspectRatio="none"
        >
            <defs>
                <filter
                    id="ruin"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    color-interpolation-filters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="${frequency}"
                        numOctaves="${octaves}"
                        seed="${seed}"
                        result="noise"
                    />

                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="${roughness}"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>

            <rect
                x="${safeInset}"
                y="${safeInset}"
                width="${rectangleSize}"
                height="${rectangleSize}"
                rx="0"
                fill="white"
                filter="url(#ruin)"
            />
        </svg>
    `;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Procedurally clips an element and its entire contents
 * to an irregular rectangular shape.
 */
export default function RuinedBox({
    children,
    as: Component = "div",
    className = "",
    style,

    seed = 4,
    frequency = 0.018,
    roughness = 55,
    octaves = 3,
    inset = 35,

    ...props
}) {
    const maskImage = useMemo(
        () =>
            createRuinedMask({
                seed,
                frequency,
                roughness,
                octaves,
                inset,
            }),
        [seed, frequency, roughness, octaves, inset],
    );

    return (
        <Component
            className={`${styles.ruined} ${className}`.trim()}
            style={{
                "--ruined-mask": maskImage,
                ...style,
            }}
            {...props}
        >
            {children}
        </Component>
    );
}
