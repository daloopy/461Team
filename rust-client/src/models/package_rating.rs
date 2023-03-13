/*
 * ECE 461 - Spring 2023 - Project 2
 *
 * API for ECE 461/Spring 2023/Project 2: A Trustworthy Module Registry
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: davisjam@purdue.edu
 * Generated by: https://openapi-generator.tech
 */

/// PackageRating : Package rating (cf. Project 1).  If the Project 1 that you inherited does not support one or more of the original properties, denote this with the value \"-1\".



#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct PackageRating {
    /// 
    #[serde(rename = "BusFactor")]
    pub bus_factor: f64,
    /// 
    #[serde(rename = "Correctness")]
    pub correctness: f64,
    /// 
    #[serde(rename = "RampUp")]
    pub ramp_up: f64,
    /// 
    #[serde(rename = "ResponsiveMaintainer")]
    pub responsive_maintainer: f64,
    /// 
    #[serde(rename = "LicenseScore")]
    pub license_score: f64,
    /// The fraction of its dependencies that are pinned to at least a specific major+minor version, e.g. version 2.3.X of a package. (If there are zero dependencies, they should receive a 1.0 rating. If there are two dependencies, one pinned to this degree, then they should receive a Â½ = 0.5 rating).
    #[serde(rename = "GoodPinningPractice")]
    pub good_pinning_practice: f64,
}

impl PackageRating {
    /// Package rating (cf. Project 1).  If the Project 1 that you inherited does not support one or more of the original properties, denote this with the value \"-1\".
    pub fn new(bus_factor: f64, correctness: f64, ramp_up: f64, responsive_maintainer: f64, license_score: f64, good_pinning_practice: f64) -> PackageRating {
        PackageRating {
            bus_factor,
            correctness,
            ramp_up,
            responsive_maintainer,
            license_score,
            good_pinning_practice,
        }
    }
}

