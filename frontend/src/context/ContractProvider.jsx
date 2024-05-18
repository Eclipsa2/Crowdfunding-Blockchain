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

const ContractContext = createContext();

function ContractProvider({ children }) {
  const { contract } = useContract("0xC3ad3309b438a5De5DC2ea4694F92762D8D409DB");

  const { data, isLoading, error } = useContractRead(contract, "getCampaigns");
  const { data: tokens } = useContractRead(contract, "checkTokenBalance");

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
    })) ?? null;

  const connect = useConnect();

  const disconnect = useDisconnect();

  const address = useAddress();

  const metamaskConfig = metamaskWallet();

  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");
  const { mutateAsync: donate } = useContractWrite(contract, "donateToCampaign");

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

  async function donateToCampaign(campaignId) {
    try {
      const data = await donate({
        args: [campaignId],
      });

      console.log("Donated successfully", data);
    } catch (error) {
      console.log("Error donating to campaign", error);
    }
  }

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
        donateToCampaign,
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
