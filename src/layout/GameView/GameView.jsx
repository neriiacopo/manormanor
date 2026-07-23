import ProgressArea from '../sub/ProgressArea/ProgressArea';
import MainArea from '../sub/MainArea/MainArea';
import SubArea from '../sub/SubArea/SubArea';
import styles from './GameView.module.css';

/**
 * GameView — the shared vertical scaffold for every in-game screen (both
 * Adventure and Combat mount inside this). See style-board §4:
 *
 *  ┌ ProgressArea  flex: var(--gv-progress-flex)
 *  └ MainArea      flex: var(--gv-main-flex)   ← AdventureMode | CombatMode
 *
 * SubArea (SectionArea + fixed ToggleBar) isn't part of that split — it's
 * an absolutely-positioned overlay anchored to the bottom (see
 * SubArea.module.css), floating on top of MainArea without resizing it.
 */
export default function GameView({ mode, progress }) {
  return (
    <div className={styles.gameView}>
      <ProgressArea {...progress} />
      <MainArea mode={mode} />
      <SubArea />
    </div>
  );
}
