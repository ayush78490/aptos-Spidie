// Core Blockchain Testnet configuration
const aptosTestnetConfig = {
    chainId: '0x2', // 2 in hex (Aptos Testnet chain ID)
    chainName: 'Aptos Testnet',
    rpcUrls: ['https://fullnode.testnet.aptoslabs.com'],
    nativeCurrency: {
        name: 'APT',
        symbol: 'APT',
        decimals: 8
    },
    blockExplorerUrls: ['https://explorer.aptoslabs.com/?network=testnet']
};

// // Connect wallet and switch/add Core Testnet
// async function connectCoreTestnet() {
//     if (typeof window.ethereum === 'undefined') {
//         alert('Please install MetaMask or another compatible wallet.');
//         return;
//     }
//     try {
//         // Request wallet connection
//         await window.ethereum.request({ method: 'eth_requestAccounts' });

//         // Try switching to Core Testnet
//         await window.ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: coreTestnetConfig.chainId }]
//         });
//     } catch (switchError) {
//         // If the chain is not added, add it
//         if (switchError.code === 4902) {
//             try {
//                 await window.ethereum.request({
//                     method: 'wallet_addEthereumChain',
//                     params: [coreTestnetConfig]
//                 });
//             } catch (addError) {
//                 alert('Failed to add Core Testnet: ' + addError.message);
//             }
//         } else {
//             alert('Failed to switch network: ' + switchError.message);
//         }
//     }
// }

// Aptos Testnet connect using Petra wallet

async function connectAptosTestnet() {
    if (typeof window.aptos === 'undefined') {
        alert('Please install Petra Wallet or another Aptos-compatible wallet.');
        return;
    }
    try {
        // Request wallet connection
        const response = await window.aptos.connect();
        // Get the connected account address
        const account = await window.aptos.account();
        // Store the address globally if needed
        window.connectedWallet = account.address;
        alert('Connected to Aptos Testnet!\nAddress: ' + account.address);
    } catch (err) {
        alert('Failed to connect to Aptos wallet: ' + (err.message || err));
    }
}

async function fetchAptosBalance(address) {
    try {
        console.log(`Fetching balance for address: ${address}`);
        const response = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resources`);
        
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }
        
        const resources = await response.json();
        console.log('API Response:', resources); // Log the full response for debugging
        
        // Find the APT CoinStore resource
        const coinStore = resources.find(
            r => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        );
        
        console.log('CoinStore found:', coinStore); // Log the CoinStore for debugging
        
        if (coinStore?.data?.coin?.value) {
            // Balance is in Octas (1 APT = 10^8 Octas)
            const balance = parseInt(coinStore.data.coin.value, 10) / 1e8;
            console.log('Aptos Balance:', balance);
            document.getElementById('wallet-balance').textContent = balance + ' APT';
            console.log(`Balance for ${address}: ${balance} APT`);
            return balance;
        } else {
            console.log('No AptosCoin balance found for this address');
            document.getElementById('wallet-balance').textContent = '0 APT';
            return 0;
        }
    } catch (err) {
        console.error('Error fetching balance:', err);
        document.getElementById('wallet-balance').textContent = 'Error';
        return null;
    }
}

// Example: Attach to a button with id="connect-core-btn"
// document.getElementById('connect-core-btn').onclick = connectCoreTestnet;

// Example: Attach to a button with id="connect-aptos-btn"
// document.getElementById('connect-aptos-btn').onclick = connectAptosTestnet;