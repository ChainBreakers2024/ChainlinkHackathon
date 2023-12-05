<div align="center" style="margin-top: 1em; margin-bottom: 3em;">
  <a href="https://ethereum.org"><img alt="chainbreakers logo" src="./public/eth-logo-gradient.png" alt="chainbreakers.online" width="125"></a>
  <h1>👋 Welcome to chainbreakers.online!</h1>
</div>


This is the repo for the [chainbreaker.online](https://chainbreaker.online) website, a project offering gaming experiences without gambling, prioritizing responsible entertainment. The site's goal is to provide a platform for players to enjoy games without the risk associated with gambling practices. Read more about the project's mission and objectives [here](https://chainbreaker.online/about/).

[chainbreaker.online](https://chainbreaker.online) is continually evolving with contributions from community members who contribute content, provide feedback, or volunteer their time to enhance its features. If you’re interested in contributing to the improvement of [chainbreaker.online](https://chainbreaker.online).



## Exploring Ethereum Gaming?

If you're interested in Ethereum's gaming ecosystem, it's essential to note that Ethereum itself does not have a single repository dedicated solely to gaming. Instead, Ethereum supports various gaming projects and decentralized applications (DApps) built on its blockchain.

Ethereum serves as the underlying infrastructure for gaming applications developed by different teams and communities. These games leverage Ethereum's smart contracts and decentralized nature to offer unique gaming experiences.

To explore Ethereum's gaming landscape, check out the diverse range of gaming projects and decentralized applications built on the Ethereum blockchain. You can discover these by exploring different platforms and forums dedicated to Ethereum gaming innovation and development.



## Table of contents

- [Code Structure Understanding](#code-structure)
- [Frontend Code Understanding](#frontend)
- [Backend Code Understanding](#backend)

## Code Structure

The codebase of chainbreakers.online is organized into several directories, each serving a specific purpose:

### app (Main App Folder)
- `app/api`: Houses backend APIs responsible for handling server-side functionalities.
- `app/(general)`: Represents the primary website folder containing main frontend components and functionalities.
- `app/dashboard`: Includes user dashboard and lobby-related functionalities.

### components (Main Component Folder)
- `components/app`: Holds main app-related components.
- `components/blockchain`: Contains components related to blockchain interactions, such as address, wallet balance, and wallet ENS name.
- `components/layout`: Includes layout components like footer, navigation, and header.
- `components/providers`: Contains providers responsible for communication with libraries like RainbowKit.
- `components/ui` & `components/shared`: Houses UI elements and shared components.

### contracts
- `contracts`: Contains blockchain contracts utilized by chainbreakers.online.

### lib (Library Files)
- `lib/app`: Holds main app-related libraries.
- `lib/generated`: Contains generated blockchain libraries.

### prisma (Database Files)
- `prisma`: Includes main database files utilizing Prisma.

### public
- `public`: Contains image and icon files used in the application.

### scripts
- `scripts`: Houses scripts necessary for running the project.

### styles
- `styles`: Contains CSS files responsible for styling the project.

## Frontend

This project utilize
s Next.js, React, TypeScript, and Web3.js for its frontend functionalities.

### Next.js
Next.js is a React framework used for building server-side rendered (SSR) and statically generated web applications. It aids in seamless routing, faster page loading, and enhanced developer experience.

### React
React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently manage the application's state.

### TypeScript
TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch potential errors during development, enhancing code maintainability and scalability.

### Web3.js
Web3.js is a JavaScript library that interacts with the Ethereum blockchain. It enables communication between the frontend and the Ethereum network, allowing functionalities like reading data, sending transactions, and interacting with smart contracts.

### SIWE (Sign in with Ethereum)
SIWE, or Sign in with Ethereum, is an authentication method that enables users to sign in to the application using their Ethereum wallet. It utilizes Ethereum's cryptographic capabilities for secure and decentralized authentication.

### RainbowKit
RainbowKit is a tool designed to improve the process of connecting a wallet to the application. It likely streamlines wallet integration, providing a smoother and more user-friendly experience for interacting with Ethereum wallets.

## Backend

The backend of this project is powered by Node.js, Prisma, and Ethereum.

### Node.js
Node.js is a runtime environment that executes JavaScript code server-side. It facilitates building scalable and efficient backend applications using JavaScript.

### Prisma
Prisma is an ORM (Object-Relational Mapping) tool that simplifies database operations. It offers a type-safe and intuitive way to interact with databases, allowing seamless integration and manipulation of data.

### Ethereum
Ethereum serves as the underlying blockchain technology, providing the decentralized infrastructure for various functionalities within the application, such as smart contracts, transactions, and data storage.