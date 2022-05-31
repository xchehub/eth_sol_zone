// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingToken is ERC20 {
    constructor() ERC20("Staking Token", "ST") {}

    // 1 wei -> 1 coin
    function mint() external payable {
        _mint(msg.sender, msg.value);
    }
}

contract RewardsToken is ERC20 {
    constructor() ERC20("Rewards Token", "ST") {
        _mint(msg.sender, 100 * 1e18);
    }
}