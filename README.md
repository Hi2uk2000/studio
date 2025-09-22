# AssetStream

**Your all-in-one home management solution.**

AssetStream is a comprehensive web application designed to help homeowners and landlords manage their properties with ease. It provides a centralized dashboard to track assets, expenses, maintenance tasks, and important documents, all in one place. The application leverages AI to provide smart features like expense categorization and service provider recommendations.

## ✨ Features

*   **Dashboard Overview**: Get a quick snapshot of your property's value, equity, and recent expenses.
*   **Asset Management**: Keep a detailed inventory of your home assets, including purchase dates, warranty information, and photos.
*   **Expense Tracking**: Log one-off and recurring expenses, with AI-powered categorization.
*   **Maintenance Planner**: Schedule and track maintenance tasks, and link them to relevant documents and assets.
*   **Document Storage**: Securely store all your important documents, such as insurance policies, warranties, and certificates.
*   **AI-Powered Assistance**:
    *   Automatically categorize expenses from descriptions.
    *   Extract expenses from bank statements.
    *   Get recommendations for local service providers.
*   **Responsive Design**: Access and manage your property information on any device.

## 🛠️ Technologies Used

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
*   **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **Charts**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/assetstream.git
    cd assetstream
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    *   Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    *   Enable Firebase Authentication with the "Email/Password" and "Google" sign-in methods.
    *   Get your Firebase project configuration and add it to `src/lib/firebase.ts`.

4.  **Set up Genkit:**
    *   Follow the [Genkit setup instructions](https://firebase.google.com/docs/genkit/get-started) to configure your environment.
    *   You will need to enable the Google AI plugin and provide the necessary API keys.

### Running the Development Server

Once the setup is complete, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
