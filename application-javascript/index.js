//index.js

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../test-application/javascript/AppUtil.js");
const { error } = require("console");

const channelName = "mychannel";
const chaincodeName = "evoting";
const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "appUser";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );
    const wallet = await buildWallet(Wallets, walletPath);
    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg1,
      org1UserId,
      "org1.department1"
    );
    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true },
      });

      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      await contract.submitTransaction('Admin');

      let express = require("express");
      var bodyParser = require("body-parser");

      let app = express();
      const port = 3000;

      const cookieParser = require("cookie-parser");
      const cors = require('cors')

      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      app.use(cookieParser());
      app.use(cors({

        "origin": "http://localhost:3001",
        "credentials": true


      }));


      ////***Admin Log in**


      app.post("/admin", async function (req, res) {
        const { username, password } = req.body;
        //const id = user_${email};

        try {
          //loginUser(ctx, email, password)
          const queryResult = await contract.evaluateTransaction(
              "LoginAdmin",
              username,
              password
          );

          res.cookie("admin", queryResult.toString(), {
            maxAge: 3600_000,
            httpOnly: true,
          });

          // //let users = JSON.parse(queryResult.toString());
          res.send(queryResult.toString());
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      // ***** adminLog out ****
      app.get("/adminLogOut", async function (req, res) {
        const { username, password } = req.body;
        //const id = user_${email};

        try {
          res.cookie("admin", null, { maxAge: -1, httpOnly: true });
          //res.send("You have successfully Logged out");
          // //let users = JSON.parse(queryResult.toString());
          res.send("You have successfully logged out");
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });


      ////***** RegisterVoter******

      app.post("/registerVoter", async function (req, res) {
        const { name, email, password } = req.body;
        const voterId = email;

        try {
          await contract.submitTransaction(
            "registerVoter",
            voterId,
            name,
            email,
            password
          );
          res.json({
            status: "register user successful",
          });
        } catch (error) {
          res
            .status(400)
            .json({error: error.toString()});
        }
      });

      ///// ***** Login Voter ****

      app.post("/loginVoter", async function (req, res) {
        const { email, password } = req.body;
        //const id = user_${email};

        try {
          //loginUser(ctx, email, password)
          const queryResult = await contract.evaluateTransaction(
            "loginUser",
            email,
            password
          );

          res.cookie("voter", queryResult.toString(), {
            maxAge: 3600_000,
            httpOnly: true,
          });

          // //let users = JSON.parse(queryResult.toString());
          res.send(queryResult.toString());
        } catch (error) {
            res
                .status(400)
                .json({error: error.toString()});
          }
      });

      // ***** Log out ****
      app.get("/logOut", async function (req, res) {
        const { email, password } = req.body;
        //const id = user_${email};

        try {
          res.cookie("voter", null, { maxAge: -1, httpOnly: true });
          //res.send("You have successfully Logged out");

          // //let users = JSON.parse(queryResult.toString());
          res.send("You have successfully logged out");
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      //*** Add election ***

      app.post("/addElection", async function (req, res) {
        const { electionId, electionName, candidateNumber } = req.body;

        try {
          const result = await contract.submitTransaction(
            "addElection",
              electionId,
              electionName,
              candidateNumber
          );
          res.json({
            status: "Election creation is successful",
          });
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      //**** addCandidate ****

      app.post("/addCandidate", async function (req, res) {
        const { canId, name, sign, electionId } = req.body;

        try {

          const result = await contract.submitTransaction(
            "addCandidate",
            canId,
            name,
            sign,
            electionId
          );
          res.json({
            status: "Candidate creation is successful",
          });
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      //****** castVote function****

      app.post("/castVote", async function (req, res) {
        let voter = JSON.parse(req.cookies.voter.toString());

        const { electionId, candidateId} = req.body;

        const voterId = voter.email;

        try {




          const result = await contract.submitTransaction(
            "castVote",
            electionId,
            voterId,
            candidateId
          );
          res.json({
            status: "cast vote is successful",
          });
        }catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      ///*** stopElection & store result **

      app.post("/stopElection", async function (req, res) {
        const { electionId } = req.body;

        try {
          //   //loginUser(ctx, email, password)
          const result = await contract.evaluateTransaction(
            "stopElectionAndStoreResult",
            electionId
          );


          let obj = JSON.parse(result);

          let candidateResult = new Map();

         // let candidateResult

          for (var i in obj) {
            let tempCandidateKey = obj[i]["Key"];
            // console.log(tempCandidateKey);
            // fetch all the info of specific candidate and store the vote number in map
            let candidateHistory = await contract.evaluateTransaction(
              "FindVoteByCandidateKey",
              tempCandidateKey
            );
            let obj1 = JSON.parse(candidateHistory);
            let votecount = Object.keys(obj1).length;
            let candidateName = obj[i]["Record"]["name"];
            candidateResult.set(candidateName, votecount);
          }

          let resultElection;

          // get all the info of election1
          resultElection = await contract.evaluateTransaction(
            "electionInfo",
            electionId
          );




          //fetch the election name and electionid
          let electionObj = JSON.parse(resultElection);
          let electionName = electionObj[0]["Record"]["electionName"];
          let electionId1 = electionObj[0]["Key"];

          //create a object of candidateresult map and make the object into a json format to send it to server
          let resultObj = Object.fromEntries(candidateResult);
          var myJSON = JSON.stringify(resultObj);

          // ------ async addResult(ctx, electionId, electionName, resultObj) -----

          //creating result

          let final = await contract.evaluateTransaction( "electionIdResult",
              electionId,
          );

          let finalObj = JSON.parse(final);
          res.cookie("electionidresultc", final.toString(), {
            maxAge: 3600_000,
            httpOnly: true,
          });

           await contract.submitTransaction(
            "addResult",
            electionId1,
            electionName,
            myJSON
          );





          //--------         async changeElectionId(ctx, preElectionId,newElectionId) function------
          //changing the existing electionid to new one
          let newElectionId = (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
          ).toString();
          //console.log(newElectionId);

          await contract.submitTransaction(
            "changeElectionId",
            electionId,
            newElectionId
          );

          //res.send(result1);

          // //let users = JSON.parse(queryResult.toString());
         // res.json(finalObj);
         res.send("The election is stoppped and result is ready!");
        
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      app.get("/checkingElectionId", async function (req, res) {
        const { givenElenctionId } = req.body;
        //const id = user_${email};

        try {
          let result = await contract.evaluateTransaction(
            "checkElectionid",
            givenElenctionId
          );

          res.send("correct electionId, You may procced for voting ");
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      //********* see candidates */((((((((((kaaajj))))))))))

      app.post("/seeCandidates", async function (req, res) {

        
        //const electionid = electionidc1.electionId.toString();
        //const id = user_${email};

        try {
          let electionidc1 = JSON.parse(req.cookies.electionidc.toString());

          // if(electionidc1.keys.length === 0){
          //   throw new Error(`Invalid election or no candidate exist`);
          // }
         
          let electionId = electionidc1[0]["Record"]["electionId"];

          let result = await contract.evaluateTransaction(
              "FindCandidateByElectionKey",
              electionId
          );



          let obj = JSON.parse(result);
          res.json(obj);

         //res.cookie("electionidc1", null, { maxAge: -1, httpOnly: true });




        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

     //**submit election id***(extra) */((((((((((Kaaaj))))))))))

     app.post("/submitelectionid", async function (req, res) {
      const { electionId } = req.body;
      //const id = user_${email};

      try {
        //loginUser(ctx, email, password)
        let result = await contract.evaluateTransaction(
          "FindCandidateByElectionKey",
          electionId
       );

        res.cookie("electionidc", result.toString(), {
          maxAge: 3600_000,
          httpOnly: true,
        });

        // //let users = JSON.parse(queryResult.toString());
        let obj = JSON.parse(result);
        res.json(obj);

      } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
    });

      //**submit election id result***(extra) */((((((((((Kaaaj))))))))))

      app.post("/submitresultelectionid", async function (req, res) {
        const { electionId } = req.body;
        //const id = user_${email};

        try {
          let result = await contract.evaluateTransaction(
              "electionIdResult",
              electionId
          );

          res.cookie("electionidresultc", result.toString(), {
            maxAge: 3600_000,
            httpOnly: true,
          });

          // //let users = JSON.parse(queryResult.toString());
          let obj = JSON.parse(result);
          res.json(obj);

        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      //********* see result election id */((((((((((kaaajj))))))))))

      app.post("/seeresultelectionid", async function (req, res) {


        //const electionid = electionidc1.electionId.toString();
        //const id = user_${email};

        try {
          let electionidc1 = JSON.parse(req.cookies.electionidresultc.toString());

          // if(electionidc1.keys.length === 0){
          //   throw new Error(`Invalid election or no candidate exist`);
          // }

          let electionId = electionidc1[0]["Record"]["key"];

          let result = await contract.evaluateTransaction(
              "electionIdResult",
              electionId
          );

          let obj = JSON.parse(result);
          res.json(obj);

          //res.cookie("electionidc1", null, { maxAge: -1, httpOnly: true });

        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });

      ///get running election list
      app.get("/runningElection", async function (req, res) {
        try {
          let result = await contract.evaluateTransaction("getRunningElection");

          let obj = JSON.parse(result);
          // let results=JSON.stringyfy(obj);



          res.send(obj);
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });










      app.get("/seeResults", async function (req, res) {
        try {
          let result = await contract.evaluateTransaction("getResult");

          let obj = JSON.parse(result);
         // let results=JSON.stringyfy(obj);



          let electionResultmap = new Map();


          for (var i in obj) {
            let electionName = obj[i]["Record"]["electionName"];
            let electionResult = obj[i]["Record"]["finalResult"];
            electionResultmap.set(electionName, electionResult);
          }

          //let resultObj1 = Object.fromEntries(electionResultmap);
         // const myJSON1 = JSON.stringify(resultObj1);

          res.send(obj);
        } catch (error) {
          res
              .status(400)
              .json({error: error.toString()});
        }
      });






      app.listen(port, async () => {
        console.log(`app listening at http://localhost:${port}`);
      });

      /////////////////////////////////////////////////////////////
    } finally {
      //   console.log("disconnecting from chaincode");
      //   gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
  }
}

main();
