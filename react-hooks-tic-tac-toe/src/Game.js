import React, { useState, useRef, useEffect } from "react";
import Board from "./components/Board";
import "./App.css";
import { useKeplr } from "./useKeplr";
import { CONTRACT_ADDRESS, JOIN_GAME } from "./constant";
import { Button, NavLink } from "reactstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import useInterval from "./hooks/useInterval";
import { GameInfoTable } from "./components/GameInfoTable";

const TEST_ID = /^[0-9]{6,10}?$/;
function Game() {
  const { account, cosmwasmProvider, fetchGame, fetchGameWinner } = useKeplr();
  const [gameData, setGameData] = useState();
  const [winner, setWinner] = useState();
  const resolveWinner = () => {
    if (!winner || !gameData) return "";
    if (winner == "Nought") {
      return gameData.nought;
    }
    if (winner == "Zero") {
      return gameData.zero;
    }
    if (winner == "Draw") {
      return "Draw";
    }
    return "";
  };
  const {
    params: { id },
  } = useRouteMatch();
  if (!id || !TEST_ID.test(id)) {
    return <Redirect to={"/"} exact />;
  }

  const handleWinner = async () => {
    setWinner(await fetchGameWinner(id));
  };

  const realTime = async () => {
    await handleGame();
    await handleWinner();
  };

  useEffect(() => {
    realTime();
  }, [cosmwasmProvider]);

  const handleGame = async () => {
    if (!cosmwasmProvider) return;
    const data = await fetchGame(id);
    setGameData(data);
  };
  console.log(gameData);
  useInterval(realTime, !!gameData ? 10 * 1000 : null);
  //----------------------------------------- useState ---------------------------------------------------
  //---------------------------------------- style useRef -------------------------------------------------
  const gameScreenEl = useRef(null);
  const [gameScreenHeightState, setGameScreenHeightState] = useState(0);
  const gameContainerEl = useRef(null);
  const [gameContainerHeightState, setGameContainerHeightState] = useState(0);
  // similar to componentDidMount(), run the effect function only when the component mounts
  useEffect(() => {
    setGameScreenHeightState(
      gameScreenEl.current.getBoundingClientRect().height
    );
    setGameContainerHeightState(
      gameContainerEl.current.getBoundingClientRect().height
    );
  }, []);

  const handleClick = async (i, j) => {
    if (!gameData) return;

    const msg = {
      update_game: {
        game_id: id,
        i,
        j,
        side: gameData.next_move,
      },
    };
    const tx = await cosmwasmProvider.execute(
      account,
      CONTRACT_ADDRESS,
      msg,
      "auto",
      `Update a game for ${account} with id ${id} with i=${i} and j=${j}`,
      []
    );
    await realTime();
  };

  const withdrawWinning = async () => {
    if (!gameData) return;

    const msg = {
      withdraw_bet: {
        game_id: id,
      },
    };
    const tx = await cosmwasmProvider.execute(
      account,
      CONTRACT_ADDRESS,
      msg,
      "auto",
      `Withdraw a Bet`,
      []
    );
    console.log(tx);
  };

  const winnerValue = resolveWinner();

  const centerGameScreen =
    (gameContainerHeightState - gameScreenHeightState) / 4;
  return (
    <div ref={gameContainerEl} className="container game-container">
      {!!gameData && gameData.is_pending && (
        <div className="d-flex">
          Currently game is not joined by anyone. Please click{" "}
          <NavLink active href={`${JOIN_GAME}/${id}`} className="py-0 px-1">
            here
          </NavLink>{" "}
          to join the game
        </div>
      )}
      <div className="mt-5">
        <GameInfoTable data={gameData || {}} />
      </div>
      <div className="row">
        <div className="col-12">
          <div
            ref={gameScreenEl}
            className="game-screen"
            style={{
              margin: `${centerGameScreen}px 0px ${centerGameScreen}px 0px`,
            }}
          >
            <div className="row">
              <h3>TIC TAC TOE</h3>
            </div>
            <div className="row">
              <div className="col-12 offset-0 col-lg-5 offset-lg-2 game__board">
                {gameData && (
                  <div>
                    <p className="game__status">
                      Next Move: {gameData.next_move ? "X" : "0"}
                    </p>
                    <Board
                      squares={gameData.game}
                      nextMove={gameData.next_move}
                      nought={gameData.nought}
                      zero={gameData.zero}
                      account={account}
                      isWinner={!!winnerValue}
                      onClick={(i, j) => {
                        handleClick(i, j);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              {!!winnerValue && `Winner: ${winnerValue}`}
              {!!winnerValue && !gameData.is_completed && (
                <Button color="success" onClick={withdrawWinning}>
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/*
     
*/

export default Game;
