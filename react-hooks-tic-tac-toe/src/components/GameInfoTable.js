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
        accessor: "state",
        Header: "Status"
      },
    ],
    []
  );
  return <Table columns={col} data={[data]} />;
};
