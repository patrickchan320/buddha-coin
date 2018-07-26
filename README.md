# Deployment

Deploy Incense.sol at "address_of_inc"
Deploy BiddingFeeAuction.sol of "address_of_bfa"

Call constructor of BFA with address_of_inc

Call address_of_inc.mint(address_of_bfa, 282e10)
Call address_of_inc.finishMinting()

# Bidding

Call address_of_inc.increaseApproval(address_of_bfa, 1)
Call address_of_bfa.bid()

#Winning INC

Call address_of_bfa.win()

#Withdrawing ETH
Call address_of_inc.withdraw()
