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

export default function Cars() {
  const [cars, setCars] = useState<ICars[] | null>([]);
  const { account, contract, connectWallet } = useWeb3();

  useEffect(() => {
    if (!contract) connectWallet();
  }, [contract]);

  const fetchCars = async () => {
    try {
      if (window.ethereum) {
        const contract = new web3.eth.Contract(CarDealerContract.abi, contractAddress);

        const carList = await contract.methods.getAvailableCars().call({ from: account });
        console.log(carList);
        setCars(carList!);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    if (account) fetchCars();
  }, [account]);

  return (
    <div className="flex justify-center items-start w-full h-full pt-5">
      <div>
        <h2 className="text-2xl font-bold text-center mb-5">Available Cars for Buying</h2>
        <div className="flex flex-wrap gap-5 justify-center">
          {cars?.length ? (
            cars.map((car) => (
              <CarCard
                car={car}
                key={car.id}
              />
            ))
          ) : (
            <div>
              <h4>No cars available for buying.</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
