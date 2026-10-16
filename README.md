# Binaire - System Tasks and Sensor Viewer (CLI)

This project was built for the JavaScript Developer Assessment at Binaire Private Limited[cite: 1, 2]. It is a Terminal-Based UI (TUI) application that supports real-time system tasks (processes), hardware sensors, and Firebase authentication[cite: 1, 2].

## 🚀 Tech Stack & Libraries
* **UI Framework:** Built using ReactJS with the **Ink** library to render React components (`<Box>`, `<Text>`) directly in the terminal[cite: 1].
* **System Sensors:** Uses the **`systeminformation`** library to fetch hardware metrics (CPU load, core temperatures, RAM, disk usage, network speed, and battery)[cite: 1].
* **System Processes:** Uses Node.js's native `child_process` module (`ps` command) to retrieve running system tasks and processes[cite: 1].
* **Authentication:** Implemented secure Sign-up and Login screens using the Firebase Auth SDK[cite: 2].

## 🏛️ OOP Architecture & Design Structure
The project follows clean code practices with **Object-Oriented Programming (OOP) principles** and classes[cite: 1]:
* **`src/api/`**: `SensorApi` and `ProcessApi` classes for data fetching[cite: 1].
* **`src/models/`**: `ProcessModel` for data structure management.
* **`src/sorting/`, `src/filters/`, `src/search/`**: Dedicated OOP classes to sort, filter, and search through processes[cite: 1].
* **`src/auth/`**: `FirebaseAuthService` for managing user authentication[cite: 2].

## ⌨️ Keyboard Shortcuts & Interactivity
* **Up / Down Arrows**: Navigate through the process table[cite: 1].
* **`s` Key**: Change sorting field (`cpu` -> `mem` -> `pid` -> `program`)[cite: 1].
* **`r` Key**: Reverse the sorting order[cite: 1].
* **`f` or `/` Key**: Activate process search/filter[cite: 1].
* **`q` or `Esc` Key**: Exit the application.

## 🛠️ Installation & Running
1. Install dependencies:
   ```bash
   npm install