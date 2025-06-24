// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract SkillExchange {
    struct Skill {
        uint256 id;
        address provider;
        string title;
        string description;
        uint256 price;
        string category;
        address tokenAddress; // address(0) for ETH, ERC-20 address for tokens
        bool active;
    }

    struct ServiceRequest {
        uint256 id;
        uint256 skillId;
        address requester;
        string requirements;
        bool accepted;
        bool completed;
        bool paymentReleased;
    }

    struct Rating {
        uint256 serviceId;
        address rater;
        uint8 rating;
    }

    uint256 public skillCount;
    uint256 public requestCount;

    mapping(uint256 => Skill) public skills;
    mapping(uint256 => ServiceRequest) public requests;
    mapping(uint256 => Rating[]) public serviceRatings;

    // Simple reentrancy guard
    uint256 private unlocked = 1;
    modifier nonReentrant() {
        require(unlocked == 1, "ReentrancyGuard: reentrant call");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    event SkillListed(uint256 indexed skillId, address indexed provider, address tokenAddress);
    event ServiceRequested(uint256 indexed requestId, uint256 indexed skillId, address indexed requester, address tokenAddress, uint256 amount);
    event RequestAccepted(uint256 indexed requestId);
    event ServiceCompleted(uint256 indexed requestId);
    event PaymentReleased(uint256 indexed requestId, address indexed provider, uint256 amount, address tokenAddress);
    event ServiceRated(uint256 indexed serviceId, address indexed rater, uint8 rating);

    // List a new skill (tokenAddress = address(0) for ETH, or ERC-20 address)
    function listSkill(string memory title, string memory description, uint256 price, string memory category, address tokenAddress) external {
        skillCount++;
        skills[skillCount] = Skill({
            id: skillCount,
            provider: msg.sender,
            title: title,
            description: description,
            price: price,
            category: category,
            tokenAddress: tokenAddress,
            active: true
        });
        emit SkillListed(skillCount, msg.sender, tokenAddress);
    }

    // Request a service (ETH or ERC-20)
    function requestService(uint256 skillId, string memory requirements) external payable nonReentrant {
        Skill storage skill = skills[skillId];
        require(skill.active, "Skill not active");
        if (skill.tokenAddress == address(0)) {
            // ETH payment
            require(msg.value == skill.price, "Incorrect ETH payment amount");
        } else {
            // ERC-20 payment
            require(msg.value == 0, "Do not send ETH for token payment");
            require(IERC20(skill.tokenAddress).transferFrom(msg.sender, address(this), skill.price), "Token transfer failed");
        }
        requestCount++;
        requests[requestCount] = ServiceRequest({
            id: requestCount,
            skillId: skillId,
            requester: msg.sender,
            requirements: requirements,
            accepted: false,
            completed: false,
            paymentReleased: false
        });
        emit ServiceRequested(requestCount, skillId, msg.sender, skill.tokenAddress, skill.price);
    }

    // Provider accepts a request
    function acceptRequest(uint256 requestId) external {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == skill.provider, "Only provider can accept");
        require(!req.accepted, "Already accepted");
        req.accepted = true;
        emit RequestAccepted(requestId);
    }

    // Provider marks service as completed
    function completeService(uint256 requestId) external {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == skill.provider, "Only provider can complete");
        require(req.accepted, "Request not accepted");
        require(!req.completed, "Already completed");
        req.completed = true;
        emit ServiceCompleted(requestId);
    }

    // Requester releases payment after completion
    function releasePayment(uint256 requestId) external nonReentrant {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == req.requester, "Only requester can release payment");
        require(req.completed, "Service not completed");
        require(!req.paymentReleased, "Payment already released");
        req.paymentReleased = true;
        if (skill.tokenAddress == address(0)) {
            // ETH
            payable(skill.provider).transfer(skill.price);
        } else {
            // ERC-20
            require(IERC20(skill.tokenAddress).transfer(skill.provider, skill.price), "Token payout failed");
        }
        emit PaymentReleased(requestId, skill.provider, skill.price, skill.tokenAddress);
    }

    // Requester rates the service
    function rateService(uint256 requestId, uint8 rating) external {
        ServiceRequest storage req = requests[requestId];
        require(msg.sender == req.requester, "Only requester can rate");
        require(req.paymentReleased, "Payment not released");
        require(rating >= 1 && rating <= 5, "Rating out of range");
        serviceRatings[requestId].push(Rating({
            serviceId: requestId,
            rater: msg.sender,
            rating: rating
        }));
        emit ServiceRated(requestId, msg.sender, rating);
    }

    // Get ratings for a service
    function getRatings(uint256 requestId) external view returns (Rating[] memory) {
        return serviceRatings[requestId];
    }
} 