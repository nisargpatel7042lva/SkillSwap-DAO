const hre = require("hardhat");

async function main() {
  const SkillExchange = await hre.ethers.getContractFactory("SkillExchange");
  const skillExchange = await SkillExchange.deploy();
  await skillExchange.waitForDeployment();
  console.log("SkillExchange deployed to:", skillExchange.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 