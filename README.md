# Smart Identity

[![Build Status](https://travis-ci.org/SmartIdentity/smartId-contracts.svg?branch=develop)](https://travis-ci.org/SmartIdentity/smartId-contracts)

## Table of Contents

- [What is Smart Identity?](#what-is-smart-identity)
- [Getting Started](#getting-started)
- [Community / Forum / Contact](#community--forum--contact)
- [Our Vision](#the-vision)
- [Overview](#overview)
- [Licensing](#licensing)
- [Contributions](#contributions)
- [How to contribute](#how-to-contribute)
- [Use Cases](#use-cases)
- [Disclaimer](#disclaimer)

## What is Smart Identity?

Today, Smart Identity uses the Ethereum blockchain to represent an identity using a smart contract, attributes can be added by the identity owner and are stored in hash form. Attributes can be endorsed by any user, this is done by storing a corresponding endorsement hash against the attribute hash. Endorsements are revocable and are considered current if not revoked.

To verify underlying attribute and endorsement data, corresponding hashes must be computed, and their presence verified within the corresponding identity contract.

Attributes and endorsements are formed of field sets, merkle-root hashes are used to allow sharing and verification of partial data (such as date of birth within a driving license).

Smart ID is a platform that uses Ethereum and solidity smart contracts as a framework for its core protocol. A spring boot java application has been implemented to showcase how the protocol works and acts as an interface to the blockchain. Initial smart contracts written have been written in Solidity to the Solidity 0.4 specification. [http://solidity.readthedocs.io/en/develop/](http://solidity.readthedocs.io/en/develop/).

## Prerequisites
  * [Node.js 6.9](https://nodejs.org)
  * [Python 2.7](https://www.python.org/download/releases/2.7/)
  * Command Line Tools
   * **Mac OS X**: [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`) and `brew install libgcrypt`
   * **Ubuntu / Linux**: `sudo apt-get install build-essential python-software-properties libssl-dev`

## Getting Started

### Setting up the dev environment

```bash
# Get the latest snapshot
#https
git clone https://github.com/SmartIdentity/smartId-contracts.git
#ssh
git clone git@github.com:SmartIdentity/smartId-contracts.git

# Change directory
cd smartId-contracts/

# Install NPM dependencies
npm install

```

In a separate terminal run:

```
./node_modules/.bin/testrpc 
```
to spin up a test blockchain (it doesn't mine, just runs and parses the commands sent to it).

It listens on the default RPC interface of localhost:8085, so you could also run against geth, or any other web3 enabled RPC.

Testrpc is designed to provide fast feedback, without rinsing your processor.

You can then execute the following functions:

  * `truffle compile` - checks that the contracts compile and there are no errors.  Run this to setup the contract before `truffle console`.
  * `truffle console` - spins up an interactive shell to interrogate the blockchain
  * `truffle test` - runs the unit tests in against testrpc


## The Vision

The vision for Smart Identity is to enable a universal platform for identity representation and verification, enabling people, organisations, IoT devices, Dapps, or anything else, to obtain, use and verify identity information with minimal reliance on centrally provided systems or services.

Such an outcome offers considerable social and economic advantage; in developing economies the ability to obtain credible identity offers value outright, whilst in developed economies the vision addresses higher-order efficiency and user experience imperatives by standardising the technical framework within which any identity artefact can be represented, shared and verified.

Beyond traditional identity data, a Smart ID is intended to serve as a container (wallet) for digital assets owned by an identity, for contracts an identity is party to, and as a controller to identity linked Dapps. 

To offer global utility, Smart Identity should:

* Operate over resilient, widely accessible decentralised infrastructure, reducing risks of failure, compromise or imposed cost associated with centrally provided platforms
* Provide a high degree of default user privacy and security
* Operate at very low cost

## Community / Forum / Contact

* [Solidity Gitter Channel](https://gitter.im/ethereum/solidity) for tech issues/discussion around solidity.
* [LinkedIn Group](https://www.linkedin.com/groups/8585249) for professional chat on use cases and/or anything else.
* [Deloitte Smart ID website](http://www.deloitte.co.uk/smartid) for Deloitte announcements relating to Smart ID
* Or contact a member of the Deloitte Smart ID team via email: blockchain@deloitte.co.uk

## Overview

### The Smart Identity structure: Smart Contracts, Attributes and Endorsements

The Smart Identity construct uses an attribute-endorsement model enabled by the use of smart contracts which provide rudimentary role based permissions. An identity-owner can attest that an 'attribute' is a correct representation of a part of their identity (by storing a corresponding hash value within their identity), following which third parties are able to attest to the validity of each attribute (by storing a corresponding hash value against the attribute within the identity)

#### Smart Contracts

##### Smart IDentity.sol

This is the Smart Identity contract as used by the Smart Identity instance.  It describes the core functionality required as part of a Smart Identity contracts with encryption keys, attributes & endorsements. 

A Smart ID is an [Ethereum](https://www.ethereum.org/) Smart Contract address. The smart contract must be constructed using valid Smart ID bytecode. It provides access to identity management commands and stores hash representations of identity data.

The Smart Contract has a constructor that defines the owner and core elements of the identity:

* Contract address - a 32byte hash of the address at which the contract is deployed.
* Encryption key - a changeable encryption (public) key that allows other actors to send data for encrypted receipt and decryption by this identity. This can be changed at any point.
* Signing key - a changeable encryption (public) key that allows other actors to verify Endorsements signed by this identity.
* Attribute mapping - A mapping that stores the Attributes (and associated Endorsements) related to the contract/identity.
* It also implements a kill function so that an identity can be retired (though the record of it's 'active' period is of course retained in the blockchain).

#### Smart IDentityRegistry.sol

This contract holds a curated list of valid contracts that Deloitte (or any other registrar, there are no barriers to entry) have approved as valid implementations of Smart Identity. These are curated by hashing the bytecode of a known good contract.  This should be maintained as a list on the Blockchain so that other contracts can perform (optional) real-time verification that a contract is present on this list, and therefore a valid smart identity.  There may be multiple statuses on this registry (initially Pending / Accepted / Rejected) so that the contracts can be better maintained. 

### Attributes

An Attribute is a specific instance of an attribute template which has been populated and (the corresponding hash) stored within a Smart ID.

If verification of attribute field subsets is required, for instance to use a digital driving license in order to prove age but not disclose address, the attribute hash should be the merkle root of the attribute field set (with appropriate salt or RND values applied at the leaf node level to prevent reverse engineering of leaf node hash values).

**The attribute hash corresponds to an attribute record stored off-chain, which consists of at least:**

* AttributeHash
* AttributeId (attribute template identifier)
* Attribute field set

Attribute creation/update/removal transactions can only be submitted by the identity owner.

### Endorsements

An endorsement is a notarised record of attestation by a third party in relation to a specified attribute, stored with the attribute within the identity contract. Our initial implementation uses a single endorsement template. The definition of what 'endorsement' means for a given attribute can also be varied within the underlying attribute definition to provide some flexibility.

Receivers/consumers of identity data may (should) privately manage the Endorser identities they are prepared to trust. 

**The endorsement hash corresponds to an endorsement record stored off-chain, which consists of at least:**

  * Endorsement Hash
  * Endorsee Address (Smart ID)
  * Endorsed Attribute Hash
  * Endorsement Expiry Date
  * Endorser Address (Smart ID)
  * Endorser signature of endorsement

Whilst attributes can only be added by an identity owner, endorsements must be added anonymously from previously unused ethereum public keys. This is to preserve privacy and prevent unwanted identification of an endorsing party. This will also allow endorsements to be created 'off chain', and added in by the owner themselves, providing the signature of the endorsement can be verified against an on-chain Identity. The unrestricted ability to add endorsements presents a risk of spam or unwanted endorsements, for which there are a number of potential solutions, and for which future protocol updates may be introduced.

### Value of the identity / attribute / endorsement model

Given that an attribute has been endorsed by a trusted third party, the weight of that endorsement is what adds value to the attribute. An attribute without endorsement requires complete trust in the identity. For the benefit of the ecosystem, each time a user chooses to trust such an attribute, they should endorse the fact that they trust it.

The challenge lies in providing the transparency of endorsement types, if not endorsement people. For example, if I simply endorse a driving licence for the purpose of identifying a person qualfies for entry into a nightclub, then that same endorsement should hold far less weight on whether a person is entititled to drive. To that end I should only endorse the attributes of the driving licence that I have relied upon for my judgement, and rarely the document as a whole.

### Attribute Templates

An Attribute Template can describe either a single field, or collection of fields representing a logical set of identity data.

Attribute templates are created and stored within the Smart Identity application instance (see Admin Microservice below).

The model for templates should follow that of jsonschemaform - whereby the definition of the form is kept in the attribute.

Whilst bespoke attribute templates can be configured for any purpose (consider an attribute template as a data collection form which facilitates personal data notarisation), it is expected that common attributes (e.g. driving license) will be standardised and endorsable, and in time repositories of common templates will be curated and shared for common reference.

## Wider architecture

The distributed ledger and identity smart contract form just one layer in the Smart Identity ecosystem, outside of this layer, numerous applications support the various off-chain storage and processing tasks needed during interaction with the blockchain. Operators are free to use alternative components, however Deloitte have developed a reference application formed of various capability microservices, and have begun a process of porting these into the opensource repository, components include:

  * Core application and blockchain interface
  * Application and User (data vault) databases
  * Administration functions such as attribute template creation
  * Core user actions (create identity, add/update/remove attributes, add/update/remove endorsements)
  * Attribute/Endorsement sharing and verification services
  * Web user interface providing user access to core application features

## Licensing

This code is released under the Apache v2 open source licence.

## Contributions

We've launched the core Smart Contracts of SmartIDentity to allow third parties to start coming up with their own implementations of Smart Identity.

Please help by coming up with ways in which you could implement Smart Identity, share your ideas with us on the issues tab (first check the [Use Cases](#use-cases) list below in case we have already added it), and help us make sure that the solidity code is secure.

We've created two use cases in the test/scenario/ folder, to give an example of how Smart Identity could be used.
Please add in some example tests of your own that either help support Smart Identity, or that come up with use cases that we need to think about further.

Direct your questions to the GitHub issue tracker, and we will endeavour to respond.

## How to contribute

**Understand the vision. Review and experiment with the code. Contribute to the design and build process.**

We encourage all contributors and welcome all constructive input. By opening the project we reduce the barriers to access, and expose it to an exponentially expanding pool of rich and diverse brainpower; we do this to attract an open and collaborative community intended to validate, inform and accelerate the further development, testing and hardening of core components, and ultimately to build momentum for widespread adoption.

To contribute, please follow the process outlined below.

1. Create an issue in Github.
2. Anyone can review and comment on the issue, and a member of the Smart ID team will advise / recommend next steps. If the team is already working on a similar issue we will let you know and close the issue to prevent the issue board from clogging up.
3. If you wish to complete the development work on an issue please start development. Please note, to contribute to the Smart Identity code base, you will need to agree to the contributors license agreement (below - for more info contact blockchain@deloitte.co.uk).
4. If you do not wish to do the development work, please leave the ticket open for one of the Smart ID team or another contributor from the Open Source community to pick up and complete.
5. Create a PR once you have finished development - Please include tests and any relevant documentation.
6. The PR will be reviewed by the Smart ID team.
7. If approved the PR will be merged into our repo.

[Contributor License Agreement](CONTRIBUTING.md)

## Use Cases

This is a non-exhaustive list of example use cases for Smart Identity. Distributed identity is a powerful enabler for many digital services and so we expect that more use cases will come up as the Smart Identity project progresses.

  * **Identity Management:**

	Our core use case is the provision of an efficient, standardised identity platform to enable automation of complex identity verification processes. Today, customer identity information is duplicated in every organisation a customer touches. Records are poorly integrated, and information is often out of date. This duplication of data leads to friction within processes and duplication of activity. Common activities such as KYC/KYB compliance checks are often repeated both across and within organisations. 

	Smart ID enables an industry-wide transition from disconnected and duplicated customer information records, to widespread integration with a distributed master identity record. Users are able to create an identity profile, and allow trusted users, including institutions, to verify its authenticity. Users can then interact between one another directly, safe in the knowledge that their counterparty is who they say they are.

  * **Travel and International Settlement:**

	Users could transport their digital identity across jurisdictions and use it to easily travel through border checks and gain access to financial and other services in their new place of residence.

  * **Tailored Risk and Insurance Policies:**

	Insurance providers are able to use customer digital identities to more effectively build risk profiles and develop tailored risk-based products.

  * **Asset Ownership:**

	Assets with their own digital identity can be linked to and securely transferred between individual identities with an immutable record of asset ownership. Smart Identity could be used to send, receive and store digital asset tokens representing currency or property.

  * **Licensing, IP and Digital Rights Management:**

	Digital rights (eg. digital media) and intellectual property could be linked to individual or organisational identities. Transfer of ownership, usage terms and royalty payments could all be managed using Smart Identity.

  * **Digital Driving Licences (and other documents):**

	Digital licences could be used to represent a right-to-drive, manage penalties, offences and revocations.

  * **Digital Public Services (and Gov.verify):**

	Individuals could use Smart Identity to validate their right to access digital public services (eg. NHS treatment, welfare, council tax, etc.). Smart Identity could also be integrated as a Gov.verify service to assert your digital identity credentials.

  * **Secure Digital Voting:**

	The right-to-vote could be verified using individual digital identity with the ability to digitally allocate a vote, while reducing the risk of fraudulent voting.

## Disclaimer

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

It has not been exhaustively tested and should be treated as a prototype, not a production-ready application.

Recommended for private or controlled testnet use only at this stage. Use with a public testnet should be controlled to avoid use of real identity data.

