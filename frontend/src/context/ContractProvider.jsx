/* eslint-disable react/prop-types */
import {
  metamaskWallet,
  useAddress,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useDisconnect,
} from "@thirdweb-dev/react";
import { createContext, useContext } from "react";
import { weiToEth } from "../utils/helpers";
import { ethers } from "ethers";

const ContractContext = createContext();

function ContractProvider({ children }) {
  const { contract } = useContract("0x022Cf400257362efF627c1C05a084c8cD63C2c45");

  const { data, isLoading, error } = useContractRead(contract, "getCampaigns");

  const campaigns =
    data?.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: weiToEth(Number(campaign.target._hex)),
      deadline: campaign.deadline.toNumber(),
      amountCollected: weiToEth(Number(campaign.amount_collected._hex)),
      image: campaign.image,
      donators: campaign.donators ? campaign.donators : [],
      id: i,
      tokenAddress: campaign.tokenAddress,
      tokenName: campaign.local_name,
      tokenSymbol: campaign.local_symbol,
    })) ?? null;

  const connect = useConnect();

  const disconnect = useDisconnect();

  const address = useAddress();

  const metamaskConfig = metamaskWallet();

  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");

  const publishCampaign = async (campaign) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          campaign.title, // title
          campaign.description, // description
          campaign.target,
          new Date(campaign.deadline).getTime(), // deadline,
          campaign.image,
          campaign.tokenName,
          campaign.tokenSymbol,
        ],
      });

      console.log("Campaign created successfully", data);
    } catch (error) {
      console.log("Error creating campaign", error);
    }
  };

  function getCampaign(id) {
    console.log(campaigns);
    return campaigns.filter((c) => c.id === id)[0];
  }

  const donate = async (campaignId, amount) => {
    const data = await contract.call("donateToCampaign", [campaignId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDetailsByTokenAddress = async (tokenAddress) => {
    console.log("token address in context: ", tokenAddress);
    const data = await contract.call("getTokenDetailsByTokenID", [tokenAddress]);
    return data;
  };

  return (
    <ContractContext.Provider
      value={{
        contract,
        campaigns,
        isLoading,
        error,
        getCampaign,
        connect,
        disconnect,
        address,
        metamaskConfig,
        publishCampaign,
        donate,
        getDetailsByTokenAddress,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export const useContractContext = () => {
  return useContext(ContractContext);
};

export default ContractProvider;
