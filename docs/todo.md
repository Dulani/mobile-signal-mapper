# Project To-Do List

This document tracks the major features and improvements planned for SignalMapper.

## High Priority

-   [x] **Implement User Authentication with Google**
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

-   [ ] **Implement Live Data View**
    -   Add a switch to the logging page that enables a "live view" panel.
    -   When active, this panel should display the real-time data the app is receiving from the device's GPS: current latitude, longitude, and a timestamp.
    -   This gives the user confidence that the app is correctly "seeing" their location before they log a point.

-   [ ] **Route Management**
    -   Allow users to start and stop recording a "route."
    -   Display signal data collected along a specific route.
    -   Allow users to name and save routes.

-   [ ] **Improved Data Visualization**
    -   Replace the scatter plot with a true heatmap on an interactive map (e.g., OpenStreetMap or Google Maps).
    -   Enhance the heatmap with more filtering options (e.g., by date, by network carrier).
    -   Explore different chart types or data representations.

-   [ ] **Offline Data Syncing**
    -   Leverage PWA capabilities to store logged points offline when there's no connectivity.
    -   Automatically sync the data to Firestore when the connection is restored.

-   [ ] **Explore Native App Development**
    -   Investigate creating a native iOS/Android application to gain access to OS-level APIs (like CoreTelephony on iOS) for automatic and precise signal strength collection.

-   [ ] **Add AI to your app?**
    -   The firebase page suggested that it could help you add AI to your apps.  A thought occured to me that we could do a ground-news style summary of the comments.  We could k-means cluster the numeric responses into low, medium, and high (3 clusters).  Then, we could ask an LLM to periodically summarize what each group tends to emphasize (it might offer a slight speedup and a little fun to the process).
