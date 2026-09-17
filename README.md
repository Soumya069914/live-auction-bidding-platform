# live-auction-bidding-platform

A real-time web-based auction platform where sellers can create auctions for their products and buyers can participate by placing bids. The system provides real-time bid updates using WebSocket and stores auction data in MySQL.

The project is developed using **Angular, Java/Advanced Java, Spring Boot, WebSocket and MySQL**.

---

## 📌 Project Overview

The **Live Auction Bidding Platform** is a web application that allows sellers to list products for auction and buyers to compete by placing bids in real time.

The main purpose of the project is to provide an interactive auction environment where users can see the latest bid immediately without refreshing the page.

The system uses:

- **Angular** for the frontend
- **Java / Advanced Java** for backend programming
- **Spring Boot** for backend development
- **WebSocket** for real-time communication
- **MySQL** for database management
- **JPA / Hibernate** for database interaction
- **Maven** for dependency and build management

---

# 🎯 Objectives

The main objectives of the project are:

- To develop an online auction platform.
- To allow sellers to create and manage auctions.
- To allow buyers to participate in live auctions.
- To implement real-time bidding using WebSocket.
- To validate bids on the server side.
- To maintain auction and bidding data using MySQL.
- To implement REST APIs using Spring Boot.
- To apply Advanced Java concepts in backend development.
- To automatically determine the winner when an auction ends.
- To provide a simple and user-friendly auction interface.

---

# 🚀 Main Features

## 1. User Registration and Login

Users can register and log in to the platform.

The system supports three types of users:

- BUYER
- SELLER
- ADMIN

### Buyer

A buyer can:

- Register and login
- Browse auctions
- Search for products
- View auction details
- Place bids
- View bid history
- View won auctions
- View orders

### Seller

A seller can:

- Register and login
- Add products
- Create auctions
- Set starting price
- Set minimum bid increment
- Set auction start time
- Set auction end time
- Monitor bids
- View auction results

### Admin

An admin can:

- View users
- Manage users
- View auctions
- Manage inappropriate listings
- Monitor system information

---

# 🛍️ Product Management

Sellers can create and manage products before putting them into an auction.

Each product can contain:

- Product ID
- Product name
- Description
- Category
- Image
- Seller information
- Creation date

### Example

```text
Product Name: iPhone 15
Category: Electronics
Description: Apple iPhone 15
Starting Price: ₹40,000
Minimum Increment: ₹500
