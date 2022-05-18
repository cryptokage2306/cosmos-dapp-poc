import React, { useEffect, useState } from "react";
import { AllGameTable } from "./components/AllGameTable";
import { useKeplr } from "./useKeplr";

export const AllGames = ({ onClick }) => {
  const { cosmwasmProvider, fetchAllGames, connectWallet, fetchGame } =
    useKeplr();
  const [isLoading, setIsLoading] = useState(false);
  const [allGameData, setAllGameData] = useState([]);
  const fetchTableData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllGames();
      const updatedData = (
        await Promise.all(data.map((item) => fetchGame(item)))
      ).map((item, i) => ({
        ...item,
        id: data[i],
      }));
      setAllGameData(updatedData);
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
      {!isLoading && !!allGameData && (
        <AllGameTable data={allGameData} onClick={onClick} />
      )}
    </>
  );
};
