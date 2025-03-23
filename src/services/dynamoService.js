const AWS = require("aws-sdk");

AWS.config.update({ region: process.env.DYNAMODB_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getTransactionsByWallet = async (walletAddress) => {
  const params = {
    TableName: "lannp_demo_bsc",
    KeyConditionExpression: "walletAddress = :wallet",
    ExpressionAttributeValues: { ":wallet": walletAddress },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error("❌ DynamoDB Error:", error);
    throw error;
  }
};

const insertTransactions = async (transactions) => {
  const putRequests = transactions.map((tx) => ({
    PutRequest: {
      Item: {
        walletAddress: tx.from,
        transactionHash: tx.hash,
        from: tx.from,
        to: tx.to,
        amount: tx.value,
        timestamp: tx.timeStamp,
      },
    },
  }));

  const batchParams = {
    RequestItems: {
      BSC_Transactions: putRequests,
    },
  };

  try {
    await dynamoDB.batchWrite(batchParams).promise();
    console.log("✅ Transactions inserted into DynamoDB.");
  } catch (error) {
    console.error("❌ DynamoDB Batch Write Error:", error);
    throw error;
  }
};

module.exports = { getTransactionsByWallet, insertTransactions };
