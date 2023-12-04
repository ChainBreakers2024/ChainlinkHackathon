// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract StockPrediction{
  address public owner;
  uint256 public predictionStartTime;
  uint256 public predictionEndTime;
  int public currentPrice ; // negatif sayıları int ile kullanabilmek için
  mapping(address=>int) public bets;
  address[] public bettors ;
  mapping (address=>uint256) public betAmounts;

  uint256 public lastCheckedTime;
  bool public isBettingActive;
  address public lastWinner;

  struct Bet{
    address bettor;
    int amount ;
  }

  struct BetInfo{
    address bettor;
    int amount ;
    uint256 betAmount;
  }

  constructor ()  {
    owner= msg.sender;
    predictionEndTime = block.timestamp + 5 minutes;
    isBettingActive = false ;
     
  }




function getAllBets() public view returns (BetInfo[] memory) {
  BetInfo[] memory allBets = new BetInfo[](bettors.length);
  for (uint256 i = 0; i < bettors.length; i++) {
    allBets[i].bettor = bettors[i];
    allBets[i].amount = bets[bettors[i]];
    allBets[i].betAmount = betAmounts[bettors[i]];
  }
  return allBets;
}


}

