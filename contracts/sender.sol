// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenDistribution is Ownable {
    IERC20 public testToken; 
    address[] public winners; 
    bool public distributionCompleted;

    event TokensDistributed(address indexed winner, uint256 amount);

    modifier distributionNotCompleted() {
        require(!distributionCompleted, "Distribution has already been completed");
        _;
    }

    constructor(address _testToken) {
        testToken = IERC20(_testToken);
        distributionCompleted = false;
    }

    function addWinner(address _winner) external onlyOwner distributionNotCompleted {
        winners.push(_winner);
    }

    function distributeTokens() external onlyOwner distributionNotCompleted {
        uint256 totalWinners = winners.length;
        require(totalWinners > 0, "No winners to distribute tokens to");

        uint256 totalAmount = testToken.balanceOf(address(this));
        require(totalAmount > 0, "No tokens available for distribution");

        uint256 amountPerWinner = totalAmount / totalWinners;

        for (uint256 i = 0; i < totalWinners; i++) {
            testToken.transfer(winners[i], amountPerWinner);
            emit TokensDistributed(winners[i], amountPerWinner);
        }

        distributionCompleted = true;
        
        delete winners;
    }
}
