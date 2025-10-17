# 🧱 Web Page Builder

A **real-time web page builder** that lets you visually create, edit, and manage multiple web pages at once — all updated instantly across connected users using **WebSockets**.

Built with **React**, **Socket.io**, **Node.js**, and **MongoDB**, it’s designed for developers and teams who want a fast, collaborative, and modern web-building experience.

---

## 🚀 Features

- ⚡ Real-time collaboration using WebSockets  
- 🧩 Drag-and-drop visual editor  
- 🌐 Multi-page builder — manage multiple pages in one project  
- 💾 Persistent data storage with MongoDB  
- 🔒 Authentication system with OTP verification  
- 👤 Admin dashboard with pre-seeded admin user  
- 🔁 Instant live updates during editing  

---

## 🧰 Tech Stack

**Frontend:** React, Socket.io-client  
**Backend:** Node.js, Express, Socket.io  
**Database:** MongoDB  

---

## 🛠️ Setup Guide

### 1️⃣ Download the Project

Download the repository as a **ZIP file** and extract it.  
Or clone it using Git:

```bash
git clone https://github.com/Vivek9760/web-page-builder.git
```

---

### 2️⃣ Setup Client

```bash
cd client
```

Create a `.env` file inside the `client` folder and paste the contents from this link:  
👉 [Client .env File](https://docs.google.com/document/d/1Dg5mAhecAVceTg3LYsATkvHU45T433qlUoxZObpJM3o/edit?tab=t.0)

Then install dependencies:

```bash
npm install
```

---

### 3️⃣ Setup Server

```bash
cd server
```

Create a `.env` file inside the `server` folder and paste the contents from this link:  
👉 [Server .env File](https://docs.google.com/document/d/1Dg5mAhecAVceTg3LYsATkvHU45T433qlUoxZObpJM3o/edit?tab=t.2vlz1dsnydz4)

Then install dependencies:

```bash
npm install
```

---

### 4️⃣ Database Setup

You’ll need **MongoDB** installed locally or hosted on the cloud (e.g., **MongoDB Atlas**).

Run this command inside the `server` folder to create a default admin & client user:

```bash
npm run seeds
```

🧑‍💼 **Admin Credentials:**
```
Email: admin@wpb.com  
Password: 123456
```

🧑‍💻 **Client Credentials:**
```
Email: user@wpb.com  
Password: 123456
```

---

### 5️⃣ Run the Project

Start both client and server in separate terminals:

```bash
# In client folder
npm run dev

# In server folder
npm run dev
```

---

## 🧾 Notes

- When registering a new account, check the **server console** for the OTP code.  
- Once logged in, you can start building and editing pages collaboratively in real time.  
- All data is stored securely in MongoDB, and updates are synced across clients instantly.

---

## 🧑‍💻 Contributing

Contributions are welcome!  
Feel free to fork this repo, open an issue, or submit a pull request.

---

## ⭐ Support

If you find this project useful, please consider giving it a **⭐ star** on GitHub — it really helps and motivates further development!

---

## 📧 Contact

For questions or feedback, feel free to reach out via GitHub Issues or Discussions.