import React, { useState, useRef, useEffect } from "react";
import Board from "./components/Board";
import "./App.css";
import { useKeplr } from "./useKeplr";
import {
  CONTRACT_ADDRESS,
  HOME_PAGE,
  JOIN_GAME,
  POLLING_INTERVAL,
  TEST_ID,
} from "./constant";
import { Button, NavLink } from "reactstrap";
import { Redirect, useRouteMatch } from "react-router-dom";
import useInterval from "./hooks/useInterval";
import { GameInfoTable } from "./components/GameInfoTable";
import { toast } from "react-toastify";
import { convertAcudosToCudos } from "./utils";

function Game() {
  const { account, cosmwasmProvider, fetchGame, fetchGameWinner } = useKeplr();
  const [gameData, setGameData] = useState();
  const [winner, setWinner] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const resolveWinner = () => {
    if (!winner || !gameData) return "";
    if (winner === "Cross") {
      return gameData.nought;
    }
    if (winner === "Nought") {
      return gameData.zero;
    }
    if (winner === "Draw") {
      return "Draw";
    }
    return "";
  };
  const {
    params: { id },
  } = useRouteMatch();

  if (!id || !TEST_ID.test(id)) {
    return <Redirect to={HOME_PAGE} exact />;
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

  useInterval(
    realTime,
    !!gameData && !gameData.is_completed ? POLLING_INTERVAL * 1000 : null
  );
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
    setIsLoading(true);
    try {
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
      toast.success(tx.transactionHash);
      await realTime();
      setIsLoading(false);
    } catch (err) {
      toast.error((err && err.message) || "Unknown Error Occurred");
      setIsLoading(false);
    }
  };

  const withdrawWinning = async () => {
    setIsLoading(true);
    try {
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
      toast.success(tx.transactionHash);
      setIsLoading(false);
    } catch (err) {
      toast.error((err && err.message) || "Unknown Error Occurred");
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const msg = {
        cancel_game: {
          game_id: id,
        },
      };
      const tx = await cosmwasmProvider.execute(
        account,
        CONTRACT_ADDRESS,
        msg,
        "auto",
        `Cancel`,
        []
      );
      toast.success(tx.transactionHash);
      setIsLoading(false);
    } catch (err) {
      toast.error((err && err.message) || "Unknown Error Occurred");
      setIsLoading(false);
    }
  };

  const winnerValue = resolveWinner();

  const centerGameScreen =
    (gameContainerHeightState - gameScreenHeightState) / 4;
  return (
    <div ref={gameContainerEl} className="container game-container">
      {!!gameData && gameData.is_pending && (
        <div>
          {gameData.is_completed ? (
            <div className="d-flex">Game is cancelled by the creator</div>
          ) : (
            <div className="d-flex">
              Currently game is not joined by anyone. Please click{" "}
              <NavLink active href={`${JOIN_GAME}/${id}`} className="py-0 px-1">
                here
              </NavLink>{" "}
              to join the game
            </div>
          )}

          {!gameData.is_completed && gameData.cross === account && (
            <div>
              <Button color="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="mt-5">
        <GameInfoTable data={gameData || {}} />
      </div>
      <div className="text-center">{isLoading && "Loading..."}</div>

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
                      cross={gameData.cross}
                      nought={gameData.nought}
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
            <div>
              <div className="text-right">
                {!!winnerValue && `Winner: ${winnerValue}`}
                <div className="mt-2">
                  {!!gameData && !gameData.is_completed && !!winnerValue ? (
                    winner === "Draw" ? (
                      <Button color="success" onClick={withdrawWinning}>
                        Withdraw Orginal Bet {convertAcudosToCudos(gameData.bet.amount)}CUDOS
                      </Button>
                    ) : winnerValue === account ? (
                      <Button color="success" onClick={withdrawWinning}>
                        Withdraw Winnings {convertAcudosToCudos(gameData.bet.amount * 2)}CUDOS
                      </Button>
                    ) : null
                  ) : null}
                </div>
              </div>
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
