# EVM MCP Server

A Master Control Program (MCP) server for interacting with EVM smart contracts with a web interface for transaction confirmations.

## Architecture

- **MCP Server**: Handles read operations and prepares transactions
- **Web DApp**: Provides user interface, wallet connection, and transaction confirmation

## Project Structure

- `/server` - Backend MCP server
- `/client` - Frontend Web DApp

## Features

- Read operations through MCP server using API keys
- Write operations requiring wallet signature through Web DApp
- Support for multiple EVM chains
- Secure API key storage
- Transaction monitoring

## Setup and Installation

See individual README files in server and client directories.
