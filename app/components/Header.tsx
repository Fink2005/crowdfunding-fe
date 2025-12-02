import { ModeToggle } from '@/components/ModeToggle'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NavLink } from 'react-router'

const Header = () => {
  return (
    <header className="h-[60px] fixed top-0 w-full border-b border-gray-200 flex items-center justify-between px-5 bg-white dark:bg-[#030712] z-50">
      <NavLink to="/">
        <h1 className="text-lg font-semibold m-0 dark:text-white">fundhive.</h1>
      </NavLink>
      <nav>
        <ul className="flex items-center gap-6">
          <li className="font-mono">
            <NavLink
              to="/idea"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }
            >
              Launch Your Idea
            </NavLink>
          </li>
          <li className="font-mono">
            <NavLink
              to="/my-campaigns"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }
            >
              My Campaigns
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <ConnectButton showBalance label="Connect" />
      </div>
    </header>
  )
}

export default Header
