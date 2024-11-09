const CarDealer = artifacts.require("CarDealer");

module.exports = function (deployer) {
  deployer.deploy(CarDealer);
};
