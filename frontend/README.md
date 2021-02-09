# Blockchain Frontend

A frontend for a simple Blockchain implementation. The frontend is a node JS server managed by yarn. Vue.js is used with Typescript. 

## Table of Contents
* [Prerequisites](#prerequisites)
* [Setup](#setup)
* [Development Server](#development-server)
* [Production Server](#production-server)
* [Linting](#lints-and-file-fixes)

## Prerequisites

* Yarn Version 1.22.5 (or later) to handle setup, dependency management, and builds

## Setup
A ```package.json``` file is included with all required dependencies. To initially setup the project, in the ```frontend``` directory
```console
yarn install
```
This will install all dependencies in the local ```node_modules``` directory.

Note this is only needed for the first compile to generate the ```yarn.lock``` file.\
\[[toc](#table-of-contents)\]

## Development Server
To compile and hot-reload for development (most builds since this is for demonstration purposes only):
```console
yarn serve
```
\[[toc](#table-of-contents)\]

## Production Server
To compile and minify for production:
```console
yarn build
```
\[[toc](#table-of-contents)\]

## Lints and File Fixes
```console
yarn lint
```
\[[toc](#table-of-contents)\]