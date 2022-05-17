import React, { useMemo } from "react";
import { Button, NavLink } from "reactstrap";
import Table from "./Table";

export const AllGameTable = ({ data, onClick }) => {
  const col = useMemo(
    () => [
      {
        id: "game_id",
        Header: "Game Id",
        type: "button",
        accessor: (o) => (
          <NavLink tag={Button} onClick={() => onClick(o)}>
            {o}
          </NavLink>
        ),
      },
    ],
    []
  );
  return <Table columns={col} data={data} />;
};
