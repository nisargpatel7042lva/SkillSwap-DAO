const hre = require("hardhat");

async function main() {
  const SkillExchange = await hre.ethers.getContractFactory("SkillExchange");
  const skillExchange = await SkillExchange.deploy();
  await skillExchange.deployed();
  console.log("SkillExchange deployed to:", skillExchange.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 