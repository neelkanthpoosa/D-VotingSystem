var Election=artifacts.require("./Election.sol");

contract("Election",function(accounts)
{
  var probableInstance;
  it("Confirming candidates contesting are only 2",function(){
    return Election.deployed().then(function(instance){
      return instance.candidatesCount();
    }).then(function(count){
      assert.equal(count,2);
    });
  });
  it("Checking candidates that are added and verifying:",function(){
    return Election.deployed().then(function(instance){
      probableInstance=instance;
      return probableInstance.candidates(1);
    }).then(function(candidate){
      assert.equal(candidate[0],1,"ID checked");
      assert.equal(candidate[1],"Neelkanth P","Name checked");
      assert.equal(candidate[2],0,"Starting vote count from 0");
      return probableInstance.candidates(2);
    }).then(function(candidate){
      assert.equal(candidate[0],2,"ID checked");
      assert.equal(candidate[1],"Pranav M","Name checked");
      assert.equal(candidate[2],0,"Starting vote count from 0");
    });
  });
  it("Setting up env to cast vote!",function(){
    return Election.deployed().then(function(instance){
      electionInstance=instance;
      candidateID=1;
      return electionInstance.vote(candidateID,{from: accounts[0]});
    }).then(function(receipt){
       assert.equal(receipt.logs.length,1,"Event triggerred");
       assert.equal(receipt.logs[0].event,"votedEvent","Event type checked");
       assert.equal(receipt.logs[0].args.cid.toNumber(),candidateID,"ID VERIFIED");
      return electionInstance.voters(accounts[0]);
    }).then(function(voted){
      assert(voted,"Voter marked voted");
      return electionInstance.candidates(candidateID);
    }).then(function(candidate){
      var voteCount=candidate[2];
      assert.equal(voteCount,1,"Increased vote count for the probable");

    });
  });

  it("throws an exception for invalid candiates", function() {
  return Election.deployed().then(function(instance) {
    electionInstance = instance;
    return electionInstance.vote(99, { from: accounts[1] })
  }).then(assert.fail).catch(function(error) {
    assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    return electionInstance.candidates(1);
  }).then(function(candidate1) {
    var voteCount = candidate1[2];
    assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
    return electionInstance.candidates(2);
  }).then(function(candidate2) {
    var voteCount = candidate2[2];
    assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
  });
});

  it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });
});
