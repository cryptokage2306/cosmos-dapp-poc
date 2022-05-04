import React, { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, GAME_BASE } from "./constant";
import { useKeplr } from "./useKeplr";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, Input, InputGroup, Row, Col } from "reactstrap";

export const JoinGame = () => {
  const { account, cosmwasmProvider, fetchGame, connectWallet } = useKeplr();
  const [id, setId] = useState(0);
  const [bet, setBet] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    params: { id: idByParams },
  } = useRouteMatch();
  //   queryContractSmart(address: string, queryMsg: Record<string, unknown>): Promise<JsonObject>;
  const history = useHistory();
  const fetchBet = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!cosmwasmProvider) throw new Error("Wallet is not connected");
      if (!id) throw new Error("Id is not set");

      const data = await fetchGame(id);
      setBet(data.bet);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError((err && err.message) || "Unknown Error Occurred");
    }
  };
  const joinGame = async () => {
    try {
      if (!cosmwasmProvider) throw new Error("Wallet is not connected");
      const msg = {
        join_game: {
          game_id: id,
        },
      };
      setIsLoading(true);
      const tx = await cosmwasmProvider.execute(
        account,
        CONTRACT_ADDRESS,
        msg,
        "auto",
        `join a game for ${account} with id ${id} with bet ${bet.amount}${bet.denom}`,
        [bet]
      );
      history.push(`${GAME_BASE}/${id}`);
    } catch (err) {
      setIsLoading(false);
      setError((err && err.message) || "Unknown Error Occurred");
    }
  };
  const handleBetWithConnectWallet = async () => {
    setId(idByParams);
    await fetchBet();
  };
  useEffect(() => {
    if (!idByParams) return;
    handleBetWithConnectWallet();
  }, [idByParams, cosmwasmProvider]);
  return (
    <>
      <Row className="justify-content-center">
        <Col xs="6">
          <InputGroup>
            <Input
              disabled={!!bet}
              type="number"
              autoComplete="off"
              autoCorrect="off"
              placeholder="0"
              minLength={1}
              maxLength={79}
              spellCheck="false"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            {!!bet ? (
              <Button color="primary" onClick={() => joinGame()}>
                Join Bet
              </Button>
            ) : (
              <Button color="primary" onClick={() => fetchBet()}>
                Fetch Bet
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col xs="12" className="text-center">
          {!!bet &&
            `To join the game you need to pay ${bet.amount}${bet.denom}`}
        </Col>
        <Col xs="12" className="text-center">
          {isLoading && "Loading Game...."}
        </Col>
        <Col xs="12" className="text-center">
          {!!error && error}
        </Col>
      </Row>
    </>
  );
};
