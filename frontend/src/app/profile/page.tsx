"use client";

import { useEffect, useState } from "react";
import Web3 from "web3";
import CarDealerContract from "../../../../smart_contract/client/src/contracts/CarDealer.json";
import { useWeb3 } from "@/utils/web3";
import CarCard from "@/components/CarCard";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

type ICars = {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  distanceDriven: string;
  fuelType: string;
  condition: string;
  location: string;
  typeOfGear: string;
  year: string;
};

export default function Profile() {
  const [carsForSale, setCarsForSale] = useState<ICars[]>([]);
  const [carsBought, setCarsBought] = useState<ICars[]>([]);
  const { account, contract, connectWallet } = useWeb3();

  useEffect(() => {
    if (!contract) connectWallet();
  }, [contract]);

  const fetchCarsForSale = async () => {
    try {
      if (window.ethereum) {
        const contract = new web3.eth.Contract(CarDealerContract.abi, contractAddress);

        const cars = (await contract.methods.getOwnedCars().call({ from: account })) as ICars[];
        setCarsForSale(cars);
      }
    } catch (error) {
      console.error("Error fetching cars for sale:", error);
    }
  };

  const fetchCarsBought = async () => {
    try {
      if (window.ethereum) {
        const contract = new web3.eth.Contract(CarDealerContract.abi, contractAddress);

        const cars = (await contract.methods.getBoughtCars().call({ from: account })) as ICars[];
        setCarsBought(cars);
      }
    } catch (error) {
      console.error("Error fetching bought cars:", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchCarsForSale();
      fetchCarsBought();
    }
  }, [account]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full pt-5 gap-10">
      <div>
        <h2 className="text-center text-3xl font-bold mb-5">Cars put up for sale</h2>
        {carsForSale.length ? (
          <div className="flex flex-wrap gap-8 justify-center">
            {carsForSale.map((car) => (
              <CarCard
                key={car.id}
                car={car}
              />
            ))}
          </div>
        ) : (
          <h2 className="text-center text-2xl">You have not put up any cars for sale yet</h2>
        )}
      </div>
      <div>
        <h2 className="text-center text-3xl font-bold mb-5">Cars you bought</h2>
        {carsBought.length ? (
          <div className="flex flex-wrap gap-8 justify-center">
            {carsBought.map((car) => (
              <CarCard
                key={car.id}
                car={car}
              />
            ))}
          </div>
        ) : (
          <h2 className="text-center text-2xl">You have not bought any cars yet</h2>
        )}
      </div>
    </div>
  );
}
