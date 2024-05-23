import { useContractRead } from "@thirdweb-dev/react";
import { useContractContext } from "../context/ContractProvider";
import { ethers } from "ethers";
import Button from "./Button";
import { useMarketplaceContext } from "../context/MarketplaceProvider";

// eslint-disable-next-line react/prop-types
function Token({ campaignId }) {
  const { contract, address, getCampaign } = useContractContext();
  const { sellToken } = useMarketplaceContext();
  const { data, isLoading, error } = useContractRead(contract, "checkTokenBalance", [
    campaignId,
    address,
  ]);
  const campaign = getCampaign(campaignId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  console.log(data);

  if (Number(data._hex) === 0) return null;

  const tokenAmount = Math.floor(ethers.utils.formatUnits(data, 18));

  console.log(campaign.tokenAddress);

  return (
    <div className="flex flex-col w-[45%] bg-slate-950 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-xl">{campaign.title}</p>
          <p>
            {tokenAmount}
            <span className="text-slate-400">{campaign.tokenSymbol || "tokens"}</span>
          </p>
        </div>
        <Button onClick={() => sellToken(campaign.tokenAddress, tokenAmount, 0.001)}>Sell</Button>
      </div>
    </div>
  );
}

export default Token;
