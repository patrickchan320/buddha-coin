pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract BiddingFeeAuction {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;
    ERC20 public token;

    // Address where Bid is collected
    address public wallet;

    event BidEvent(
        address indexed bidder,
        uint256 timestamp
    );


    /**
    allows user to spend Bid to extend time
    **/
    function bid() public {

    }
}