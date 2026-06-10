# Vercel Deployment Guide

This React + Vite web application is optimized to run smoothly on Vercel with clean single-page routes and direct serverless rewriting capability.

Follow this quiet-luxury, step-by-step instruction sheet to deploy your application to Vercel via the **Vercel CLI**.

---

## ── Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (normally bundled with Node)
- A registered [Vercel Account](https://vercel.com/)

---

## ── Step 1: Install the Vercel CLI

Open your terminal or command prompt and run the following command to install the Vercel Command Line Interface (CLI) globally:

```bash
npm install -g vercel
```

*Note: Depending on your system security configuration, macOS/Linux users may need to prefix this with `sudo` if global installations require elevated privileges:* `sudo npm install -g vercel`

---

## ── Step 2: Authenticate and Log In

Log into your Vercel account from the terminal:

```bash
vercel login
```

Choose your preferred login provider (Email, GitHub, GitLab, or Bitbucket) and follow the simple browser instructions to securely authenticate your local CLI tool.

---

## ── Step 3: Run the Deploy Script

Navigate to your workspace directory and initiate the interactive deployment setup using npm:

```bash
# To deploy to a staging/preview url:
npm run deploy

# OR to deploy directly to the production domain:
npm run deploy:prod
```

### ── Command Line Interview Flow 
The Vercel CLI will ask you a small sequence of quick configuration questions. Here are the recommended answers for this project:

1. **Set up and deploy "`/react-example`"?**  
   👉 Type `Y` (Yes) and press **Enter**.
2. **Which scope do you want to deploy to?**  
   👉 Select your personal workspace (usually your username or default organization) and press **Enter**.
3. **Link to an existing project?**  
   👉 Type `N` (No) and press **Enter** (since we are creating a brand new deployment).
4. **What's your project's name?**  
   👉 Press **Enter** to accept the default, or type a custom modern name for your app.
5. **In which directory is your code located?**  
   👉 Press **Enter** to accept `./` (current directory).
6. **Want to modify these settings?**  
   👉 Vercel will automatically detect **Vite** as your preset. Type `N` (No) and press **Enter** to accept the default optimized build settings (`dist` output folder, `npm run build` command).

---

## ── Step 4: Access Your Live Application

The CLI will initiate the build process and compile your static files:
1. It will output a **Development/Preview URL** (e.g., `https://react-example-username-dev.vercel.app`)
2. Once verified, running `npm run deploy:prod` will compile and launch the application directly to the **Production/Live URL**.

---

## ── Key Features Included in this Configuration

- **`vercel.json` Client-Side Rewrite Rule**:
  We have configured a modern `vercel.json` file on your behalf. This guarantees that deep-linked paths are handled correctly by React's internal client routing rather than prompting a standard browser `404 Not Found` error:
  ```json
  {
    "version": 2,
    "cleanUrls": true,
    "framework": "vite",
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **Automatic Vite Detection**:
  Vercel fully supports Vite builds out-of-the-box, ensuring optimized loading speeds and gorgeous font deliveries.
