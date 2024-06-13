# ERA Frontend Documentation

## Overview

The frontend is structured into several components, models, pages, and utility files. It provides a modular and organized approach to developing a comprehensive web application.

## Directory Structure

```
src
 ├── components
 │   ├── Basic
 │   │   ├── Button.js 
 │   │   ├── AlertModal.js
 │   │   ├── FormInput.js
 │   │   ├── Marquee.js
 │   │   ├── Popup.js
 │   ├── AddPlan.js
 │   ├── DashboardGrid.js
 │   ├── EditableGrid.js
 │   ├── GridItem.js
 │   ├── Layout.js
 │   ├── Navbar.js
 │   ├── Path.js
 │   ├── PlanList.js
 │   ├── PlanWithUsers.js
 │   ├── Sidebar.js
 │   ├── UserCard.js
 │   ├── UserCircle.js
 │   ├── UserGrid.js
 ├── models
 │   ├── AlertModalStore.js
 │   ├── MarqueeStore.js
 │   ├── PlanStore.js
 │   ├── PopupStore.js
 ├── pages
 │   ├── dashboard.js
 │   ├── users.js
 │   ├── floorplans.js
 ├── api.js
 ├── utils.js
```

## Components

### Basic Components

#### Button.js

- **Description:** A reusable button component with customizable properties for different use cases.
- **Key Features:** Customizable text, styling, and click event handling.

#### AlertModal.js

- **Description:** A modal component to display alerts and notifications.
- **Key Features:** Supports dynamic messages, custom actions, and easy integration with state management.

#### FormInput.js

- **Description:** A reusable input field component for forms.
- **Key Features:** Supports different input types, validation, and error handling.

#### Marquee.js

- **Description:** Displays a scrolling text banner.
- **Key Features:** Configuration options for speed, direction, and text content.

#### Popup.js

- **Description:** A generic popup component for displaying additional information or actions.
- **Key Features:** Customizable triggers, content, and layout.

### Other Components

#### AddPlan.js

- **Description:** A component for adding new and editing old plans.
- **Key Features:** Form handling, validation, and API integration for saving new plans.

#### DashboardGrid.js

- **Description:** Displays a grid layout for the dashboard.
- **Key Features:** Dynamic grid configuration and responsive design.

#### EditableGrid.js

- **Description:** An editable grid component for interactive layouts.
- **Key Features:** Drag-and-drop functionality, resizing, and grid item editing.

#### GridItem.js

- **Description:** Represents an item within a grid.
- **Key Features:** Customizable content and layout.

#### Layout.js

- **Description:** The primary layout component for the application.
- **Key Features:** Header, footer, and main content area arrangement.

#### Navbar.js

- **Description:** Navigation bar component for the application.
- **Key Features:** Dynamic menu items, routing, and responsive design.

#### Path.js

- **Description:** Displays the path or route information.
- **Key Features:** Visualization of paths, support for different routing algorithms.

#### PlanList.js

- **Description:** Lists all available plans.
- **Key Features:** Fetching and displaying plans from the store, search, and filter capabilities.

#### PlanWithUsers.js

- **Description:** Display floor plans with users.
- **Key Features:** Customizable content and layout.

#### Sidebar.js

- **Description:** Sidebar navigation component for floorplan editing.
- **Key Features:** Toggle functionality, dynamic menu items, and responsive design.

#### UserCard.js

- **Description:** Displays user details in a card format.
- **Key Features:** Customizable layout, profile picture, and user information display.

#### UserCircle.js

- **Description:** Displays user in a circular format.
- **Key Features:** Customizable content, size, and styling.

#### UserGrid.js

- **Description:** Displays a single user in a grid layout.
- **Key Features:** Dynamic layout configuration and responsive design.

## Models

### AlertModalStore.js

- **Description:** Manages the state for alert modals.
- **Key Features:** Open/close state, message content, and actions.

### MarqueeStore.js

- **Description:** Manages the state for marquee components.
- **Key Features:** Text content, speed, and direction.

### PlanStore.js

- **Description:** Manages plans-related state data.
- **Key Features:** Fetching, saving, and updating plans.

### PopupStore.js

- **Description:** Manages the state for popup components.
- **Key Features:** Open/close state, content management.

## Pages

### dashboard.js

- **Description:** Dashboard page that displays an overview of the floorplans and all the users.
- **Key Features:** Graphs, charts, and summary information.

### users.js

- **Description:** Manages users in the application.
- **Key Features:** List of users, search, filter and user-related actions.

### floorplans.js

- **Description:** Manages floor plans.
- **Key Features:** List, add, edit, and delete floor plans.

## Utility Files

### api.js

- **Description:** Handles API calls and configurations.
- **Key Features:** Functions for GET, POST, PUT, DELETE requests, error handling.

### utils.js

- **Description:** Common utility functions used across the application.
- **Key Features:** Helpers for formatting, common data transformations.
