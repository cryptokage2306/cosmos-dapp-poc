import React, { useEffect, useMemo, useState } from "react";
import { useKeplr } from "../../useKeplr";
import { QueryMsg } from "./schema/query_msg";
import JSONForm from "@rjsf/core";
import query_msg from "./schema/query_msg_nft.json";
import { CONTRACT_ADDRESS } from "../../constant/config";

export const Cosmwasm = () => {
  const { cosmwasmProvider, account } = useKeplr();
  const { oneOf } = query_msg;
  const [result, setResult] = useState<{
    id: number;
    result: string;
  }>({
    id: -1,
    result: "",
  });
  const d = useMemo(() => {
    return oneOf.map((item) => {
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
          CONTRACT_ADDRESS,
          formData
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
  return (
    <div>
      Read Contracts
      <div>
        {d.map((item, id) => (
          <div>
            <JSONForm schema={item} onSubmit={onSubmit(id)} />
            {id == result.id && <section>{result.result}</section>}
          </div>
        ))}
      </div>
    </div>
  );
};
