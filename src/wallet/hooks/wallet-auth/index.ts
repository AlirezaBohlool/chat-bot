import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import axios from "axios";
import { keccak256, stringToHex } from "viem";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/auth";
import { jwtDecode } from "jwt-decode";

// Types
interface AuthContent {
  nonce: string;
  metaData: string;
}

interface AuthResponse {
  result: {
    token: string;
    // Add other properties as needed
  };
}

// JWT token structure  
interface Role {
  roleId: string;
  slug: string;
}

interface DecodedToken {
  auth: string;
  roles: Role[];
  iat: number;
  exp: number;
}

interface UseWalletLoginOptions {
  metaData?: string;
  onLoginSuccess?: (response: AuthResponse) => void;
  onLoginError?: (error: any) => void;
}

export const useWalletLogin = (options: UseWalletLoginOptions = {}) => {
  const {
    metaData = "1234",
    onLoginSuccess,
    onLoginError,
  } = options;

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    // Check if wallet is connected and proceed with authentication
    if (isConnected && address) {
      handleWalletLogin();
    }
  }, [isConnected, address]);

  const fetchNonce = async (walletAddress: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DAPP_API}/api/v1/wallet/nonce`,
        {
          walletAddress,
        }
      );
      return response.data.result.nonce;
    } catch (error) {
      disconnect(); // Disconnect if there's an error
      setWalletError("Failed to start authentication process");
      throw error;
    }
  };

  const signMessage = async (nonce: string): Promise<string> => {
    try {
      const content: AuthContent = {
        nonce,
        metaData,
      };
      const message = JSON.stringify(content);
      const messageHash = keccak256(stringToHex(message));

      const signature = await signMessageAsync({ message: messageHash });
      return signature.toLowerCase();
    } catch (error) {
      setWalletError("Signature request was rejected");
      disconnect();
      throw error;
    }
  };  const walletLogin = async (
    signature: string,
    walletAddress: string,
    nonce: string
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DAPP_API}/api/v1/wallet/signin-wallet`,
        {
          signature,
          walletAddress,
          content: {
            nonce,
            metaData,
          },
        }
      );
      
      const token = response.data.result.token;
      
      try {
        // Decode token to verify it's valid
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Only store the initial token, don't call setRole automatically
        // Let the dashboard modal handle role selection
        dispatch(setToken(token));
      } catch (decodeError) {
        console.error('Failed to decode wallet token:', decodeError);
        throw new Error('Invalid token received from wallet authentication');
      }
      
      return response.data;
    } catch (error) {
      setWalletError("Authentication failed");
      disconnect();
      throw error;
    }
  };
  const handleWalletLogin = async () => {
    if (!address) return;

    setIsLoading(true);
    setWalletError("");
    setGeneralError("");

    try {
      const nonce = await fetchNonce(address.toLowerCase());
      const signature = await signMessage(nonce);
      const authResult = await walletLogin(
        signature.toLowerCase(),
        address.toLowerCase(),
        nonce
      );
      
      // Call onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(authResult);
      }
    } catch (error) {
      disconnect();

      if (onLoginError) {
        onLoginError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    setWalletError(""); // Clear previous errors
    open();
  };

  return {
    isLoading,
    walletError,
    generalError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
    setWalletError,
    setGeneralError,
  };
};
