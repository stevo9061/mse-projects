## Mendix scripts for analysing projects

This repository contains a collection of scripts that were developed as part of a master's thesis. 
The aim is to analyse various aspects of Mendix projects and gain detailed insights into
their architecture and quality.

Important notice:
The Mendix Model SDK used is now obsolete and is no longer maintained or updated by the Mendix team. 
However, the current old version (V4.97.0) was completely sufficient for the use cases considered in this work and did not cause any errors. The results were also validated manually, meaning that the analyses can be assumed to be highly reliable.

**Areas of application**

The scripts enable, among other things:

- Analysing microflows and nanoflows  
Determination of the microflows and nanoflows used in the project and calculation of the cyclomatic complexity.

- Widget counting and page analysis  
Traversing pages and snippets to identify widgets used and create a detailed overview.
- Project structure and use cases  
The scripts are organised in separate folders for individual use cases to ensure improved clarity and maintainability.


**Prerequisites**

- Node.js (version 12 or higher) is required.

- Mendix accounts, projects and corresponding authorisations  
Valid access data is required to connect to the Mendix platform.

Note:
It does not make sense to use this scripts without a Mendix Account, projects and a personal access token. 
However, the scripts can be used as a basis and support for analysing your own Mendix projects.

## Installation

To set up the project, execute the following steps:  
```
npm init --yes
npm install -g typescript
npm install mendixmodelsdk mendixplatformsdk when @types/when --save
tsc --init
```


## Documentation

Further information on the SDKs used:
- [Mendix Model SDK Documentation] (https://docs.mendix.com/apidocs-mxsdk/mxsdk/)
- [Mendix SDK API Documentation] (https://apidocs.rnd.mendix.com/modelsdk/latest/index.html)

