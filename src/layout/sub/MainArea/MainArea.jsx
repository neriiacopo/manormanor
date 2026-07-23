import AdventureMode from "../../../views/AdventureMode/AdventureMode";
import CombatMode from "../../../views/CombatMode/CombatMode";
import styles from "./MainArea.module.css";

export default function MainArea({ mode }) {
    return (
        <div className={styles.mainArea}>
            {mode === "combat" ? <CombatMode /> : <AdventureMode />}
        </div>
    );
}
