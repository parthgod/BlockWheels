"use client";

import { useWeb3 } from "@/utils/web3";
import Image from "next/image";
import * as React from "react";
import CarDealerContract from "../../../../../smart_contract/client/src/contracts/CarDealer.json";
import Web3 from "web3";
import { set } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  owner: string;
};

const CarIdPage = ({ params }: { params: any }) => {
  //@ts-ignore
  const { id } = React.use(params);
  const [car, setCar] = React.useState<ICars | null>();
  const [success, setSuccess] = React.useState<boolean>(false);

  const { contract, account, connectWallet } = useWeb3();

  const getCarDetails = async () => {
    try {
      if (window.ethereum) {
        const contract = new web3.eth.Contract(CarDealerContract.abi, contractAddress);

        const car = (await contract.methods.getCarById(id).call()) as ICars;
        if (car) setCar(car);

        console.log(account);
        console.log(car);
      }
    } catch (error) {
      console.error("Error fetching bought cars:", error);
    }
  };

  const buyCar = async (id: number) => {
    try {
      if (window.ethereum) {
        // const contract = new web3.eth.Contract(CarDealerContract.abi, contractAddress);

        await contract.buyCar(id, { from: account, value: car!.price });

        setSuccess(true);
        car!.isAvailable = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success("Car bought successfully! Please note the location to collect your car.");
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error buying car:", error);
    }
  };

  React.useEffect(() => {
    if (account) getCarDetails();
  }, [account]);

  React.useEffect(() => {
    if (!contract) connectWallet();
  }, [contract]);

  if (car)
    return (
      <div className="flex justify-center items-start w-full h-full p-5">
        <div>
          <h1 className="text-2xl font-bold text-center mb-10">Car details</h1>
          {success && (
            <div className="bg-green-200 p-5 rounded-md mb-5 text-center -mt-4">
              <p>Car bought successfully! Please note the location to collect your car.</p>
            </div>
          )}
          <div className="flex flex-col gap-10 p-5 items-center">
            <div>
              <Image
                src={car.imageUrl}
                alt={car.name}
                width={700}
                height={700}
              />
            </div>
            <div className="grid grid-cols-3 gap-5 w-full">
              <div>
                <h3 className="text-gray-400">Name</h3>
                <p className="font-bold">{car.name}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Price</h3>
                <p className="font-bold">{web3.utils.fromWei(car.price, "ether")} ETH</p>
              </div>
              <div>
                <h3 className="text-gray-400">Distance driven</h3>
                <p className="font-bold">{car.distanceDriven}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Fuel type</h3>
                <p className="font-bold">{car.fuelType}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Condition</h3>
                <p className="font-bold">{car.condition}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Type of gear</h3>
                <p className="font-bold">{car.typeOfGear}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Year originally bought</h3>
                <p className="font-bold">{car.year}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-gray-400">Location</h3>
                <p className="font-bold">{car.location}</p>
              </div>
            </div>
          </div>
          {car.isAvailable && (
            <Button
              onClick={() => buyCar(car.id)}
              className="bg-blue-500 text-white p-3 rounded-md w-full mb-10 hover:bg-blue-800"
            >
              Buy Car
            </Button>
          )}
        </div>
      </div>
    );
};

export default CarIdPage;
