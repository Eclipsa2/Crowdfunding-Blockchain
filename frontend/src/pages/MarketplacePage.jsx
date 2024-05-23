import { useMarketplaceContext } from "../context/MarketplaceProvider";
import TokenListing from "../ui/TokenListing";

function MarketplacePage() {
  const { listings, isLoading, error } = useMarketplaceContext();
  if (error) return <div>Something went wrong</div>;
  if (isLoading) return <div>Loading...</div>;

  console.log(listings);

  return (
    <>
      <div>
        <p className="font-bold text-2xl pt-4">My Tokens</p>
      </div>
      <div className="flex flex-wrap w-full justify-center gap-8">
        {listings.map((l, i) => i > 0 && <TokenListing token={l} key={l.tokenAddress} />)}
      </div>
    </>
  );
}

export default MarketplacePage;
