"use client";

import { useWeb3 } from "@/utils/web3";
import Link from "next/link";
import { useEffect, useState } from "react";
import Web3 from "web3";
import CarDealerContract from "../../../smart_contract/client/src/contracts/CarDealer.json";
import { Button } from "@/components/ui/button";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function Home() {
  const { contract, account, connectWallet } = useWeb3();

  useEffect(() => {
    if (!contract) connectWallet();
  }, [contract]);

  return (
    <div className="flex justify-center items-center p-5 text-center gap-5 h-full">
      <div>
        <h1 className="mb-5 text-5xl font-bold">Welcome to the Decentralized Car Dealer Platform</h1>
        {account ? (
          <div>
            <p className="mb-5 text-2xl">Account {account} is connected</p>
            <p className="mb-5 text-2xl">Begin your journey now!</p>
            <div className="flex gap-5 justify-center items-center">
              <Link href="/cars">
                <Button>Buy a Car</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary">Sell your Car</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p>Connect your wallet now to buy a car</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        )}
      </div>
    </div>
  );
}
