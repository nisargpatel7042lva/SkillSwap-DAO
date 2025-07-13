const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SkillSwap DAO contracts...");

  // Get the contract factory
  const SkillExchange = await ethers.getContractFactory("SkillExchange");
  
  console.log("📋 Deploying SkillExchange contract...");
  
  // Deploy the contract
  const skillExchange = await SkillExchange.deploy();
  
  // Wait for deployment to finish
  await skillExchange.waitForDeployment();
  
  const address = await skillExchange.getAddress();
  
  console.log("✅ SkillExchange deployed to:", address);
  console.log("");
  console.log("📝 Update your .env file with:");
  console.log(`VITE_SKILL_EXCHANGE_ADDRESS=${address}`);
  console.log("");
  console.log("🎉 Deployment completed successfully!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Update your .env file with the contract address above");
  console.log("2. Run: npm run setup:database");
  console.log("3. Start your development server: npm run dev");
  console.log("");
  console.log("Happy coding! 🚀");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 