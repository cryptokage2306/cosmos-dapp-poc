import React, { useState } from "react";
import { CONTRACT_ADDRESS, GAME_BASE } from "./constant";
import { useKeplr } from "./useKeplr";
import { coin } from "@cosmjs/stargate";
import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { convertCudosToACudos } from "./utils";
import { toast } from "react-toastify";
const ETHEREUM_MAX_AMOUNT = /^\d*\.?\d*$/;

export const Main = () => {
  const history = useHistory();
  const { account, cosmwasmProvider } = useKeplr();
  const [isLoading, setIsLoading] = useState(false);
  const [bet, setBet] = useState("");
  const createGame = async () => {
    setIsLoading(true);
    try {
      if (!cosmwasmProvider)
        throw new Error("Wallet is not present or connected");
      if (bet < 10) throw new Error("Minimum Bet is 10CUDOS");
      const val = coin(convertCudosToACudos(bet), "acudos");
      const msg = {
        create_game: {
          bet: val,
        },
      };
      const tx = await cosmwasmProvider.execute(
        account,
        CONTRACT_ADDRESS,
        msg,
        "auto",
        `create a game for ${account} with bet ${bet} cudos`,
        [val]
      );
      const id = tx.logs[0].events[5].attributes[1].value;
      toast.success(tx.transactionHash);
      history.push(`${GAME_BASE}/${id}`);
    } catch (err) {
      setIsLoading(false);
      toast.error((err && err.message) || "Unknown Error Occurred");
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
        <Col xs="6" className="">
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
            <InputGroupText>CUDOS</InputGroupText>
          </InputGroup>
          <div className="text-center mt-3">
            <Button color="success" onClick={() => createGame()}>
              Create Game
            </Button>
          </div>
        </Col>
        <Col xs="12" className="text-center">
          {isLoading && "Creating Game...."}
        </Col>
      </Row>
    </>
  );
};
