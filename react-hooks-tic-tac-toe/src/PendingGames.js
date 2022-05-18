import React, { useEffect, useState } from "react";
import { PendingGameTable } from "./components/PendingGameTable";
import { useKeplr } from "./useKeplr";

export const PendingGames = ({ onClick }) => {
  const { cosmwasmProvider, fetchPendingGames, connectWallet, fetchGame } =
    useKeplr();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingGameData, setPendingGameData] = useState([]);
  const fetchTableData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPendingGames();
      const gameData = (await Promise.all(data.map((item) => fetchGame(item))))
        .map((item, i) => ({ ...item, id: data[i] }))
        .filter((item) => !item.is_completed);
      setPendingGameData(gameData);
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
      {pendingGameData.length ? (
        <PendingGameTable data={pendingGameData} onClick={onClick} />
      ) : (
        !isLoading && "No Pending Games"
      )}
    </>
  );
};
