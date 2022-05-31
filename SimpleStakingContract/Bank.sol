// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FinalBank {
    // staking tokens
    IERC20 public stakingToken;

    // reward tokens
    IERC20 public rewardsToken;

    // staking amount
    uint256 public totalSupply;

    // personal staking amount
    mapping(address => uint256) public balanceOf;
    
    // lock duration
    uint256 public lockDuration = 10 seconds;

    // pledge info
    struct Deposit {
        uint256 amount;
        uint256 start;
        uint256 end;
    }
    mapping(address => Deposit[]) public depositOf;

    // reward
    uint256 public rewardRate = 1;
    
    mapping(address => uint256) public lastUpdateTime;
    mapping(address => uint256) public rewardOf;

    constructor(IERC20 _stakingToken, IERC20 _rewardsToken) {
        stakingToken = _stakingToken;
        rewardsToken = _rewardsToken;
    }

    // count reward
    function earned() public view returns (uint256) {
        uint256 duration = block.timestamp - lastUpdateTime[msg.sender];
        return balanceOf[msg.sender] * duration * rewardRate + rewardOf[msg.sender];
    }

    // 更新獎勵
    modifier updateReward() {
        rewardOf[msg.sender] = earned();
        lastUpdateTime[msg.sender] = block.timestamp;
        _;
    }

    // fixed deposit
    function deposit(uint256 _amount) external updateReward {
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        totalSupply += _amount;
        balanceOf[msg.sender] += _amount;

        depositOf[msg.sender].push(
            Deposit({
                amount: _amount,
                start: block.timestamp,
                end: block.timestamp + lockDuration
            })
        );
    }

    // release deposit
    function withdraw(uint256 _depositId) external updateReward {
        Deposit[] storage deposits = depositOf[msg.sender];
        uint256 amount = deposits[_depositId].amount;

        require(_depositId < deposits.length, "Deposit ID does not exist");
        require(block.timestamp >= deposits[_depositId].end, "withdraw too soon");

        stakingToken.transfer(msg.sender, amount);
        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;

        // remove deposit
        uint lastOne = deposits.length - 1;
        deposits[_depositId] = deposits[lastOne];
        deposits.pop();
    }

    function getReward() external updateReward {
        uint reward = rewardOf[msg.sender];
        rewardOf[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }
}