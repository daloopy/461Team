# Rust API client for openapi

API for ECE 461/Spring 2023/Project 2: A Trustworthy Module Registry

For more information, please visit [http://davisjam.github.io](http://davisjam.github.io)

## Overview

This API client was generated by the [OpenAPI Generator](https://openapi-generator.tech) project.  By using the [openapi-spec](https://openapis.org) from a remote server, you can easily generate an API client.

- API version: 2.0.0
- Package version: 2.0.0
- Build package: `org.openapitools.codegen.languages.RustClientCodegen`

## Installation

Put the package under your project folder in a directory named `openapi` and add the following to `Cargo.toml` under `[dependencies]`:

```
openapi = { path = "./openapi" }
```

## Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**create_auth_token**](docs/DefaultApi.md#create_auth_token) | **PUT** /authenticate | 
*DefaultApi* | [**package_by_name_delete**](docs/DefaultApi.md#package_by_name_delete) | **DELETE** /package/byName/{name} | Delete all versions of this package.
*DefaultApi* | [**package_by_name_get**](docs/DefaultApi.md#package_by_name_get) | **GET** /package/byName/{name} | 
*DefaultApi* | [**package_by_reg_ex_get**](docs/DefaultApi.md#package_by_reg_ex_get) | **POST** /package/byRegEx/{regex} | Get any packages fitting the regular expression.
*DefaultApi* | [**package_create**](docs/DefaultApi.md#package_create) | **POST** /package | 
*DefaultApi* | [**package_delete**](docs/DefaultApi.md#package_delete) | **DELETE** /package/{id} | Delete this version of the package.
*DefaultApi* | [**package_rate**](docs/DefaultApi.md#package_rate) | **GET** /package/{id}/rate | 
*DefaultApi* | [**package_retrieve**](docs/DefaultApi.md#package_retrieve) | **GET** /package/{id} | Interact with the package with this ID
*DefaultApi* | [**package_update**](docs/DefaultApi.md#package_update) | **PUT** /package/{id} | Update this content of the package.
*DefaultApi* | [**packages_list**](docs/DefaultApi.md#packages_list) | **POST** /packages | Get the packages from the registry.
*DefaultApi* | [**registry_reset**](docs/DefaultApi.md#registry_reset) | **DELETE** /reset | Reset the registry


## Documentation For Models

 - [AuthenticationRequest](docs/AuthenticationRequest.md)
 - [Error](docs/Error.md)
 - [Package](docs/Package.md)
 - [PackageData](docs/PackageData.md)
 - [PackageHistoryEntry](docs/PackageHistoryEntry.md)
 - [PackageMetadata](docs/PackageMetadata.md)
 - [PackageQuery](docs/PackageQuery.md)
 - [PackageRating](docs/PackageRating.md)
 - [User](docs/User.md)
 - [UserAuthenticationInfo](docs/UserAuthenticationInfo.md)


To get access to the crate's generated documentation, use:

```
cargo doc --open
```

## Author

davisjam@purdue.edu
