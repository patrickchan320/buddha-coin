pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract BiddingFeeAuction {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;
    StandardToken public token;

    // Address where Bid is collected
    address public wallet;
    // map username to contributor
    mapping(bytes32 => Contributor) userNameContributorMap;
    // map address to contributor
    mapping(address => Contributor) addressContributorMap;

    // game end timestamp in seconds
    uint32 endTime;

    // max duration from now to endTime (1 day)
    uint32 constant timerCap=24*60*60;

    // timer extension per bid
    uint32 constant timeIncrement=60*5;

    address lastBidder=address(0x0);

    // contributor attributes
    struct Contributor{
        address wallet;
        bytes32 username;
        uint32 referral;
    }

    // event emitted when user
    event BidEvent(
        bytes32 username,
        uint256 timestamp
    );

    function BiddingFeeAuction(address _tokenContract){
        token=ERC20(_tokenContract);
    }

    /**
        allows user to spend Bid to extend time
    **/
    function bid() returns (bool success){
        require(!isGameEnded());
        require(token.balanceOf(msg.sender)>0);

        require(token.transferFrom(msg.sender,this,1));

        uint32 maxTime=block.timestamp+timerCap;
        endTime+= timeIncrement;
        if(endTime>maxTime){
            endTime=maxTime;
        }
        lastBidder=msg.sender;
        return true;
    }

    function register(bytes32 username, bytes32 referrer) returns (bool success){
        require(userNameContributorMap[username].wallet==address(0x0));
        require(addressContributorMap[msg.sender].wallet==address(0x0));

        userNameContributorMap[username]=Contributor(msg.sender,username,0);
        addressContributorMap[msg.sender]=userNameContributorMap[username];
        if(userNameContributorMap[referrer].wallet!=address(0x0)){
            userNameContributorMap[referrer].referral=1+userNameContributorMap[referrer].referral;
        }
        return true;
    }

    function getLastBidder() returns(bytes32 username){
        require(lastBidder!=address(0x0));
        return addressContributorMap[lastBidder].username;
    }

    function isGameEnded() returns (bool ended){
        return block.timestamp>endTime;
    }

    function getEndTime() returns (uint32 endTime){
        return endTime;
    }

    function win() returns (bool gameOver){
        require(block.timestamp>endTime);
        require(lastBidder!=address(0x0));
        require(token.balanceOf(this)>0);
        token.transferFrom(this, lastBidder,token.balanceOf(this));
        return true;
    }
}