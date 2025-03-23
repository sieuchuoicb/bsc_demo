const axios = require("axios");

const BSC_API_URL = "https://api.bscscan.com/api";
const BSC_API_KEY = process.env.BSC_API_KEY;

const fetchTransactionsFromBSC = async (walletAddress) => {
  try {
    const response = await axios.get(BSC_API_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: "asc",
        apikey: BSC_API_KEY,
      },
    });

    return response.data.result || [];
  } catch (error) {
    console.error("❌ Error fetching from BSC:", error);
    throw error;
  }
};

module.exports = { fetchTransactionsFromBSC };
