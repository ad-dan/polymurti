import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { Component } from "react";
import { thistle } from "color-name";
import "semantic-ui-css/semantic.min.css";
import {
  Container,
  Button,
  Header,
  Image,
  Input,
  Label,
} from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import md5 from "md5";

const NFT_ADDRESS = "0xe6a0df91275c9F088f29275AF3DA86b0b5BbD6B1";
const CHAIN_ID = "80001";

let searchInterval = null;

const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "adr",
        type: "address",
      },
    ],
    name: "authorize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "numberOfNfts",
        type: "uint256",
      },
    ],
    name: "mintNFTs",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "resuce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "setBaseUri",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "ext",
        type: "string",
      },
    ],
    name: "setFileExtension",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "setMintPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "adr",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "adr",
        type: "address",
      },
    ],
    name: "unauthorize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentTokenCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "adr",
        type: "address",
      },
    ],
    name: "isAuthorized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "7a47d34b7e3f4809adab2557aeae1336", // required
    },
  },
};

const web3Modal = new Web3Modal({
  providerOptions, // required
  theme: "dark",
});

class App extends Component {
  constructor() {
    super();
    this.audio = new Audio("./sound.mp3");
    this.mintAudio = new Audio("./mintsound.mp3");
    this.refAudio = new Audio("./menu cl.mp3");

    this.state = {
      web3: null,
      nftContract: null,
      chainId: null,
      isWalletConnected: false,
      currentAccount: null,
      isWL: false,
      mintAmount: 1,
      mintCost: 0,
      nftData: [],

      totalMinted: null,
      currRarity: null,
      currRarityInput: "",
    };
  }

  connect = async () => {
    web3Modal.clearCachedProvider();
    const provider = await web3Modal.connect({ disableInjectedProvider: true });

    provider.on("accountsChanged", this.populateInfo);

    const web3 = new Web3(provider);

    const nftContract = new web3.eth.Contract(CONTRACT_ABI, NFT_ADDRESS);

    window.nftContract = nftContract;
    this.setState(
      {
        web3,
        isWalletConnected: true,
        nftContract,
      },
      this.populateInfo
    );
  };

  populateInfo = async () => {
    if (!this.state.web3) return;
    const { web3 } = this.state;
    const accounts = await web3.eth.getAccounts();
    this.setState(
      {
        currentAccount: accounts[0],
      },
      () => {
        if (searchInterval) {
          clearInterval(searchInterval);
        }
        searchInterval = setInterval(this.getUserNFTs, 60 * 1000);
        this.getUserNFTs();
      }
    );
  };
  getUserNFTs = async () => {
    const { web3 } = this.state;
    if (!web3) return;
    const [currentAccount] = await web3.eth.getAccounts();

    const totalNFTsOwned = await this.state.nftContract.methods
      .balanceOf(currentAccount)
      .call();

    const totalNFTsMinted = await this.state.nftContract.methods
      .totalSupply()
      .call();

    const nftTokenArr = [];

    for (let i = 0; i < totalNFTsOwned; i++) {
      const currentTokenId = await this.state.nftContract.methods
        .tokenOfOwnerByIndex(currentAccount, i)
        .call();
      const URIURL = await this.state.nftContract.methods
        .tokenURI(currentTokenId)
        .call();
      const jsonFile = await window.fetch(URIURL);
      const data = await jsonFile.json();
      console.log({ data });
      nftTokenArr.push({
        id: currentTokenId,
        attributes: data.attributes,
        src: data.image,
      });
    }

    this.setState({
      nftData: nftTokenArr,
      totalMinted: totalNFTsMinted,
    });
  };
  changeMintAmount = (i) => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play();
    const currAmount = this.state.mintAmount;
    if (currAmount + i > 0) {
      this.setState({
        mintAmount: currAmount + i,
      });
    }
  };

  mintNFT = async () => {
    if (!this.state.web3) return;
    this.mintAudio.pause();
    this.mintAudio.currentTime = 0;
    this.mintAudio.play();
    const { web3, currentAccount, nftContract, mintAmount, mintCost } =
      this.state;
    const mintFee = 0;
    await nftContract.methods
      .mintNFTs(mintAmount)
      .send({
        value: web3.utils.toWei(`${mintAmount * mintFee}`, "ether"),
        from: currentAccount,
      })
      .on("receipt", () => {
        toast.success(`Ordered ${mintAmount} NFTs!`);
        setTimeout(this.getUserNFTs, 0);
      });
  };

  render() {
    const nftDisplay = this.state.nftData.map((data) => {
      const { id, attributes, src } = data;
      const picSrc = src;
      return (
        <div className="card">
          <div className="card-img">
            <Image src={picSrc} />
          </div>
          <div>
            <div>
              <div className="card-head">#{id}</div>
            </div>
            <div className="card-labels">
              {attributes.map((attr) => (
                <Label color="black">
                  {attr["trait_type"]}{" "}
                  <Label.Detail>{attr["value"]}</Label.Detail>
                </Label>
              ))}{" "}
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <ToastContainer theme="colored" />
        <Container textAlign="center" style={{ paddingTop: 12 }}>
          <Header as="h1">Mumbai Testnet Version</Header>
          <Image className="rot-img" src="./ganeshwebp.webp"></Image>
          {/* {!this.state.web3 && <div>Wallet not connected</div>} */}
          {!this.state.web3 && (
            <>
              {" "}
              <Button className="connect-btn" onClick={this.connect}>
                Connect Wallet
              </Button>
            </>
          )}
          {this.state.isWalletConnected && (
            <div>
              <Header as="h1">
                Minted: {this.state.totalMinted || "🐘🐘🐘"} / 69{"   "}
                {!!this.state.totalMinted &&
                  `     (${((this.state.totalMinted / 69) * 100).toFixed(0)}%)`}
              </Header>
              <Header as="h2">Price: 0 MATIC</Header>

              <div className="inp-reg">
                <div
                  className="inp-btn cl"
                  onClick={() => this.changeMintAmount(-1)}
                >
                  <Image src="./minus.svg" />
                </div>
                <div className="inp-btn inp-val">{this.state.mintAmount}</div>
                <div
                  className="inp-btn cl"
                  onClick={() => this.changeMintAmount(1)}
                >
                  {" "}
                  <Image src="./plus.svg" />
                </div>
              </div>

              <Button
                onClick={this.mintNFT}
                className="mint-btn"
                style={{ marginTop: 64 }}
              >
                {"Mint"}
              </Button>
            </div>
          )}
        </Container>
        {this.state.isWalletConnected && (
          <Container textAlign="center" style={{ paddingTop: 30 }}>
            <div className="cllct">
              <Header as="h1">My Collection</Header>
              <Image
                className="rfrsh"
                src="./refresh.svg"
                onClick={() => {
                  this.refAudio.pause();
                  this.refAudio.currentTime = 0;
                  this.refAudio.play();
                  this.getUserNFTs();
                }}
              />
            </div>

            <div className="cards-container">{nftDisplay}</div>
          </Container>
        )}
      </div>
    );
  }
}

export default App;
