//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Exchange is ERC20 {
    IERC20 public token;

    constructor(IERC20 _token) ERC20("Exchange", "EX") {
        token = _token;
    }

    function addLiquidity(
        uint256 minLiquidity,
        uint256 maxTokens,
        uint256 deadline
    ) public payable returns (uint256) {
        uint256 liquidity = totalSupply();
        if (liquidity > 0) {
            uint256 ethReserve = address(this).balance - msg.value;
            uint256 tokenReserve = token.balanceOf(address(this));
            uint256 tokenAmount = (msg.value * tokenReserve) / ethReserve + 1;
            uint256 liquidityMinted = (msg.value * liquidity) / ethReserve;
            require(
                maxTokens >= tokenAmount && liquidityMinted >= minLiquidity,
                "LMT"
            );
            _mint(msg.sender, liquidityMinted);
            token.transferFrom(msg.sender, address(this), tokenAmount);
            return totalSupply();
        } else {
            uint256 initialLiquidity = address(this).balance;
            _mint(msg.sender, initialLiquidity);
            token.transferFrom(msg.sender, address(this), maxTokens);
            return totalSupply();
        }
    }

    function getInputPrice(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) internal pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "LIO");
        uint256 inputAmountWithFee = inputAmount * 997;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 1000) + inputAmountWithFee;

        return numerator / denominator;
    }

    function ethToTokenTransferInput(uint256 minTokens)
        public
        payable
        returns (uint256)
    {
        uint256 ethSold = msg.value;

        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 inputReserve = address(this).balance - ethSold;
        uint256 tokensBought = getInputPrice(
            ethSold,
            inputReserve,
            tokenReserve
        );
        token.transfer(msg.sender, tokensBought);

        require(tokensBought >= minTokens, "LMT");

        return tokensBought;
    }
}