/*
 * ECE 461 - Spring 2023 - Project 2
 *
 * API for ECE 461/Spring 2023/Project 2: A Trustworthy Module Registry
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: davisjam@purdue.edu
 * Generated by: https://openapi-generator.tech
 */

/// AuthenticationRequest : 



#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct AuthenticationRequest {
    #[serde(rename = "User")]
    pub user: Box<crate::models::User>,
    #[serde(rename = "Secret")]
    pub secret: Box<crate::models::UserAuthenticationInfo>,
}

impl AuthenticationRequest {
    /// 
    pub fn new(user: crate::models::User, secret: crate::models::UserAuthenticationInfo) -> AuthenticationRequest {
        AuthenticationRequest {
            user: Box::new(user),
            secret: Box::new(secret),
        }
    }
}


