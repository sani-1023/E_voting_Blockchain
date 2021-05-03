/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const crypto = require('crypto');

class AssetTransfer extends Contract {



    async Admin(ctx){
        const admin = {
            username : 'admin',
            password : 'admin1234',
            Doctype : 'admin',

        };

        ctx.stub.putState('admin', Buffer.from(JSON.stringify(admin)));
        // return JSON.stringify(admin);

    }


    //***Login Admin**


    async LoginAdmin(ctx, username, password) {
        console.info("============= START : Login Admin===========");
        const userBytes = await ctx.stub.getState(username); // get the email from chaincode state
        if (!userBytes || userBytes.length === 0) {
            throw new Error(`${username} does not exist`);
        }

        const user = JSON.parse(userBytes.toString());

        if (user.password === password) {
            return user;
        }
        else {
            throw new Error(`password does not exist`);

        }

        console.info("============= END : Login Admin===========");
    }


    //registervoter function
    async registerVoter(ctx, voterId, name, email, password) {
        console.info('============= START : Register user ===========');

        const voter = {

            key: voterId,
            name,
            email,
            password,
            docType: 'voter'
        };

        const userBytes = await ctx.stub.getState(email); // get the email from chaincode state for confirmation
        if (!userBytes || userBytes.length === 0) {
            await ctx.stub.putState(voterId, Buffer.from(JSON.stringify(voter)));
        }
        else {
            throw new Error(`email already exist`);
        }


        return JSON.stringify(voter);



        //  await ctx.stub.putState(voterId, Buffer.from(JSON.stringify(user)));
        console.info('============= END : Register user ===========');
    }
    //log in function + queryfunction

    async loginUser(ctx, email, password) {
        console.info("============= START : Login User ===========");
        const userBytes = await ctx.stub.getState(email); // get the email from chaincode state
        if (!userBytes || userBytes.length === 0) {
            throw new Error(`${email} does not exist`);
        }

        const user = JSON.parse(userBytes.toString());

        if (user.password === password) {
            return user;
        }
        else {
            throw new Error(`password does not exist`);

        }

        console.info("============= END : Login User ===========");
    }

    //add election funtion

