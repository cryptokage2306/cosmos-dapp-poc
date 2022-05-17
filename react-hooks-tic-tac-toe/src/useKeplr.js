import { useEffect, useState, useCallback } from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice, StargateClient } from "@cosmjs/stargate";
// import { toast } from "react-toastify";
import {
  CHAIN_ID,
  NAME,
  RPC_URL,
  CONTRACT_ADDRESS,
  GAS_PRICE,
} from "./constant";

export const useKeplr = () => {
  const [cosmwasmProvider, setCosmwasmProvider] = useState();
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState("");
  const [isError, setIsError] = useState("");

  const connectWallet = async () => {
    try {
      const chainId = CHAIN_ID;
      console.log("chainId", chainId);
      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window) {
        throw new Error("Please install keplr extension");
      }
      if (!window.getOfflineSigner || !window.keplr) {
        throw new Error("Please install keplr extension");
      } else {
        if (window.keplr.experimentalSuggestChain) {
          await window.keplr.experimentalSuggestChain({
            rpc: RPC_URL,
            rest: "http://35.232.27.92:1317",
            chainName: NAME,
            chainId,
            currencies: [
              {
                coinDenom: "CUDOS",
                coinMinimalDenom: "acudos",
                coinDecimals: 18,
                coinGeckoId: "cudos",
              },
            ],
            stakeCurrency: {
              coinDenom: "CUDOS",
              coinMinimalDenom: "acudos",
              coinDecimals: 18,
              coinGeckoId: "cudos",
            },
            feeCurrencies: [
              {
                coinDenom: "CUDOS",
                coinMinimalDenom: "acudos",
                coinDecimals: 18,
                coinGeckoId: "cudos",
              },
            ],
            bip44: { coinType: 118 },
            bech32Config: {
              bech32PrefixAccAddr: "cudos",
              bech32PrefixAccPub: "cudospub",
              bech32PrefixValAddr: "cudosvaloper",
              bech32PrefixValPub: "cudosvaloperpub",
              bech32PrefixConsAddr: "cudosvalcons",
              bech32PrefixConsPub: "cudosvalconspub",
            },
            coinType: 118,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.04,
            },
          });
        } else {
          throw new Error("Please use the recent version of keplr extension");
        }
      }

      // // You should request Keplr to enable the wallet.
      // // This method will ask the user whether or not to allow access if they haven't visited this website.
      // // Also, it will request user to unlock the wallet if the wallet is locked.
      // // If you don't request enabling before usage, there is no guarantee that other methods will work.
      // if (!window?.keplr) throw new Error("Unable to connect with Keplr");
      // await window.keplr.enable(chainId);

      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const clonedacc = [...accounts];
      setAccount(clonedacc[0].address);
      setCosmwasmProvider(
        await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner, {
          prefix: "cudos",
          gasPrice: GasPrice.fromString(GAS_PRICE),
        })
      );
      setProvider(await StargateClient.connect(RPC_URL));
    } catch (err) {
      // toast.error(err?.message, {
      //   position: "top-right",
      //   toastId: "error_toast",
      // });
      setIsError(err.message);
    }
  };
  useEffect(() => {
    if (!!account && !!cosmwasmProvider) return;
    connectWallet();
  }, [cosmwasmProvider, account]);

  const fetchGame = useCallback(
    async (id) => {
      if (!cosmwasmProvider) return;
      const msg = {
        query_game: {
          game_id: id,
        },
      };
      const data = await cosmwasmProvider.queryContractSmart(
        CONTRACT_ADDRESS,
        msg
      );
      return data;
    },
    [cosmwasmProvider]
  );

  const fetchGameWinner = useCallback(
    async (id) => {
      if (!cosmwasmProvider) return;
      const msg = {
        get_winner: {
          game_id: id,
        },
      };
      const data = await cosmwasmProvider.queryContractSmart(
        CONTRACT_ADDRESS,
        msg
      );
      return data;
    },
    [cosmwasmProvider]
  );

  const fetchPendingGames = useCallback(async () => {
    if (!cosmwasmProvider) return;
    const msg = {
      pending_games: {},
    };
    const data = await cosmwasmProvider.queryContractSmart(
      CONTRACT_ADDRESS,
      msg
    );
    return data;
  }, [cosmwasmProvider]);

  const fetchAllGames = useCallback(async () => {
    if (!cosmwasmProvider) return;
    const msg = {
      all_games: {},
    };
    const data = await cosmwasmProvider.queryContractSmart(
      CONTRACT_ADDRESS,
      msg
    );
    return data;
  }, [cosmwasmProvider]);
  return {
    account,
    connectWallet,
    isError,
    cosmwasmProvider,
    fetchGame,
    fetchGameWinner,
    provider,
    fetchPendingGames,
    fetchAllGames
  };
};
