'use strict';

const { Contract } = require('fabric-contract-api');

class citizenTransactions extends Contract {

    async InitLedger(ctx) {
        const citizens = [
            {
                NIC: '9806506969V',
                fullname: 'Tharindu Disanayaka',
                birthdate: '05-03-1998', 
                birthplace : 'Badulla', 
                gender: 'Male', 
                address: 'Bandarawela', 
                fathername: 'Ranathunga', 
                mothername: 'Dayani', 
                religion: 'Buddhist', 
                nationality: 'Sinhalese', 
                passportid:'7452436591', 
                passportissuedate: '25-12-2017', 
                passportexpirydate: '26-12-2027', 
                bloodgroup: 'B+', 
                drivinglicenseissuedate: '18-11-2017', 
                drivinglicenseexpirydate: '19-11-2027', 
                typeofvehicles: 'A1, A, B, G1'
                
            }
        ];

        for (const citizen of citizens) {
            citizens.docType = 'citizens';
            await ctx.stub.putState(citizen.NIC, Buffer.from(JSON.stringify(citizen)));
            console.info(`citizen ${citizen.NIC} initialized`);
        }
    }

    // CreateCitizen issues a new citizen to the world state with given details.
    async CreateCitizen(ctx, NIC, fullname, birthdate, birthplace, gender, address, 
        fathername, mothername, religion, nationality, passportid, passportissuedate, 
        passportexpirydate, bloodgroup, drivinglicenseissuedate, 
        drivinglicenseexpirydate, typeofvehicles) {
        const citizen = {
            NIC: NIC,
            fullname: fullname,
            birthdate: birthdate, 
            birthplace: birthplace, 
            gender: gender, 
            address: address, 
            fathername: fathername, 
            mothername: mothername, 
            religion: religion, 
            nationality: nationality, 
            passportid: passportid, 
            passportissuedate: passportissuedate, 
            passportexpirydate: passportexpirydate, 
            bloodgroup: bloodgroup, 
            drivinglicenseissuedate: drivinglicenseissuedate, 
            drivinglicenseexpirydate: drivinglicenseexpirydate, 
            typeofvehicles: typeofvehicles
        };
        ctx.stub.putState(NIC, Buffer.from(JSON.stringify(citizen)));
        return JSON.stringify(citizen);
    }

    // CreateCitizen issues a new citizen with given details.
    async addNewCitizenIDInfo(ctx, NIC, fullname, birthdate, gender, address) {
        const exists = await this.citizenExists(ctx, NIC);
        if (exists) {
            throw new Error(`The citizen ${NIC} exists`);
        }
        const citizen = {
            NIC: NIC,
            fullname: fullname,
            birthdate: birthdate, 
            gender: gender, 
            address: address,
            fathername: '', 
            mothername: '', 
            religion: '', 
            nationality: '', 
            passportid: '', 
            passportissuedate: '', 
            passportexpirydate: '', 
            bloodgroup: '', 
            drivinglicenseissuedate: '', 
            drivinglicenseexpirydate: '', 
            typeofvehicles: ''

        };
        ctx.stub.putState(NIC, Buffer.from(JSON.stringify(citizen)));
        return JSON.stringify(citizen);
    }

    // addBirthInfo updates an existing citizen with Birth Info
    async addBirthInfo(ctx, NIC, fathername, mothername, birthplace, religion, nationality) {
        const citizenString = await this.ReadCitizen(ctx, NIC);
        const citizen = JSON.parse(citizenString);
        citizen.fathername = fathername;
        citizen.mothername = mothername;
        citizen.birthplace = birthplace;
        citizen.religion = religion;
        citizen.nationality = nationality;
        return ctx.stub.putState(NIC, Buffer.from(JSON.stringify(citizen)));
    }

    // addPassportInfo updates an existing citizen with Passport Info
    async addPassportInfo(ctx, NIC, passportid, passportissuedate, passportexpirydate) {
        const citizenString = await this.ReadCitizen(ctx, NIC);
        const citizen = JSON.parse(citizenString);
        citizen.passportid = passportid;
        citizen.passportissuedate = passportissuedate;
        citizen.passportexpirydate = passportexpirydate;
        return ctx.stub.putState(NIC, Buffer.from(JSON.stringify(citizen)));
    }

    // addDrivingLicInfo updates an existing citizen with Driving License Info
    async addDrivingLicInfo(ctx, NIC, bloodgroup, drivinglicenseissuedate, drivinglicenseexpirydate, typeofvehicles) {
        const citizenString = await this.ReadCitizen(ctx, NIC);
        const citizen = JSON.parse(citizenString);
        citizen.bloodgroup = bloodgroup;
        citizen.drivinglicenseissuedate = drivinglicenseissuedate;
        citizen.drivinglicenseexpirydate = drivinglicenseexpirydate;
        citizen.typeofvehicles = typeofvehicles;
        return ctx.stub.putState(NIC, Buffer.from(JSON.stringify(citizen)));
    }

