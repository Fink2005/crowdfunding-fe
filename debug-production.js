// Paste this in browser Console on https://fundhive.pro.vn
// to debug why campaigns are not loading

console.log('=== 🔍 Production Debug ===\n')

// 1. Check if React app is mounted
console.log('1️⃣ React root mounted:', !!document.querySelector('body'))
console.log('  - Has scripts:', document.querySelectorAll('script[type="module"]').length, 'module scripts')

// 2. Check if app loaded (look for React root)
const hasReactRoot = !!document.querySelector('[data-rk]') || !!document.querySelector('[class*="App"]')
console.log('  - React app loaded:', hasReactRoot ? '✅ Yes' : '❌ No')

// 3. Check environment variables (can't access import.meta in Console, check window instead)
console.log('\n2️⃣ Checking window objects:')
console.log('  - window.__reactRouterContext:', !!window.__reactRouterContext)
console.log('  - window.__reactRouterRouteModules:', !!window.__reactRouterRouteModules)

// 3. Check if Wagmi is initialized
setTimeout(() => {
  console.log('\n3️⃣ Checking Wagmi/Web3 state after 2s...')
  
  // Check if window has wagmi
  const hasWagmi = window.__wagmi__ || window.wagmi
  console.log('  - Wagmi in window:', hasWagmi ? '✅ Found' : '❌ Not found')
  
  // Check if RainbowKit modal exists
  const hasRainbowKit = document.querySelector('[data-rk]')
  console.log('  - RainbowKit mounted:', hasRainbowKit ? '✅ Yes' : '❌ No')
  
  // Check campaign cards
  const campaignCards = document.querySelectorAll('[data-campaign-id]')
  const skeletons = document.querySelectorAll('[data-skeleton]')
  console.log('\n4️⃣ Campaign cards:')
  console.log('  - Campaign cards found:', campaignCards.length)
  console.log('  - Skeleton loaders found:', skeletons.length)
  
  // Check React Query
  console.log('\n5️⃣ React Query state:')
  const queryClient = window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__?.queryClient
  if (queryClient) {
    const queries = queryClient.getQueryCache().getAll()
    console.log('  - Total queries:', queries.length)
    queries.forEach(query => {
      const state = query.state
      console.log(`  - ${query.queryHash}:`, {
        status: state.status,
        error: state.error?.message
      })
    })
  } else {
    console.log('  - ❌ React Query not found')
  }
  
  console.log('\n=== 🏁 Debug Complete ===')
}, 2000)

// Log any errors
window.addEventListener('error', (e) => {
  console.error('❌ Global error:', e.error)
})

console.log('\n⏳ Waiting 2 seconds for app to initialize...')
