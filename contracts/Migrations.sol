pragma solidity ^0.4.2;

/**
 * The Migrations contract is boilerplate code provided by the Truffle IDE that
 * helps deploy contracts to the Ethereum network.
 * This contract stores a number (last_completed_migration) that corresponds to the
 * last applied migration script found in the migrations folder.
 * The numbering convention is x_script_name.ks with x starting at 1.
 * As this contract stores the number of the last deployment script applied,
 * Truffle will not run those scripts again.
 */

contract Migrations {

    address public owner;
    uint public last_completed_migration;

    /**
     * Modifier to check to see if the value of msg.sender is the same as owner.
     * The underscore _ denotes the inclusion of the remainder of the function body
     * to which the modifier is applied
     */
    modifier restricted() {
        if (msg.sender == owner) _;
    }

    /**
     * Constructor of the Migrations contract which assigns owner to the value of msg.sender
     */
    function Migrations() {
        owner = msg.sender;
    }

    /**
     * A function with the signature 'setCompleted(uint)' is required.
     * Uses the restricted modifier to update the last_completed_migration variable
     */
    function setCompleted(uint completed) restricted {
        last_completed_migration = completed;
    }

    /**
     * Function which provides the contract upgrade mechanism.
     * This function takes the address of the new contraxt, creates a handle and
     * calls the setCompleted function on the new contract
     */
    function upgrade(address new_address) restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
