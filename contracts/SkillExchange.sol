// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SkillExchange {
    struct Skill {
        uint256 id;
        address provider;
        string title;
        string description;
        uint256 price;
        string category;
        address tokenAddress;
        bool active;
        uint256 totalCompleted;
        uint256 totalDisputes;
        uint256 averageRating;
        bool satisfactionGuarantee;
        uint256 satisfactionWindow;
    }

    struct ServiceRequest {
        uint256 id;
        uint256 skillId;
        address requester;
        string requirements;
        bool accepted;
        bool completed;
        bool paymentReleased;
        bool disputed;
        uint256 disputeTime;
        uint256 autoReleaseTime;
        uint256 completionDeadline;
        string workEvidence;
        string completionNotes;
        uint256 providerRating;
        bool workVerified;
        uint256 verificationDeadline;
        bool satisfactionDispute;
        uint256 satisfactionDeadline;
        string qualityEvidence;
        bool qualityVerified;
        uint256 qualityScore;
    }

    struct Rating {
        uint256 serviceId;
        address rater;
        uint8 rating;
        string review;
        bool isDetailed;
    }

    struct ProviderProfile {
        address provider;
        uint256 totalCompleted;
        uint256 totalDisputes;
        uint256 averageRating;
        uint256 totalEarnings;
        bool isVerified;
        uint256 verificationScore;
        uint256 lastActive;
        uint256 satisfactionRate;
        uint256 qualityScore;
        bool offersSatisfactionGuarantee;
    }

    struct DisputeEvidence {
        uint256 requestId;
        address submitter;
        string evidenceHash;
        string description;
        uint256 timestamp;
        bool isProviderEvidence;
        bool isQualityEvidence;
        bool isSatisfactionEvidence;
    }

    struct QualityCheck {
        uint256 requestId;
        uint256 score;
        string criteria;
        bool passed;
        uint256 timestamp;
        address checker;
    }

    uint256 public skillCount;
    uint256 public requestCount;
    uint256 public disputeCount;
    address public owner;
    address public arbitrator;
    address public qualityChecker;
    
    uint256 public constant DISPUTE_WINDOW = 7 days;
    uint256 public constant AUTO_RELEASE_WINDOW = 7 days;
    uint256 public constant WORK_VERIFICATION_WINDOW = 3 days;
    uint256 public constant MAX_COMPLETION_TIME = 30 days;
    uint256 public constant MIN_PROVIDER_SCORE = 70;
    uint256 public constant SATISFACTION_WINDOW = 14 days;
    uint256 public constant QUALITY_CHECK_WINDOW = 5 days;
    
    uint256 public platformFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(uint256 => Skill) public skills;
    mapping(uint256 => ServiceRequest) public requests;
    mapping(uint256 => Rating[]) public serviceRatings;
    mapping(address => ProviderProfile) public providerProfiles;
    mapping(uint256 => DisputeEvidence[]) public disputeEvidences;
    mapping(address => uint256[]) public userRequests;
    mapping(address => uint256[]) public providerRequests;
    mapping(uint256 => QualityCheck[]) public qualityChecks;
    
    // Reputation thresholds
    mapping(address => uint256) public providerDisputeCount;
    mapping(address => uint256) public providerCompletionRate;
    mapping(address => uint256) public providerAverageRating;

    // Simple reentrancy guard
    uint256 private unlocked = 1;
    modifier nonReentrant() {
        require(unlocked == 1, "ReentrancyGuard: reentrant call");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyArbitrator() {
        require(msg.sender == arbitrator || msg.sender == owner, "Only arbitrator can call this function");
        _;
    }

    modifier onlyQualityChecker() {
        require(msg.sender == qualityChecker || msg.sender == owner, "Only quality checker can call this function");
        _;
    }

    event SkillListed(uint256 indexed skillId, address indexed provider, address tokenAddress);
    event ServiceRequested(uint256 indexed requestId, uint256 indexed skillId, address indexed requester, address tokenAddress, uint256 amount);
    event RequestAccepted(uint256 indexed requestId);
    event ServiceCompleted(uint256 indexed requestId, string workEvidence);
    event WorkVerified(uint256 indexed requestId, bool verified);
    event PaymentReleased(uint256 indexed requestId, address indexed provider, uint256 amount, address tokenAddress);
    event ServiceRated(uint256 indexed serviceId, address indexed rater, uint8 rating);
    event DisputeRaised(uint256 indexed requestId, address indexed requester);
    event DisputeResolved(uint256 indexed requestId, bool refunded, string reason);
    event RefundIssued(uint256 indexed requestId, address indexed requester, uint256 amount, address tokenAddress);
    event EvidenceSubmitted(uint256 indexed requestId, address indexed submitter, string evidenceHash);
    event ProviderVerified(address indexed provider, uint256 score);
    event PlatformFeeUpdated(uint256 newFee);
    event SatisfactionDisputeRaised(uint256 indexed requestId, address indexed requester);
    event QualityCheckCompleted(uint256 indexed requestId, uint256 score, bool passed);
    event SatisfactionGuaranteeActivated(uint256 indexed requestId);

    constructor() {
        owner = msg.sender;
        arbitrator = msg.sender;
        qualityChecker = msg.sender;
    }

    // List a new skill with satisfaction guarantee option
    function listSkill(string memory title, string memory description, uint256 price, string memory category, address tokenAddress, bool satisfactionGuarantee) external {
        ProviderProfile storage profile = providerProfiles[msg.sender];
        
        if (profile.totalCompleted == 0) {
            require(price <= 0.1 ether, "New providers limited to 0.1 ETH max");
        } else {
            require(profile.verificationScore >= MIN_PROVIDER_SCORE, "Insufficient reputation score");
        }
        
        skillCount++;
        skills[skillCount] = Skill({
            id: skillCount,
            provider: msg.sender,
            title: title,
            description: description,
            price: price,
            category: category,
            tokenAddress: tokenAddress,
            active: true,
            totalCompleted: 0,
            totalDisputes: 0,
            averageRating: 0,
            satisfactionGuarantee: satisfactionGuarantee,
            satisfactionWindow: satisfactionGuarantee ? SATISFACTION_WINDOW : DISPUTE_WINDOW
        });
        
        if (profile.provider == address(0)) {
            profile.provider = msg.sender;
            profile.lastActive = block.timestamp;
            profile.offersSatisfactionGuarantee = satisfactionGuarantee;
        }
        
        emit SkillListed(skillCount, msg.sender, tokenAddress);
    }

    // Request a service with enhanced security
    function requestService(uint256 skillId, string memory requirements) external payable nonReentrant {
        Skill storage skill = skills[skillId];
        require(skill.active, "Skill not active");
        
        ProviderProfile storage profile = providerProfiles[skill.provider];
        require(profile.verificationScore >= MIN_PROVIDER_SCORE || profile.totalCompleted == 0, "Provider reputation too low");
        
        if (skill.tokenAddress == address(0)) {
            require(msg.value == skill.price, "Incorrect ETH payment amount");
        } else {
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
            paymentReleased: false,
            disputed: false,
            disputeTime: 0,
            autoReleaseTime: 0,
            completionDeadline: block.timestamp + MAX_COMPLETION_TIME,
            workEvidence: "",
            completionNotes: "",
            providerRating: 0,
            workVerified: false,
            verificationDeadline: 0,
            satisfactionDispute: false,
            satisfactionDeadline: 0,
            qualityEvidence: "",
            qualityVerified: false,
            qualityScore: 0
        });
        
        userRequests[msg.sender].push(requestCount);
        providerRequests[skill.provider].push(requestCount);
        
        emit ServiceRequested(requestCount, skillId, msg.sender, skill.tokenAddress, skill.price);
    }

    // Provider accepts a request
    function acceptRequest(uint256 requestId) external {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == skill.provider, "Only provider can accept");
        require(!req.accepted, "Already accepted");
        require(block.timestamp <= req.completionDeadline, "Request expired");
        
        req.accepted = true;
        emit RequestAccepted(requestId);
    }

    // Provider marks service as completed with evidence
    function completeService(uint256 requestId, string memory workEvidence, string memory completionNotes) external {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == skill.provider, "Only provider can complete");
        require(req.accepted, "Request not accepted");
        require(!req.completed, "Already completed");
        require(block.timestamp <= req.completionDeadline, "Completion deadline passed");
        require(bytes(workEvidence).length > 0, "Work evidence required");
        
        req.completed = true;
        req.workEvidence = workEvidence;
        req.completionNotes = completionNotes;
        req.autoReleaseTime = block.timestamp + AUTO_RELEASE_WINDOW;
        req.verificationDeadline = block.timestamp + WORK_VERIFICATION_WINDOW;
        
        if (skill.satisfactionGuarantee) {
            req.satisfactionDeadline = block.timestamp + skill.satisfactionWindow;
        }
        
        emit ServiceCompleted(requestId, workEvidence);
    }

    // Quality checker can verify work quality
    function verifyQuality(uint256 requestId, uint256 score, string memory criteria, bool passed) external onlyQualityChecker {
        ServiceRequest storage req = requests[requestId];
        require(req.completed, "Service not completed");
        require(!req.qualityVerified, "Quality already verified");
        require(score <= 100, "Score must be 0-100");
        
        req.qualityVerified = true;
        req.qualityScore = score;
        
        qualityChecks[requestId].push(QualityCheck({
            requestId: requestId,
            score: score,
            criteria: criteria,
            passed: passed,
            timestamp: block.timestamp,
            checker: msg.sender
        }));
        
        emit QualityCheckCompleted(requestId, score, passed);
    }

    // Requester verifies work completion
    function verifyWork(uint256 requestId, bool isVerified) external {
        ServiceRequest storage req = requests[requestId];
        require(msg.sender == req.requester, "Only requester can verify");
        require(req.completed, "Service not completed");
        require(!req.workVerified, "Work already verified");
        require(block.timestamp <= req.verificationDeadline, "Verification deadline passed");
        
        req.workVerified = isVerified;
        
        if (isVerified) {
            _releasePayment(requestId);
        }
        
        emit WorkVerified(requestId, isVerified);
    }

    // Internal payment release function
    function _releasePayment(uint256 requestId) internal nonReentrant {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(!req.paymentReleased, "Payment already released");
        require(!req.disputed, "Payment is disputed");
        require(!req.satisfactionDispute, "Satisfaction dispute active");
        
        req.paymentReleased = true;
        
        uint256 feeAmount = (skill.price * platformFee) / FEE_DENOMINATOR;
        uint256 providerAmount = skill.price - feeAmount;
        
        if (skill.tokenAddress == address(0)) {
            payable(skill.provider).transfer(providerAmount);
            payable(owner).transfer(feeAmount);
        } else {
            require(IERC20(skill.tokenAddress).transfer(skill.provider, providerAmount), "Token payout failed");
            require(IERC20(skill.tokenAddress).transfer(owner, feeAmount), "Fee transfer failed");
        }
        
        _updateProviderStats(skill.provider, true, false);
        
        emit PaymentReleased(requestId, skill.provider, providerAmount, skill.tokenAddress);
    }

    // Requester releases payment manually
    function releasePayment(uint256 requestId) external {
        ServiceRequest storage req = requests[requestId];
        require(msg.sender == req.requester, "Only requester can release payment");
        require(req.completed, "Service not completed");
        require(!req.paymentReleased, "Payment already released");
        require(!req.disputed, "Payment is disputed");
        require(!req.satisfactionDispute, "Satisfaction dispute active");
        
        _releasePayment(requestId);
    }

    // Raise dispute with evidence (standard dispute)
    function raiseDispute(uint256 requestId, string memory evidenceHash, string memory reason) external {
        ServiceRequest storage req = requests[requestId];
        require(msg.sender == req.requester, "Only requester can raise dispute");
        require(req.completed, "Service not completed");
        require(!req.paymentReleased, "Payment already released");
        require(!req.disputed, "Dispute already raised");
        require(!req.satisfactionDispute, "Satisfaction dispute already raised");
        require(block.timestamp <= req.autoReleaseTime, "Dispute window expired");
        require(bytes(evidenceHash).length > 0, "Evidence required");
        
        req.disputed = true;
        req.disputeTime = block.timestamp;
        
        disputeEvidences[requestId].push(DisputeEvidence({
            requestId: requestId,
            submitter: msg.sender,
            evidenceHash: evidenceHash,
            description: reason,
            timestamp: block.timestamp,
            isProviderEvidence: false,
            isQualityEvidence: false,
            isSatisfactionEvidence: false
        }));
        
        disputeCount++;
        emit DisputeRaised(requestId, msg.sender);
        emit EvidenceSubmitted(requestId, msg.sender, evidenceHash);
    }

    // NEW: Raise satisfaction dispute (for change of mind)
    function raiseSatisfactionDispute(uint256 requestId, string memory evidenceHash, string memory reason) external {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == req.requester, "Only requester can raise satisfaction dispute");
        require(req.completed, "Service not completed");
        require(!req.paymentReleased, "Payment already released");
        require(!req.disputed, "Standard dispute already raised");
        require(!req.satisfactionDispute, "Satisfaction dispute already raised");
        require(skill.satisfactionGuarantee, "Provider doesn't offer satisfaction guarantee");
        require(block.timestamp <= req.satisfactionDeadline, "Satisfaction window expired");
        require(bytes(evidenceHash).length > 0, "Evidence required");
        
        req.satisfactionDispute = true;
        req.disputeTime = block.timestamp;
        
        disputeEvidences[requestId].push(DisputeEvidence({
            requestId: requestId,
            submitter: msg.sender,
            evidenceHash: evidenceHash,
            description: reason,
            timestamp: block.timestamp,
            isProviderEvidence: false,
            isQualityEvidence: false,
            isSatisfactionEvidence: true
        }));
        
        disputeCount++;
        emit SatisfactionDisputeRaised(requestId, msg.sender);
        emit EvidenceSubmitted(requestId, msg.sender, evidenceHash);
    }

    // Provider can submit counter-evidence
    function submitCounterEvidence(uint256 requestId, string memory evidenceHash, string memory description) external {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(msg.sender == skill.provider, "Only provider can submit counter-evidence");
        require(req.disputed || req.satisfactionDispute, "No dispute raised");
        require(!req.paymentReleased, "Payment already released");
        require(bytes(evidenceHash).length > 0, "Evidence required");
        
        disputeEvidences[requestId].push(DisputeEvidence({
            requestId: requestId,
            submitter: msg.sender,
            evidenceHash: evidenceHash,
            description: description,
            timestamp: block.timestamp,
            isProviderEvidence: true,
            isQualityEvidence: false,
            isSatisfactionEvidence: req.satisfactionDispute
        }));
        
        emit EvidenceSubmitted(requestId, msg.sender, evidenceHash);
    }

    // Arbitrator resolves disputes with enhanced logic
    function resolveDispute(uint256 requestId, bool refundToRequester, string memory reason) external onlyArbitrator nonReentrant {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(req.disputed || req.satisfactionDispute, "No dispute raised");
        require(!req.paymentReleased, "Payment already released");
        
        req.paymentReleased = true;
        
        if (refundToRequester) {
            if (skill.tokenAddress == address(0)) {
                payable(req.requester).transfer(skill.price);
            } else {
                require(IERC20(skill.tokenAddress).transfer(req.requester, skill.price), "Token refund failed");
            }
            emit RefundIssued(requestId, req.requester, skill.price, skill.tokenAddress);
            _updateProviderStats(skill.provider, false, true);
        } else {
            uint256 feeAmount = (skill.price * platformFee) / FEE_DENOMINATOR;
            uint256 providerAmount = skill.price - feeAmount;
            
            if (skill.tokenAddress == address(0)) {
                payable(skill.provider).transfer(providerAmount);
                payable(owner).transfer(feeAmount);
            } else {
                require(IERC20(skill.tokenAddress).transfer(skill.provider, providerAmount), "Token payout failed");
                require(IERC20(skill.tokenAddress).transfer(owner, feeAmount), "Fee transfer failed");
            }
            emit PaymentReleased(requestId, skill.provider, providerAmount, skill.tokenAddress);
            _updateProviderStats(skill.provider, true, false);
        }
        
        emit DisputeResolved(requestId, refundToRequester, reason);
    }

    // Auto-release payment after dispute window expires
    function autoReleasePayment(uint256 requestId) external nonReentrant {
        ServiceRequest storage req = requests[requestId];
        Skill storage skill = skills[req.skillId];
        require(req.completed, "Service not completed");
        require(!req.paymentReleased, "Payment already released");
        require(!req.disputed, "Payment is disputed");
        require(!req.satisfactionDispute, "Satisfaction dispute active");
        
        uint256 deadline = req.satisfactionDispute ? req.satisfactionDeadline : req.autoReleaseTime;
        require(block.timestamp >= deadline, "Auto-release time not reached");
        
        _releasePayment(requestId);
    }

    // Update provider statistics
    function _updateProviderStats(address provider, bool completed, bool disputed) internal {
        ProviderProfile storage profile = providerProfiles[provider];
        
        if (completed) {
            profile.totalCompleted++;
            profile.totalEarnings += 1;
        }
        
        if (disputed) {
            profile.totalDisputes++;
        }
        
        uint256 completionRate = profile.totalCompleted > 0 ? 
            ((profile.totalCompleted - profile.totalDisputes) * 100) / profile.totalCompleted : 0;
        
        profile.verificationScore = completionRate;
        profile.lastActive = block.timestamp;
        
        if (profile.verificationScore >= 80 && profile.totalCompleted >= 5) {
            profile.isVerified = true;
            emit ProviderVerified(provider, profile.verificationScore);
        }
    }

    // Rate service with detailed review
    function rateService(uint256 requestId, uint8 rating, string memory review, bool isDetailed) external {
        ServiceRequest storage req = requests[requestId];
        require(msg.sender == req.requester, "Only requester can rate");
        require(req.paymentReleased, "Payment not released");
        require(rating >= 1 && rating <= 5, "Rating out of range");
        
        serviceRatings[requestId].push(Rating({
            serviceId: requestId,
            rater: msg.sender,
            rating: rating,
            review: review,
            isDetailed: isDetailed
        }));
        
        req.providerRating = rating;
        
        ProviderProfile storage profile = providerProfiles[skills[req.skillId].provider];
        if (profile.averageRating == 0) {
            profile.averageRating = rating;
        } else {
            profile.averageRating = (profile.averageRating + rating) / 2;
        }
        
        emit ServiceRated(requestId, msg.sender, rating);
    }

    // Get ratings for a service
    function getRatings(uint256 requestId) external view returns (Rating[] memory) {
        return serviceRatings[requestId];
    }

    // Get dispute evidence
    function getDisputeEvidence(uint256 requestId) external view returns (DisputeEvidence[] memory) {
        return disputeEvidences[requestId];
    }

    // Get quality checks
    function getQualityChecks(uint256 requestId) external view returns (QualityCheck[] memory) {
        return qualityChecks[requestId];
    }

    // Get provider profile
    function getProviderProfile(address provider) external view returns (ProviderProfile memory) {
        return providerProfiles[provider];
    }

    // Owner functions for platform management
    function setArbitrator(address newArbitrator) external onlyOwner {
        arbitrator = newArbitrator;
    }

    function setQualityChecker(address newQualityChecker) external onlyOwner {
        qualityChecker = newQualityChecker;
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        if (tokenAddress == address(0)) {
            payable(owner).transfer(address(this).balance);
        } else {
            uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
            require(IERC20(tokenAddress).transfer(owner, balance), "Token withdrawal failed");
        }
    }

    // View functions for frontend
    function getRequest(uint256 requestId) external view returns (ServiceRequest memory) {
        return requests[requestId];
    }

    function getSkill(uint256 skillId) external view returns (Skill memory) {
        return skills[skillId];
    }

    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }

    function getProviderRequests(address provider) external view returns (uint256[] memory) {
        return providerRequests[provider];
    }
} 