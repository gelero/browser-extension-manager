# 🌟 Browser Extensions Manager - Frontend Mentor Solution

An interactive solution for the "**Browser Extensions Manager**" challenge from Frontend Mentor, implemented with **React** for the Frontend and **Node.js/Express** for the REST API Backend.

## 🔗 Links

* **Live Demo (Solution Link):** [https://browser-extension-manager-ruddy.vercel.app]
* **Repository (Frontend & Backend):** [https://github.com/gelero/browser-extension-manager]

---

## ✨ Project Overview

### The Challenge
The goal of this project was to build an extension management interface, ensuring the layout was **responsive** across different screen sizes and that the application could **consume an API** to handle data manipulation.

### My Solution
This solution was developed using the **SPA (Frontend) + REST API (Backend)** architecture, focusing on:

* **State Management:** Utilizing `useState` and `useEffect` to manage the extensions list, themes, and filters.
* **API Communication:** The frontend consumes endpoints from the Node.js backend to fetch and update the state of the extensions.
* **Interactivity:** Features include **toggling status** (`toggle`), **filtering** by status (Active/Inactive/All), and **switching themes** (Dark/Light mode).
* **Temporary Removal:** Implementation of a removal that is **visual only** on the frontend, ensuring the complete list is restored upon page refresh (as per the challenge requirement).

---

## 🛠️ Used Technologies

### Frontend (SPA)
* **React:** Primary library for building the interface.
* **Vite:** Fast build tool.
* **JavaScript (ES6+):** Logic and state manipulation.
* **Pure CSS:** Styling, including **CSS Variables** for the theme system (dark/light mode).

### Backend (REST API)
* **Node.js:** Runtime environment.
* **Express:** Framework for creating routes and handling requests.
* **CORS:** Middleware to allow requests from the hosted frontend.

---

## ⚙️ How to Run the Project Locally

This project is structured in a main folder containing the `backend` and `frontend` subdirectories. Both must be started in parallel.

### Step 0: Clone the Repository

1.  **Clone the main repository:**
    ```bash
    git clone [https://github.com/gelero/browser-extension-manager](https://github.com/gelero/browser-extension-manager)
    cd browser-extension-manager
    ```

### Step 1: Start the Backend (API)

1.  **Navigate to the Backend folder:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the API:**
    ```bash
    npm start 
    ```
    *The API will be running at `http://localhost:5000`.*

### Step 2: Start the Frontend (React)

1.  **Go back to the root and navigate to the Frontend folder:**
    ```bash
    cd ..
    cd frontend
    ```
2.  **Create the environment file:**
    In the frontend root, create a file named **`.env`** and add your API URL:
    ```
    VITE_API_URL=http://localhost:5000/api/extensions 
    # Use the address of your local or hosted API
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the Frontend:**
    ```bash
    npm run dev
    ```
    *The application will open in your browser (usually at `http://localhost:5173`), consuming the local API.*

---

## 🙋 Author

* **Frontend Mentor:** [@gelero](https://www.frontendmentor.io/profile/gelero)
* **GitHub:** [@gelero](https://github.com/gelero)