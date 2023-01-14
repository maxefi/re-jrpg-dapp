// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

// Helper we wrote to encode in Base64
import "../libraries/Base64.sol";

// Our contract inherits from ERC721, which is the standard NFT contract!
contract ReJrpgDapp is ERC721 {
    // We'll hold our character's attributes in a struct. Feel free to add
    // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
        uint256 dodgeChance;
    }

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
        uint256 dodgeChance;
    }

    BigBoss public bigBoss;

    // The tokenId is the NFTs unique identifier, it's just a number that goes
    // 0, 1, 2, 3, etc.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // A lil array to help us hold the default data for our characters.
    // This will be helpful when we mint new characters and need to know
    // things like their HP, AD, etc.
    CharacterAttributes[] defaultCharacters;

    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // A mapping from an address => the NFTs tokenId. Gives me an ez way
    // to store the owner of the NFT and reference it later.
    mapping(address => uint256) public nftHolders;
    
    // this is used to help ensure that the algorithm has different inputs every time
    uint randNonce = 0;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(
        address sender,
        uint256 newBossHp,
        uint256 newPlayerHp
    );

    // Data passed in to the contract when it's first created initializing the characters.
    // We're going to actually pass these values in from run.js.
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        uint256[] memory characterDodgeChance,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage,
        uint256 bossDodgeChance
    )
        // Below, you can also see I added some special identifier symbols for our NFT.
        // This is the name and symbol for our token, ex Ethereum and ETH. I just call mine
        // Heroes and HERO. Remember, an NFT is just a token!
        ERC721("Stars", "STARS")
    {
        // Initialize the boss. Save it to our global "bigBoss" state variable.
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage,
            dodgeChance: bossDodgeChance
        });

        console.log(
            "Done initializing boss %s w/ HP %s, img %s",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.imageURI
        );

        // Loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i],
                    dodgeChance: characterDodgeChance[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];

            // Hardhat's use of console.log() allows up to 4 parameters in any order of following types: uint, string, bool, address
            console.log(
                "Done initializing %s w/ HP %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }

        // I increment _tokenIds here so that my first NFT has an ID of 1.
        // More on this in the lesson!
        _tokenIds.increment();
    }

    // Users would be able to hit this function and get their NFT based on the
    // characterId they send in!
    function mintCharacterNFT(uint256 _characterIndex) external {
        // Get current tokenId (starts at 1 since we incremented in the constructor).
        uint256 newItemId = _tokenIds.current();

        // The magical function! Assigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        // We map the tokenId => their character attributes. More on this in
        // the lesson below.
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage,
            dodgeChance: defaultCharacters[_characterIndex].dodgeChance
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        // Keep an easy way to see who owns what NFT.
        nftHolders[msg.sender] = newItemId;

        // Increment the tokenId for the next person that uses it.
        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );
        string memory strDodgeChance = Strings.toString(
            charAttributes.dodgeChance
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game RE JRPG DAPP!", "image": "ipfs://',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "HP", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "DMG", "value": ',
                strAttackDamage,
                '}, { "trait_type": "DODGE", "value": ',
                strDodgeChance,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function randomInt(uint _modulus) internal returns(uint) {
        randNonce++;                                                // increase nonce
        return uint(keccak256(abi.encodePacked(block.timestamp,     // `now` is an alias for 'block.timestamp', but it's depricated
                                          msg.sender,               // your address
                                          randNonce))) % _modulus;  // modulo using the _modulus argument
    }

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        console.log(
            "\nPlayer w/ character %s about to attack. Has %s HP and %s DMG",
            player.name,
            player.hp,
            player.attackDamage
        );
        console.log(
            "%s has %s HP and %s DMG",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );

        // Make sure the player has more than 0 HP.
        require(player.hp > 0, "YOU DIED...");

        // Make sure the boss has more than 0 HP.
        require(bigBoss.hp > 0, "TYRANT IS DEAD, GRATS!");

        // Allow player to attack boss.
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
            console.log("%s attacked boss. New boss hp: %s", player.name, bigBoss.hp);
        } else {
            // by passing 10 as the mod, we elect to only grab the last digit (0-9) of the hash!
            if (randomInt(10) > bigBoss.dodgeChance) {
                bigBoss.hp = bigBoss.hp - player.attackDamage;
                console.log("%s attacked boss. New boss hp: %s", player.name, bigBoss.hp);
            } else {
                console.log("%s missed!", player.name);
            }
        }

        // Allow boss to attack player.
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
            console.log("%s attacked player. New player hp: %s\n", bigBoss.name, player.hp);
        } else {
            // by passing 10 as the mod, we elect to only grab the last digit (0-9) of the hash!
            // boss has 50% to miss
            if (randomInt(10) > player.dodgeChance) {
                player.hp = player.hp - bigBoss.attackDamage;
                console.log("%s attacked player. New player hp: %s\n", bigBoss.name, player.hp);
            } else {
                console.log("%s missed!\n", bigBoss.name);
            }
        }

        emit AttackComplete(msg.sender, bigBoss.hp, player.hp);
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        // Get the tokenId of the user's character NFT
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];

        console.log(msg.sender);
        console.log(nftTokenIdOfPlayer);

        // If the user has a tokenId in the map, return their character.
        if (nftTokenIdOfPlayer > 0) {
            return nftHolderAttributes[nftTokenIdOfPlayer];
        } else {
            // Else, return an empty character.
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }
}
