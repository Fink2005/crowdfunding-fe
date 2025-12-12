// Paste this in browser console on https://fundhive.pro.vn
// to check if WalletConnect Project ID was embedded

console.log('=== Checking Environment Variables ===');
console.log('Build mode:', import.meta.env.MODE);
console.log('VITE_WALLETCONNECT_PROJECT_ID:', import.meta.env.VITE_WALLETCONNECT_PROJECT_ID);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Check wagmi config
import('@/shared/config/wagmiConfig').then(module => {
  console.log('\n=== Wagmi Config ===');
  console.log('Config:', module.wagmiConfig);
  console.log('Chains:', module.wagmiConfig.chains);
});

// Check if window has wagmi/viem
console.log('\n=== Global Objects ===');
console.log('window.ethereum:', window.ethereum ? 'Available' : 'Not available');
