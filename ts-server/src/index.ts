import express, { Request, Response } from 'express';
import { filter } from 'lodash';
import path from 'path';

import {
    addRepo,
    updateRepo,
    deleteRepo,
    findReposByName,
    getModuleKey,
    findReposByNameAndVersion,
    getAllReposPagenated,
    getAllRepos,
    updateRepoPackageAction,
    createRepoData
} from "./datastore/modules";
import { addUser } from "./datastore/users";
import {deleteEntity, doesIdExistInKind, resetKind} from "/Users/maxim/Downloads/ECE461_Part2-main/ts-server/src/datastore";
import {datastore, MODULE_KIND, NAMESPACE} from "/Users/maxim/Downloads/ECE461_Part2-main/ts-server/src/datastore/ds_config";

/* * * * * * * * * * *
 * global variables  *
 * * * * * * * * * * */

const ASSETS_PATH = "../assets";
const HTML_PATH = ASSETS_PATH + "/html";
const app = express();
const port = 8080;


app.use(express.json());


/* * * * * * * * * * * *
 * Rest API endpoints  *
 * * * * * * * * * * * */

// Fetch directory of packages
app.post('/packages', async (req, res) => {
    res.send("packages endpoint");

    // Overview:
    //  gets any package which fits the request
    //  to enumerate all packages: provide an array with a single PackageQuery whose name is "*"
    //  line # refers to the OpenAPI yml file

    // request body (json): line 18, 720
    //  [{name:str, version:str}]
    //  name: line 688
    //  version: line 712
    // query param
    //  offset: line 27, 732

    // responses
    //  default: line 35
    //      Error: line 513
    //          code (int32): line 515
    //          message (str): line 516
    //  200: line 41
    //      headers:
    //          offset (str): line 732
    //      content (json): line 49
    //          PackageMetadata: line 535
    //              name
    //              version
    //              ID
    //  400: line 65
    //      missing field/ mailformed request
    //  413: line 66
    //      too many packages returned

    // process request

    let queries = req.body.PackageQuery;

    console.log(`Got /package post request`);

    // validate post request
    if (typeof queries === undefined || queries.length === 0) {
        // invalid request
    } else {
        // there are 1 more more queries. The request is valid.

        // check if an offset has been given. If not, default to 0
        let offset = req.query.offset;
        if (offset === undefined) {
            offset = "0";
        }
        // console.log(`offset: ${offset}`);
        // console.log(queries);

        // do db actions
    }


    // response

});

// Reset to default state
app.delete('/reset', async (req, res) => {
    console.log("reset endpoint");

    // get auth from header
    // look into https://jwt.io/
    //  let auth = req.header["X-Authorization"];
    if(!req.headers.authorization){
        res.sendStatus(400);
    }

    // return 200 when registry is reset
    await resetKind(MODULE_KIND);
    res.sendStatus(200);

    // return 400 for missing field/ invalid auth

    // return 401 for not enough permissions


})