    // ReadCitizen returns the citizen stored with given NIC.
    async ReadCitizen(ctx, NIC) {
        const citizenJSON = await ctx.stub.getState(NIC); // get the citizen from chaincode state
        if (!citizenJSON || citizenJSON.length === 0) {
            throw new Error(`The citizen ${NIC} does not exist`);
        }
        return citizenJSON.toString();
    }

    // citizenExists returns true when citizen with given NIC exists.
    async citizenExists(ctx, NIC) {
        const citizenJSON = await ctx.stub.getState(NIC);
        return citizenJSON && citizenJSON.length > 0;
    }

    async changeIDInfo(ctx, NIC, fullname, birthdate, gender, address){
        const citizenString = await this.ReadCitizen(ctx, NIC);
        const citizen = JSON.parse(citizenString);
        citizen.fullname = fullname;
        citizen.birthdate = birthdate;
        citizen.gender = gender;
        citizen.address = address;
        return ctx.stub.putState(NIC, Buffer.from(JSON.stringify(citizen)));
    } 

    //
    // get history of modifications of citizn infromation
    async GetCitizenHistory(ctx, NIC) {
      let resultsIterator = await ctx.stub.getHistoryForKey(NIC);
      let results = await this.GetAllResults(resultsIterator, true);

      return JSON.stringify(results);
	}

    


    //----------- Public App Chaincode -----------


    //request by third parties
  async makeRequest(ctx, NIC, variables, requestedby, reqid, orgID) {
    const genid = reqid;
    console.log(variables);
    const request = new Object({
      reqid: genid,
      NIC: NIC,
      variables: variables,
      status: "pending",
      requestedby: requestedby,
      orgID:orgID,
      type:'request'
    });
    ctx.stub.putState(genid, Buffer.from(JSON.stringify(request)));
    return JSON.stringify(request);
  }
  
  async ReadRequest(ctx, reqid) {
    const requestJSON = await ctx.stub.getState(reqid); // get the request from chaincode state
    if (!requestJSON || requestJSON.length === 0) {
        throw new Error(`The request ${reqid} does not exist`);
    }
    return requestJSON.toString();
  }

  async acceptRequest(ctx, reqid) {
    const reqString = await this.ReadRequest(ctx, reqid);
    const request = JSON.parse(reqString);
    request.status = "accepted";
    
    return ctx.stub.putState(reqid, Buffer.from(JSON.stringify(request)));
  }

  //to view by the citizen
  async viewPendingRequestsofCitizen(ctx, NIC) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.status = 'pending';
		queryString.selector.NIC = NIC;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}

  //to view by the citizen
  async viewAcceptedRequestsofCitizen(ctx, NIC) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.status = 'accepted';
		queryString.selector.NIC = NIC;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}

  //to view by the org
  async viewPendingRequestsofOrg(ctx, orgID) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.status = 'pending';
		queryString.selector.orgID = orgID;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}

  //to view by the org
  async viewAcceptedRequestsofOrg(ctx, orgID) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.status = 'accepted';
		queryString.selector.orgID = orgID;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}

  ///////

  //to view by the citizen
  async viewAcceptedRequests(ctx, NIC) {
    let resultsIterator = await ctx.stub.getQueryResult(NIC);
    let fullresult = await this.GetAllResults(resultsIterator, false);
    let jsonresult = JSON.stringify(fullresult);

    return jsonresult.filter((obj) => obj.status === "accepted");
  }

  //view citizen from request
  async viewCitizenInfo(ctx, requestid) {
	//check request is exist
    const requestJSON = await ctx.stub.getState(requestid);
    if (!requestJSON || requestJSON.length === 0) {
      throw new Error(`The request ${requestid} does not exist`);
    } else {
		//check acceptance of the request
      const requestJSONparsed = JSON.parse(requestJSON);
      if (requestJSONparsed.status === "accepted") {
        const citizenJSON = await ctx.stub.getState(requestJSONparsed.NIC); // get the citizen from chaincode state
        if (!citizenJSON || citizenJSON.length === 0) {
          throw new Error(`The citizen ${NIC} does not exist`);
        }
		//get citizen custom info
		const parsedJson = JSON.parse(citizenJSON);
    const requiredVariablesArray = requestJSONparsed.variables.split(',');
    const newJson = {};
    for (const variable of requiredVariablesArray) {
      newJson[variable] = parsedJson[variable];
    }
    const newJsonString = JSON.stringify(newJson);
		  return newJsonString.toString();
      } else {
        throw new Error(`The request ${requestid} is not yet accepted`);
      }
    }
  }

  async GetQueryResultForQueryString(ctx, queryString) {
		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this.GetAllResults(resultsIterator, false);
		return JSON.stringify(results);
	}

  // get all results as JSON Array
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

}

module.exports = citizenTransactions;
