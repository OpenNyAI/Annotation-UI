# Annotation UI

Annotation UI is a powerful tool designed for creating benchmarking datasets. It streamlines the process of data annotation through a structured four-phase approach.

## Features

- User authentication (Sign up and Sign in)
- Four-phase workflow:
  1. Onboarding
  2. Annotation
  3. Review
  4. Expert Review
- Document annotation
- Answer versioning
- Flag system for irrelevant questions

## Phases

### 1. Onboarding

This includes a calibration exercise which allows multiple users to annotate on the same document, to mark them on a scale of 1-5. This ensures the quality of annotators.

### 2. Annotation

Users can:

- Simulate questions
- Annotate documents in response to the question
- Annotated retriever chunks that are pulled up in response to the question
- Add additional information from other legal documents
- Put together a comprehensive answer to their question
- View previously annotated answers

### 3. Review

In this phase, users can:

- Review annotated questions
- Modify answers, creating new versions
- Switch between different answer versions
- Flag questions deemed irrelevant

### 4. Expert Review

Final review phase for ensuring data quality (details to be added)

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
   git clone https://github.com/OpenNyAI/custom-ui.git
   cd custom-ui
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
   docker run -p 8080:80 annotation-ui
   ```

   This command maps port 8080 on your host to port 80 in the container. Adjust the port mapping if needed.

3. Access the application at `http://localhost:8080` in your browser.

Note: The environment variables `VITE_API_URL` and `VITE_TALLY_FORM_URL` are set inside the container based on the build arguments. You don't need to pass them again when running the container.
