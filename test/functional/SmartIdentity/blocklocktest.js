/**
  * The purpose of this test contract is to test the blocklock function in
  * SmartIdentity.sol.
  */

var SmartIdentity = artifacts.require("SmartIdentity");

contract('SmartIdentity', function(accounts) {

    var smartIdentity,
        owner,
        override,
        thirdparty;

    before("Setup the Smart Identity contract and hydrate the required variables", function() {
        owner = accounts[0];
        override = owner;
        thirdparty = accounts[1];

        SmartIdentity.new({from: owner})
        .then(function(data) {
            smartIdentity = data;
        });

        return smartIdentity,
        owner,
        thirdparty;
    });

    describe("Blocklock tests", function() {

        it("will create a new user and immediately set a new owner successfully", function(done) {
            SmartIdentity.new({from: owner})
            .then(function(identity) {
                identity.setOwner(thirdparty, {from: override})
                .then(function(response) {
                    var newOwnerStatus = web3.eth.getTransactionReceipt(response).logs[0].data[65];
                    assert.equal(3, newOwnerStatus, "Transaction returned unexpected status");
                    assert.isOk(response, "Setting new owner failed");
                    done();
                });
            });
        });

        it("will set thirdparty as the new owner by an override user", function(done) {
            smartIdentity.setOwner(thirdparty, {from: override})
            .then(function(response) {
                var newOwnerStatus = web3.eth.getTransactionReceipt(response).logs[0].data[65];
                assert.equal(3, newOwnerStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Setting new owner failed");
                done();
            });
        });

        it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function(done) {
            smartIdentity.setOwner(thirdparty, {from: override})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
                done();
            });
        });

        it("will mine through 20 blocks to simulate the blocklock time passing");
        for (var i = 1; i < 21; i++) {
            it("BLOCK MINING " + i, function() {
                return SmartIdentity.new();
            });
        }

        it("will set the override to a thirdparty owner", function(done) {
            smartIdentity.setOverride(accounts[3], {from: thirdparty})
            .then(function(response) {
                var newOverrideStatus = web3.eth.getTransactionReceipt(response).logs[0].data[65];
                assert.equal(3, newOverrideStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Setting override failed");
                done();
            });
        });

        it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function(done) {
            smartIdentity.setOwner(thirdparty, {from: override})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
                done();
            });
        });

        it("will once again mine through 20 blocks to simulate the blocklock time passing");
        for (var j = 1; j < 21; j++) {
            it("BLOCK MINING " + j, function() {
                return SmartIdentity.new();
            });
        }

        it("will set the new owner back to 'owner' as the new override user", function(done) {
            smartIdentity.setOwner(owner, {from: accounts[3]})
            .then(function(response) {
                var newOwnerStatus = web3.eth.getTransactionReceipt(response).logs[0].data[65];
                assert.equal(3, newOwnerStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Setting new owner failed");
                done();
            });
        });

        it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function(done) {
            smartIdentity.setOwner(thirdparty, {from: override})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
                done();
            });
        });
    });
}, 5000);
