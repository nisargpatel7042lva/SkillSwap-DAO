const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting SkillSwap DAO deployment...");

  // Deploy SkillExchange contract
  console.log("📦 Deploying SkillExchange contract...");
  const SkillExchange = await hre.ethers.getContractFactory("SkillExchange");
  const skillExchange = await SkillExchange.deploy();
  await skillExchange.waitForDeployment();
  
  const contractAddress = await skillExchange.getAddress();
  console.log("✅ SkillExchange deployed to:", contractAddress);

  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await skillExchange.deploymentTransaction().wait(5);

  // Verify contract on Etherscan (if not on local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ Contract verification failed:", error.message);
    }
  }

  // Update frontend configuration
  console.log("📝 Updating frontend configuration...");
  updateFrontendConfig(contractAddress);

  // Create deployment info file
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: (await hre.ethers.getSigners())[0].address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  fs.writeFileSync(
    path.join(__dirname, "../deployment-info.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to deployment-info.json");

  // Display deployment summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("=".repeat(50));
  console.log("📋 Deployment Summary:");
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Contract Address: ${deploymentInfo.contractAddress}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Block Number: ${deploymentInfo.blockNumber}`);
  console.log("=".repeat(50));
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update your .env file with the contract address");
  console.log("2. Set up your Supabase project");
  console.log("3. Run the database migrations");
  console.log("4. Start the frontend application");
}

function updateFrontendConfig(contractAddress) {
  // Update the contract address in the frontend config
  const configPath = path.join(__dirname, "../src/lib/SkillExchange.ts");
  let configContent = fs.readFileSync(configPath, "utf8");
  
  // Replace the fallback address with the deployed address
  configContent = configContent.replace(
    /export const SKILL_EXCHANGE_ADDRESS = .*?;/,
    `export const SKILL_EXCHANGE_ADDRESS = "${contractAddress}";`
  );
  
  fs.writeFileSync(configPath, configContent);
  console.log("✅ Frontend configuration updated");
}

// Handle deployment errors
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
}); 