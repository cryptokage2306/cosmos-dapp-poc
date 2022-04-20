import { useEffect, useMemo, useState } from "react";
import { useKeplr } from "../../useKeplr";
import { QueryMsg } from "./schema/query_msg";
import JSONForm from "@rjsf/core";
import query_msg from "./schema/query_msg_nft.json";
import { CONTRACT_ADDRESS, TIC_TAC_CONTRACT_ADDRESS } from "../../constant";
import { Button } from "reactstrap";

export const Cosmwasm = () => {
  const { cosmwasmProvider, account, provider } = useKeplr();
  const { anyOf } = query_msg;
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
    async ({ formData }: { formData: QueryMsg }) => {
      try {
        let result = await cosmwasmProvider?.queryContractSmart(
          TIC_TAC_CONTRACT_ADDRESS,
          {
            query_game: {
              game_id: 331952,
            },
          }
        );
        console.log(result);
        setResult({
          id: ind,
          result: JSON.stringify(result, null, 2),
        });
      } catch (err) {
        console.error(err);
        setResult({
          id: ind,
          result: err?.message || "error occurred",
        });
      }
    };

  const handleQuery = async () => {
    let result = await cosmwasmProvider?.queryContractSmart(
      TIC_TAC_CONTRACT_ADDRESS,
      {
        query_game: {
          game_id: "331952",
        },
      }
    );
    console.log(result);
  };

  const handleWinnerQuery = async () => {
    let result = await cosmwasmProvider?.queryContractSmart(
      TIC_TAC_CONTRACT_ADDRESS,
      {
        get_winner: {
          game_id: "331952",
        },
      }
    );
    console.log(result);
  };

  const handleContractBalance = async () => {
    let result = await provider?.getAllBalances("cudos1ufs3tlq4umljk0qfe8k5ya0x6hpavn89xewwgu");
    console.log(result);
  };
  return (
    <div>
      Read Contracts
      <div>
        <Button
          onClick={async (e) => {
            e.preventDefault();
            await handleQuery();
          }}
        >
          {" "}
          Query
        </Button>

        <Button
          onClick={async (e) => {
            e.preventDefault();
            await handleWinnerQuery();
          }}
        >
          {" "}
          Query Winner
        </Button>

        <Button
          onClick={async (e) => {
            e.preventDefault();
            await handleContractBalance();
          }}
        >
          {" "}
          Query Contract balance
        </Button>
        {/* {d.map((item, id) => (
          <div>
            <JSONForm schema={item} onSubmit={onSubmit(id)} />
            {id == result.id && <section>{result.result}</section>}
          </div>
        ))} */}
      </div>
    </div>
  );
};
