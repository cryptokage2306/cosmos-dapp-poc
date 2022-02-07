import { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../../components/Table";
import { useKeplr } from "../../useKeplr";

import { preprocess, fetchData } from "../../utils";

export const AllNFTsList = () => {
  const [data, setData] = useState<
    { id: string; name: string; creator: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { queryClient, provider, account, isError } = useKeplr();
  useEffect(() => {
    if (!queryClient || !provider || !account) return;
    fetchNFTs();
  }, [queryClient, provider, account, isError]);
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
  const centerText = (text: string) => (
    <div className="text-center">{text}</div>
  );
  const render = useCallback(() => {
    if (isError) return centerText("Please refresh the page");
    if (isLoading) return centerText("Loading ...");
    return <Table columns={col} data={data} />;
  }, [isError, isLoading, data]);
  return (
    <>
      <div>
        <h1 className="text-center">All NFTs</h1>
        <div className="my-5">{render()}</div>
      </div>
    </>
  );
};
