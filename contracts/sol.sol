pragma solidity 0.8.7;

contract CarPool{
    mapping(address => bool) public drivers;
    uint256 public RegistrationFees=10e17;
    struct Ride{
        address customer;
        string source;
        string destination;
        uint256 fee;
        address driver;
        bool proposalStatus;
        bool status;
    }
    mapping(string => Ride) public rides;
    string[] public keys;
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }
    function newDriver() payable public{
        require(msg.value >= RegistrationFees,"Please pay the registration fee.");
        drivers[msg.sender] = true;
        owner.transfer(msg.value);
    }

    function newRide(string memory _key, string memory _src, string memory _dst) public {
        Ride memory obj = Ride(msg.sender,_src,_dst,0,address(0),false,false);
        rides[_key] = obj;
        keys.push(_key);
    } 

    function proposeRide(string memory _key, uint256 _fee) public {
        require(rides[_key].driver == address(0),"Some other driver have proposed.");
        require(drivers[msg.sender],"You are not a driver.");
        rides[_key].driver = msg.sender;
        rides[_key].fee = _fee;
    }

    function replyToProposeal(string memory _key, bool _reply) public {
        require(rides[_key].driver != address(0),"No driver have proposed.");
        require(rides[_key].customer == msg.sender,"You didn't requested this ride.");
        if(_reply){
            rides[_key].proposalStatus = true;
        }else{
            rides[_key].driver = address(0);
            rides[_key].fee = 0;
        }
    }

    function payment(string memory _key) payable public{
        require(rides[_key].fee == msg.value);
        address payable to = payable(rides[_key].driver);
        to.transfer(msg.value);
        rides[_key].status = true;
    }

    function availableRides() public view returns(Ride[] memory) {
        uint256 n = keys.length;
        uint256 c = 0;
        for(uint256 i=0;i<n;i++){
            if(rides[keys[i]].status==false){
                c++;
            }
        }
        Ride[] memory arr = new Ride[](c);
        for(uint256 i=0;i<n;i++){
            if(rides[keys[i]].status==false){
                arr[i] = rides[keys[i]];
            }
        }
        return arr;
    }
}