var NotarizationDappController = artifacts.require("./NotarizationDappController.sol");

module.exports = function(deployer) {
  deployer.deploy(NotarizationDappController);
};
