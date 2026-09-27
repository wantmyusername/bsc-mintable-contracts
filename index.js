const axios = require('axios');
const fs = require('fs');

// BscScan API key — comes from the environment, NEVER hardcoded.
const apiKey = process.env.BSCSCAN_API_KEY;
if (!apiKey) {
  console.error('Missing BSCSCAN_API_KEY. Set it as an environment variable (see README).');
  process.exit(1);
}

// Read 'contratos.txt' (one contract address per line).
const contractAddresses = fs
  .readFileSync('contratos.txt', 'utf-8')
  .split('\n')
  .map((a) => a.trim())
  .filter(Boolean);

// Iterate over each contract address.
contractAddresses.forEach((contractAddress, index) => {
  setTimeout(() => {
    // Call the BscScan API to fetch the contract ABI.
    axios
      .get('https://api.bscscan.com/api', {
        params: {
          module: 'contract',
          action: 'getabi',
          address: contractAddress,
          apikey: apiKey,
        },
      })
      .then((response) => {
        let contractAbi;
        try {
          contractAbi = JSON.parse(response.data.result);
        } catch {
          // BscScan returns a string like "Contract source code not verified".
          return;
        }

        // A minting function exposed in the ABI (`mint`, or `_mint` if public).
        const mintFunction = contractAbi.find(
          (f) => f.type === 'function' && (f.name === 'mint' || f.name === '_mint')
        );

        if (mintFunction) {
          console.log(`"mint" is available. Contract: ${contractAddress}`);
          // Append the result to 'mentas.txt'.
          fs.appendFileSync(
            'mentas.txt',
            `"mint" is available. Contract: ${contractAddress}\n`
          );
        }
      })
      .catch((error) => {
        console.error(`Error fetching ABI for ${contractAddress}:`, error.message);
      });
  }, index * 1000); // Wait 1 second between requests (rate-limit friendly).
});
