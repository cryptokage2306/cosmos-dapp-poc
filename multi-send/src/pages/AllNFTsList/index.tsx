import React, { useState, useMemo, useEffect } from "react";
import Table from "../../components/Table";
import { useKeplr } from "../../useKeplr";

import { preprocess, fetchData } from "../../utils";

export const AllNFTsList = () => {
  const [data, setData] = useState<
    { id: string; name: string; creator: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { queryClient, provider, account } = useKeplr();
  useEffect(() => {
    if (!queryClient || !provider || !account) return;
    fetchNFTs();
  }, [queryClient, provider, account]);
  const fetchNFTs = async () => {
    const dd = await queryClient?.queryUnverified(
      "/cudosnode.cudosnode.nft.Query/Denoms",
      new Uint8Array()
    );
    if (!dd) return;
    const tableData = fetchData(preprocess(dd));
    setData(tableData);
    setIsLoading(false);
  };

  const col = useMemo(
    () => [
      { accessor: "id", Header: "Symbol" },
      { accessor: "name", Header: "Name" },
      { accessor: "creator", Header: "Creator" },
    ],
    []
  );
  return (
    <>
      <div>
        <h1 className="text-center">All NFTs</h1>
        <div className="my-5">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Table columns={col} data={data} />
          )}
        </div>
      </div>
    </>
  );
};
