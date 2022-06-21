import { useEffect, useMemo, useState } from "react";
import { useKeplr } from "../../useKeplr";
import JSONForm from "@rjsf/core";
import query_msg from "./schema/query_msg.json";
import { CONTRACT_ADDRESS } from "../../constant";

export const Cosmwasm = () => {
  const { cosmwasmProvider, account } = useKeplr();
  const { oneOf, definitions } = query_msg;
  const [result, setResult] = useState<{
    id: number;
    result: string;
  }>({
    id: -1,
    result: "",
  });
  const d = useMemo(() => {
    return oneOf.map((item) => {
      return {
        ...item,
        definitions,
      };
    });
  }, []);
  useEffect(() => {
    if (!cosmwasmProvider || !account) return;
  }, [cosmwasmProvider, account]);
  const onSubmit =
    (id: number) =>
    async ({ formData }: any) => {
      try {
        console.log({ formData });
        let formD1: any = {};
        const data = Object.keys(formData).filter(
          (item) => item !== "query_denom_by_id"
        )[0];
        if (!!data) {
          formD1[data] = formData[data];
        } else {
          formD1 = formData;
        }
        let result = await cosmwasmProvider?.queryContractSmart(
          CONTRACT_ADDRESS,
          formD1
        );
        console.log(result);
        setResult({
          id,
          result: JSON.stringify(result, null, 2),
        });
      } catch (err) {
        console.error(err);
        setResult({
          id,
          result: err?.message || "error occurred",
        });
      }
    };
  return (
    <div>
      Read Contracts
      <div>
        <JSONForm schema={query_msg} onSubmit={onSubmit(0)} noValidate />
        {0 == result.id && <section>{result.result}</section>}
      </div>
    </div>
  );
};
