import styles from "./Button.module.css";

export default function Button({
    children,
    className = "",
    type = "button",
    disabled = false,
    inverted = false,
    ...props
}) {
    return (
        <button
            type={type}
            className={`${styles.button} ${className}`.trim()}
            disabled={disabled}
            {...props}
        >
            <span className={styles.label}>
                <span
                    className={styles.shadow}
                    aria-hidden="true"
                >
                    {children}
                </span>

                <span
                    className={styles.foreground}
                    style={{
                        color: inverted
                            ? "var(--color-parchment-light)"
                            : "var(--color-ink)",
                    }}
                >
                    {children}
                </span>
            </span>

            <span
                className={styles.underline}
                aria-hidden="true"
            />
        </button>
    );
}
