/**
  * Bob has a current account with his bank, but wants to apply for a mortgage.
  *
  * The mortgage department need additional information from Bob to prove he’s employed.
  * Bob’s employer has endorsed his Smart ID.
  * This has been shared with the bank, who can verify his employment status - now and on an ongoing basis.
  *
  */

var SmartIdentity = artifacts.require("SmartIdentity");

contract('SmartIdentity', function(accounts) {

    var bob = {},
        employer = {},
        bank = {},
        employmentAttributeHash,
        endorsementHash;

    before("Setup the scenario", function() {
        bob.address = accounts[0];
        employer.address = accounts[1];
        bank.address = accounts[2];

        employmentAttributeHash = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff';
        endorsementHash = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5';

        return bob,
        employer,
        bank,
        employmentAttributeHash,
        endorsementHash;

    });

    describe("Scenario: Bob has a current account with his bank, but needs to supply additional information to apply for a mortgage.", function() {

        it("Should create an identity for Bob so that he can create employement status attributes", function() {
          var encryptionKey = "test encryption key";

            return SmartIdentity.new({from: bob.address})
            .then(function(data) {
                bob.identity = data.address;
                assert.isOk(data, "Bob's Identity failed to be created");
                return data.setEncryptionPublicKey(encryptionKey, {from: bob.address})
            }).then(function() {
                SmartIdentity.at(bob.identity).then(function(identity){
                    return identity.encryptionPublicKey.call();
                }).then(function(returnedEncryptionKey) {
                    assert.equal(encryptionKey, returnedEncryptionKey, "failed to add key");
                })
            })
        });

        it("Should create an identity for Bob's Employer so they can endorse his employment status", function() {
            return SmartIdentity.new({from: employer.address})
            .then(function(data) {
                employer.identity = data.address;
                assert.isOk(data, "Bob's Employer Identity failed to be created");
            });
        });

        it("Should create an identity for Bob's Bank so they can verify the employment status", function() {
            return SmartIdentity.new({from: bank.address})
            .then(function(data) {
                bank.identity = data.address;
                assert.isOk(data, "Bob's Bank Identity failed to be created");
            });
        });

        it("Should allow Bob to create a new employment status attribute", function() {
            return SmartIdentity.at(bob.identity).addAttribute(employmentAttributeHash, {from: bob.address})
            .then(function(data) {
                assert.isOk(data, 'Employment status attribute failed to be created');
            });
        });

        it("Should allow Bob's Employer to endorse Bob's employment status", function() {
            return SmartIdentity.at(bob.identity).addEndorsement(employmentAttributeHash, endorsementHash, {from: employer.address})
            .then(function(data) {
                assert.isOk(data, "Bob's employment status failed to be endorsed");
            });
        });

        it("Should allow Bob to accept his Employer's endorsement for his employment status", function() {
            return SmartIdentity.at(bob.identity).acceptEndorsement(employmentAttributeHash, endorsementHash, {from: bob.address})
            .then(function(data) {
                assert.isOk(data, "Bob failed to accept the employment endorsement");
            });
        });

        it("Should allow Bob's Bank to check that an endorsement exists for his attribute; verifying his employement status", function() {
            return SmartIdentity.at(bob.identity).checkEndorsementExists.call(employmentAttributeHash, endorsementHash, {from: bank.address})
            .then(function(data) {
                assert.equal(data.valueOf(), true, "Bank failed to find endorsements for Bob's employment status");
            });
        });

    });
});
