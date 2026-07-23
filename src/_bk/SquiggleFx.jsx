import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./SquiggleFx.module.css";

/**
 * SquiggleFx — wraps text or scribble UI (e.g. a ScribbleBox button) with a
 * constant hand-jitter, evoking classic squigglevision: the illusion that
 * each frame is very slightly redrawn.
 *
 * Used for: the landing title ("THE MANOR"), and any scribble-register
 * control that should feel hand-inked rather than static (combat action
 * buttons, tactic labels — pass `squiggle` on ScribbleBox to opt in).
 *
 * TODO(cowork): the jitter here is a cheap transform-based approximation.
 * Consider swapping to a 2–3 frame SVG path morph if it needs to read more
 * like a genuinely redrawn line rather than a wobbling box.
 */
export default function SquiggleFx({
    children,
    intensity = 1, // 0–2, scales jitter amplitude
    speed = 0.4, // playback rate multiplier
    as: Tag = "div",
    className,
    ...rest
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReducedMotion) return undefined;

        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(el, {
            x: 0.6 * intensity,
            y: -0.4 * intensity,
            rotate: 0.3 * intensity,
            duration: 0.09 / speed,
            ease: "none",
        }).to(el, {
            x: -0.5 * intensity,
            y: 0.5 * intensity,
            rotate: -0.25 * intensity,
            duration: 0.11 / speed,
            ease: "none",
        });

        return () => tl.kill();
    }, [intensity, speed]);

    return (
        <Tag
            ref={ref}
            className={[styles.squiggle, className].filter(Boolean).join(" ")}
            {...rest}
        >
            {children}
        </Tag>
    );
}
