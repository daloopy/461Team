"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const modules_1 = require("./datastore/modules");
/* * * * * * * * * * *
 * global variables  *
 * * * * * * * * * * */
const ASSETS_PATH = "../assets";
const HTML_PATH = ASSETS_PATH + "/html";
const app = (0, express_1.default)();
const port = 8080;
app.use(express_1.default.json());
/* * * * * * * * * * * *
 * Rest API endpoints  *
 * * * * * * * * * * * */
app.post('/packages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    else {
        // there are 1 more more queries. The request is valid.
        // check if an offset has been given. If not, default to 0
        let offset = req.query.offset;
        if (offset === undefined) {
            offset = "0";
        }
        console.log(`offset: ${offset}`);
        console.log(queries);
        // do db actions
    }
    // response
}));
app.delete('/reset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("reset endpoint");
    // get auth from header
    // look into https://jwt.io/
    //  let auth = req.header["X-Authorization"];
    // return 200 when registry is reset
    // return 400 for missing field/ invalid auth
    // return 401 for not enough permissions
}));
app.post('/package', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("package endpoint");
    // get req content as PackageData schema
    // get auth from header
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
}));
app.get('/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("package/" + req.params.id + " endpoint");
    // download package by ID
    // default response:
    // unexpected error (what error code do we return)
    // code 200
    // return package schema json object
    //  includes: metadata and data
    // code 404
    // package DNE
}));
app.put('/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
app.delete('/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("package/" + req.params.id + " endpoint");
    // get package ID from path
    // 200
    // package successfully deleted
    // 400
    // malformed json/invalid auth
    // 404
    // package DNE
}));
app.get('/package/:id/rate', (req, res) => {
    res.send("package/" + req.params.id + "/rate endpoint");
    // get req with PackageID and AuthenticationToken schema
    // respond with content as PackageRating schema
    // 400
    // malformed json/ invalid auth
    // 404
    // package DNE
    // 500
    // package rating choked on at least one of the metrics
});
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
app.delete('/package/byName/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get package name from header
    // get auth token from header
    // 200
    // package successfully deleted
    // 400
    // malformed json/ invalid auth
    // 404
    // package DNE
}));
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
app.get("/packages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // serve webpage
    console.log("hello world");
    res.sendFile(path_1.default.join(__dirname, HTML_PATH + "/packages.html"));
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, HTML_PATH + "/index.html"));
    res.send("index!");
    yield (0, modules_1.addRepo)("eeeeeeeee", "eeeeeeeeee.com", "1.1");
    // await addRepo("yeet_test", "google.com", "4.3.2");
    // await addRepo("additional_repo","github", "1.2.2");
    // await addRepo("hacker_man", "lit_hub", "4.20.69");
    // await addRepo("fake_module", "mmm", "10.8.1");
    yield (0, modules_1.findRepo)("yeet1");
}));
app.listen(port, () => {
    console.log("The application is listening on port " + port + "!");
});
