import { PaperBox } from "../../fx";
import Icon from "../Icon/Icon";
import styles from "./Stats.module.css";

const STAT_META = {
    body: { label: "Body", icon: "body-01" },
    defense: { label: "Defense", icon: "defense-01" },
    determination: { label: "Determination", icon: "determination-01" },
    stamina: { label: "Stamina", icon: "stamina-01" },
};

/**
 * Stats — segmented n/max bars, reused for the player's full stat block
 * (bottom sub area: Body/Defense/Determination/Stamina) AND the enemy
 * header in combat (Body/HP only — style-board §5c: "only HP & bonus/
 * malus" are shown for enemies). Rendered on a procedural paper background
 * (fx/PaperBox), matching the style-board reference art.
 *
 * @param {Object} values   e.g. { body: 10, defense: 10, determination: 8, stamina: 3 }
 * @param {Object} [max]    per-stat max, defaults to 10
 * @param {string[]} [show] which stat keys to render — omit for all of `values`
 * @param {Object} [delta]  last-change annotation, e.g. { body: -3 }, drives
 *   the "circle the consumed segments" combat-result treatment (see
 *   2_combat_1 vs 3_combat_2 in the mockups)
 * @param {string} [portrait] character portrait image src
 */
export default function Stats({
    values,
    max = {},
    show,
    delta = {},
    portrait,
}) {
    const keys = show ?? Object.keys(values);

    return (
        <div className={styles.inner}>
            {portrait && (
                <div className={styles.portrait}>
                    <img
                        src={portrait}
                        alt=""
                    />
                </div>
            )}
            <div className={styles.bars}>
                {keys.map((key) => {
                    const meta = STAT_META[key];
                    const current = values[key] ?? 0;
                    const total = max[key] ?? 10;
                    const change = delta[key];

                    return (
                        <div
                            key={key}
                            className={styles.row}
                            data-stat={key}
                        >
                            <Icon
                                className={styles.icon}
                                name={meta.icon}
                                size={22}
                                fillColor="var(--stat-color)"
                            />
                            <span className={styles.label}>{meta.label}</span>
                            <divder></divder>
                            {change != null && (
                                <span className={styles.delta}>
                                    {change > 0 ? `+${change}` : change}
                                </span>
                            )}
                            <div className={styles.segments}>
                                {Array.from({ length: total }).map((_, i) => {
                                    const filled = i < current;
                                    // TODO(cowork): verify this consumed-segment math against
                                    // the actual combat-result mockup — segments should circle
                                    // exactly the pips just spent this round.
                                    const justConsumed =
                                        change != null &&
                                        i >= current &&
                                        i < current - change;
                                    return (
                                        <span
                                            key={i}
                                            className={[
                                                styles.segment,
                                                filled && styles.filled,
                                                justConsumed &&
                                                    styles.justConsumed,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        />
                                    );
                                })}
                            </div>
                            <span className={styles.fraction}>
                                {current}/{total}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
