import React, { useMemo } from "react";
import { Button, NavLink } from "reactstrap";
import { convertAcudosToCudos } from "../utils";
import Table from "./Table";

export const AllGameTable = ({ data, onClick }) => {
  const col = useMemo(
    () => [
      {
        Header: "Game Id",
        accessor: "id",
        Cell: ({ value }) => (
          <NavLink tag={Button} className="p-0" color="link" onClick={() => onClick(value)}>
            {value}
          </NavLink>
        ),
      },
      {
        Header: "X",
        accessor: "cross",
      },
      {
        Header: "0",
        accessor: "nought",
      },
      {
        Header: "Bet Amount",
        accessor: "bet",
        Cell: ({ value }) => `${convertAcudosToCudos(value.amount)}CUDOS`,
      },

      {
        Header: "Pending",
        accessor: "is_pending",
        Cell: ({ value }) => `${value}`,
      },
      {
        Header: "Completed",
        accessor: "is_completed",
        Cell: ({ value }) => `${value}`,
      },
    ],
    []
  );
  return <Table columns={col} data={data} />;
};
