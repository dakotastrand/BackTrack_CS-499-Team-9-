# BackTrack Project Setup Guide

This guide will walk you through setting up and running the BackTrack server and mobile application.

## 1. Server Setup

Follow these steps to get the Python backend server running.

1.  **Navigate to the Server Directory**
    Open a terminal and navigate to the `server` directory from the project root.
    ```bash
    cd server
    ```

2.  **Create and Activate Virtual Environment**
    Create a Python virtual environment to isolate dependencies.
    ```bash
    python -m venv venv
    ```
    Activate it based on your operating system:
    *   **Windows:**
        ```bash
        venv\Scripts\activate
        ```
    *   **macOS & Linux:**
        ```bash
        source venv/bin/activate
        ```

3.  **Install Dependencies**
    Install the required Python packages from `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Server**
    Start the Flask server.
    ```bash
    python server.py
    ```

## 2. Mobile App Setup

Follow these steps to set up the Expo mobile application.

1.  **Navigate to the App Directory**
    Open a *new* terminal and navigate to the `App` directory.
    ```bash
    cd App
    ```

2.  **Install Dependencies**
    Install the Node.js dependencies.
    ```bash
    npm install
    ```

3.  **Start the App**
    Start the Expo development server. A URL and QR code will appear in the terminal, which you can use to open the app.
    ```bash
    npx expo start
    ```

## 3. Network Configuration

**Important:** For the mobile app to communicate with your local server, you must configure the API endpoint.

1.  Navigate to the `.env` file within the `App` directory.
2.  Find the `EXPO_PUBLIC_API_URL` variable.
3.  Update its value to match the IP address of the machine running the server (e.g., `http://192.168.1.100:5000`). This is crucial for the app to communicate correctly with the server.

    > **Tip:** On Windows, you can find your local IP address by running `ipconfig` in the command prompt. On macOS/Linux, use `ifconfig` or `ip addr`.