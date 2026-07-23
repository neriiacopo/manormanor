import { Stats } from "../../../components";
import { PaperBox, RuinedBox } from "@/fx";

import portrait from "../../../assets/demo/imgs/vessel-adventurer-03.png";
import styles from "./SectionArea.module.css";

/**
 * SectionArea — the overlaid, height-variable panel above ToggleBar. Only
 * renders the Stats section for now (profile + 4 bars, style-board §5b);
 * wire up 'inventory' and 'menu' as those get designed.
 *
 * NOTE: currently hardcodes player values as a placeholder — wire to
 * useGameStore once combat/adventure state is real.
 */
export default function SectionArea({ section }) {
    if (section === "stats") {
        return (
            <>
                <div className={styles.sectionArea}>
                    <PaperBox
                        className={styles.stats}
                        seed={22}
                        variation={2}
                        grain={0.7}
                        stains={0.7}
                        stainScale={1.6}
                        stainSoftness={0.2}
                    >
                        <Stats
                            portrait={portrait} // TODO(cowork): real portrait source once character data is wired up
                            values={{
                                body: 10,
                                defense: 10,
                                determination: 8,
                                stamina: 3,
                            }}
                        />
                    </PaperBox>
                </div>
                <RuinedBox
                    roughness={20}
                    frequency={0.015}
                    octaves={4}
                    seed={8}
                    className={styles.sectionArea}
                    style={{ transform: "scaleX(2)" }}
                ></RuinedBox>
            </>
        );
    }

    // TODO(cowork): inventory + menu sections
    return <div className={styles.sectionArea} />;
}
