import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { SafeAuthKit, Web3AuthModalPack } from "@safe-global/auth-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayAdapter } from "@safe-global/relay-kit";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import Safe, { SafeFactory } from "@safe-global/protocol-kit";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WALLET_ADAPTERS } from "@web3auth/base";

import { ethers } from "ethers";

import contractABI from "./artifacts/contract.json";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import FirstPage from "./pages/FirstPage";
import SecondPage from "./pages/SecondPage";
import ThirdPage from "./pages/ThirdPage";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";

// const contractAddress = "0x61De71734C89C9a359028962f6834A2ae099293e";
const contractAddress = "0x4a88d4D7A355cbC6a45D95D53aB70829EA249275";

const WEB3_AUTH_CLIENT_ID =
  "BJolOCXyRwP89SBB61VIfZjR3VdkB_-fDEfDmk_GSI02QEY21-anUB0CyaEmiWJjLdzIGtgJNYozp8KjXMhuay4";

function App() {
  const [safeInstance, setSafeInstance] = useState();
  const [userData, setUserData] = useState({
    provider: "",
    address: "",
    signer: "",
    balance: "",
    profileImg: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    console.log(`${process.env.REACT_APP_IMP_K}`);
    // https://web3auth.io/docs/sdk/web/modal/initialize#arguments
    const options = {
      clientId: WEB3_AUTH_CLIENT_ID,
      web3AuthNetwork: "testnet",
      // chainConfig: {
      //   chainNamespace: "eip155",
      //   chainId: "0x13881", // hex of 80001, polygon testnet
      //   rpcTarget: "https://rpc-mumbai.maticvigil.com/",
      // },
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x5",
        // https://chainlist.org/
        rpcTarget: `https://rpc.ankr.com/eth_goerli`,
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
    const pack = new Web3AuthModalPack(
      options,
      [openloginAdapter],
      modalConfig
    );
    const initializeSafe = async () => {
      const safeAuthKit = await SafeAuthKit.init(pack, {
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      });

      console.log(safeAuthKit);
      setSafeInstance(safeAuthKit);
    };
    initializeSafe();
  }, []);

  // login function
  const login = async () => {
    try {
      const userAddress = await safeInstance.signIn();
      console.log(userAddress);
      const info = await safeInstance.getUserInfo();
      console.log(info);
      const provider = new ethers.providers.Web3Provider(
        safeInstance.getProvider()
      );
      const balance = await provider.getBalance(userAddress.eoa);
      console.log();
      setUserData({
        ...userData,
        address: userAddress,
        provider: provider,
        signer: provider.getSigner(),
        balance: parseInt(balance) / Math.pow(10, 18),
        profileImg: info.profileImage,
        email: info.email,
        name: info.name,
      });
      // check this below condition before calling any other function except login
      // if (userAddress.safes.length === 0) {
      //   deploySafe();
      // }
    } catch (err) {
      console.log(err);
    }
  };

  //logout function

  const logout = async () => {
    try {
      await safeInstance.signOut();
      setUserData({
        provider: "",
        address: "",
        signer: "",
        balance: "",
        profileImg: "",
        name: "",
        email: "",
      });
    } catch (err) {
      console.log(err);
    }
  };
  // deploy safe
  const deploySafe = async () => {
    try {
      const RPC_URL = "https://eth-goerli.public.blastapi.io";
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      // console.log(provider);
      // const signer = userData.signer;
      const owner1Signer = new ethers.Wallet(
        `${process.env.REACT_APP_IMP_K}`,
        provider
      );
      console.log(owner1Signer);
      console.log(userData.address);

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: owner1Signer,
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

      const safeSdk = await safeFactory.deploySafe({
        safeAccountConfig,
      });
      console.log(safeSdk);
      const newSafeAddress = await safeSdk.getAddress();
      console.log("Your Safe has been deployed:");
      console.log(`https://goerli.etherscan.io/address/${newSafeAddress}`);
      console.log(`https://app.safe.global/gor:${newSafeAddress}`);
      console.log(newSafeAddress);
    } catch (err) {
      console.log(err);
    }
  };

  // contract functions to send msg into contract
  const sayHello = async () => {
    // const RPC_URL =
    //   "https://eth-goerli.g.alchemy.com/v2/ZCKl4kBCa9k_St-OJHoAVeEhpM0P22W-";
    // const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    // const signer = new ethers.Wallet("private key", provider);
    // const safeAddress = "0xCEdbC2c8a42aEdf0859E5b8a21e24405B8CD8245"; // Safe from which the transaction will be sent. Replace with your Safe address
    const chainId = 5;

    // Get Gelato Relay API Key: https://relay.gelato.network/
    const GELATO_RELAY_API_KEY = "MuKjSVedmLh21RUTtQUA8V1MCeBnRhRjn2xT61_IPVQ_";

    // Usually a limit of 21000 is used but for smart contract interactions, you can increase to 100000 because of the more complex interactions.
    const gasLimit = "100000";

    const options = {
      gasLimit: ethers.BigNumber.from(gasLimit),
      isSponsored: true,
    };

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: userData.signer,
    });
    const safeAddress = userData.address.safes[0];
    console.log(safeAddress);
    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });
    console.log(safeSDK);

    const relayAdapter = new GelatoRelayAdapter(GELATO_RELAY_API_KEY);

    console.log(relayAdapter);
    // encode data
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      userData.signer
    );
    const functionName = "sayHello";
    const functionArgs = "Good morning!";

    const functionData = contract.interface.encodeFunctionData(functionName, [
      functionArgs,
    ]);
    console.log(functionData);
    // const contract_address = "0x828d8CD5b5a74c7ED768d74379F404977e5fEfc4";
    // const c_address = "0xE648F46aEE4c3ec13c1870bE0AdB5307c1a941b7";
    // const e_data =
    //   "0xa80121090000000000000000000000000000000000000000000000000000000000000007";

    // send transaction
    const safeTransactionData = {
      to: contractAddress,
      data: functionData,
      value: 0,
    };

    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });

    const signedSafeTx = await safeSDK.signTransaction(safeTransaction);

    const encodedTx = safeSDK
      .getContractManager()
      .safeContract.encode("execTransaction", [
        signedSafeTx.data.to,
        signedSafeTx.data.value,
        signedSafeTx.data.data,
        signedSafeTx.data.operation,
        signedSafeTx.data.safeTxGas,
        signedSafeTx.data.baseGas,
        signedSafeTx.data.gasPrice,
        signedSafeTx.data.gasToken,
        signedSafeTx.data.refundReceiver,
        signedSafeTx.encodedSignatures(),
      ]);

    const relayTransaction = {
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options,
    };
    const response = await relayAdapter.relayTransaction(relayTransaction);

    console.log(
      `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
    );
  };

  //contract get msg function

  const getMsg = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        safeInstance.getProvider()
      );
      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log(contract);
      const data = await contract.getHello();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  //using safe-Gelato-send-transaction

  const usingSafeGelato = async () => {
    // Customize the following variables
    // https://chainlist.org
    // const RPC_URL =
    //   "https://eth-goerli.g.alchemy.com/v2/ZCKl4kBCa9k_St-OJHoAVeEhpM0P22W-";
    // const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    // const signer = new ethers.Wallet("private key", provider);
    // const safeAddress = "0xCEdbC2c8a42aEdf0859E5b8a21e24405B8CD8245"; // Safe from which the transaction will be sent. Replace with your Safe address
    const chainId = 5;

    // Any address can be used for destination. In this example, we use vitalik.eth
    const destinationAddress = "0x1B1d688A5b37e57Be1179694D0f15E05B6de8cC3";
    const withdrawAmount = ethers.utils
      .parseUnits("0.00005", "ether")
      .toString();
    console.log(withdrawAmount);

    // Get Gelato Relay API Key: https://relay.gelato.network/
    const GELATO_RELAY_API_KEY = "MuKjSVedmLh21RUTtQUA8V1MCeBnRhRjn2xT61_IPVQ_";

    // Usually a limit of 21000 is used but for smart contract interactions, you can increase to 100000 because of the more complex interactions.
    const gasLimit = "100000";

    // Create a transaction object
    const safeTransactionData = {
      to: destinationAddress,
      data: "0x", // leave blank for ETH transfers
      value: withdrawAmount,
      operation: OperationType.Call,
    };

    const options = {
      gasLimit: ethers.BigNumber.from(gasLimit),
      isSponsored: true,
    };

    console.log(userData.signer);
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: userData.signer,
    });

    console.log(ethAdapter);

    const safeAddress = userData.address.safes[0];
    console.log(safeAddress);
    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });
    console.log(safeSDK);

    const relayAdapter = new GelatoRelayAdapter(GELATO_RELAY_API_KEY);
    console.log(relayAdapter);

    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });
    console.log(safeTransaction);
    const signedSafeTx = await safeSDK.signTransaction(safeTransaction);
    console.log(signedSafeTx);
    const encodedTx = safeSDK
      .getContractManager()
      .safeContract.encode("execTransaction", [
        signedSafeTx.data.to,
        signedSafeTx.data.value,
        signedSafeTx.data.data,
        signedSafeTx.data.operation,
        signedSafeTx.data.safeTxGas,
        signedSafeTx.data.baseGas,
        signedSafeTx.data.gasPrice,
        signedSafeTx.data.gasToken,
        signedSafeTx.data.refundReceiver,
        signedSafeTx.encodedSignatures(),
      ]);

    const relayTransaction = {
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options,
    };
    const response = await relayAdapter.relayTransaction(relayTransaction);
    console.log(response);
    console.log(
      `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
    );
  };

  const sendFunds = async () => {
    try {
      const destination = "0x1B1d688A5b37e57Be1179694D0f15E05B6de8cC3";
      const amount = ethers.utils.parseEther("0.48");
      console.log(amount);
      const tx = await userData.signer.sendTransaction({
        from: userData.address.eoa,
        to: destination,
        value: amount,
      });
      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
      {/* <button onClick={login}>Login</button>
      <button onClick={deploySafe}>deploySafe</button>

      <button onClick={usingSafeGelato}>usingSafeGelato</button>

      <button onClick={sayHello}>Send Msg</button>
      <button onClick={getMsg}>get msg</button>
      <button onClick={sendFunds}>sendFunds</button>
      <button onClick={logout}>logout</button> */}

      <Router>
        <Navbar login={login} userData={userData} logout={logout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/profile"
            element={
              <Profile userData={userData} safeInstance={safeInstance} />
            }
          />
          <Route path="/first-page" element={<FirstPage />} />
          <Route path="/second-page" element={<SecondPage />} />
          <Route path="/third-page" element={<ThirdPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
