import { useMemo } from "react";

// Inlined at build time as raw markup (Vite's ?raw import) rather than
// fetched/used as <img src>, so we can rewrite the fill per-usage. Eager +
// raw means this is plain strings, no async loading to juggle.
const modules = import.meta.glob("../assets/svg/*.svg", {
    eager: true,
    query: "?raw",
    import: "default",
});

const ICONS = Object.fromEntries(
    Object.entries(modules).map(([path, raw]) => [
        path.split("/").pop().replace(/\.svg$/, ""),
        raw,
    ]),
);

/** Names available to useIcon — matches files under assets/svg minus the extension (e.g. "profile-01", "menu-01"). */
export function listIcons() {
    return Object.keys(ICONS);
}

// The source SVGs (Illustrator exports) don't set `fill` on individual
// paths/circles/rects, so they render at the SVG default of black. Setting
// `fill` on the root <svg> instead lets every unstyled descendant inherit
// it through normal SVG/CSS inheritance — no need to touch each shape.
function recolor(markup, fillColor) {
    return markup.replace(/<svg([^>]*)>/, (_match, attrs) => {
        const withoutFill = attrs.replace(/\s*fill="[^"]*"/i, "");
        return `<svg${withoutFill} fill="${fillColor}">`;
    });
}

/**
 * useIcon("menu-01", { fillColor: "var(--color-accent-red)" })
 *
 * Loads one of assets/svg/*.svg as inline markup, recolored via fillColor
 * (defaults to "currentColor", so it can also just follow the CSS `color`
 * of whatever wraps it). Memoized per name/color pair. Returns null if
 * `name` doesn't match any file.
 *
 * Meant to be spread into a wrapper via dangerouslySetInnerHTML — see
 * components/Icon for the ready-to-use version.
 */
export function useIcon(name, { fillColor = "currentColor" } = {}) {
    return useMemo(() => {
        const raw = ICONS[name];
        if (!raw) return null;
        return recolor(raw, fillColor);
    }, [name, fillColor]);
}

export default useIcon;
