# Sales Management System  

## Overview

A **web-based sales management system** built using **Node.js, Express.js, MongoDB, and Socket.io**, following the **MVC architecture**. This system provides **admin controls** for managing products, users, and permissions, along with a **customer-friendly shopping experience** featuring real-time chat and friend management.  

---

## Features  

<p align="center">
  <img src=https://github.com/trgtanhh04/Sales-management-system/blob/main/admin.png width="45%" alt="Admin Dashboard">
  <img src=https://github.com/trgtanhh04/Sales-management-system/blob/main/client.png width="45%" alt="Client Dashboard">
</p>


### **Admin Dashboard**  
- **Overview** – Displays key sales statistics and analytics.  
- **Product Categories** – Manage product categories efficiently.  
- **Product List** – View, add, update, and delete products.  
- **Role Groups & Permissions** – Assign roles and define access levels.  
- **User Accounts Management** – Manage and control registered users.  

### **Client Features**  
- **Homepage** – Display trending products and promotions.  
- **Products** – Browse and search for products.  
- **Shopping Cart** – Add, remove, and update cart items.  
- **Friends System** – Add and manage friends (**Socket.io-powered real-time updates**).  
- **Chat Room** – Real-time messaging with friends (**instant communication via Socket.io**).  
- **User Authentication** – Register, log in, and log out.  
- **Forgot Password & OTP Verification** – Secure password recovery.  
- **General Settings** – Manage user profiles and preferences.  

---

##  Technologies Used  
- **Backend:** Node.js, Express.js, Mongoose (MongoDB).  
- **Frontend:** Pug, Bootstrap (for a responsive UI).  
- **Real-time Features:** Socket.io (for messaging & friend system).  
- **Authentication:** Session-based login with secure user validation.  

---
## MVC Pattern

MVC is a popular software architecture that helps separate the components in an application. Here is the MVC pattern for this system:

<p align="center">
  <img src="https://github.com/trgtanhh04/Clinic-management/blob/main/mvc.png" width="60%" alt="MVC Pattern">
</p>

---

## 🎥 Video Demo

[![Watch Video](https://img.shields.io/badge/Youtube-Clinic%20Management-red?logo=youtube)](https://youtu.be/mjyDzThRdGM?si=HIIRGrxNZKDJRdgM)

---

## 📌 How to Run  

### 1. **Clone the Repository**  
```bash
git clone https://github.com/trgtanhh04/Sales-management-system.git
cd Sales-management-system
```
### 2. Install Dependencies
Run the following command to install all necessary libraries from package.json:
```bash
npm install
```
### 3. Run the Server
Navigate to the folder and start the server:
```bash
npm start
```
The server runs on port 3000 by default

### 4. Access the Application
- Admin Panel: http://localhost:3000/admin
- Client App: http://localhost:3000/
