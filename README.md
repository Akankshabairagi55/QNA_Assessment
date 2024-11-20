# QNA_Assessment / Risk Assessment Form

This project is a **Risk Assessment Form** application built using React. It fetches questions from an API and calculates a user’s risk profile based on their responses. The application displays a final score along with a dynamic Doughnut chart and a risk profile summary.

## Features

- **Dynamic Question Fetching**: Questions are fetched in real time from an API endpoint.
- **User Interaction**: Users can navigate through questions, select answers, and submit their responses.
- **Score Calculation**: The application calculates a total score based on user responses.
- **Risk Profile Visualization**: A Doughnut chart visually represents the user's risk profile (Conservative, Balanced, Aggressive).
- **Responsive Design**: The application is styled for various screen sizes with a clean and modern UI.

## Tech Stack

- **React**: For building the interactive UI components.
- **CSS**: For styling the application and ensuring a responsive layout.
- **Chart.js**: For rendering the dynamic Doughnut chart.
- **API Integration**: Fetches questions and submits scores to a backend server.

## Components Overview

1. **AssessmentForm**:

   - Handles the main logic, including fetching questions, storing user answers, and calculating scores.
   - Displays the question navigation and handles form submission.
   - Integrates the Doughnut chart to visualize the final score and risk profile.

2. **RiskProfileChart**:

   - A subcomponent of `AssessmentForm` that renders a Doughnut chart and displays the user's risk profile description.

3. **App**:
   - The root component that encapsulates the entire application.

## How to Use

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
