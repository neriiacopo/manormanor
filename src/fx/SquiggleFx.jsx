import { useEffect, useId, useMemo, useRef } from "react";
import gsap from "gsap";
import styles from "./SquiggleFx.module.css";

const FRAME_SCALES = [6, 8, 6, 8, 6];

/**
 * SquiggleFx — applies a frame-by-frame SVG displacement filter inspired by
 * Lucas Bebber's “Squiggly Text” effect.
 *
 * `intensity` scales the displacement amount and `speed` controls how quickly
 * the five noise frames cycle. The wrapped element itself does not move, so
 * the result reads as a redrawn edge rather than a wobbling box.
 */
export default function SquiggleFx({
    children,
    intensity = 1,
    speed = 1,
    as: Tag = "div",
    className,
    ...rest
}) {
    const ref = useRef(null);
    const reactId = useId();
    const filterPrefix = useMemo(
        () => `squiggle-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
        [reactId],
    );

    const safeIntensity = Math.max(0, intensity);
    const safeSpeed = Math.max(0.05, speed);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );

        let timeline;

        const stop = () => {
            timeline?.kill();
            timeline = undefined;
            gsap.set(el, { clearProps: "filter" });
        };

        const start = () => {
            stop();
            if (mediaQuery.matches || safeIntensity === 0) return;

            timeline = gsap.timeline({ repeat: -1 });

            FRAME_SCALES.forEach((_, frame) => {
                timeline.set(el, {
                    filter: `url("#${filterPrefix}-${frame}")`,
                });
                timeline.to({}, { duration: 0.068 / safeSpeed });
            });
        };

        start();
        mediaQuery.addEventListener?.("change", start);

        return () => {
            mediaQuery.removeEventListener?.("change", start);
            stop();
        };
    }, [filterPrefix, safeIntensity, safeSpeed]);

    return (
        <>
            <svg
                className={styles.filters}
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    {FRAME_SCALES.map((scale, frame) => (
                        <filter
                            key={frame}
                            id={`${filterPrefix}-${frame}`}
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                            colorInterpolationFilters="sRGB"
                        >
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.02"
                                numOctaves="3"
                                seed={frame}
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale={scale * safeIntensity}
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    ))}
                </defs>
            </svg>

            <Tag
                ref={ref}
                className={[styles.squiggle, className]
                    .filter(Boolean)
                    .join(" ")}
                {...rest}
            >
                {children}
            </Tag>
        </>
    );
}
