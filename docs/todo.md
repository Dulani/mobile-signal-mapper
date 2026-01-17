# Project To-Do List

This document tracks the major features and improvements planned for SignalMapper.

## High Priority

-   [ ] **Implement User Authentication with Google**
    -   Integrate Firebase Authentication to allow users to sign in with their Google accounts.
    -   Ensure all data (signal points, routes) is scoped to the logged-in user.
    -   Update Firestore security rules to enforce user-specific data access.
    -   Add a sign-in/sign-out flow to the UI.

-   [ ] **Implement Auto-Logging Feature**
    -   Add a toggle switch (e.g., a `Switch` component) to the "Log Signal" page to enable/disable automatic logging.
    -   Create a dropdown or a set of radio buttons to allow the user to select the logging interval (e.g., 30s, 1 min, 5 mins).
    -   Use `setInterval` when the feature is active to automatically trigger the `logSignalPoint` function at the chosen interval.
    -   Provide clear visual feedback to the user that auto-logging is active.
    -   Ensure the interval is cleared (`clearInterval`) when the user toggles the feature off or navigates away from the page.

## Future Ideas

-   [ ] **Route Management**
    -   Allow users to start and stop recording a "route."
    -   Display signal data collected along a specific route.
    -   Allow users to name and save routes.

-   [ ] **Improved Data Visualization**
    -   Enhance the heatmap with more filtering options (e.g., by date, by network carrier).
    -   Explore different chart types or data representations.

-   [ ] **Offline Data Syncing**
    -   Leverage PWA capabilities to store logged points offline when there's no connectivity.
    -   Automatically sync the data to Firestore when the connection is restored.