// Upload endpoint and module ingestion
app.post('/package', async (req, res) => {
    res.send("package endpoint");

    // get req content as PackageData schema
    const packageData = req.body;

    // get auth from header
    const auth = req.headers.authorization;

    try {
        // attempt to create and save new package to database
        const newPackage = await addRepo(packageData.name, packageData.version, packageData.url);
        res.status(201).json(newPackage);
    } catch (error) {
        if (error instanceof InvalidRequestError) {
            res.status(400).send(error.message);
        } else if (error instanceof AuthenticationError) {
            res.status(403).send(error.message);
        } else if (error instanceof PackageAlreadyExistsError) {
            res.status(409).send(error.message);
        } else if (error instanceof PackageDisqualificationError) {
            res.status(424).send(error.message);
        } else {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    // 201
    // respond with Package schema json object

    // 400
    // malformed json/ invalid auth

    // 403
    // auth failed (no permissions)

    // 409
    // package already exists

    // 424
    // package not uploaded due to disqualification
});

// Download Endpoint
app.get('/package/:id', async (req, res) => {
    console.log("package/" + req.params.id + " endpoint");

    let id = Number(req.params.id);
    const result = await doesIdExistInKind(MODULE_KIND, id)
    if(!result){
        res.send("req.params.id doesn't exist in MODULE_KIND.");
        return;
    }

    // download package by ID
    res.send(await downloadRepo(id));
    // default response:
    // unexpected error (what error code do we return)

    // code 200
    // return package schema json object
    //  includes: metadata and data

    // code 404
    // package DNE
});

// Update Endpoint
app.put('/package/:id', async (req, res) => {
    res.send("package/" + req.params.id + " endpoint");

    // get package schema from request body

    // get id from path

    // 200
    // version is updated successfully
    // the package contents from PackageData schema will replace previous contents

    // 400
    // malformed json/ invalid auth

    // 404
    // package DNE

});

// Delete endpoint
app.delete('/package/:id', async (req, res) => {
    res.send("package/" + req.params.id + " endpoint");

    // get package ID from path

    // 200
    // package successfully deleted

    // 400
    // malformed json/invalid auth

    // 404
    // package DNE
});

// Rate endpoint
app.get('/package/:id/rate', (req, res) => {
    res.send("package/" + req.params.id + "/rate endpoint");

    // get req with PackageID and AuthenticationToken schema
    // respond with content as PackageRating schema

    // 400
    // malformed json/ invalid auth

    // 404
    // package DNE

    // 500
    // package choked on one metric
});

// Fetch package history
app.get('/package/byName/:name', (req, res) => {
    res.send("package/byName/" + req.params.name + " endpoint");

    // get auth token from header

    // default
    // respond with content as json formatted Error schema

    // 200
    // respond with PackageHistoryEntry in json schema

    // 400
    // maleformed json/ invalid auth

    // 404
    // package DNE
});

// Deletes all versions of a package from the datastore with the given name.
app.delete('/package/byName/:name', async (req, res) => {
    // get package name from header
    const packageName = req.params.name;
    
    // Check if the package name adheres to the naming conventions
    const filter = /^[a-zA-Z0-9\-._~!$&'()*+,;=]+$/.test(packageName);
    if (!filter || packageName === '*') {
        // 400 - invalid package name
        res.status(400).json({error: 'Invalid package name'});
    } else {
        // Retrieve all packages from the datastore with that package name
        const allPackages = await findReposByName(packageName);

        if (allPackages.length === 0) {
            // 404 - package does not exist
            res.status(404).json({error: 'Package does not exist'});
        } else {
            // Delete all versions of the package from the datastore

            // The map() function takes each package object in allPackages and applies a function to it that 
            // returns a promise to delete the package from the datastore using the datastore.delete() function. 
            // The getModuleKey() function is called with the ID of each package to retrieve the datastore key associated 
            // with that package, which is passed to the datastore.delete() function.
            const deletionPromises = allPackages.map((pkg: any) => datastore.delete(getModuleKey(pkg.ID)));

            // The resulting deletionPromises array contains one promise for each package to be deleted. 
            // These promises are then passed to Promise.all(), which returns a single promise that resolves 
            // when all the promises in the array have resolved. The await keyword is used to wait for this promise 
            // to resolve before continuing with the rest of the code.
            await Promise.all(deletionPromises);

            // 200 - package successfully deleted
            res.status(200).json({ message: `All versions of package ${packageName} have been deleted` });
        }
    }
});


// Fetch package with Regex
app.post('/package/byRegEx/:regex', (req, res) => {
    res.send("package/byRegEx/" + req.params.regex + " endpoint");



    // search package names and readme

    // not sure which one is right since the OpenAPI specs say both
    // get regex from url
    // get regex from content as json
    // get auth

    // 200
    // packages found
    // respond with array of PackageMetadata schemas

    // 400
    // malformed json / invalid auth

    // 404
    // no package found that matches this regex
});

// Username-password authentication
app.put('/authenticate', (req, res) => {
    res.send("authenticate endpoint");

    // get AuthenticationRequest schema

    // 200
    // returned auth token successfully

    // 400
    // malformed json / invalid auth

    // 401
    // username or password invalid

    // 501
    // this system does not support authentication

});


/* * * * * * * * * * * * * * *
 * Website Serving endpoints *
 * * * * * * * * * * * * * * */

app.get("/packages", async (req, res) => {
    // serve webpage
    console.log("hello world");
    res.sendFile(path.join(__dirname, HTML_PATH + "/packages.html"));
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, HTML_PATH + "/index.html"));
    res.send("index!");

});

app.listen(port, () => {
    console.log("The application is listening on port " + port + "!");
});
