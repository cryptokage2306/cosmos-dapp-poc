import React, { useMemo } from "react";
import { Button, NavLink } from "reactstrap";
import { JOIN_GAME } from "../constant/routes";
import { useHistory } from "react-router-dom";
import Table from "./Table";

export const PendingGameTable = ({ data, onClick }) => {
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
