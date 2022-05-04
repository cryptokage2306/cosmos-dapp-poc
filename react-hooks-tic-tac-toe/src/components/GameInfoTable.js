import React, { useMemo } from "react";
import Table from "./Table";

export const GameInfoTable = ({ data }) => {
  const col = useMemo(
    () => [
      {
        accessor: "nought",
        Header: "Nought",
      },
      { accessor: "zero", Header: "Zero" },
      { accessor: "is_pending", Header: "Pending", Cell: ({ value }) => String(value) },
      { accessor: "is_completed", Header: "Completed", Cell: ({ value }) => String(value) },
    ],
    []
  );
  return <Table columns={col} data={[data]} />;
};
