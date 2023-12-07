// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FeeDeposit {
    address public owner;
    uint256 public feePercentage;
    mapping(address => uint256) public userBalances;

    event Deposit(address indexed user, uint256 amountDeposited, uint256 feeAmount);
    event Withdrawal(address indexed user, uint256 amountWithdrawn);

    constructor() {
        owner = msg.sender;
        feePercentage = 25;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        feePercentage = _feePercentage;
    }

    function deposit() external payable {
        require(msg.value > 0, "Amount should be greater than 0");

        uint256 feeAmount = (msg.value * feePercentage) / 1000;
        uint256 amountAfterFee = msg.value - feeAmount;

        userBalances[msg.sender] += amountAfterFee;

        emit Deposit(msg.sender, amountAfterFee, feeAmount);
    }

    function getUserBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount should be greater than 0");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");

        userBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdrawal(msg.sender, amount);
    }

    // Function to withdraw funds from the contract (onlyOwner function)
    function withdrawContractBalance(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    // Function to retrieve the contract's balance (onlyOwner function)
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
