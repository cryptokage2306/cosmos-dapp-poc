import React, { useEffect, useState } from "react";
import { PendingGameTable } from "./components/PendingGameTable";
import { useKeplr } from "./useKeplr";

export const PendingGames = ({onClick}) => {
  const { cosmwasmProvider, fetchPendingGames, connectWallet } = useKeplr();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingGameData, setPendingGameData] = useState([]);
  const fetchTableData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPendingGames();
      console.log(data);
      setPendingGameData(data);
      setIsLoading(false);
    } catch (err) {}
  };
  useEffect(() => {
    if (!cosmwasmProvider) connectWallet();
    fetchTableData();
  }, [cosmwasmProvider]);
  return (
    <>
      <div>{isLoading ? "Loading..." : ""}</div>
      {!isLoading && !!pendingGameData && (
        <PendingGameTable data={pendingGameData} onClick={onClick} />
      )}
    </>
  );
};
