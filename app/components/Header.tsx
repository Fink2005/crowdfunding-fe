import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="h-[60px] fixed top-0 w-full border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-[#030712] z-50">
      <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
        <h1 className="text-lg md:text-xl font-semibold m-0 dark:text-white">
          fundhive.
        </h1>
      </NavLink>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-6">
          <li className="font-mono text-sm">
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
          <li className="font-mono text-sm">
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

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-2">
        <ModeToggle />
        <ConnectButton showBalance label="Connect" />
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-2">
        <ModeToggle />
        <ConnectButton showBalance={false} label="Connect Wallet" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-white dark:bg-[#030712] z-40 md:hidden">
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="/idea"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg font-mono text-base ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  🚀 Launch Your Idea
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-campaigns"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg font-mono text-base ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  📋 My Campaigns
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
