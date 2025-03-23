const express = require("express");
const { getTransactionsByWallet, insertTransactions } = require("../services/dynamoService");
const { fetchTransactionsFromBSC } = require("../services/bscService");

const router = express.Router();

// API to check and fetch transactions
router.get("/check-wallet/:walletAddress", async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // Step 1: Check if the wallet exists in DynamoDB
    const transactions = await getTransactionsByWallet(walletAddress);

    if (transactions.length > 0) {
      console.log("✅ Wallet found in database.");
      return res.json(transactions);
    }

    console.log("⚠️ Wallet not found. Fetching from BSC chain...");

    // Step 2: Fetch transactions from BSC Scan
    const newTransactions = await fetchTransactionsFromBSC(walletAddress);

    if (newTransactions.length === 0) {
      return res.status(404).json({ error: "No transactions found on BSC chain." });
    }

    // Step 3: Insert transactions into DynamoDB
    await insertTransactions(newTransactions);

    return res.json(newTransactions);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
