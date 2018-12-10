pragma solidity >=0.4.0 <0.6.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address private _owner;

    event OwnershipTransferred(
      address indexed previousOwner,
      address indexed newOwner
    );

    /**
    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
    * account.
    */
    constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
    * @return the address of the owner.
    */
    function owner() public view returns(address) {
        return _owner;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(isOwner(),"Only Owner can call this !!!");
        _;
    }

    /**
    * @return true if `msg.sender` is the owner of the contract.
    */
    function isOwner() public view returns(bool) {
        return msg.sender == _owner;
    }

    /**
    * @dev Allows the current owner to relinquish control of the contract.
    * @notice Renouncing to ownership will leave the contract without an owner.
    * It will not be possible to call the functions with the `onlyOwner`
    * modifier anymore.
    */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
    * @dev Transfers control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0),"New owner address is not provided !!!");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

library SafeMath {

    /**
    * @dev Multiplies two numbers, reverts on overflow.
    */
    function mul(uint16 a, uint16 b) internal pure returns (uint16) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint16 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
    */
    function div(uint16 a, uint16 b) internal pure returns (uint16) {
        require(b > 0); // Solidity only automatically asserts when dividing by 0
        uint16 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint16 a, uint16 b) internal pure returns (uint16) {
        require(b <= a);
        uint16 c = a - b;
        return c;
    }

    /**
    * @dev Adds two numbers, reverts on overflow.
    */
    function add(uint16 a, uint16 b) internal pure returns (uint16) {
        uint16 c = a + b;
        require(c >= a);
        return c;
    }

    /**
    * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint16 a, uint16 b) internal pure returns (uint16) {
        require(b != 0);
        return a % b;
    }
}

contract hrm is Ownable{
    using SafeMath for uint16;
    mapping(bytes32=>uint16) EmployeeLeaveBalance;

    event NewEmployeeAdded(bytes32 eid);
    event CompensationLeaveAdded(bytes32 eid, uint16 day);
    event ApproveLeave(bytes32 eid, uint16 day);
    event TransferLeave(bytes32 from, bytes32 to, uint day);

    function addNewEmployee(bytes32 eid) public onlyOwner  {
        require(EmployeeLeaveBalance[eid]==0,"Employee Already Registered !!!");
        EmployeeLeaveBalance[eid] = 200;
        emit NewEmployeeAdded(eid);
    }
    
    function checkLeaveBalance(bytes32 eid) public view returns(uint16){
        return EmployeeLeaveBalance[eid];
    }
    
    function addLeave(bytes32 eid, uint16 day) public onlyOwner {
        require(EmployeeLeaveBalance[eid].add(day) < 3651, "Leave balance in not more than 365");
        EmployeeLeaveBalance[eid] = EmployeeLeaveBalance[eid].add(day);
        emit CompensationLeaveAdded(eid,day);
    }
    
    function approveLeave(bytes32 eid,uint16 day) public onlyOwner {
        EmployeeLeaveBalance[eid] = EmployeeLeaveBalance[eid].sub(day);
        emit ApproveLeave(eid,day);
    }
    
    function transferLeave(bytes32 from_eid,bytes32 to_eid,uint16 day) public {
        require(day<=EmployeeLeaveBalance[from_eid], "Sender leave balance is low !!!");
        require(EmployeeLeaveBalance[to_eid]>0, "Reciever leave balance either zero or user does not register !!!");
        require(EmployeeLeaveBalance[to_eid].add(day) < 3651, "Leave balance in not more than 365");
        EmployeeLeaveBalance[from_eid] = EmployeeLeaveBalance[from_eid].sub(day);
        EmployeeLeaveBalance[to_eid] = EmployeeLeaveBalance[to_eid].add(day);
        emit TransferLeave(from_eid, to_eid, day);
    }
}