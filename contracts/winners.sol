// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TokenDistribution is Ownable {
    IERC20 public testToken; // Dağıtılacak token'ın adresi
    address[] public winners; // Kazanan cüzdanların adresleri

    event TokensDistributed(address indexed winner, uint256 amount);

constructor(address _testToken, address initialOwner) Ownable(initialOwner) {
    testToken = IERC20(_testToken);
}
    function addWinner(address _winner) external onlyOwner {
        winners.push(_winner);
    }

    function distributeTokens() external onlyOwner {
        uint256 totalWinners = winners.length;
        require(totalWinners > 0, "No winners to distribute tokens to");

        uint256 totalAmount = testToken.balanceOf(address(this));
        require(totalAmount > 0, "No tokens available for distribution");

        uint256 amountPerWinner = totalAmount / totalWinners;

        for (uint256 i = 0; i < totalWinners; i++) {
            testToken.transfer(winners[i], amountPerWinner);
            emit TokensDistributed(winners[i], amountPerWinner);
        }

        // Clear the winners array after distribution
        delete winners;
    }
}
