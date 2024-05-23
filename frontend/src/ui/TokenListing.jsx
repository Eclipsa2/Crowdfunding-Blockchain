import { useEffect, useState } from "react";
import { useContractContext } from "../context/ContractProvider";
import Button from "./Button";
import { useMarketplaceContext } from "../context/MarketplaceProvider";

/* eslint-disable react/prop-types */
function TokenListing({ token }) {
  const { tokenAddress } = token;
  console.log(tokenAddress);
  const { getDetailsByTokenAddress } = useContractContext();
  const { buyToken } = useMarketplaceContext();

  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");

  useEffect(
    function () {
      getDetailsByTokenAddress(tokenAddress).then((data) => {
        setTokenName(data[0]);
        setTokenSymbol(data[1]);
      });
    },
    [getDetailsByTokenAddress, tokenAddress]
  );

  return (
    <div className="flex flex-col w-[45%] bg-slate-950 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-xl">{tokenName || "Loading..."}</p>
          <p>
            {token.tokenAmount}
            <span className="text-slate-400">{tokenSymbol || "Loading..."}</span>
          </p>
        </div>
        <Button onClick={() => buyToken(token.id, token.totalPrice)}>
          Buy {token.totalPrice} ETH
        </Button>
      </div>
    </div>
  );
}

export default TokenListing;
