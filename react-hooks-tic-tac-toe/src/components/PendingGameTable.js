import React, { useMemo } from "react";
import { Button, NavLink } from "reactstrap";
import { convertAcudosToCudos } from "../utils";
import Table from "./Table";

export const PendingGameTable = ({ data, onClick }) => {
  const col = useMemo(
    () => [
      {
        Header: "Game Id",
        accessor: "id",
        Cell: ({ value }) => {
          return (
            <NavLink
              tag={Button}
              color="link"
              className="p-0"
              onClick={() => onClick(value)}
            >
              {value}
            </NavLink>
          );
        },
      },
      {
        Header: "X",
        accessor: "cross",
      },
      {
        accessor: "bet",
        Header: "Bet Amount",
        Cell: ({ value }) => `${convertAcudosToCudos(value.amount)}CUDOS`,
      },
    ],
    []
  );
  return <Table columns={col} data={data} />;
};
