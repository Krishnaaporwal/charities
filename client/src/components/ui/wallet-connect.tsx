import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { formatWalletAddress, getNetworkName, isNetworkSupported } from '@/lib/web3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, X, AlertTriangle } from 'lucide-react';
import { SiMetamask } from '@react-icons/all-files/si/SiMetamask';
import { SiWalletconnect } from '@react-icons/all-files/si/SiWalletconnect';
import { SiCoinbase } from '@react-icons/all-files/si/SiCoinbase';

export const WalletConnectButton: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isConnecting, chainId } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (method: string) => {
    await connectWallet();
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={account ? "outline" : "default"} 
          className={account ? "bg-muted hover:bg-muted/80" : "crypto-gradient hover:opacity-90"}
          size="sm"
        >
          <Wallet className="h-5 w-5 mr-2" />
          {account ? formatWalletAddress(account) : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {account ? "Wallet Connected" : "Connect Wallet"}
          </DialogTitle>
          <DialogDescription>
            {account 
              ? "Your wallet is connected to CryptoFund" 
              : "Connect your crypto wallet to interact with the platform."}
          </DialogDescription>
        </DialogHeader>

        {account ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="font-mono text-sm">{formatWalletAddress(account)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network</span>
                <div className="flex items-center">
                  {isNetworkSupported(chainId) ? (
                    <span className="font-medium text-sm">{getNetworkName(chainId)}</span>
                  ) : (
                    <div className="flex items-center text-destructive text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span>Unsupported Network</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleDisconnect} 
              variant="destructive" 
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => handleConnect('metamask')} 
              className="w-full flex items-center justify-between p-4 bg-muted rounded-xl border border-border hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center">
                <SiMetamask className="h-8 w-8 text-[#F6851B]" />
                <span className="ml-3 font-medium">MetaMask</span>
              </div>
              <span className="text-primary text-sm">Popular</span>
            </button>
            
            <button 
              onClick={() => handleConnect('walletconnect')} 
              className="w-full flex items-center justify-between p-4 bg-muted rounded-xl border border-border hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center">
                <SiWalletconnect className="h-8 w-8 text-[#3B99FC]" />
                <span className="ml-3 font-medium">WalletConnect</span>
              </div>
              <span className="text-muted-foreground text-sm">Universal</span>
            </button>
            
            <button 
              onClick={() => handleConnect('coinbase')} 
              className="w-full flex items-center justify-between p-4 bg-muted rounded-xl border border-border hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center">
                <SiCoinbase className="h-8 w-8 text-[#0052FF]" />
                <span className="ml-3 font-medium">Coinbase Wallet</span>
              </div>
              <span className="text-muted-foreground text-sm">Mobile</span>
            </button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            By connecting your wallet, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
