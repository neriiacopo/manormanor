import Landing from './layout/Landing/Landing';
import GameView from './layout/GameView/GameView';
import useGameStore from './store/useGameStore';
import './theme/fonts.css';
import './theme/tokens.css';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const mode = useGameStore((s) => s.mode);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const continueGame = useGameStore((s) => s.continueGame);

  if (screen === 'landing') {
    return <Landing onNewGame={startNewGame} onContinue={continueGame} hasSave={false} />;
  }

  return <GameView mode={mode} progress={{ value: 1, max: 6 }} />;
}
