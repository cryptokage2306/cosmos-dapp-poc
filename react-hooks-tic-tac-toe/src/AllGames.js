import React, { useEffect, useState } from "react";
import { AllGameTable } from "./components/AllGameTable";
import { useKeplr } from "./useKeplr";

export const AllGames = ({onClick}) => {
  const { cosmwasmProvider, fetchAllGames, connectWallet } = useKeplr();
  const [isLoading, setIsLoading] = useState(false);
  const [allGameData, setAllGameData] = useState([]);
  const fetchTableData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllGames();
      console.log(data);
      setAllGameData(data);
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
