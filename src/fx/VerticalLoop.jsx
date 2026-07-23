import styles from "./VerticalLoop.module.css";

export default function VerticalLoop({
    children,
    duration = 6,
    direction = "up",
    className = "",
    ...props
}) {
    return (
        <div
            className={`${styles.viewport} ${className}`}
            style={{
                "--loop-duration": `${duration}s`,
                "--loop-direction": direction === "down" ? "reverse" : "normal",
                ...props.style,
            }}
        >
            <div className={styles.track}>
                <div className={styles.item}>{children}</div>

                <div
                    className={styles.item}
                    aria-hidden="true"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
