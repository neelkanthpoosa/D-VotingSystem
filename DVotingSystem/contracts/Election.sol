pragma solidity^0.4.2;
contract Election
{
struct Candidate
  {
    uint id;
    string name;
    uint voteCount;
  }
  //Using mapping we store candidates,fetch them and give the vote count
  mapping(uint=>Candidate) public candidates;

  //Accounts tracking which have voted
  mapping(address=>bool) public voters;

  uint public candidatesCount; //keep track of candidate count and assign ID

   event votedEvent(uint indexed cid);

  function addCandidate(string probable) private //Add candidate
  {
    candidatesCount++;
    candidates[candidatesCount]=Candidate(candidatesCount,probable,0);//assign the id,name and initial count as 0.


  }

function Election() public
  {
  addCandidate("Neelkanth P");
  addCandidate("Pranav M");

  }

modifier restricted()
{
  //users who didnt vote should only vote
  require(!voters[msg.sender]);
  _;
}

function vote(uint cid) public restricted
  {

    //Can only vote to a valid probable
    require(cid>0 && cid<=candidatesCount);

    //voter is trying to vote for the first time,so set it to true.
    voters[msg.sender]=true;

    //Increase vote count for the probable
    candidates[cid].voteCount++;

    //Trigger the event
     votedEvent(cid);
  }
}
