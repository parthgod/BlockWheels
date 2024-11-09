"use client";

import { useEffect, useState } from "react";
import Web3 from "web3";
import CarDealerContract from "../../../../smart_contract/client/src/contracts/CarDealer.json";
import { useWeb3 } from "@/utils/web3";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/FileUploader";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const formSchema = z.object({
  carName: z.string().min(2),
  buyPrice: z.string().min(1),
  imgUrl: z.string().min(1),
  distanceDriven: z.string().min(1),
  fuelType: z.string().min(1),
  condition: z.string().min(1),
  location: z.string().min(1),
  typeOfGear: z.string().min(1),
  year: z.string().min(1),
});

export default function Register() {
  const router = useRouter();

  const { account, contract, connectWallet } = useWeb3();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carName: "",
      buyPrice: "",
      imgUrl: "",
      distanceDriven: "",
      fuelType: "",
      condition: "",
      location: "",
      typeOfGear: "",
      year: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let uploadedImageUrl = values.imgUrl;

    try {
      if (window.ethereum) {
        await contract.registerCar(
          values.carName,
          web3.utils.toWei(values.buyPrice, "ether"),
          uploadedImageUrl,
          values.distanceDriven,
          values.condition,
          values.location,
          values.typeOfGear,
          values.fuelType,
          values.year,
          {
            from: account,
          }
        );
        toast.success("Car registered successfully!");
        router.push("/profile");
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error registering car:", error);
    }
  }

  useEffect(() => {
    if (contract) {
    } else {
      connectWallet();
    }
  }, [contract]);

  return (
    <div className="flex flex-col justify-center items-centers p-5 w-full gap-5">
      <h1 className="text-2xl font-bold text-center">Register your car up for sale</h1>
      <div></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 flex flex-col justify-center items-center gap-5"
        >
          <div className="grid grid-cols-3 gap-5 w-full">
            <FormField
              control={form.control}
              name="carName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name of car"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price of car</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter price of car in ETH"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition of car</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter consition of car (e.g. new, used)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceDriven"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance driven in kms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter total distance car has driven"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year when bought the car</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the year when car was bought"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeOfGear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of gear</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a valid gear type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of fuel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a valid type of fuel used by the car" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="LPG">LPG</SelectItem>
                      <SelectItem value="EV">EV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the location of the car to be picked up once sold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem className="h-fit w-1/3">
                <FormLabel>Image of Car</FormLabel>
                <FormControl>
                  <FileUploader
                    imageUrl={field.value}
                    onFieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
