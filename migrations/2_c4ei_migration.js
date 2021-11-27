const CeinToken = artifacts.require("CeinToken");
const CeinTicketsFactory = artifacts.require("CeinTicketsFactory");

module.exports = function (deployer) {
  deployer.deploy(CeinToken);
  deployer.deploy(CeinTicketsFactory);
};
