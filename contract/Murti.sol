pragma solidity ^0.8.0;

import "../contracts/utils/math/SafeMath.sol";
import "../contracts/access/Ownable.sol";
import "../contracts/utils/Address.sol";
import "../contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../contracts/utils/Counters.sol";
import "../chainlink/VRFConsumerBase.sol";
import "./Auth.sol";

contract TestMurti is ERC721Enumerable, Auth, VRFConsumerBase {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    bytes32 internal keyHash;
    uint256 internal fee;

    string private _baseUri;
    string private _fileExtension;

    Counters.Counter tokenCounter;

    uint256 private mintPrice;

    mapping(uint256 => uint256) tokenToType;

    struct MintRequest {
        address minter;
        bytes32 hashedReq;
        bool fulfilled;
    }

    uint256 TYPES = 69; //types for now
    mapping(bytes32 => bool) hashToFulfill;
    mapping(bytes32 => MintRequest) hashToRequest;

    address private fundAddress;

    constructor()
        ERC721("TestMurti", "TMURTI")
        Auth(msg.sender)
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB
        )
    {
        mintPrice = 0 ether;
        fundAddress = msg.sender;
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18;
    }

    function setMintPrice(uint256 newPrice) external authorized {
        mintPrice = newPrice;
    }

    function getCurrentTokenCount() external view returns (uint256) {
        return tokenCounter.current();
    }

    function setBaseUri(string memory uri) public authorized {
        _baseUri = uri;
    }

    function setFileExtension(string memory ext) public authorized {
        _fileExtension = ext;
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    _baseUri,
                    uint2str(tokenToType[tokenId]),
                    _fileExtension
                )
            );
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        require(hashToFulfill[requestId] == false, "Request already filled");
        require(
            hashToRequest[requestId].fulfilled == false,
            "Request already filled"
        );

        uint256 typeOfNFT = (randomness % TYPES) + 1;
        tokenCounter.increment();
        uint256 _tokenId = tokenCounter.current();
        tokenToType[_tokenId] = typeOfNFT;

        _safeMint(hashToRequest[requestId].minter, _tokenId);

        hashToFulfill[requestId] = true;
        hashToRequest[requestId].fulfilled = true;
    }

    function mintNFTs(uint256 numberOfNfts) external payable {
        uint256 totalCost = numberOfNfts * mintPrice;

        require(msg.value == totalCost, "Not enough MATIC");
        payable(fundAddress).transfer(msg.value);

        for (uint256 i = 0; i < numberOfNfts; i++) {
            bytes32 reqId = requestRandomness(keyHash, fee);
            hashToRequest[reqId] = MintRequest(msg.sender, reqId, false);
            hashToFulfill[reqId] = false;
        }
    }

    function resuce() external authorized {
        uint256 totalBalance = address(this).balance;
        payable(msg.sender).transfer(totalBalance);
    }
}
