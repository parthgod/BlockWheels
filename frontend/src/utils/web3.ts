import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CarDealerABI from "../../../smart_contract/client/src/contracts/CarDealer.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export function useWeb3() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<any>(null);

  async function connectWallet() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newProvider = new ethers.providers.Web3Provider(connection);
    const signer = newProvider.getSigner();
    const address = await signer.getAddress();

    const carRentalContract = new ethers.Contract(contractAddress, CarDealerABI.abi, signer);

    setProvider(newProvider);
    setAccount(address);
    setContract(carRentalContract);
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  return { provider, account, contract, connectWallet };
}
