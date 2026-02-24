# SignalMapper

SignalMapper is a Progressive Web App (PWA) for crowdsourcing and visualizing cellular signal strength. It allows users to easily log signal quality at their current location, and then view that data on a map to understand cellular coverage patterns.

This project is being developed in collaboration with the App Prototyper AI in Firebase Studio and Google's Jules AI app developer. For best practices on this collaborative workflow, please see [docs/agents.md](docs/agents.md).

## Core Features

-   **Simple Data Logging:** Log signal strength with a single tap. The app automatically captures your precise location, timestamp, and network details.
-   **Data Visualization:** See your signal data come to life on a scatter plot, showing the geographic distribution of signal quality.
-   **PWA Functionality:** Installable on your home screen for a native-app feel and designed for offline capabilities.
-   **Secure & Private:** Built on a Firebase backend where each user can only access their own data.

## How It Works

The user flow is designed for simplicity and efficiency:

1.  **Open the App:** Access the app through any modern web browser on any device.
2.  **Log a Point:** On the main screen, select the current signal strength (1-4 bars) and your network carrier.
3.  **Visualize:** Navigate to the dashboard to see all your logged points plotted on a chart, giving you an at-a-glance understanding of signal quality in the areas you've visited.

## Technical Overview

SignalMapper is built with a modern, robust, and scalable tech stack.

-   **Frontend:**
    -   **Framework:** [Next.js](https://nextjs.org/) with the App Router
    -   **Language:** [TypeScript](https://www.typescriptlang.org/)
    -   **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), and [Tailwind CSS](https://tailwindcss.com/)
    -   **Visualization:** [Vega-Lite](https://vega.github.io/vega-lite/) for data charting.
-   **Backend:**
    -   **Platform:** Designed to run on [Firebase](https://firebase.google.com/).
    -   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth) to manage user accounts.
    -   **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore) is used as the database, with a security model that ensures users can only access their own data. The data structure is detailed in `docs/backend.json`.

## About Progressive Web Apps (PWAs)

SignalMapper is a PWA, which is a web application that provides a user experience similar to that of a native mobile app.

#### Advantages

-   **Installable:** Users can add the app to their home screen without needing to go through an app store.
-   **Offline Capability:** PWAs can be designed to work offline or on low-quality networks. This is especially crucial for a signal mapping application, as users are often in areas with poor connectivity when they need to log data.
-   **Cross-Platform:** A single codebase works across all devices and platforms (iOS, Android, Desktop), significantly reducing development and maintenance effort.
-   **No App Store:** The app is delivered directly through the web, bypassing app store approval processes and fees.

#### Disadvantages

-   **Limited Hardware Access:** While web standards are constantly improving, PWAs may have more restricted access to certain low-level device hardware and OS features compared to a fully native application.
-   **Platform Inconsistencies:** The user experience and level of feature support (e.g., how push notifications are handled) can vary slightly between operating systems and browsers.

## Project Structure

-   `src/app/`: Contains the primary pages and routing logic for the Next.js application.
-   `src/components/`: Home to reusable React components, including UI elements from ShadCN.
-   `src/lib/`: Includes server actions (`actions.ts`) for data handling and data type definitions.
-   `src/firebase/`: Contains Firebase configuration, providers, and custom hooks for interacting with Firebase services.
-   `docs/`: Project documentation, including the backend data schema and agent collaboration guidelines.
