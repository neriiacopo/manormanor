import { useIcon } from "../../lib/useIcon";
import styles from "./Icon.module.css";

/**
 * Icon — renders one of assets/svg/*.svg inline so its color can be set via
 * `fillColor` (see lib/useIcon for how the recoloring works). Renders
 * nothing if `name` doesn't match a file.
 *
 *   <Icon name="menu-01" size={28} fillColor="var(--color-ink)" />
 */
export default function Icon({
    name,
    fillColor = "currentColor",
    size = 24,
    className,
    style,
    ...rest
}) {
    const markup = useIcon(name, { fillColor });
    if (!markup) return null;

    return (
        <span
            className={[styles.icon, className].filter(Boolean).join(" ")}
            style={{ width: size, height: size, ...style }}
            dangerouslySetInnerHTML={{ __html: markup }}
            {...rest}
        />
    );
}
