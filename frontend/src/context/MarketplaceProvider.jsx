/* eslint-disable react/prop-types */
import { useContract } from "@thirdweb-dev/react";
import { createContext, useContext } from "react";
import { weiToEth } from "../utils/helpers";

const MarketplaceContext = createContext();

function MarketplaceProvider({ children }) {
  const { contract } = useContract("0xC3ad3309b438a5De5DC2ea4694F92762D8D409DB");

  return <MarketplaceContext.Provider value={{}}>{children}</MarketplaceContext.Provider>;
}

export const useMarketplaceContext = () => {
  return useContext(MarketplaceContext);
};

export default MarketplaceProvider;
