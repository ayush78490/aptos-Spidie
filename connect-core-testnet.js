// Core Blockchain Testnet configuration
const coreTestnetConfig = {
    chainId: '0x45a', // 1114 in hex
    chainName: 'Core Blockchain Testnet',
    rpcUrls: ['https://rpc.test2.btcs.network'],
    nativeCurrency: {
        name: 'tCORE2',
        symbol: 'tCORE2',
        decimals: 18
    },
    blockExplorerUrls: ['https://scan.test2.btcs.network']
};

// Connect wallet and switch/add Core Testnet
async function connectCoreTestnet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask or another compatible wallet.');
        return;
    }
    try {
        // Request wallet connection
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Try switching to Core Testnet
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: coreTestnetConfig.chainId }]
        });
    } catch (switchError) {
        // If the chain is not added, add it
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [coreTestnetConfig]
                });
            } catch (addError) {
                alert('Failed to add Core Testnet: ' + addError.message);
            }
        } else {
            alert('Failed to switch network: ' + switchError.message);
        }
    }
}

// Example: Attach to a button with id="connect-core-btn"
// document.getElementById('connect-core-btn').onclick = connectCoreTestnet;