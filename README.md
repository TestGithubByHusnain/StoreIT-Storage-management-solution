<div align="center">
  <br />
    <a href="https://youtu.be/lie0cr3wESQ" target="_blank">
      <img src="public/readme/hero.png" alt="Project Banner">
    </a>
  <br />

  <div>
     <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
  </div>

<h3 align="center">Storage and File Sharing Platform</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube. Join the JSM family!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Assets](#links)
6. 🚀 [More](#more)

## 🚨 Tutorial

This repository contains the code corresponding to an in-depth tutorial available on our YouTube
channel, <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a>.

If you prefer visual learning, this is the perfect resource for you. Follow our tutorial to learn how to build projects
like these step-by-step in a beginner-friendly manner!

<a href="https://youtu.be/lie0cr3wESQ?si=yLQyhMrYLjpysnqE" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/1736fca5-a031-4854-8c09-bc110e3bc16d" /></a>

## <a name="introduction">🤖 Introduction</a>

A storage management and file sharing platform that lets users effortlessly upload, organize, and share files. Built with the latest Next.js 15 and the Appwrite Node SDK, utilizing advanced features for seamless file management.

If you're getting started and need assistance or face any bugs, join our active Discord community with over **34k+**
members. It's a place where people help each other out.

<a href="https://discord.com/invite/n6EdbFJ" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/618f4872-1e10-42da-8213-1d69e486d02e" /></a>

## <a name="tech-stack">⚙️ Tech Stack</a>

- React 19
# StoreIt — Storage & File Sharing Platform

StoreIt is a modern storage and file-sharing web application built with Next.js 15, React 19, TypeScript and Appwrite. It provides a clean dashboard for uploading, organizing, sharing and downloading files, with user authentication handled via Appwrite email tokens.

This repository contains the full source code for the frontend and server actions used in the demo/tutorial project.

## Key features

- User signup/sign-in with Appwrite email OTP
- Upload files to Appwrite Storage and save metadata in Appwrite Database
- View files by type (documents, images, media, others)
- Rename, delete and share files with other users
- Download files directly from Appwrite storage
- Dashboard with usage summary and recent uploads

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Appwrite (Authentication, Storage, Databases)
- Tailwind CSS + shadcn/ui components

## Getting started

1. Install dependencies

```powershell
npm install
```

2. Create a `.env.local` in the project root and add Appwrite configuration:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT="<your-project-id>"
NEXT_PUBLIC_APPWRITE_DATABASE="<your-database-id>"
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION="<users-collection-id>"
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION="<files-collection-id>"
NEXT_PUBLIC_APPWRITE_BUCKET="<files-bucket-id>"
NEXT_APPWRITE_KEY="<server-key>"
```

Notes:
- `NEXT_APPWRITE_KEY` is a secret server key (used by server/admin actions). Keep it out of client-side code.
- Make sure your Appwrite database collections and storage bucket exist and match the field names used in the code (for example the files collection expects attributes like `name`, `type`, `size`, `bucketFileId`, `accountId`, and `users`)

## Run the app

```powershell
npm run dev
```

## Build for production

```powershell
npm run build
npm run start
```

## Available scripts

- `dev` — run Next.js in development
- `build` — create production build
- `start` — serve production build
- `lint` — run ESLint

## Project structure (important files)

- `app/` — Next.js app router pages and layouts
- `components/` — React components + UI primitives
- `lib/` — helpers and Appwrite client wrappers (`lib/appwrite`, `lib/actions`)
- `hooks/` — custom hooks (e.g., `use-toast`)
- `public/assets/` — images and icons
- `types/` — shared TypeScript types

## Notes & troubleshooting

- Favicon: the app metadata points to `/assets/icons/logo-brand.svg`; if you don't see the icon, clear your browser cache or add a `public/favicon.ico` for maximum compatibility.
- Appwrite queries: searching in string fields requires a fulltext index in Appwrite. The code includes a safe fallback for environments without a fulltext index, but for best performance set the `users` attribute to an array type and index it in Appwrite.
- Toasts: the app uses a custom `use-toast` hook — listener registration was corrected to avoid duplicate listeners.

## Contributing

Contributions, bug reports and feature requests are welcome. Open an issue or submit a pull request.

## License

This project doesn't include a license file in the repository. Add a `LICENSE` file if you want to open-source this project.

## Contact

If this repository came from a tutorial, follow the original tutorial resources for step-by-step setup. For private help, provide the steps you ran and any error logs and I can help debug further.
