use std::env;
use std::path::Path;
use std::fs::File;
use std::io::{BufRead, BufReader};
mod package;
use package::Package;
use package::URL;
use pyo3::prelude::*;

static API_PYTHON: &str = r#"
import gql
import json
from gql.transport.requests import RequestsHTTPTransport
import os
import re
import requests
import base64

def getRestData(owner, repo):

    token = os.getenv("GITHUB_TOKEN")
    url = "https://api.github.com/repos/{}/{}".format(owner, repo)
    headers = {'Authorization': f'Bearer {token}', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers)

    response.raise_for_status()
    if response.status_code == 200:
        pretty_data = json.loads(response.text)
        
        contentURL = "https://api.github.com/repos/{}/{}/contents/".format(owner, repo)
        content_resp = requests.get(contentURL, headers=headers)
        content_resp.raise_for_status()
        if content_resp.status_code == 200:
            pretty_content = json.loads(content_resp.text)

            names = []
            for i in range(len(pretty_content)): 
                names.append(pretty_content[i]["name"])
            test_score = 0
            hasREADME = False     
            if 'test'.casefold() in (name.casefold() for name in names):
                test_score = 1
            if "README.md" in names:
                hasREADME = True
        
            hasWiki = pretty_data["has_wiki"]
            hasDiscussions = pretty_data["has_discussions"]
            hasPages = pretty_data["has_pages"]
            
            license_score = 0
            hasLicense = pretty_data["license"]
            if hasLicense == "False":
                RMurl = "https://api.github.com/repos/{}/{}/contents/README.md".format(owner, repo)
                RM_resp = requests.get(RMurl, headers=headers)
                RM_resp.raise_for_status()
                if RM_resp.status_code == 200:
                    pretty_readme = json.loads(RM_resp.text)
                    rmbase64 = pretty_readme["content"]

                    decoded = base64.b64decode(rmbase64)
                    decodeStr = decoded.decode()
                    licenses = {"Apache": 0, "MIT": 1, "GNU": 1, "GPL": 1, "LGPL": 1, "MPL": 1, "Eclipse Public License": 0, "BSD": 1, "CDDL": 1}
                    license_score = 0.5
                    if "Licence" in decodeStr:
                        licenseStr = decodeStr.split("Licence",1)[1]
                        # license compatible = 1, lincese exists but not compatible = 0.5, license doesn't exist = 0
                        for key, val in licenses.items():
                            if key in licenseStr:
                                license_score = 1
                else:
                    print("Request failed with status code:", response.status_code)
            else:
                license_score = 1 
        else:
            print("Request failed with status code:", response.status_code)
    else:
        print("Request failed with status code:", response.status_code)

    return test_score, license_score, hasWiki, hasDiscussions, hasPages, hasREADME
 

def getGqlData(owner, repo):
  token = os.getenv("GITHUB_TOKEN")   # get personal github api token
  headers = {"Authorization": "Token {}".format(token)}

  # Use the RequestsHTTPTransport class to send the GraphQL query with the headers
  transport = RequestsHTTPTransport(
    url="https://api.github.com/graphql",
    headers=headers,
    use_json=True,
  )

  # Create a client using the transport
  client = gql.Client(transport=transport, fetch_schema_from_transport=True)

### RESPONSE QUERY
  # create query
  response_query = """
  {{ 
  repository(owner:"{}", name:"{}") {{ 
    name
    issues {{
      totalCount
    }}
    open: issues(states:OPEN) {{
      totalCount
    }}
    closed: issues(states:CLOSED) {{
      totalCount
    }}
  }}
  }}
""".format(owner, repo)

  # Provide a GraphQL query
  query = gql.gql(response_query)

  # Execute the query on the transport
  response_result = client.execute(query) 

### BUS QUERY
  bus_query ="""
  {{
  repository(owner:"{}", name:"{}") {{
    object(expression:"master") {{
      ... on Commit {{
        history {{
          totalCount
        }}
      }}
    }}
  }}
}}
""".format(owner, repo)

  query = gql.gql(bus_query)
  bus_result = client.execute(query)

  #format data
  data = {
    "open_issues": response_result["repository"]["open"]["totalCount"],
    "closed_issues": response_result["repository"]["closed"]["totalCount"],
    "total_commits": bus_result["repository"]["object"]["history"]["totalCount"]
  }

  return data

def getOwnerRepo(url):
  parts = re.split("/", url)
  owner = parts[0]
  repo = parts[1]
  return owner, repo

def getData(*args):
  owner_repo = args[0]
  owner,repo = getOwnerRepo(owner_repo)
  gqldata = getGqlData(owner, repo)
  test_score, license_score, hasWiki, hasDiscussions, hasPages, hasREADME = getRestData(owner, repo)

  data = gqldata
  data["hasREADME"] = hasREADME
  data["hasWiki"] = hasWiki
  data["hasPages"] = hasPages
  data["hasDiscussions"] = hasDiscussions
  data["testScore"] = test_score
  data["licenseScore"] = license_score
  print(str(data))

"#;

pub fn main(){

    let args: Vec<String> = env::args().collect(); //returns an iterator

    let task = &args[1]; //stores what instruction will be run
    println!("File to run {}", task);

    let path = Path::new(task.as_str());
    let file_result = File::open(path); // Open the path in read-only mode, returns `io::Result<File>`

    // error handling
    let _file = match file_result  {
        Ok(_file) => {
            let reader = BufReader::new(_file); 
            for (index, line) in reader.lines().enumerate() {
                let line = line.unwrap(); // Ignore errors.
                println!("{}. {}", index + 1, line);

                // initialize object
                // might not be needed
                let obj = Package {
                    total_score: -1.0,
                    bus_factor: -1.0,
                    responsiveness: -1.0,
                    license: -1.0,
                    correctness: -1.0,
                    ramp: -1.0,
                    url: URL::new(line), // send in URL
                };

                println!("Constructed Package");
                println!("Running Python:");
                Python::with_gil(|py| -> PyResult<()> {
                    let app = PyModule::from_code(py, &API_PYTHON, "", "")?;
                    let new_app: Py<PyAny> = app.getattr("getData")?.into();
                    new_app.call1(py, (obj.url.get_owner_repo(),))?;

                    Ok(())
                });
                println!("Above is the JSON output\n")

            }
        }
        Err(err) => panic!("Problem opening the file: {:?}", err),
    };
}



