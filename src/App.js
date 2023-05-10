import logo from "./logo.svg";
import "./App.css";

import { SafeAuthKit, Web3AuthModalPack } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WALLET_ADAPTERS } from "@web3auth/base";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";

import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";

import { useEffect, useState } from "react";

const WEB3_AUTH_CLIENT_ID =
  "BNVHKQQNqwNQSTBomstQ29-Hxh-ri77E5OreTGJ6lLyHr0vj7cnbr6sZTxOXyjF_8nlYltULDWY-f2Cx70PbMUM";

function App() {
  const [safeInstance, setSafeInstance] = useState();
  const [userData, setUserData] = useState({
    provider: "",
    address: "",
    signer: "",
  });

  // https://web3auth.io/docs/sdk/web/modal/initialize#arguments
  const options = {
    clientId: WEB3_AUTH_CLIENT_ID,
    web3AuthNetwork: "testnet",
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0x13881", // hex of 80001, polygon testnet
      rpcTarget: "https://rpc-mumbai.maticvigil.com/",
    },
    uiConfig: {
      theme: "dark",
      loginMethodsOrder: ["google", "facebook"],
    },
  };

  // https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
  const modalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: "torus",
      showOnModal: false,
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: "metamask",
      showOnDesktop: true,
      showOnMobile: false,
    },
  };

  // https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "mandatory",
    },
    adapterSettings: {
      uxMode: "popup",
      whiteLabel: {
        name: "Safe",
      },
    },
  });

  const pack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig);

  const initializeSafe = async () => {
    const safeAuthKit = await SafeAuthKit.init(pack, {
      txServiceUrl: "https://safe-transaction-goerli.safe.global",
    });

    console.log(safeAuthKit);
    setSafeInstance(safeAuthKit);
  };
  useEffect(() => {
    initializeSafe();
  }, []);

  // login function
  const login = async () => {
    try {
      const userAddress = await safeInstance.signIn();
      console.log(userAddress);
      const provider = new ethers.providers.Web3Provider(
        safeInstance.getProvider()
      );

      setUserData({
        ...userData,
        address: userAddress,
        provider: provider,
        signer: provider.getSigner(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // deploy safe
  const deploySafe = async () => {
    try {
      // const privateKey = await safeInstance.provider.request({
      //   method: "eth_private_key",
      // });
      // console.log(privateKey);
      const signer = userData.signer;

      console.log(signer);
      console.log(userData.address.eoa);

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: userData.signer,
      });
      console.log(ethAdapter);

      const safeFactory = await SafeFactory.create({ ethAdapter });
      console.log(safeFactory);

      const owners = [`${userData.address.eoa}`];
      const threshold = 1;

      const safeAccountConfig = {
        owners,
        threshold,
        // ...
      };

      const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
      console.log(safeSdk);
      const newSafeAddress = await safeSdk.getAddress();
      console.log(newSafeAddress);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <button onClick={login}>Login</button>
      <button onClick={deploySafe}>deploySafe</button>
    </div>
  );
}

export default App;
