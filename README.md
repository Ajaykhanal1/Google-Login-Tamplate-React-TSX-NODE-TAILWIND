
# 🔐 Google Login MERN App (React TSX + Node.js + MongoDB + JWT)

A complete authentication system using **Google OAuth**, built with:

- React (Vite + TypeScript)
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google OAuth (@react-oauth/google)

---

## 🚀 Tech Stack

### Frontend
- React + Vite + TypeScript  
- @react-oauth/google  
- React Router DOM  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT (JSON Web Token)  
- Google Auth Library  

---

## 📁 Project Structure

```

project/
│
├── client/   # Frontend (React TSX)
└── server/   # Backend (Node.js + Express)

````

---

## 🟢 FRONTEND SETUP

### 1. Create React App

```bash
npm create vite@latest client -- --template react-ts
cd client
````

---

### 2. Install Dependencies

```bash
npm install @react-oauth/google axios react-router-dom
```

---

### 3. Run Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### 4. Google OAuth Provider Setup

#### `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

### 5. Login Page

#### `src/pages/Login.tsx`

```tsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
    </div>
  );
}

export default Login;
```

---

### 6. Home Page

#### `src/pages/Home.tsx`

```tsx
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Home;
```

---

## 🟢 BACKEND SETUP

### 1. Create Server

```bash
mkdir server
cd server
npm init -y
```

---

### 2. Install Dependencies

```bash
npm install express mongoose cors dotenv jsonwebtoken google-auth-library
npm install -D nodemon
```

---

### 3. Add Dev Script

#### `package.json`

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

---

### 4. Environment Variables

#### `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

---

### 5. User Model

#### `models/User.js`

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    name: String,
    email: String,
    picture: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

---

### 6. Auth Route

#### `routes/authRoutes.js`

```js
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture,
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: jwtToken,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
```

---

### 7. Server Setup

#### `server.js`

```js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

---

## 🔑 Google Cloud Setup

1. Go to Google Cloud Console
2. Create OAuth Client ID
3. Add Authorized Origin:

```
http://localhost:5173
```

4. Copy Client ID and use it in:

* Frontend (`GoogleOAuthProvider`)
* Backend (`.env`)

---

## 🗄 MongoDB Setup

Use:

* MongoDB Atlas OR
* Local MongoDB

```
mongodb://127.0.0.1:27017/googlelogin
```

---

## ▶️ Run Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🎯 Authentication Flow

```
User clicks Google Login
        ↓
Google returns credential
        ↓
Backend verifies token
        ↓
User created or fetched
        ↓
JWT generated
        ↓
Stored in localStorage
        ↓
Redirect to Home page
```

---

## 🛡 Optional: Protected Route

```tsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};
```

---

## 🚀 Done

* Google OAuth Login
* JWT Authentication
* MongoDB User Storage
* React TSX Frontend
* Node.js Backend
* Clean Project Structure

```

