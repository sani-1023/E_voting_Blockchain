
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { error } = require('console');

const channelName = 'mychannel';
const chaincodeName = 'evoting';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	try {

		const ccp = buildCCPOrg1();


		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');


		const wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg1);


		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		const gateway = new Gateway();

		try {

			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);


			console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			//await contract.submitTransaction('InitLedger');

			// let result = await contract.evaluateTransaction('GetAllAssets');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);


	
			//--------for registerVoter(ctx, voterId, name, email, password) function------

			try {
				let result = await contract.evaluateTransaction('registerVoter', 'san@gmail.com', 'san', 'san@gmail.com', 'san')
				await contract.submitTransaction('registerVoter', 'san@gmail.com', 'san', 'san@gmail.com', 'san');

				console.log(`registration successful for ${result}\n`);
			} catch (error) {
				console.log(`*** registration failed.......Successfully caught the error: \n    ${error}`);
			}

			try {
				let result = await contract.evaluateTransaction('registerVoter', 'sani@gmail.com', 'sani', 'sani@gmail.com', 'sani')
				await contract.submitTransaction('registerVoter', 'sani@gmail.com', 'sani', 'sani@gmail.com', 'sani');

				console.log(`registration successful for ${result}\n`);
			} catch (error) {
				console.log(`*** registration failed.......Successfully caught the error: \n    ${error}`);
			}


			//--------async loginUser(ctx, email, password) function------
			try {

				let result = await contract.evaluateTransaction('loginUser', 'sani@gmail.com', 'sani');
				console.log(`login successful for ${result}\n`);
			} catch (error) {
				console.log(`*** login failed.......Successfully caught the error: \n    ${error}`);
			}

			//--------    async addElection(ctx, electionId, electionName,candidateNumber) function------
			try {

				let result = await contract.evaluateTransaction('addElection', 'election1', 'national election', '2');
				await contract.submitTransaction('addElection', 'election1', 'national election', '2');
				console.log(`Election has been created successfully for ${result}\n`);
			} catch (error) {
				console.log(`*** Election creation failed.......Successfully caught the error: \n    ${error}`);
			}

			try {

				let result = await contract.evaluateTransaction('addElection', 'election2', 'national election1', '2');
				await contract.submitTransaction('addElection', 'election2', 'national election1', '2');
				console.log(`Election has been created successfully for ${result}\n`);
			} catch (error) {
				console.log(`*** Election creation failed.......Successfully caught the error: \n    ${error}`);
			}

			// //--------async  addCandidate(ctx, canId, name, sign, electionId)  function------

			try {

				let result = await contract.evaluateTransaction('addCandidate', 'can1', 'Abhishek', 'Nouka', 'election1');
				await contract.submitTransaction('addCandidate', 'can1', 'Abhishek', 'Nouka', 'election1');
				console.log(`Candidate has been created successfully for ${result}\n`);
			} catch (error) {
				console.log(`*** Candidate creation failed.......Successfully caught the error: \n    ${error}`);
			}
			try {

				let result = await contract.evaluateTransaction('addCandidate', 'can2', 'Sani', 'Dhaan', 'election1');
				await contract.submitTransaction('addCandidate', 'can2', 'Sani', 'Dhaan', 'election1');
				console.log(`Candidate has been created successfully for ${result}\n`);
			} catch (error) {
				console.log(`*** Candidate creation failed.......Successfully caught the error: \n    ${error}`);
			}


			//--------async  castVote(ctx,voteId,electionId,voterId,candidateId)  function------

			try {

				let result = await contract.evaluateTransaction('castVote', 'election2', 'sani@gmail.com', 'can2');
				await contract.submitTransaction('castVote', 'election2', 'sani@gmail.com', 'can2');
				console.log(`cast vote has been created successfully for ${result}\n`);

			} catch (error) {
				console.log(`*** cast vote creation failed.......Successfully caught the error: \n    ${error}`);
			}
			try {

				let result = await contract.evaluateTransaction('castVote', 'election2', 'san@gmail.com', 'can2');
				await contract.submitTransaction('castVote', 'election2', 'san@gmail.com', 'can2');
				console.log(`cast vote has been created successfully for ${result}\n`);

			} catch (error) {
				console.log(`*** cast vote creation failed.......Successfully caught the error: \n    ${error}`);
			}

			//-------- async FindVoterByEmail(ctx, email) function------

			// try {

			// 	let result = await contract.evaluateTransaction('FindVoterByEmail');
			// 	console.log(`find voter for ${result}\n`);

			// } catch (error) {
			// 	console.log(`*** find voter is failed.......Successfully caught the error: \n    ${error}`);
			// }

			//--------     async FindCandidateByCandidateKey(ctx, candidatekey) function------

			// try {

			// 	let result = await contract.evaluateTransaction('FindCandidateByCandidateKey','can1');
			// 	console.log(`find candidate for ${result}`);

			// } catch (error) {
			// 	console.log(`*** find candidate by key is failed.......Successfully caught the error: \n    ${error}`);
			// }

			//--------        async FindVoteByCandidateKey(ctx, candidatekey) function------

			// try {

			// 	let result = await contract.evaluateTransaction('FindVoteByCandidateKey','can1');
			// 	console.log(`find vote by candidatekey ${result}\n`);

			// 	//for the size of result obj.....
			// 	var obj = JSON.parse(result);
			//     var length = Object.keys(obj).length;

			// 	console.log(length);
			// } catch (error) {
			// 	console.log(`*** find vote by candidatekey is failed.......Successfully caught the error: \n    ${error}`);
			// }
			// try {

			// 	let result = await contract.evaluateTransaction('FindVoteByCandidateKey','can2');
			// 	console.log(`find vote by candidatekey ${result}\n`);

			// 	//for the size of result obj.....
			// 	var obj = JSON.parse(result);
			//     var length = Object.keys(obj).length;

			// 	console.log(length);
			// } catch (error) {
			// 	console.log(`*** find vote by candidatekey is failed.......Successfully caught the error: \n    ${error}`);
			// }

			//--------           async stopElectionAndStoreResult(ctx,electionId) function------
			try {


				//fetch all the candidate info of election1
				let result = await contract.evaluateTransaction('stopElectionAndStoreResult', 'election1');
				console.log(`find candidate for election ${result}\n`);

				let obj = JSON.parse(result);


				let candidateResult = new Map();

				for (var i in obj) {

					let tempCandidateKey = obj[i]["Key"];
					// console.log(tempCandidateKey);
					// fetch all the info of specific candidate and store the vote number in map
					let candidateHistory = await contract.evaluateTransaction('FindVoteByCandidateKey', tempCandidateKey);
					let obj1 = JSON.parse(candidateHistory);
					let votecount = Object.keys(obj1).length;

					let candidateName = obj[i]["Record"]["name"];
					candidateResult.set(candidateName, votecount);


				}


				let resultElection;

				// get all the info of election1
				resultElection = await contract.evaluateTransaction('electionInfo', 'election1');


				//fetch the election name and electionid 
				let electionObj = JSON.parse(resultElection);
				let electionName = electionObj[0]["Record"]["electionName"];
				let electionId1 = electionObj[0]["Key"];

				//create a object of candidateresult map and make the object into a json format to send it to server
				let resultObj = Object.fromEntries(candidateResult);
				var myJSON = JSON.stringify(resultObj);

				// ------ async addResult(ctx, electionId, electionName, resultObj) -----

				//creating result 
				await contract.submitTransaction('addResult', electionId1, electionName, myJSON);

				//--------         async changeElectionId(ctx, preElectionId,newElectionId) function------
				//changing the existing electionid to new one 
				let newElectionId = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString();
				//console.log(newElectionId);

				await contract.submitTransaction('changeElectionId', 'election1', newElectionId);


			} catch (error) {
				console.log(`*** find candidate for election is  failed.......Successfully caught the error: \n    ${error}`);
			}



			// ------     async checkElectionid(ctx, givenElenctionId) -----

			try {

				let result = await contract.evaluateTransaction('checkElectionid', 'election2');

				console.log(`${result}`);



			} catch (error) {
				console.log(`*** election is not valid or election is over.......Successfully caught the error: \n    ${error}`);

			}
			// collect all results
			try {

				let result = await contract.evaluateTransaction('getResult');
				console.log(`${result}\n`);
			} catch (error) {
				console.log(`*** collecting results failed.......Successfully caught the error: \n    ${error}`);
			}





		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
