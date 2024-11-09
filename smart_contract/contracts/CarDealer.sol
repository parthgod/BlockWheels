// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarDealer {
    struct Car {
        uint id;
        address owner;
        string name;
        uint price;
        bool isAvailable;
        string imageUrl;
        string distanceDriven;
        string condition;
        string location;
        string typeOfGear;
        string fuelType;
        string year;
    }

    mapping(uint => Car) public cars; // All registered cars
    mapping(address => Car[]) public boughtCars; // Store bought cars for each buyer
    mapping(address => Car[]) public ownedCars; // Store owned cars for each owner
    uint public carCount;

    event CarRegistered(
        uint id,
        string name,
        uint price,
        string imageUrl,
        string distanceDriven,
        string condition,
        string location,
        string typeOfGear,
        string fuelType,
        string year
    );
    event CarBought(uint id, address buyer);
    event CarReturned(uint id);

    function registerCar(
        string memory _name,
        uint _price,
        string memory _imageUrl,
        string memory _distanceDriven,
        string memory _condition,
        string memory _location,
        string memory _typeOfGear,
        string memory _fuelType,
        string memory _year
    ) public {
        carCount++;
        cars[carCount] = Car(
            carCount,
            msg.sender,
            _name,
            _price,
            true,
            _imageUrl,
            _distanceDriven,
            _condition,
            _location,
            _typeOfGear,
            _fuelType,
            _year
        );

        // Track owned cars
        ownedCars[msg.sender].push(cars[carCount]);

        emit CarRegistered(
            carCount,
            _name,
            _price,
            _imageUrl,
            _distanceDriven,
            _condition,
            _location,
            _typeOfGear,
            _fuelType,
            _year
        );
    }

    function buyCar(uint _id) public payable {
        require(cars[_id].isAvailable, "Car not available");

        // Mark the car as unavailable
        cars[_id].isAvailable = false;

        // Add the bought car to the buyer's list of bought cars
        boughtCars[msg.sender].push(cars[_id]);

        // Transfer payment to the seller
        payable(cars[_id].owner).transfer(msg.value);

        // Remove the car from the seller's owned cars
        removeCarFromOwned(cars[_id].owner, _id);

        emit CarBought(_id, msg.sender);
    }

    function removeCarFromOwned(address owner, uint _id) internal {
        Car[] storage owned = ownedCars[owner];
        for (uint i = 0; i < owned.length; i++) {
            if (owned[i].id == _id) {
                // Move the last element into the place to delete
                owned[i] = owned[owned.length - 1];
                owned.pop(); // Remove the last element
                break; // Exit after removing
            }
        }
    }

    function getBoughtCars() public view returns (Car[] memory) {
        return boughtCars[msg.sender]; // Return entire Car objects for bought cars
    }

    function getOwnedCars() public view returns (Car[] memory) {
        return ownedCars[msg.sender]; // Return entire Car objects for owned cars
    }

    function getAvailableCars() public view returns (Car[] memory) {
        Car[] memory availableCars = new Car[](carCount);
        uint count = 0;

        for (uint i = 1; i <= carCount; i++) {
            if (cars[i].owner != msg.sender && cars[i].isAvailable) {
                // Check if not owned by sender and available
                availableCars[count] = cars[i];
                count++;
            }
        }

        // Resize the array to fit the number of available cars
        assembly {
            mstore(availableCars, count)
        }

        return availableCars;
    }

    function getCars() public view returns (Car[] memory) {
        Car[] memory carList = new Car[](carCount);

        for (uint i = 1; i <= carCount; i++) {
            carList[i - 1] = cars[i];
        }

        return carList;
    }

    function getCarById(uint _id) public view returns (Car memory) {
        require(_id > 0 && _id <= carCount, "Invalid car ID");

        return cars[_id]; // Return the specific Car object
    }
}
