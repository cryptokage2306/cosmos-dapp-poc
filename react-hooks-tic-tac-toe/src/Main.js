import React, { useState } from "react";
import { CONTRACT_ADDRESS, GAME_BASE } from "./constant";
import { useKeplr } from "./useKeplr";
import { coin } from "@cosmjs/stargate";
import { useHistory } from "react-router-dom";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
const ETHEREUM_MAX_AMOUNT = /^\d*\.?\d*$/;

export const Main = () => {
  const history = useHistory();
  const { account, cosmwasmProvider } = useKeplr();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bet, setBet] = useState("");
  //   execute(senderAddress: string, contractAddress: string, msg: Record<string, unknown>, fee: StdFee | "auto" | number, memo?: string, funds?: readonly Coin[])
  const createGame = async () => {
    try {
      if (!cosmwasmProvider)
        throw new Error("Wallet is not present or connected");
      const val = coin(bet, "acudos");
      const msg = {
        create_game: {
          bet: val,
        },
      };
      setIsLoading(true);
      const tx = await cosmwasmProvider.execute(
        account,
        CONTRACT_ADDRESS,
        msg,
        "auto",
        `create a game for ${account} with bet ${bet} cudos`,
        [val]
      );
      const id = tx.logs[0].events[5].attributes[1].value;
      history.push(`${GAME_BASE}/${id}`);
    } catch (err) {
      setIsLoading(false);
      setError((err && err.message) || "Unknown Error Occurred");
    }
  };

  const onKeyPressHandler = (e) => {
    if (!ETHEREUM_MAX_AMOUNT.test(e.key)) {
      e.preventDefault();
    }
  };
  return (
    <>
      <Row className="justify-content-center">
        <Col xs="6">
          <InputGroup>
            <Input
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0.0"
              minLength={1}
              maxLength={79}
              spellCheck="false"
              onKeyPress={onKeyPressHandler}
              onChange={(e) => setBet(e.target.value)}
            />
            <Button color="primary" onClick={() => createGame()}>Create Game</Button>
          </InputGroup>
        </Col>
        <Col xs="12" className="text-center">
          {isLoading && "Creating Game...."}
        </Col>
        <Col xs="12" className="text-center">{!!error && error}</Col>
      </Row>
    </>
  );
};
