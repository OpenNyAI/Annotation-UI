# Annotation UI

Annotation UI is a powerful tool designed for creating benchmarking datasets. It streamlines the process of data annotation through a structured four-phase approach.
This Annotation UI repository has a respective backend repository which can be found here: https://github.com/OpenNyAI/Annotation-Backend. The setup instruction for the backend is present in that repository's README documentation.

## Features

- User authentication (Sign up and Sign in)
- Two-phase workflow:
  1. Annotation
  2. Review
- Document annotation
- Answer versioning
- Flag system for irrelevant questions

## Phases

### 1. Annotation

Users can:

- Simulate questions
- Annotate documents in response to the question
- Annotated retriever chunks that are pulled up in response to the question
- Add additional information from other legal documents
- Put together a comprehensive answer to their question
- View previously annotated answers

### 2. Review

In this phase, users can:

- Review annotated questions
- Modify answers, creating new versions
- Switch between different answer versions
- Flag questions deemed irrelevant

## Technologies

- React
- Vite
- Docker

## Getting Started

### Prerequisites

- Node.js
- Docker (optional)

### Environment Variables

Create a `.env` file in the root directory with the following content:

```
VITE_API_URL="http://localhost:8080"
VITE_TALLY_FORM_URL=""
```

Adjust the values as needed for your environment.

### Local Setup

1. Clone the repository:

   ```
   git clone git@github.com:OpenNyAI/Annotation-UI.git
   cd Annotation-UI
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

### Docker Setup

The Dockerfile uses build arguments to set environment variables. Here's how to build and run the container:

1. Build the Docker image:

   ```
   docker build \
     --build-arg API_URL=http://localhost:8080 \
     --build-arg TALLY_FORM_URL="#tally-open=form_id" \
     -t annotation-ui .
   ```

   You can customize the `API_URL` and `TALLY_FORM_URL` arguments as needed.

2. Run the container:

   ```
   docker run -p 5000:80 annotation-ui
   ```

   This command maps port 5000 on your host to port 80 in the container. Adjust the port mapping if needed.

3. Access the application at `http://localhost:5000` in your browser.

Note: The environment variables `VITE_API_URL` and `VITE_TALLY_FORM_URL` are set inside the container based on the build arguments. You don't need to pass them again when running the container.
