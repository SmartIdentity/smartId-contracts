/**
  * The purpose of this test contract is to test the functions in SmartIdentity.sol
  * that use attributes.
  */

var SmartIdentity = artifacts.require("SmartIdentity");

contract('SmartIdentity', function(accounts) {

    var smartIdentity,
        owner,
        endorser,
        thirdparty,
        attributeHash1,
        attributeHash2,
        attributeHash3,
        attributeHash4;

    attributeHash1 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5';
    attributeHash2 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff';
    attributeHash3 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d1A2B';
    attributeHash4 = '0xbc614e0000000000000000000000000000000000000000000000000000000000';

    before("Setup the Smart Identity contract and hydrate the required variables", function(done) {
        owner = accounts[0];
        endorser = accounts[1];
        thirdparty = accounts[2];

        SmartIdentity.new({from: owner})
        .then(function(data) {
            smartIdentity = data;
            done();
        });

        return smartIdentity,
        owner,
        endorser,
        thirdparty;
    });

    describe("Attribute tests", function() {

        it("will add an attribute as the owner, and succeed", function() {
            return smartIdentity.addAttribute(attributeHash1, {from: owner})
            .then(function(response) {
                assert.isOk(response, "Attribute addition failed");
                var addAttributeStatus = response.logs[0].args.status;
                assert.equal(4, addAttributeStatus, "Transaction returned unexpected status");
            });
        });

        it("will confirm that the owner's attribute has been added successfully", function() {
            return smartIdentity.attributes.call(attributeHash1)
            .then(function(response) {
                assert.equal(response.valueOf(), attributeHash1, "Attribute hash does not exist");
            });
        });

        it("will attempt to add an attribute that already exists, and fail", function() {
            return smartIdentity.addAttribute(attributeHash1, {from: owner})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will attempt to add an attribute as a third party, and fail", function() {
            return smartIdentity.addAttribute(attributeHash2, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will confirm that the third party's attribute has not been added", function() {
            return smartIdentity.attributes.call(attributeHash2)
            .then(function(response) {
                assert.equal(response.valueOf(), false, "Attribute has been added");
            });
        });

        it("will attempt to add an attribute as an endorser, and fail", function() {
            return smartIdentity.addAttribute(attributeHash3, {from: endorser})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will confirm that the endorser's attribute has not been added", function() {
            return smartIdentity.attributes.call(attributeHash3)
            .then(function(response) {
                assert.equal(response.valueOf(), false, "Attribute has been added");
            });
        });

        it("will attempt to remove an attribute that doesn't exist, and fail", function() {
            return smartIdentity.removeAttribute(attributeHash2, {from: owner})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will attempt to update an existing attribute as an endorser, and fail", function() {
            var oldAttributeHash = attributeHash1;
            var newAttributeHash = attributeHash3;
            return smartIdentity.updateAttribute(oldAttributeHash, newAttributeHash, {from: endorser})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will confirm that the owner's attribute has not been changed by the endorser", function() {
            return smartIdentity.attributes.call(attributeHash1)
            .then(function(response) {
                assert.equal(response.valueOf(), attributeHash1, "Attribute has been changed");
            });
        });

        it("will attempt to update an existing attribute as a third party, and fail", function() {
            var oldAttributeHash = attributeHash1;
            var newAttributeHash = attributeHash3;
            return smartIdentity.updateAttribute(oldAttributeHash, newAttributeHash, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will confirm that the owner's attribute has not been changed by the third party", function() {
            return smartIdentity.attributes.call(attributeHash1)
            .then(function(response) {
                assert.equal(response.valueOf(), attributeHash1, "Attribute has been changed");
            });
        });

        it("will attempt to remove an attribute as a third party, and fail", function() {
            return smartIdentity.removeAttribute(attributeHash1, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will confirm that the owner's attribute was not removed by the third party", function() {
            return smartIdentity.attributes.call(attributeHash1)
            .then(function(response) {
                assert.equal(response.valueOf(), attributeHash1, "Attribute hash does not exist");
            });
        });

        it("will attempt to remove an attribute as an endorser, and fail", function() {
            return smartIdentity.removeAttribute(attributeHash1, {from: endorser})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will confirm that the owner's attribute was not removed by the endorser", function() {
            return smartIdentity.attributes.call(attributeHash1)
            .then(function(response) {
                assert.equal(response.valueOf(), attributeHash1, "Attribute hash does not exist");
            });
        });

        it("will remove an attribute as an owner, and succeed", function() {
            return smartIdentity.removeAttribute(attributeHash1, {from: owner})
            .then(function(response) {
                var removeAttributeStatus = response.logs[0].args.status;
                assert.equal(3, removeAttributeStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute removal failed");
            });
        });

        it("will confirm that the attribute has been removed by the owner", function() {
            return smartIdentity.attributes.call(attributeHash1)
            .then(function(response) {
                assert.equal(response.valueOf(), false, "Attribute was not removed");
            });
        });

        it("will add a new attribute as the owner, and succeed", function() {
            return smartIdentity.addAttribute(attributeHash4, {from: owner})
            .then(function(response) {
                var addAttributeStatus = response.logs[0].args.status;
                assert.equal(4, addAttributeStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's attribute has been added successfully", function() {
            return smartIdentity.attributes.call(attributeHash4)
            .then(function(response) {
                assert.equal(response.valueOf(), attributeHash4, "Attribute hash does not exist");
            });
        });

        it("will update an existing attribute as the owner, and succeed", function() {
            var oldAttributeHash = attributeHash4;
            var newAttributeHash = "0x154f7ce000000000000000000000000000000000000000000000000000000000";
            return smartIdentity.updateAttribute(oldAttributeHash, newAttributeHash, {from: owner})
            .then(function(response) {
                var debugStatus = response.logs[0].args.status;
                var removeAttributeStatus = response.logs[1].args.status;
                var addAttributeStatus = response.logs[2].args.status;
                var updateAttributeStatus = response.logs[3].args.status;
                assert.equal(5, debugStatus, "Transaction returned unexpected status");
                assert.equal(3, removeAttributeStatus, "Transaction returned unexpected status");
                assert.equal(4, addAttributeStatus, "Transaction returned unexpected status");
                assert.equal(3, updateAttributeStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute update failed");
            });
        });

        it("will confirm that the old attribute has been removed by the owner", function() {
            var oldAttributeHash = attributeHash4;
            return smartIdentity.attributes.call(oldAttributeHash)
            .then(function(response) {
                assert.equal(response.valueOf(), false, "Attribute was not removed");
            });
        });

        it("will confirm that the owner's new attribute has been added successfully", function() {
            var newAttributeHash = "0x154f7ce000000000000000000000000000000000000000000000000000000000";
            return smartIdentity.attributes.call(newAttributeHash)
            .then(function(response) {
                assert.equal(response.valueOf(), newAttributeHash, "Attribute hash does not exist");
            });
        });
    });
}, 6000);
