import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { InputGroup, Input, Button, Row, Col } from "reactstrap";
import { AllGames } from "./AllGames";
import { GAME_BASE } from "./constant";
import { useKeplr } from "./useKeplr";

export const ViewGame = () => {
  const [gameId, setGameId] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchGame } = useKeplr();
  const history = useHistory();
  const checkGame = async () => {
    try {
      if (gameId === 0) throw new Error("GameId Cannot be zero");
      setIsLoading(true);
      await fetchGame(gameId);
      history.push(`${GAME_BASE}/${gameId}`);
    } catch (err) {
      setIsLoading(false);
      setError((err && err.message) || "Unknown Error Occurred");
    }
  };
  return (
    <>
      <Row className="justify-content-center">
        <Col xs="6">
          <InputGroup>
            <Input
              type="number"
              min={0}
              autoComplete="off"
              autoCorrect="off"
              placeholder="0"
              minLength={1}
              maxLength={79}
              spellCheck="false"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
          </InputGroup>
          <div className="text-center mt-3">
            <Button color="primary" onClick={() => checkGame()}>
              View Game
            </Button>
          </div>
        </Col>
        <Col xs="12" className="text-center">
          {isLoading && "Loading Game...."}
        </Col>
        <Col xs="12" className="text-center">
          {!!error && error}
        </Col>
        <Col xs="12" className="mt-4">
          <AllGames onClick={setGameId} />
        </Col>
      </Row>
    </>
  );
};
