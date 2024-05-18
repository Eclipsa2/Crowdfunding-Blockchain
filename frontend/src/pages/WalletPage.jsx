import { useContractContext } from "../context/ContractProvider";
import Token from "../ui/Token";

function WalletPage() {
  const { campaigns, isLoading } = useContractContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div>
        <p className="font-bold text-2xl pt-4">My Tokens</p>
      </div>
      <div className="flex flex-wrap w-full justify-center gap-8">
        {campaigns.map((c) => (
          <Token campaignId={c.id} key={c.id} />
        ))}
      </div>
    </>
  );
}

export default WalletPage;
