import React, { useState } from 'react';
import { Link } from 'wouter';
import { WalletConnectButton } from '@/components/ui/wallet-connect';
import { Button } from '@/components/ui/button';
import { Menu, X, MessageSquareText } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 rounded-lg crypto-gradient flex items-center justify-center">
                  <span className="font-mono font-bold text-white">NF</span>
                </div>
                <span className="ml-3 font-mono font-bold text-xl text-white">NustarFund</span>
              </a>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href="/explore">
                <a className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium">
                  Explore
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium">
                  How It Works
                </a>
              </Link>
              <Link href="/profile">
                <a className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium">
                  Profile
                </a>
              </Link>
              <Link href="/tax-info">
                <a className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium">
                  Tax & Donations
                </a>
              </Link>
              {/* Chat Link
              <Link href="/CreativeDataSync">
                <a className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium flex items-center gap-1">
                  <MessageSquareText className="h-4 w-4" />
                  Chat
                </a>
              </Link> */}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <WalletConnectButton />
            </div>
            <Button
              onClick={toggleMobileMenu}
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
          <Link href="/explore">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              Explore
            </a>
          </Link>
          <Link href="/how-it-works">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              How It Works
            </a>
          </Link>
          <Link href="/profile">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              Profile
            </a>
          </Link>
          <Link href="/#faq">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              FAQ
            </a>
          </Link>
          {/* Chat Link in Mobile */}
          <Link href="/CreativeDataSync">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              <MessageSquareText className="inline h-4 w-4 mr-2" />
              Chat
            </a>
          </Link>
          <div className="mt-4 px-3">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
