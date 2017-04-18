/**
  * The purpose of this test contract is to test the functions in SmartIdentity.sol
  * that alter the signing public key.
  */

var SmartIdentity = artifacts.require("SmartIdentity");

contract('SmartIdentity', function(accounts) {

    var smartIdentity,
        owner,
        thirdparty,
        publicSigningKey,
        newPublicSigningKey;

    before("Setup the smart identity and hydrate the required variables", function(done) {
        owner = accounts[0];
        thirdparty = accounts[1];

        SmartIdentity.new({from: owner})
        .then(function(data) {
            smartIdentity = data;
            done();
        });

        return smartIdentity,
        owner,
        thirdparty;
    });

    publicSigningKey = "Signing Public Key 1";
    newPublicSigningKey = "Signing Public Key 2";

    describe("Signing Public Key tests", function() {

        it("will set signing public key as the owner", function() {
            return smartIdentity.setSigningPublicKey(publicSigningKey, {from: owner})
            .then(function(response) {
                var newSigningKeyStatus = response.logs[0].args.status;
                assert.equal(3, newSigningKeyStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's signing public key was set successfully", function() {
            return smartIdentity.signingPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, publicSigningKey, "signingPublicKey doesn't exist");
            });
        });

        it("will update the signing public key as the owner", function() {
            return smartIdentity.setSigningPublicKey(newPublicSigningKey, {from: owner})
            .then(function(response) {
                var newSigningKeyStatus = response.logs[0].args.status;
                assert.equal(3, newSigningKeyStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's signing public key has been changed", function() {
            return smartIdentity.signingPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, newPublicSigningKey, "signingPublicKey has not been changed");
            });
        });

        it("will not allow a third party to modify the owner's signing public key", function() {
            return smartIdentity.setSigningPublicKey(publicSigningKey, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, 'Expected error has not been caught');
            });
        });

        it("will confirm that the owner's signing public key has not been changed by the third party", function() {
            return smartIdentity.signingPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, newPublicSigningKey, "signingPublicKey has been changed");
            });
        });

        it("will allow a third party to read the owner's signing public key", function() {
            return smartIdentity.signingPublicKey.call({from: thirdparty})
            .then(function(response) {
                assert.equal(response, newPublicSigningKey, "signingPublicKey has not been changed");
            });
        });

    });
});
