/**
  * The purpose of this test contract is to test the functions in SmartIdentityRegistry.sol.
  */

var SmartIdentityRegistry = artifacts.require("SmartIdentityRegistry");

contract('SmartIdentityRegistry', function(accounts) {

    var registry,
        contractRegistry1,
        contractRegistry2,
        contracthash1,
        contracthash2;

    contracthash1 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5';
    contracthash2 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff';

    before("Setup the Smart Identity registry and hydrate the required variables", function(done) {
        contractRegistry1 = accounts[0];
        contractRegistry2 = accounts[1];

        SmartIdentityRegistry.new({from: contractRegistry1})
        .then(function(response) {
            registry = response;
            done();
        });

        return registry,
        contractRegistry1,
        contractRegistry2;
    });

    describe("SmartIdentityRegistry tests", function() {

        it("will submit a contract into the registry", function() {
            return registry.submitContract(contracthash1, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract submitting failed');
            });
        });

        it("will prove that the registry owner can approve a contract", function() {
            return registry.approveContract(contracthash1, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract approval failed');
            });
        });

        it("will prove that a non-owner cannot approve a contract", function() {
            return registry.approveContract(contracthash1, {from: contractRegistry2})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will prove that the registry owner can reject a contract", function() {
            return registry.rejectContract(contracthash1, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract rejection failed');
            });
        });

        it("will prove that a non-owner cannot reject a contract", function() {
            return registry.rejectContract(contracthash1, {from: contractRegistry2})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will delete a contract from the registry", function() {
            registry.submitContract(contracthash2, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract submitting failed');
            });
            return registry.deleteContract(contracthash2).then(function(response) {
                assert.isOk(response, 'Contract failed to be deleted');
            });
        });

        it("will verify a contract is not valid", function() {
            registry.submitContract(contracthash2, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract submitting failed');
            });
            return registry.isValidContract(contracthash2).then(function(response) {
                assert.isOk(response, 'Failed to verify contract');
            });
        });

        it("will verify a contract is not valid and will throw an error", function() {
            registry.submitContract(contracthash2, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract submitting failed');
            });
            registry.rejectContract(contracthash2, {from: contractRegistry1});
            return registry.isValidContract(contracthash2)
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will verify a contract is valid", function() {
            registry.submitContract(contracthash2, {from: contractRegistry1})
            .then(function(response) {
                assert.isOk(response, 'Contract submitting failed');
            });
            registry.approveContract(contracthash2, {from: contractRegistry1});
            return registry.isValidContract(contracthash2)
            .then(function(response) {
                assert.isOk(response, 'Failed to verify contract');
            });
        });
    });

});
