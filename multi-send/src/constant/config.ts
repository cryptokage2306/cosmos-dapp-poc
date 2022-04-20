// export const CONTRACT_ADDRESS = "cudos1v7trdcye9089z8x0v7qkyuvd4wtcnkrtrwmau6";
// export const CONTRACT_ADDRESS = "cudos1gxsqr0qf3ls0k3d4n22yldc4hwtpznnergeeew";
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "";
export const TIC_TAC_CONTRACT_ADDRESS =
  process.env.REACT_APP_TIC_TAC_CONTRACT_ADDRESS || "";
export const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || "";
export const NAME = process.env.REACT_APP_NAME || "";
export const RPC_URL = process.env.REACT_APP_RPC_URL || "";
export const MULTI_SEND = process.env.REACT_APP_MULTI_SEND === "true";
export const NFT_BINDING = process.env.REACT_APP_NFT_BINDING === "true";
export const SHOW_ALL_NFT = process.env.REACT_APP_SHOW_ALL_NFT === "true";
export const SHOW_ALL_NFT_TIC_TAC_INTERFACE =
  process.env.REACT_APP_SHOW_ALL_NFT_TIC_TAC_INTERFACE === "true";
export const GAS_PRICE = "5000000000000acudos";