import React from 'react';
import { createStage, isColliding } from './gameHelpers'

// Custom hooks
import { useInterval } from './hooks/useInterval'
import { usePlayer } from './hooks/usePlayer'
import { useStage } from './hooks/useStage'


import Stage from './stage/Stage'
import Display from './display/Display'
import StartButton from './startbutton/StartButton'


// Styles
import { StyledTetrisWrapper, StyledTetris } from './App.styles';

const App: React.FC = () => {
  const [dropTime, setDropTime] = React.useState<null | number>(null);
  const [gameOver, setGameOver] = React.useState(true)

  const gameArea = React.useRef<HTMLDivElement>(null)

  const { player, updatePlayerPos, resetPlayer } = usePlayer()
  const { stage, setStage } = useStage(player, resetPlayer)

  const movePlayer = (dir: number) => {
    if (!isColliding(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false})
    }
  }

  const keyUp = ({ keyCode }: { keyCode: number}): void => {
    // Change the droptime speed when user releases down arrow
    if (keyCode === 40) {
      setDropTime(1000);
    }
  }

  const handleStartGame = (): void => {
    // Need to focus the window with the key events on start
    if (gameArea.current) gameArea.current.focus()
    // Reset everything
    setStage(createStage())
    setDropTime(1000)
    resetPlayer()
    setGameOver(false)
  }

  const move = ({ keyCode, repeat }: { keyCode: number; repeat: boolean}): void => {
    if (keyCode === 37) {
      movePlayer(-1);
    } else if (keyCode === 39) {
      movePlayer(1);
    } else if (keyCode === 40) {
      if(repeat) {
        return
      }
      setDropTime(30)
    } else if (keyCode === 38) {
      // Will implement rotation function here later
    }
  }

  const drop = (): void => {
    updatePlayerPos({x: 0, y: 1, collided: false})
  }

  useInterval(() => {
    drop()
  }, dropTime)

  return (
    <StyledTetrisWrapper role='button' tabIndex={0} onKeyDown={move} onKeyUp={keyUp} ref={gameArea}>
      <StyledTetris>
        <div className='display'>
            {gameOver ? (
                <>
                    <Display gameOver={gameOver} text='Game Over!' />
                    <StartButton callback={handleStartGame} />
                </>
            ) : (
                <>
                    <Display text={`Score: `} />
                    <Display text={`Rows: `} />
                    <Display text={`Level: `} />
                </>



            )}
        </div>
        <Stage stage={stage} />
        </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default App;