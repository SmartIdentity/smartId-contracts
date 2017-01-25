module.exports = function(deployer) {
  deployer.deploy(SmartIdentity);
  deployer.autolink();
};
