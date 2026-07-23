import { useState } from 'react';
import { Die, Stats, ScribbleBox, ScribbleDivider } from '../../components';
import styles from './CombatMode.module.css';

const PHASES = ['tactics', 'actions', 'results'];

/**
 * CombatMode — dark UI (--color-combat-void), per style-board §5c.
 * Header (enemy portrait + name + HP-only bar) → description → versus
 * panel (light player half / dark enemy half) → phase switcher (Tactics →
 * Actions → Results, sequential, strike-through on complete).
 *
 * TODO(cowork):
 *  - "Special!" tag + boxed DEF-tied-to-a-stat treatment for enemies like
 *    The Mirror (DEF = Body instead of a flat number) — not yet built
 *  - real combat resolution (hit/miss, damage math) — resolveRoll() below
 *    is a placeholder that just rolls dice and jumps to Results
 *  - consider swapping the plain phase nav for Radix Tabs if keyboard/
 *    focus handling needs to be more robust than the current buttons
 */
export default function CombatMode({ enemy, player }) {
  const [phase, setPhase] = useState('tactics');
  const [rolling, setRolling] = useState(false);
  const [playerRoll, setPlayerRoll] = useState(null);
  const [enemyRoll, setEnemyRoll] = useState(null);

  const e = enemy ?? { name: 'The Mirror', body: { current: 10, max: 10 }, atk: { sides: 4, count: 1 } };
  const p = player ?? { atk: { sides: 4, count: 1 }, def: null };

  function resolveRoll() {
    setRolling(true);
    setTimeout(() => {
      setPlayerRoll(1 + Math.floor(Math.random() * p.atk.sides));
      setEnemyRoll(1 + Math.floor(Math.random() * e.atk.sides));
      setRolling(false);
      setPhase('results');
    }, 600);
  }

  return (
    <div className={styles.combat}>
      <header className={styles.header}>
        <img className={styles.enemyPortrait} src="/assets/enemy-placeholder.png" alt="" />
        <div className={styles.enemyInfo}>
          <h2 className={styles.enemyName}>{e.name}</h2>
          <Stats values={{ body: e.body.current }} max={{ body: e.body.max }} show={['body']} />
        </div>
      </header>

      <p className={styles.description}>
        The figure in the glass mimics a gesture you have not made — and you feel it working through you.
      </p>

      <div className={styles.versusPanel}>
        <div className={styles.playerSide}>
          <Die sides={p.atk.sides} count={p.atk.count} rolling={rolling} result={playerRoll} />
          <span className={styles.defLabel}>{p.def ?? '—'}</span>
        </div>
        <span className={styles.divider} aria-hidden="true">🤚</span>
        <div className={styles.enemySide}>
          <Die sides={e.atk.sides} count={e.atk.count} rolling={rolling} result={enemyRoll} />
        </div>
      </div>

      <nav className={styles.phaseSwitcher}>
        {PHASES.map((ph, i) => (
          <span key={ph} className={styles.phaseGroup}>
            <span
              className={[
                styles.phase,
                phase === ph && styles.activePhase,
                PHASES.indexOf(phase) > i && styles.donePhase,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {ph.toUpperCase()}
            </span>
            {i < PHASES.length - 1 && (
              <ScribbleDivider orientation="vertical" struck={PHASES.indexOf(phase) > i} />
            )}
          </span>
        ))}
      </nav>

      {phase === 'tactics' && (
        <div className={styles.actionsRow}>
          <ScribbleBox squiggle onClick={() => setPhase('actions')}>Switch Stance</ScribbleBox>
          <ScribbleBox squiggle onClick={() => setPhase('actions')}>Skip</ScribbleBox>
          <ScribbleBox squiggle onClick={() => setPhase('actions')}>Use Item</ScribbleBox>
        </div>
      )}
      {phase === 'actions' && (
        <div className={styles.actionsRow}>
          <ScribbleBox squiggle onClick={resolveRoll}>Def</ScribbleBox>
          <ScribbleBox squiggle onClick={resolveRoll}>Atk</ScribbleBox>
          <ScribbleBox squiggle onClick={resolveRoll}>Flee</ScribbleBox>
        </div>
      )}
      {phase === 'results' && (
        <div className={styles.actionsRow}>
          <ScribbleBox squiggle onClick={() => setPhase('tactics')}>Next Round</ScribbleBox>
        </div>
      )}
    </div>
  );
}
