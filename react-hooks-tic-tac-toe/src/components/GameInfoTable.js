import React, { useMemo } from "react";
import { convertAcudosToCudos } from "../utils";
import Table from "./Table";

export const GameInfoTable = ({ data }) => {
  console.log(data);
  const col = useMemo(
    () => [
      {
        accessor: "nought",
        Header: "Nought",
      },
      { accessor: "zero", Header: "Zero" },
      {
        accessor: "bet",
        Header: "Bet Amount",
        Cell: ({ value }) =>
          !!value ? `${convertAcudosToCudos(value.amount)}${value.denom}` : "",
      },
      {
        accessor: "is_pending",
        Header: "Pending",
        Cell: ({ value }) => String(value),
      },
      {
        accessor: "is_completed",
        Header: "Completed",
        Cell: ({ value }) => String(value),
      },
    ],
    []
  );
  return <Table columns={col} data={[data]} />;
};
