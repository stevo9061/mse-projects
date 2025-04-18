# Master Thesis: Effort and Performance: Low-Code vs. Traditional Development

This repository contains the projects of the Master Thesis **"Effort and Performance: Low-Code vs. Traditional Development ’**.

## Overview
- **Use Cases:**  
  The Java/Angular implementations for use cases 1 to 3 are stored in separate directories.  
  Each directory contains its own `README.md`, which briefly describes the respective purpose.

- **Mendix implementations:**  
The Mendix implementations have **not** been published on GitHub as the applications are hosted in the Mendix Cloud. Depending on the configuration - for example, when using Mendix Single Sign-On (SSO) - access may require interested parties to register with a Mendix account and be explicitly invited by the author. In other cases, access is via user accounts created in the application, so that a download of Mendix Studio Pro is not necessary for end users. Furthermore, Mendix is free for private use but you can only register with a work email address [Signup for Mendix](https://signup.mendix.com/link/signup). Instead, the master's thesis is accompanied by extensive technical documentation.

## Mendix Java Actions
In addition to the scripts in the `FlowAnalysis-with-Mendix-SDK` folder, there are Java actions from the Mendix use cases in the `Mendix-Java-Actions` directory. 

- As the existing script does not offer any functionality for automatic evaluation of the cyclomatic complexity for Java actions, these were determined **manually**.
- The Java Actions are attached here as **reference**, as the Mendix implementations themselves are not included in the repository.


## Cyclomatic Complexity in Mendix

Since there was no easy way to measure cyclomatic complexity in Mendix, scripts were developed in the folder `FlowAnalysis-with-Mendix-SDK` to determine this metric. An official Mendix API was used, but it is no longer actively maintained or updated. Nevertheless, its functionality was sufficient for the requirements and worked reliably. The analyses were also checked manually.

> **Note:**  
> Due to authentication restrictions, the author can only execute these scripts himself.  
> The scripts therefore serve primarily as proof of work and as a blueprint for future, similar analyses in Mendix applications.



## Further notes

Further details and instructions can be found in the respective `README.md` files of the individual
