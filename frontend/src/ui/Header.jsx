import { useContractContext } from "../context/ContractProvider";
import Button from "./Button";

function Header() {
  const { address, connect, metamaskConfig, disconnect } = useContractContext();

  return (
    <div className="flex items-center justify-between px-8 py-4">
      {address ? (
        <>
          <p className="text-sm text-slate-400 italic">
            <span className="font-bold text-lg text-blue-400 not-italic">Connected as </span>
            {address}
          </p>
          <Button onClick={disconnect}>Disconnect</Button>
        </>
      ) : (
        <>
          <p className=" text-xl"></p>
          <Button
            onClick={async () => {
              const wallet = await connect(metamaskConfig);
              console.log("connected to ", wallet);
            }}
          >
            Connect
          </Button>
        </>
      )}
    </div>
  );
}

export default Header;
