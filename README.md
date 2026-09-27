# BSC Mintable Contracts Finder

A tiny **Node.js** script that checks a list of **BNB Smart Chain (BSC)** contract addresses through the **BscScan API** and reports which ones expose a **`mint` function** — i.e., which tokens/contracts are (publicly) mintable.

## How it works

1. Reads `contratos.txt` — **one contract address per line**.
2. For each address, calls BscScan `module=contract&action=getabi` to fetch the contract **ABI**.
3. Parses the ABI and looks for a function named **`mint`** (or **`_mint`**, if it happens to be public).
4. If found, prints the address and appends it to **`mentas.txt`**.
5. Waits **1 second** between requests to stay friendly with BscScan's rate limits.

## Requirements

- **Node.js 18+**
- A **BscScan API key** (free) → <https://bscscan.com/myapikey>
- Dependency: **axios** (`npm i axios`)

## Setup

```bash
npm i axios

# 1) Provide your BscScan API key as an environment variable
export BSCSCAN_API_KEY="YOUR_KEY"          # macOS / Linux
# $env:BSCSCAN_API_KEY="YOUR_KEY"          # Windows (PowerShell)

# 2) Create the input file with one address per line (see contratos.example.txt)
cp contratos.example.txt contratos.txt
# then edit contratos.txt with the addresses you want to check

# 3) Run
node index.js
```

## Output

A file named **`mentas.txt`** is created (appended) with the addresses that have a mint function:

```
"mint" is available. Contract: 0x....
"mint" is available. Contract: 0x....
```

## Notes

- `mint` must be a **public/external** function to appear in the ABI. The OpenZeppelin **internal `_mint`** is usually **not** in the ABI, so this detects **publicly mintable** contracts, not every contract that *can* mint internally.
- Unverified contracts return `"Contract source code not verified"` (no ABI) and are skipped.
- BscScan is now served through **Etherscan's V2 API**; the endpoint (`api.bscscan.com`), parameters or the key type may need updating over time.
- Respect BscScan's rate limits (the free tier is a few requests/second; the script spaces calls by 1s).

## License

No license. Example script — use at your own risk.
