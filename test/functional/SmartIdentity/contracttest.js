/**
  * The purpose of this test contract is to test the functions in SmartIdentity.sol
  * that involve altering the ownership of the contract.
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

    describe("Contract tests", function() {

        /**
          * Since the getOwner function can only be executed by the override account, this
          * test implies that if the owner is successfully returned, the override account
          * has been correctly set.
          */
        it("will have an owner with an override account that matches the creator of the contract", function(done) {
            SmartIdentity.new({from: override})
            .then(function(identity) {
                identity.getOwner.call()
                .then(function(response) {
                    assert.equal(response.valueOf(), owner, "owner does not match override");
                    done();
                });
            });
        });

        it("will not allow a non-owner to execute the getOwner function", function(done) {
            SmartIdentity.new({from: thirdparty})
            .then(function(identity) {
                identity.getOwner.call()
                .catch(function(error) {
                    assert.isOk(error, "Expected error has been caught");
                    done();
                });
            });
        });

        it("will attempt to setOwner as a thirdparty user and fail", function(done) {
            smartIdentity.setOwner(thirdparty, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
                done();
            });
        });

        it("will attempt to setOverride as a thirdparty user and fail", function(done) {
            smartIdentity.setOverride(thirdparty, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
                done();
            });
        });

        it("will set thirdparty as the new owner by an override user (override is the owner)", function(done) {
            smartIdentity.setOwner(thirdparty, {from: override})
            .then(function(response) {
                var newOwnerStatus = web3.eth.getTransactionReceipt(response).logs[0].data[65];
                assert.equal(3, newOwnerStatus, "Transaction returned unexpected status");
                assert.isOk(response, 'Error produced by setOwner function');
                done();
            });
        });

        it("will verify that thirdparty is now the contract owner", function(done) {
            smartIdentity.getOwner.call()
            .then(function(response) {
                assert.equal(response.valueOf(), thirdparty, "thirdparty is not the owner");
                done();
            });
        });

        it("will attempt to setOwner back to owner as the thirdparty user and fail as thirdparty is not override user", function(done) {
            smartIdentity.setOwner(owner, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
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

        it("will create a new contract then set override to a thirdparty user", function(done) {
            SmartIdentity.new({from: owner})
            .then(function(identity) {
                identity.setOverride(thirdparty, {from: override})
                .then(function(response) {
                    var newOverrideStatus = web3.eth.getTransactionReceipt(response).logs[0].data[65];
                    assert.equal(3, newOverrideStatus, "Transaction returned unexpected status");
                    assert.isOk(response, "Expected error has not been caught");
                    done();
                });
            });
        });

        /**
          * Since 0.4.4, it may be preferable to change the contract to have a disabled
          * state, that also allows for the 'identity' to be migrated to a new address.
          */
        it("will kill the contract as the owner", function(done) {
            smartIdentity.kill({from: thirdparty}).then(function() {
                assert.equal(0, web3.eth.getBalance(smartIdentity.address).valueOf(), "Hmm, money still abounds.");
                done();
            });
        });
    });
}, 5000);
