import { useEffect, useState } from "react";
import { SigningStargateClient, QueryClient } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { toast } from "react-toastify";

declare global {
  interface Window {
    getOfflineSigner?: any;
    keplr?: any;
  }
}

export const useKeplr = () => {
  const [provider, setProvider] = useState<SigningStargateClient>();
  const [cosmwasmProvider, setCosmwasmProvider] =
    useState<SigningCosmWasmClient>();
  const [queryClient, setQueryClient] = useState<QueryClient>();
  const [account, setAccount] = useState("");
  const [isError, setIsError] = useState("");

  const connectWallet = async () => {
    try {
      const chainId = "cudos-testnet-public-2";
      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window?.getOfflineSigner || !window?.keplr) {
        throw new Error("Please install keplr extension");
      } else {
        if (window?.keplr?.experimentalSuggestChain) {
          await window.keplr.experimentalSuggestChain({
            rpc: "https://sentry1.gcp-uscentral1.cudos.org:26657",
            rest: "http://35.232.27.92:1317",
            chainName: "CudosTestnet-Public",
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

      // You should request Keplr to enable the wallet.
      // This method will ask the user whether or not to allow access if they haven't visited this website.
      // Also, it will request user to unlock the wallet if the wallet is locked.
      // If you don't request enabling before usage, there is no guarantee that other methods will work.
      if (!window?.keplr) throw new Error("Unable to connect with Keplr");
      await window.keplr.enable(chainId);

      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const clonedacc = [...accounts];
      setAccount(clonedacc[0].address);
      setProvider(
        await SigningStargateClient.connectWithSigner(
          "https://sentry1.gcp-uscentral1.cudos.org:26657",
          offlineSigner,
          {
            prefix: "cudos",
          }
        )
      );
      setCosmwasmProvider(
        await SigningCosmWasmClient.connectWithSigner(
          "https://sentry1.gcp-uscentral1.cudos.org:26657",
          offlineSigner,
          {
            prefix: "cudos",
          }
        )
      );
      const tm = await Tendermint34Client.connect(
        "https://sentry1.gcp-uscentral1.cudos.org:26657"
      );
      setQueryClient(new QueryClient(tm));
    } catch (err) {
      toast.error(err?.message, {
        position: "top-right",
        toastId: "error_toast",
      });
      setIsError(err?.message);
    }
  };
  useEffect(() => {
    if (!!account && !!provider) return;
    connectWallet();
  }, [provider, account]);
  return {
    provider,
    account,
    connectWallet,
    isError,
    queryClient,
    cosmwasmProvider,
  };
};
