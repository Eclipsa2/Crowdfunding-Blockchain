/* eslint-disable react/prop-types */
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { createContext, useContext } from "react";
import { weiToEth } from "../utils/helpers";
import { ethers } from "ethers";

const MarketplaceContext = createContext();

function MarketplaceProvider({ children }) {
  const { contract } = useContract("0x6bD145796E608d1025B8917EE552a2ddef7309bE");

  const { data: dataListings, isLoading, error } = useContractRead(contract, "getAllListings");

  const listings =
    dataListings?.map((listing, i) => ({
      seller: listing.seller,
      tokenAddress: listing.tokenAddress,
      tokenAmount: Number(listing.tokenAmount._hex),
      totalPrice: weiToEth(Number(listing.totalPrice._hex)),
      id: i,
    })) ?? null;

  const sellToken = async (tokenAddress, tokenAmount, totalPrice) => {
    const totalPriceInWei = ethers.utils.parseEther(totalPrice.toString());
    const data = await contract.call("createListing", [tokenAddress, tokenAmount, totalPriceInWei]);
    return data;
  };

  const buyToken = async (listingId, totalPrice) => {
    const value = ethers.utils.parseEther(totalPrice.toString());

    const data = await contract.call("purchaseListing", [listingId], {
      value,
    });
    return data;
  };

  return (
    <MarketplaceContext.Provider value={{ listings, isLoading, error, sellToken, buyToken }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplaceContext = () => {
  return useContext(MarketplaceContext);
};

export default MarketplaceProvider;
