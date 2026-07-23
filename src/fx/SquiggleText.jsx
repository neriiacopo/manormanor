import { createElement, useId } from "react";
import styles from "./SquiggleText.module.css";

/**
 * Animated squiggly text using SVG displacement filters.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {keyof JSX.IntrinsicElements} [props.as="span"]
 * @param {string} [props.className]
 * @param {boolean} [props.editable=false]
 * @param {number} [props.frequency=0.02]
 * @param {number} [props.intensity=6]
 * @param {number} [props.duration=340]
 */
export default function SquiggleText({
    children,
    as = "span",
    className = "",
    editable = false,
    frequency = 0.02,
    intensity = 6,
    duration = 340,
    ...rest
}) {
    // Removing punctuation makes the value safe for SVG fragment IDs.
    const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

    const filterIds = Array.from(
        { length: 5 },
        (_, index) => `squiggle-${instanceId}-${index}`,
    );

    const componentStyle = {
        "--squiggle-duration": `${duration}ms`,
        "--squiggle-filter-0": `url("#${filterIds[0]}")`,
        "--squiggle-filter-1": `url("#${filterIds[1]}")`,
        "--squiggle-filter-2": `url("#${filterIds[2]}")`,
        "--squiggle-filter-3": `url("#${filterIds[3]}")`,
        "--squiggle-filter-4": `url("#${filterIds[4]}")`,
        ...rest.style,
    };

    const textElement = createElement(
        as,
        {
            ...rest,
            className: `${styles.text} ${className}`.trim(),
            contentEditable: editable || undefined,
            suppressContentEditableWarning: editable || undefined,
            style: componentStyle,
        },
        children,
    );

    return (
        <>
            {textElement}

            <svg
                className={styles.filters}
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    {filterIds.map((filterId, index) => {
                        const scale =
                            index % 2 === 0
                                ? intensity
                                : Math.round(intensity * 1.35);

                        return (
                            <filter
                                key={filterId}
                                id={filterId}
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                                colorInterpolationFilters="sRGB"
                            >
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency={frequency}
                                    numOctaves="3"
                                    seed={index}
                                    result="noise"
                                />

                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale={scale}
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </filter>
                        );
                    })}
                </defs>
            </svg>
        </>
    );
}
