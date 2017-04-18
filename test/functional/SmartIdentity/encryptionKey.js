/**
  * The purpose of this test contract is to test the functions in SmartIdentity.sol
  * that alter the encryption public key.
  */

var SmartIdentity = artifacts.require("SmartIdentity");

contract('SmartIdentity', function(accounts) {

    var smartIdentity,
        owner,
        thirdparty,
        publicEncryptionKey,
        newPublicEncryptionKey;

    before("Setup the Smart Identity contract and hydrate the required variables", function(done) {
        owner = accounts[0];
        thirdparty = accounts[1];

        SmartIdentity.new({from: owner})
        .then(function(response) {
            smartIdentity = response;
            done();
        });

        return smartIdentity,
        owner,
        thirdparty;
    });

    publicEncryptionKey = "Example Public Key 1";
    newPublicEncryptionKey = "Example Public Key 2";

    describe("Encryption Public Key tests", function() {

        it("will set encryption public key as the owner", function() {
            return smartIdentity.setEncryptionPublicKey(publicEncryptionKey, {from: owner})
            .then(function(response) {
                var newEncryptKeyStatus = response.logs[0].args.status;
                assert.equal(3, newEncryptKeyStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's encryption public key was set successfully", function() {
            return smartIdentity.encryptionPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, publicEncryptionKey, "encryptionPublicKey doesn't exist");
            });
        });

        it("will update the encryption public key as the owner", function() {
            return smartIdentity.setEncryptionPublicKey(newPublicEncryptionKey, {from: owner})
            .then(function(response) {
                var newEncryptKeyStatus = response.logs[0].args.status;
                assert.equal(3, newEncryptKeyStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's encryption public key has been changed", function() {
            return smartIdentity.encryptionPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, newPublicEncryptionKey, "encryptionPublicKey has not been changed");
            });
        });

        it("will not allow a third party to modify the owner's encryption public key", function() {
            return smartIdentity.setEncryptionPublicKey(publicEncryptionKey, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, 'Expected error has not been caught');
            });
        });

        it("will confirm that the owner's encryption public key has not been changed by the third party", function() {
            return smartIdentity.encryptionPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, newPublicEncryptionKey, "encryptionPublicKey has been changed");
            });
        });

        it("will allow a third party to read the owner's encryption public key", function() {
            return smartIdentity.encryptionPublicKey.call({from: thirdparty})
            .then(function(response) {
                assert.equal(response, newPublicEncryptionKey, "encryptionPublicKey has not been changed");
            });
        });

    });
});
