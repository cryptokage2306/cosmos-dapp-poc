import React, { useEffect, useMemo, useState } from "react";
import { useKeplr } from "../../useKeplr";
import { QueryMsg } from "./schema/query_msg";
import JSONForm from "@rjsf/core";
import execute_msg from "./schema/execute_msg.json";
import { calculateFee } from "@cosmjs/stargate";

import { CONTRACT_ADDRESS } from "../../constant/config";

export const Write = () => {
  const { cosmwasmProvider, account } = useKeplr();
  const { oneOf } = execute_msg;
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
  // const d = useMemo(() => {
  //   return anyOf.map((item) => {
  //     const { properties } = item;
  //     return {
  //       properties,
  //     };
  //   });
  // }, []);
  useEffect(() => {
    if (!cosmwasmProvider || !account) return;
  }, [cosmwasmProvider, account]);
  const onSubmit =
    (ind: number) =>
    async ({ formData }: { formData: any }) => {
      console.log(formData);
      let result = await cosmwasmProvider?.execute(
        account,
        CONTRACT_ADDRESS,
        formData,
        calculateFee(160000, "0.01acudos"),
        "testing nft binding"
      );
      console.log(result);
      // let result = await cosmwasmProvider?.execute()
      // setResult({
      //   id: ind,
      //   result: JSON.stringify(result, null, 2),
      // });
    };
  return (
    <div>
      Write Contracts
      <div>
        {d.map((item, id) => (
          <div>
            <JSONForm schema={item} onSubmit={onSubmit(id)} />
          </div>
        ))}
      </div>
    </div>
  );
};
