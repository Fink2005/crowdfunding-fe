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
        <ul>
          <li className="font-mono">
            <NavLink
              to="/idea"
              className={({ isActive }) =>
                isActive ? 'text-blue-500' : 'text-gray-700'
              }
            >
              Launch Your Idea
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
