/*
 * ECE 461 - Spring 2023 - Project 2
 *
 * API for ECE 461/Spring 2023/Project 2: A Trustworthy Module Registry
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: davisjam@purdue.edu
 * Generated by: https://openapi-generator.tech
 */




#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct Error {
    #[serde(rename = "code")]
    pub code: i32,
    #[serde(rename = "message")]
    pub message: String,
}

impl Error {
    pub fn new(code: i32, message: String) -> Error {
        Error {
            code,
            message,
        }
    }
}


