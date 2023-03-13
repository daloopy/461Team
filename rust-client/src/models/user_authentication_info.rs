/*
 * ECE 461 - Spring 2023 - Project 2
 *
 * API for ECE 461/Spring 2023/Project 2: A Trustworthy Module Registry
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: davisjam@purdue.edu
 * Generated by: https://openapi-generator.tech
 */

/// UserAuthenticationInfo : Authentication info for a user



#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct UserAuthenticationInfo {
    /// Password for a user. Per the spec, this should be a \"strong\" password.
    #[serde(rename = "password")]
    pub password: String,
}

impl UserAuthenticationInfo {
    /// Authentication info for a user
    pub fn new(password: String) -> UserAuthenticationInfo {
        UserAuthenticationInfo {
            password,
        }
    }
}

