import React, { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, GAME_BASE, HOME_PAGE, TEST_ID } from "./constant";
import { useKeplr } from "./useKeplr";
import { useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { Button, Input, InputGroup, Row, Col } from "reactstrap";
import { convertAcudosToCudos } from "./utils";
import { PendingGames } from "./PendingGames";

export const JoinGame = () => {
  const { account, cosmwasmProvider, fetchGame } = useKeplr();
  const [id, setId] = useState(0);
  const [bet, setBet] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    params: { id: idByParams },
  } = useRouteMatch();
  if (idByParams && !TEST_ID.test(idByParams)) {
    return <Redirect to={HOME_PAGE} exact />;
  }

  //   queryContractSmart(address: string, queryMsg: Record<string, unknown>): Promise<JsonObject>;
  const history = useHistory();
  const fetchBet = async () => {
    setError("");
    setIsLoading(true);
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
    setError("");
    setIsLoading(true);
    try {
      if (!cosmwasmProvider) throw new Error("Wallet is not connected");
      const msg = {
        join_game: {
          game_id: id,
        },
      };
      const tx = await cosmwasmProvider.execute(
        account,
        CONTRACT_ADDRESS,
        msg,
        "auto",
        `join a game for ${account} with id ${id} with bet ${bet.amount}${bet.denom}`,
        [bet]
      );
      console.log(tx.transactionHash);
      history.push(`${GAME_BASE}/${id}`);
    } catch (err) {
      setIsLoading(false);
      setError((err && err.message) || "Unknown Error Occurred");
    }
  };
  const handleBetWithConnectWallet = async () => {
    idByParams && setId(idByParams);
    await fetchBet();
  };
  useEffect(() => {
    if (idByParams || id) handleBetWithConnectWallet();
  }, [idByParams, id, cosmwasmProvider]);
  return (
    <>
      <Row className="justify-content-center">
        <Col xs="6">
          <InputGroup>
            <Input
              disabled={!!bet}
              type="number"
              min={0}
              autoComplete="off"
              autoCorrect="off"
              placeholder="0"
              minLength={1}
              maxLength={79}
              spellCheck="false"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </InputGroup>
          <div className="text-center mt-3">
            {!!bet ? (
              <Button color="primary" onClick={() => joinGame()}>
                Join Bet
              </Button>
            ) : (
              <Button color="primary" onClick={() => fetchBet()}>
                Fetch Bet
              </Button>
            )}
          </div>
        </Col>
        <Col xs="12" className="text-center">
          {!!bet &&
            `To join the game you need to pay ${convertAcudosToCudos(
              bet.amount
            )}CUDOS`}
        </Col>
        <Col xs="12" className="text-center">
          {isLoading && "Loading Game...."}
        </Col>
        <Col xs="12" className="text-center">
          {!!error && error}
        </Col>

        <Col xs="3" />
        <Col xs="6" className="mt-4">
          <PendingGames onClick={setId} />
        </Col>
        <Col xs="3" />
      </Row>
    </>
  );
};
