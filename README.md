# 🚀 CampusConnect

A full-stack MERN (MongoDB, Express, React, Node.js) social media application. This project was built as a complete demonstration of full-stack development, including authentication, CRUD operations, and data relationships.

---

## ✨ Features

* **Authentication:** Full user registration and login using JSON Web Tokens (JWT).
* **Protected Routes:** Backend API routes and frontend pages are protected, requiring a valid token.
* **Full CRUD:** Users can **C**reate, **R**ead, **U**pdate, and **D**elete their own posts.
* **Post Interactions:** Users can **Like** and **Unlike** posts.
* **Authorization:** Users can only Edit or Delete their *own* posts.

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express, MongoDB (with Mongoose)
* **Frontend:** React (with Vite), React Router
* **Authentication:** JWT, bcryptjs
* **State Management:** React Context API
* **API Client:** Axios

---

## 🏃 How to Run Locally

### 1. Backend

1.  `cd backend`
2.  `npm install`
3.  Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
4.  `npm run dev` (Starts on `http://localhost:5000`)

### 2. Frontend

1.  `cd frontend`
2.  `npm install`
3.  `npm run dev` (Starts on `http://localhost:3000`)