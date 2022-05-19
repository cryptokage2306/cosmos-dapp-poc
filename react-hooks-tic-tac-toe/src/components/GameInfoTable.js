import React, { useMemo } from "react";
import { convertAcudosToCudos } from "../utils";
import Table from "./Table";

export const GameInfoTable = ({ data }) => {
  const col = useMemo(
    () => [
      {
        accessor: "cross",
        Header: "Cross",
      },
      { accessor: "nought", Header: "Zero" },
      {
        accessor: "bet",
        Header: "Bet Amount",
        Cell: ({ value }) =>
          !!value ? `${convertAcudosToCudos(value.amount)}CUDOS` : "",
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
