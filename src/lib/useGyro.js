import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Tracks the device's gyroscope inclination (deviceorientation) and exposes
 * it as a mutable ref rather than React state, so consumers (e.g. an
 * r3f useFrame loop) can read it every frame without triggering re-renders.
 *
 * tiltRef.current = { x, y } — both normalized to roughly [-1, 1]
 *   x: left/right lean (from gamma)
 *   y: forward/back lean (from beta, relative to the device's orientation
 *      at the moment tracking starts, so it works whether the phone is
 *      held flat or upright)
 *
 * iOS 13+ requires a user gesture before motion access can be requested.
 * Check `needsPermission`, and call `requestPermission()` from a tap/click
 * handler when it's true. Other platforms grant access automatically.
 */
export function useGyro({ maxTilt = 1, sensitivity = 45 } = {}) {
    const tiltRef = useRef({ x: 0, y: 0 });
    const baselineRef = useRef(null);

    const needsPermission =
        typeof window !== "undefined" &&
        typeof window.DeviceOrientationEvent?.requestPermission === "function";

    const [permission, setPermission] = useState(() => {
        if (typeof window === "undefined" || !window.DeviceOrientationEvent) {
            return "unsupported";
        }
        return needsPermission ? "prompt" : "granted";
    });

    useEffect(() => {
        if (permission !== "granted") return;

        const handleOrientation = (event) => {
            const { beta, gamma } = event;
            if (beta == null || gamma == null) return;

            if (!baselineRef.current) {
                baselineRef.current = { beta };
            }

            tiltRef.current = {
                x: clamp(gamma / sensitivity, -1, 1) * maxTilt,
                y:
                    clamp((beta - baselineRef.current.beta) / sensitivity, -1, 1) *
                    maxTilt,
            };
        };

        window.addEventListener("deviceorientation", handleOrientation);
        return () =>
            window.removeEventListener("deviceorientation", handleOrientation);
    }, [permission, maxTilt, sensitivity]);

    const requestPermission = useCallback(async () => {
        if (!needsPermission) {
            setPermission("granted");
            return true;
        }
        try {
            const result = await window.DeviceOrientationEvent.requestPermission();
            const granted = result === "granted";
            setPermission(granted ? "granted" : "denied");
            return granted;
        } catch {
            setPermission("denied");
            return false;
        }
    }, [needsPermission]);

    return { tiltRef, permission, needsPermission, requestPermission };
}

export default useGyro;
