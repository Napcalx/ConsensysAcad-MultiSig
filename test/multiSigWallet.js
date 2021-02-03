
 const MultiSigWallet = artifacts.require('MultiSigWallet.sol');


 /*contract("MultiSigWallet", accounts=> {
    const owners = [accounts[0], accounts[1], accounts[2]];
    const requiredConfirmations = 2;  

    let wallet;

    beforeEach(async()=> {
        wallet = await MultiSigWallet.new(owners, requiredConfirmations);
    })


    it("should execute", async()=> {
        await wallet.proposeTransaction(owners[2], 0, "0x0");
        await wallet.approveTransaction(0, {from: owners[0]});
        await wallet.approveTransaction(0, {from: owners[1]});


        const res = await wallet.executeTransaction(0, {from: owners[0]});

        const{ logs } = res;
        assert(logs[0].event = "ExecutedTransaction");
        assert(logs[0].args.owner = owners[0]);
        assert(logs[0].args.transactionId == 0);

        const tx = await wallet.transactions(0); 
        assert(tx.isExecuted = true);   
    })
      
 }) */

 contract("MultiSigWallet", accounts=> {
    const owners = [accounts[0], accounts[1], accounts[2]];
    const requiredConfirmations = 2;  
    let wallet;

    before(async()=> {
        wallet = await MultiSigWallet.new(owners, requiredConfirmations);
    })
 
    //new wallet should be created 
    it("should deploy wallet", async()=> {  
        const walletAddress = wallet._address;
        assert(walletAddress != '');
    })

    it("should return correct list of owners", async()=> {
        const res = await wallet.viewOwners();
        assert.deepEqual(res, owners);
    })

    it("Should submit a transaction properly", async()=> {
       const res= await wallet.proposeTransaction(accounts[4], 1, 0x00, {from: owners[0]});
       
       const{ logs } = res;
        assert(logs[0].event = "TransactionProposed");
        const txOnTxList = await wallet.transactions(0);
        assert(logs[0].args.owner == txOnTxList.txSender);
        assert(logs[0].args.destination == txOnTxList.destination);
        assert(logs[0].args.amount.toNumber() === txOnTxList.amount.toNumber());
        assert(logs[0].args.transactionId.toNumber() === txOnTxList.txId.toNumber());
    })


    it("should approve a transaction", async()=> {
        await wallet.proposeTransaction(accounts[4], 1, 0x00, {from: owners[0]});
        await wallet.approveTransaction(0, {from: owners[2]} );
         const res = await wallet.approveTransaction(0, {from: owners[1]} );
       
        const {logs} = res;
        assert(logs[0].args.event = "TransactionApproved");
        const tx = await wallet.transactions(0); 
        assert(tx.isApproved = true);
        assert(tx.noOfConfirmations.toNumber() == 2);
    })


    it("should throw an error if none owner tries to submit a transaction", async()=> {
       
        
        
       try{

             await wallet.proposeTransaction(accounts[4], 0, "0x0", {from: accounts[5]});

        }

        catch (e){
            assert(e.message.includes("You are not part of owners"));
        } 

    }) 

 })