import { useEffect, useMemo, useState } from "react";
import { useKeplr } from "../../useKeplr";
import execute_msg from "./schema/execute_msg_nft.json";
import Form from "@rjsf/core";
import { BigNumber } from "bignumber.js";

import { calculateFee, coin, coins } from "@cosmjs/stargate";

import { CONTRACT_ADDRESS, TIC_TAC_CONTRACT_ADDRESS } from "../../constant";
import { Button, Input } from "reactstrap";

export const Write = () => {
  const { cosmwasmProvider, account } = useKeplr();
  const { anyOf } = execute_msg;
  const [result, setResult] = useState<{
    id: number;
    result: string;
  }>({
    id: -1,
    result: "",
  });
  const d = useMemo(() => {
    return anyOf.map((item) => {
      const { properties } = item;
      return {
        properties,
      };
    });
  }, []);
  useEffect(() => {
    if (!cosmwasmProvider || !account) return;
  }, [cosmwasmProvider, account]);
  const onSubmit =
    (ind: number) =>
    async ({ formData }: { formData: any }) => {
      try {
        let result = await cosmwasmProvider?.execute(
          account,
          TIC_TAC_CONTRACT_ADDRESS,
          formData,
          "auto",
          "datata",
          coins("1", "cudos")
        );
        setResult({
          id: ind,
          result: JSON.stringify(result, null, 2),
        });
      } catch (err: any) {
        console.error(err);
        setResult({
          id: ind,
          result: err?.message || "error occurred",
        });
      }
    };

  const handlerJoin = async () => {
    try {
      let result = await cosmwasmProvider?.execute(
        account,
        TIC_TAC_CONTRACT_ADDRESS,
        {
          join_game: {
            game_id: "331952",
          },
        },
        "auto",
        "datata",
        [coin(new BigNumber(10).exponentiatedBy(18).toString(), "acudos")]
      );
    } catch (err) {}
  };
  const handler = async () => {
    try {
      let result = await cosmwasmProvider?.execute(
        account,
        TIC_TAC_CONTRACT_ADDRESS,
        {
          create_game: {
            bet: coin(
              new BigNumber(10).exponentiatedBy(18).toString(),
              "acudos"
            ),
            zero: "cudos1cy23u79yq9ue98ca4wyyc64gxrj8vrwyx4ddu4",
          },
        },
        "auto",
        "datata",
        [coin(new BigNumber(10).exponentiatedBy(18).toString(), "acudos")]
      );
      console.log(result);
      setResult({
        id: 0,
        result: JSON.stringify(result, null, 2),
      });
    } catch (err) {
      console.log(err);
    }
  };
  const onClickTicTacHandler = (i: number, j: number, side: boolean) => async () => {
    try {
      let result = await cosmwasmProvider?.execute(
        account,
        TIC_TAC_CONTRACT_ADDRESS,
        {
          update_game: {
            game_id: "331952",
            i: i,
            j: j,
            side,
          },
        },
        "auto",
        "datata",
        []
      );
      console.log(result);
      setResult({
        id: 0,
        result: JSON.stringify(result, null, 2),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickWithdraw = async () => {
    try {
      let result = await cosmwasmProvider?.execute(
        account,
        TIC_TAC_CONTRACT_ADDRESS,
        {
          withdraw_bet: {
            game_id: "331952"
          },
        },
        "auto",
        "datata",
        []
      );
      console.log(result);
      setResult({
        id: 0,
        result: JSON.stringify(result, null, 2),
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      Write Contracts
      <div>
        <Button
          onClick={async (e) => {
            e.preventDefault();
            await handler();
          }}
        >
          Create_Game
        </Button>
        <br />
        <Button
          onClick={async (e) => {
            e.preventDefault();
            await handlerJoin();
          }}
        >
          Join Game
        </Button>
        <br />
        <br />
        <Button
          onClick={async (e) => {
            e.preventDefault();
            await onClickWithdraw();
          }}
        >
          withDraw Bet
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(0, 0, true)}>
          onClickTicTacHandler(0, 0, true)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(0, 1, false)}>
          onClickTicTacHandler(0, 1, false)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(0, 2, true)}>
          onClickTicTacHandler(0, 2, true)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(1, 2, false)}>
          onClickTicTacHandler(1, 2, false)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(1, 0, true)}>
          onClickTicTacHandler(1, 0, true)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(2, 1, false)}>
          onClickTicTacHandler(2, 1, false)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(1, 1, true)}>
          onClickTicTacHandler(1, 1, true)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(2, 0, false)}>
          onClickTicTacHandler(2, 0, false)
        </Button>
        <br />
        <Button onClick={onClickTicTacHandler(2, 2, true)}>
          onClickTicTacHandler(2, 2, true)
        </Button>
      </div>
    </div>
  );
};
