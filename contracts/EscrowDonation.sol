// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EscrowDonation {
    address public owner;
    address payable public campaignOwner;
    uint256 public fundingGoal;
    uint256 public totalDonated;
    bool public goalReached;
    bool public isClosed;
    
    // Platform fee: 0.01 ETH (10000000000000000 wei)
    uint256 public constant PLATFORM_FEE = 0.01 ether;
    
    mapping(address => uint256) public donations;

    event DonationReceived(address indexed donor, uint256 amount);
    event GoalReached(uint256 totalAmount);
    event FundsWithdrawn(address indexed campaignOwner, uint256 amount);
    event RefundIssued(address indexed donor, uint256 amount);
    event PlatformFeePaid(address indexed payer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address payable _campaignOwner, uint256 _fundingGoal) payable {
        require(msg.value >= PLATFORM_FEE, "Platform fee required");
        
        owner = msg.sender;
        campaignOwner = _campaignOwner;
        fundingGoal = _fundingGoal;
        goalReached = false;
        isClosed = false;
        
        // Transfer platform fee to contract owner
        payable(owner).transfer(PLATFORM_FEE);
        emit PlatformFeePaid(msg.sender, PLATFORM_FEE);
        
        // Refund any excess sent
        if (msg.value > PLATFORM_FEE) {
            payable(msg.sender).transfer(msg.value - PLATFORM_FEE);
        }
    }
    
    // Function to get platform fee
    function getPlatformFee() public pure returns (uint256) {
        return PLATFORM_FEE;
    }

    function donate() public payable {
        require(!isClosed, "Campaign closed");
        require(msg.value > 0, "Must send ETH");

        donations[msg.sender] += msg.value;
        totalDonated += msg.value;

        emit DonationReceived(msg.sender, msg.value);

        if (totalDonated >= fundingGoal) {
            goalReached = true;
            emit GoalReached(totalDonated);
        }
    }

    function withdrawFunds() public {
        require(msg.sender == campaignOwner, "Only campaign owner can withdraw");
        require(goalReached, "Funding goal not met");
        require(!isClosed, "Campaign closed");

        isClosed = true;
        uint256 amount = totalDonated;
        totalDonated = 0;

        campaignOwner.transfer(amount);
        emit FundsWithdrawn(campaignOwner, amount);
    }

    function refund() public {
        require(!goalReached, "Funding goal met, no refunds");
        require(donations[msg.sender] > 0, "No donations found");

        uint256 amount = donations[msg.sender];
        donations[msg.sender] = 0;

        payable(msg.sender).transfer(amount);
        emit RefundIssued(msg.sender, amount);
    }
}
