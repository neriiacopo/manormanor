import CardStack from "./CardStack";
import styles from "./AdventureMode.module.css";

// TODO(cowork): demo-only sequence spanning a few card classes (BiomeIntro
// → Transition → Event) to exercise the sequenced-scroll UX end to end.
// Once run/save state + a real beat/outcome engine exist, the sequence
// should be resolved from choice outcomes instead of a hardcoded list.
const DEMO_SEQUENCE = [
    "entry_hall_intro_departure_01",
    "entry_hall_transition_crossroads_01",
    "entry_hall_event_discovery_01",
];

export default function AdventureMode({ sequence = DEMO_SEQUENCE }) {
    return (
        <div className={styles.stage}>
            <CardStack sequence={sequence} />
        </div>
    );
}
