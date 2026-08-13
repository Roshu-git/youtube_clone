# YouTube Clone

A full-stack YouTube Clone built with **MERN Stack**.

## Installation & Setup

Follow these steps to run the project on your local computer.

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Then move into the project folder:

```bash
cd youtube-clone
```

---

## 2. Backend Setup

Open the backend folder:

```bash
cd backend
```

Install all backend dependencies:

```bash
npm install
```

### Create `.env` File

Inside the `backend` folder, create a file named:

```text
.env
```

Add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not share your `.env` file publicly. It may contain database credentials and secret keys.

### Start the Backend

Run:

```bash
npm run dev
```

The backend should start at:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal.

From the project root, go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

### Start the Frontend

Run:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

## 4. MongoDB Setup

This project requires MongoDB.

Create a MongoDB database and get your MongoDB connection string.

Add the connection string to:

```text
backend/.env
```

Example:

```env
MONGO_URI=your_mongodb_connection_string
```

Make sure MongoDB is connected before testing registration, login, channels, videos, comments, and other features.

---

## 5. Run Both Frontend and Backend

You need **two terminals** running at the same time.

### Terminal 1 — Backend

```bash
cd youtube-clone/backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd youtube-clone/frontend
npm install
npm run dev
```

Then open the frontend URL shown by Vite.

---

## 6. Project Flow

The application works approximately like this:

```text
Frontend (React)
       |
       | API Requests
       ↓
Backend (Node.js + Express)
       |
       ↓
MongoDB
```

The frontend communicates with the backend through API endpoints.

The backend handles:

* User registration
* User login
* Authentication
* Channel creation
* Channel management
* Video management
* Comments
* Other API operations

---

## 7. Important Files

### Backend

```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── package.json
└── server.js
```

### Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── public/
├── package.json
└── ...
```

---

## 8. Do Not Upload These Files

Before pushing the project to GitHub, make sure these are included in `.gitignore`:

```text
node_modules/
.env
dist/
build/
```

Do not upload:

```text
backend/.env
frontend/.env
node_modules/
```

Other users should create their own `.env` file with their own configuration.

---

## 9. Complete Installation Commands

For a new user, the complete process is:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL

cd youtube-clone

cd backend
npm install
```

Create the `backend/.env` file and configure MongoDB and JWT.

Then start the backend:

```bash
npm run dev
```

Open a **new terminal**:

```bash
cd youtube-clone/frontend
npm install
npm run dev
```

Finally, open the frontend URL displayed by Vite in the browser.

---

## 10. Troubleshooting

### `npm install` fails

Make sure Node.js and npm are installed:

```bash
node -v
npm -v
```

Then try:

```bash
npm install
```

### Backend does not start

Check:

* `backend/.env` exists
* MongoDB connection string is correct
* Port `5000` is available
* All backend dependencies are installed

### Frontend cannot connect to backend

Make sure the backend is running:

```text
http://localhost:5000
```

Also check the API URL used by the frontend.

### MongoDB connection error

Check the `MONGO_URI` value in:

```text
backend/.env
```

Make sure your MongoDB database is accessible.

---

## 11. Development

Whenever you download the project on a new computer, install dependencies first:

```bash
cd backend
npm install
```

and:

```bash
cd frontend
npm install
```

After that, start both servers:

```bash
npm run dev
```

The project is now ready to use.


## my github repository link
https://github.com/Roshu-git/youtube_clone

##this is my video link
https://www.awesomescreenshot.com/video/55531319?key=9b259eb794f0f4e32354c7eb3a1dfabe