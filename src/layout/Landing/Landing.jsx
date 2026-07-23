import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Bounds } from "@react-three/drei";
import * as THREE from "three";
import {
    SquiggleFx,
    RoughBox,
    SquiggleText,
    VerticalLoop,
    PaperBox,
    RuinedBox,
} from "../../fx";
import { Button } from "../../components";
import { ScribbleBox } from "../../components";
import { useGyro } from "../../lib/useGyro";

import styles from "./Landing.module.css";

// Max rotation (radians) applied at full tilt on each axis. Kept small so
// the model only leans gently rather than spinning around. We only ever
// drive pitch (x) and roll (z) — never yaw (y, rotation around the
// vertical/up axis) — so the model tips like it's on a gimbal instead of
// spinning in place.
const TILT_Z_MAX = 0.22; // left/right lean (roll), from gamma
const TILT_X_MAX = 0.12; // forward/back lean (pitch), from beta

// Bounds' default camera-fit animation (maxDuration prop, unset below) is
// 1000ms. We wait that long after the model appears before starting the
// canvas fade-in, so the reveal happens once the camera has already
// settled into place rather than fading in mid-flight.
const BOUNDS_SETTLE_MS = 200;

function ManorModel({ onLoad }) {
    const { scene } = useGLTF("./glb/textured.glb");

    // By the time this effect runs, Suspense has already resolved (useGLTF
    // suspends until the asset is ready), so this fires exactly once, right
    // after the model is loaded and mounted into the scene.
    useEffect(() => {
        onLoad?.();
    }, [onLoad]);

    return (
        <primitive
            object={scene}
            scale={1}
        />
    );
}

function GyroTilt({ tiltRef, children }) {
    const group = useRef();

    useFrame((_, delta) => {
        if (!group.current) return;
        const { x, y } = tiltRef.current;
        group.current.rotation.y = THREE.MathUtils.damp(
            group.current.rotation.y,
            x * TILT_Z_MAX,
            4,
            delta,
        );
    });

    return <group ref={group}>{children}</group>;
}

function ManorScene({ tiltRef, onLoad }) {
    return (
        <Canvas camera={{ position: [3, 5, 4], fov: 20 }}>
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[2, 3, 2]}
                intensity={0.8}
            />
            <Suspense fallback={null}>
                <Bounds
                    fit
                    clip
                    observe
                    margin={1.2}
                >
                    <GyroTilt tiltRef={tiltRef}>
                        <ManorModel onLoad={onLoad} />
                    </GyroTilt>
                </Bounds>
                <Environment preset="night" />
            </Suspense>
        </Canvas>
    );
}

export default function Landing({ onNewGame, onContinue, hasSave = false }) {
    const { tiltRef, permission, needsPermission, requestPermission } =
        useGyro();
    const [modelLoaded, setModelLoaded] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const handleModelLoad = useCallback(() => setModelLoaded(true), []);

    // Once the model has loaded (and Bounds has had time to fit the camera
    // to it), fade the canvas in rather than popping it in mid-setup.
    useEffect(() => {
        if (!modelLoaded) return;
        const timer = setTimeout(() => setRevealed(true), BOUNDS_SETTLE_MS);
        return () => clearTimeout(timer);
    }, [modelLoaded]);

    return (
        <>
            <div className={styles.front}>
                <div
                    className={styles.manorViewport}
                    style={{
                        // opacity: revealed ? 1 : 0,
                        filter: revealed ? "blur(0px)" : "blur(100px)",
                        transition: "opacity 1s ease-in, filter 1s ease",
                    }}
                    onPointerDown={
                        needsPermission && permission !== "granted"
                            ? requestPermission
                            : undefined
                    }
                >
                    <ManorScene
                        tiltRef={tiltRef}
                        onLoad={handleModelLoad}
                    />
                </div>
                <nav className={styles.menu}>
                    <Button
                        className={styles.navButton}
                        onClick={onNewGame}
                        inverted={true}
                    >
                        <SquiggleText
                            intensity={2}
                            duration={500}
                        >
                            new game
                        </SquiggleText>{" "}
                    </Button>
                    {/* {hasSave && ( */}
                    <Button
                        className={styles.navButton}
                        onClick={onContinue}
                        inverted={true}
                    >
                        <SquiggleText
                            intensity={2}
                            duration={500}
                        >
                            continue
                        </SquiggleText>
                    </Button>
                    {/* )} */}
                </nav>
            </div>
            <VerticalLoop
                duration={12}
                // style={{ zIndex: 100, mixBlendMode: "difference" }}
            >
                <RuinedBox
                    roughness={20}
                    frequency={0.015}
                    octaves={4}
                    seed={8}
                    padding="3rem"
                    style={{
                        width: "100vw",
                        margin: "-60px 0",
                    }}
                >
                    <PaperBox
                        seed={14}
                        variation={1.1}
                        grain={0.9}
                        stains={0.4}
                        stainScale={2.4}
                        stainSoftness={0.1}
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <h1
                            className={styles.title}
                            style={{
                                fontSize: "50vw",
                                margin: "150px 0px 150px 0",
                                textShadow: "0px 0px 10px rgba(0,0,0,0.8)",
                            }}
                        >
                            <SquiggleText
                                intensity={7}
                                duration={340}
                            >
                                manor
                            </SquiggleText>
                        </h1>
                    </PaperBox>
                </RuinedBox>
            </VerticalLoop>
        </>
    );
}