    async addElection(ctx, electionId, electionName, candidateNumber) {
        console.info('============= START : Add election ===========');

        const election = {

            key: electionId,
            electionId,
            electionName,
            candidateNumber,
            docType: 'election'

        };

        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)));
        return JSON.stringify(election);


        console.info('============= END : Add election ===========');
    }
    //add candidate function
    async addCandidate(ctx, canId, name, sign, electionId) {
        console.info('============= START : addCandidate ===========');

        const candidate = {
            key: canId,
            docType: 'candidate',
            canId,
            name,
            sign,
            electionId,
        };

        await ctx.stub.putState(canId, Buffer.from(JSON.stringify(candidate)));

        return JSON.stringify(candidate);
        console.info('============= END : addCandidate ===========');
    }

    //castvote funtion

    async castVote(ctx, electionId, voterId, candidateId) {
        console.info('============= START : cast vote ===========');


        //generating hash funtion

        let tmp = electionId.toString() + voterId.toString() ;
        // let tmpVoteId = crypto.createHash('sha256').update(tmp).digest('base64');


        const generateSignature = (body) => {
            const payload = body;
            const signature = crypto.createHash('sha256').update(payload).digest('base64')
            return signature;
        }

        let tmpVoteId = generateSignature(tmp);

        const vote = {
            key: candidateId,
            docType: 'vote',
            voterId,
            voteId: tmpVoteId,
            electionId,
            candidateId,
            
        };





        // checking for duplicate voting 
        // get the voteId from chaincode state
        const userBytes = await ctx.stub.getState(tmpVoteId);
        //  const vote = JSON.parse(userBytes.toString()); // ajaira otar lagi pech lagsil

        //another condition
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'election';
        queryString.selector.electionId = electionId;
        let result  =  await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));

        let obj = JSON.parse(result);
        let size = Object.keys(obj).length;

        //another condition

        let queryString1 = {};
        queryString1.selector = {};
        queryString1.selector.docType = 'candidate';
        queryString1.selector.key = candidateId;
        let result1 =  await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString1));

        let obj1 = JSON.parse(result1);

        let ElectionId = obj1[0]["Record"]["electionId"];

        let flag = 1;
        if(size===0)
        {
            flag = 0;
        }

        if ((!userBytes || userBytes.length === 0 ) && flag===1 && ElectionId === electionId) {
            await ctx.stub.putState(tmpVoteId, Buffer.from(JSON.stringify(vote)));


        }
        else {
            throw new Error(`You cant vote`);
        }

      ////pore dekhbo
        return JSON.stringify(vote);

        console.info('============= END : cast vote ===========');
    }


    //complex query function
    //find voter using email
    async FindVoterByEmail(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'voter';
        //	queryString.selector.email = email;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
    }
    //find candidate using candidatekey

    async FindCandidateByCandidateKey(ctx, candidatekey) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'candidate';
        queryString.selector.key = candidatekey;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
    }

    //find candiadate using electionId
    async FindCandidateByElectionKey(ctx, electionId) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'candidate';
        queryString.selector.electionId = electionId;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
    }

    //find vote by candidatekey

    async FindVoteByCandidateKey(ctx, candidatekey) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vote';
        queryString.selector.key = candidatekey;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
    }

    // stop election and save the result
    async stopElectionAndStoreResult(ctx, electionId) {


        // find all candidate  and their vote number for specific electionId
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'candidate';
        queryString.selector.electionId = electionId;

        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));


    }


    async electionInfo(ctx, electionId) {


        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'election';
        queryString.selector.key = electionId;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));


    }

    //get electionresult from electionid
    async electionIdResult(ctx, electionId) {


        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'resultHistory';
        queryString.selector.key = electionId;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));


    }


    //  add result of any election  to database
    async addResult(ctx, electionId, electionName, resultObj) {
        console.info('============= START : addResult ===========');

        const resultHistory = {
            key: electionId,
            electionName: electionName,
            docType: 'resultHistory',
            finalResult: resultObj
        };

        await ctx.stub.putState(electionName, Buffer.from(JSON.stringify(resultHistory)));

        console.info('============= END : addResult ===========');
    }


    //change the previous electionid to a random electionid
    async changeElectionId(ctx, preElectionId, newElectionId) {
        console.info('============= START : changeElectionId ===========');

        const eAsBytes = await ctx.stub.getState(preElectionId); // get the election from chaincode state
        if (!eAsBytes || eAsBytes.length === 0) {
            throw new Error(`${electionId} does not exist`);
        }
        const election = JSON.parse(eAsBytes.toString());




        //return newElectionId;


        election.electionId = newElectionId;

        await ctx.stub.putState(preElectionId, Buffer.from(JSON.stringify(election)));

        return JSON.stringify(election);




        console.info('============= END : changeElectionId ===========');
    }


    //check validation for election id

    async checkElectionid(ctx, givenElenctionId) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'election';
        queryString.selector.electionId = givenElenctionId;
        let result  =  await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));

        let obj = JSON.parse(result);
		let size = Object.keys(obj).length;

        if(size === 0)
        {
            throw new Error(`${givenElectionId} does not exist`);
        }
        else
        {
            var s  = "You are eligible for vote";
            return s;
        }

    }

     //collect all election result

     async getResult(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'resultHistory';
        let result  =  await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let obj = JSON.parse(result);
		let size = Object.keys(obj).length;

        if(size === 0)
        {
            throw new Error(`No results`);
        }
        else
        {
            return result;
        }

    }

    //get running election

    async getRunningElection(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'election';
        let result  =  await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let obj = JSON.parse(result);
        let size = Object.keys(obj).length;
        let arr = [];
        for (var i in obj) {
            let electionKey = obj[i]["Record"]["key"];
            let electionId = obj[i]["Record"]["electionId"];
            if(electionKey === electionId)
            {
                arr.push(obj[i]);
            }

        }
         //let obj1 =  Object.assign({}, arr); // {0:"a", 1:"b", 2:"c"}

        if(size === 0)
        {
            throw new Error(`No results`);
        }
        else
        {
            return arr;
        }

    }












    async GetQueryResultForQueryString(ctx, queryString) {

        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.GetAllResults(resultsIterator, false);

        return JSON.stringify(results);
    }



    async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }


    //create a random number

    async makeid(ctx, length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');



    }









}

module.exports = AssetTransfer;
