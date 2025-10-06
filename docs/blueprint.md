# **App Name**: SignalMapper

## Core Features:

- Signal Strength Input: Provide a simple UI with signal strength icons for user input, emulating the signal bars displayed on their devices.
- Location and Network Capture: Automatically capture the precise location (latitude/longitude), date, time, and network type (e.g., 4G, 5G, WiFi) upon user input.
- Google Authentication: Implement Google account authentication to secure user data and enable personalized data storage.
- Data Logging: Log user data and associate to each user based on their login.
- Heatmap Generation: Generate a heatmap-style visualization of signal strength data, with green indicating strong signal and red indicating weak signal, to reveal signal patterns over geographic areas.
- User Route Mapping: Allow users to record 'travel routes', seeing how consistent their connection is along the routes and if it might be more suitable to travel using different roads.
- Tower Proximity Hints: Uses an LLM tool to identify areas where cell phone towers are MOST LIKELY to exist given heatmap, so users can explore where cell towers are located.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to represent reliable signal strength and technological focus.
- Background color: Very light lavender (#F0F8FF) to provide a subtle contrast and calm user experience.
- Accent color: Violet (#8A2BE2) to draw attention to interactive elements and emphasize the connection to the primary color.
- Font: 'Inter', a grotesque-style sans-serif, for both headlines and body text, ensuring a modern, machined look and excellent readability.
- Use minimalistic icons to represent signal strength, GPS, and network types. Color-code them based on signal strength (green, yellow, red).
- Employ a clean, map-centric layout with a clear display of signal strength overlays. Keep the UI uncluttered and intuitive for easy data input and interpretation.
- Subtle animations to indicate data capture and heatmap updates, providing visual feedback to the user without being distracting.