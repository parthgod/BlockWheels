import Image from "next/image";
import Link from "next/link";
import Web3 from "web3";

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

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const CarCard = ({ car }: { car: ICars }) => {
  return (
    <Link href={`/cars/${car.id}`}>
      <Image
        src={car.imageUrl}
        alt={car.name}
        width={300}
        height={200}
      />
      <div className="flex justify-between items-center">
        <h3>{car.name}</h3>
        <p>{web3.utils.fromWei(car.price, "ether")} ETH</p>
      </div>
    </Link>
  );
};

export default CarCard;
