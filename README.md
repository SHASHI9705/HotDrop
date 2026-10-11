# 🍔 HotDrop — Smart Pre-Ordering & Pickup Platform

**HotDrop** is a full-stack food pre-ordering and pickup platform designed to reduce customer waiting times and streamline vendor operations. Customers can browse food items, place orders in advance, and complete payments online, while vendors can manage their stores and process incoming orders efficiently.

Built with **Next.js, TypeScript, PostgreSQL, Prisma ORM, AWS S3, and Razorpay**, HotDrop delivers a modern, secure, and scalable ordering experience.

<p align="center">
  <a href="https://www.hotdrop.tech">
    <img src="https://img.shields.io/badge/Live%20Demo-hotdrop.tech-blue?style=for-the-badge" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-TypeScript-black?style=for-the-badge&logo=next.js" alt="Next.js and TypeScript" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Payments-Razorpay-0C2451?style=for-the-badge" alt="Razorpay" />
</p>

---

## 📸 Project Preview

<!-- Replace the placeholder below with your homepage screenshot. -->
<!-- Save your screenshot in the repository as assets/hotdrop-homepage.png. -->

<p align="center">
  <img src="apps/hotdrop-fe/public/Preview-image.png" alt="HotDrop Homepage" width="100%" />
</p>

<p align="center">
  <em>HotDrop — A smarter way to pre-order and pick up food.</em>
</p>

---

## 🌐 Live Application

- **Live Website:** https://www.hotdrop.tech
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Cloud Storage:** Amazon S3
- **Payments:** Razorpay
- **Deployment:** Vercel (frontend) and AWS EC2 (backend)

---

## ✨ Key Features

### 👤 Customer Portal
- User registration and authentication.
- Google login for convenient sign-in.
- Browse available food items and vendor offerings.
- Add products to the shopping cart.
- Place pre-orders for convenient pickup.
- Complete online payments through Razorpay.
- View order information and track order progress.

### 🏪 Vendor Portal
- Dedicated vendor registration and login.
- Separate vendor interface for managing operations.
- Manage food items and product listings.
- Receive and process customer orders.
- Improve order preparation and pickup coordination.

### 💳 Payment Integration
- Integrated Razorpay Checkout for online payments.
- Supports payment initiation and transaction verification workflows.
- Designed to support platform and vendor payment distribution, subject to payment provider account capabilities and configuration.
- Secure backend handling of payment-related operations.

### ⚡ Performance & Scalability
- Modular frontend and backend architecture.
- Type-safe development using TypeScript.
- Prisma ORM for structured database access.
- PostgreSQL for reliable relational data storage.
- Amazon S3 for image and file storage.
- Cloud-hosted backend infrastructure for deployment and scalability.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Authentication | Google OAuth, application authentication |
| Payment Gateway | Razorpay |
| Object Storage | Amazon S3 |
| Package Manager | npm / pnpm, depending on the workspace |
| Frontend Hosting | Vercel |
| Backend Hosting | AWS EC2 |
| Version Control | Git, GitHub |

---

## 🏗️ System Architecture

HotDrop follows a client-server architecture with a dedicated frontend, backend API, relational database, cloud storage, and payment gateway.

```text
                    ┌─────────────────────┐
                    │       Customer      │
                    │    Vendor / User    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Next.js App     │
                    │ TypeScript + React  │
                    └──────────┬──────────┘
                               │ HTTPS / API
                               ▼
                    ┌─────────────────────┐
                    │   Express.js API    │
                    │ Node.js + TypeScript│
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
       ┌────────────────┐ ┌────────────┐ ┌──────────────┐
       │   PostgreSQL   │ │ Amazon S3  │ │   Razorpay   │
       │  Prisma ORM    │ │   Storage  │ │   Payments   │
       └────────────────┘ └────────────┘ └──────────────┘
```

### Architecture Overview

1. **Frontend:** Provides customer and vendor interfaces using Next.js and React.
2. **Backend API:** Handles application logic, authentication workflows, orders, and payment operations.
3. **Database:** Stores structured application data using PostgreSQL and Prisma ORM.
4. **Amazon S3:** Stores uploaded images and other supported assets.
5. **Razorpay:** Processes online payment workflows.
6. **Deployment:** The frontend is hosted on Vercel, while the backend runs on AWS EC2.

---

## 📂 Project Structure

The project uses a Turborepo monorepo structure to organize the frontend and backend applications.

```text
hotdrop/
│
├── apps/
│   ├── hotdrop-fe/             # Next.js frontend
│   │   ├── app/                # App Router pages and layouts
│   │   ├── components/         # Reusable UI components
│   │   ├── public/             # Static assets
│   │   ├── package.json
│   │   └── ...
│   │
│   └── hotdrop-be/             # Express.js backend
│       ├── src/                # API and application logic
│       ├── prisma/             # Prisma schema and migrations
│       ├── package.json
│       └── ...
│
├── assets/
│   └── hotdrop-homepage.png    # Homepage screenshot
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
└── README.md
```

*Note: Directory names may vary depending on the current repository structure.*

---

## ⚙️ Getting Started

Follow these instructions to run HotDrop locally.

### Prerequisites

Ensure the following tools and services are available:

- Node.js (LTS recommended)
- npm or pnpm
- Git
- PostgreSQL database
- Google OAuth credentials, if using Google login
- Razorpay API credentials, if testing payments
- AWS credentials, if testing S3 uploads

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd hotdrop
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Install Dependencies

If the repository uses pnpm and Turborepo:

```bash
npm install -g pnpm
pnpm install
```

If the project is configured to use npm workspaces instead, follow the package manager and workspace configuration in the repository.

### 3. Configure Environment Variables

Create the required `.env` files for the frontend and backend based on your existing application configuration.

Example frontend environment file:

**`apps/hotdrop-fe/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Example backend environment file:

**`apps/hotdrop-be/.env`**

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

**Important:**
- Use the actual environment variable names expected by your application.
- Do not commit `.env` or `.env.local` files to GitHub.
- Keep Razorpay secrets and AWS credentials on the backend.
- Never expose private credentials through `NEXT_PUBLIC_` variables.
- Configure your Google OAuth redirect URIs for your local and production environments.
- If you use IAM roles on EC2, prefer them over long-lived AWS access keys.

### 4. Set Up the Database

Configure your PostgreSQL connection string in the backend environment file.

Generate the Prisma Client:

```bash
pnpm exec prisma generate
```

Apply existing migrations:

```bash
pnpm exec prisma migrate deploy
```

If your repository uses a different Prisma schema location, pass the appropriate `--schema` path.

For local development, create and apply a migration when you change the Prisma schema:

```bash
pnpm exec prisma migrate dev --name init
```

Use the migration commands appropriate to your environment. Do not run development migrations against production without reviewing the changes.

### 5. Start the Application

Run the project using the scripts defined in your root `package.json`.

For a Turborepo setup, the command may look like:

```bash
pnpm dev
```

Alternatively, run the frontend and backend separately from their respective application directories:

```bash
cd apps/hotdrop-fe
pnpm dev
```

In another terminal:

```bash
cd apps/hotdrop-be
pnpm dev
```

Check your package scripts if your actual development commands differ.

### 6. Open the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

These URLs assume the default ports shown in the example configuration.

---

## 🔐 Authentication

HotDrop supports user authentication and Google login.

The authentication workflow is designed to provide a convenient sign-in experience while separating customer and vendor operations.

Key considerations:

- Configure OAuth credentials through the Google Cloud Console.
- Register the correct authorized origins and redirect URIs.
- Validate authentication responses on the backend where applicable.
- Protect private routes and sensitive API endpoints.
- Keep authentication secrets out of client-side code.

The exact authentication implementation depends on the Google OAuth library and session or token strategy configured in the application.

---

## 💰 Razorpay Payment Integration

HotDrop integrates Razorpay Checkout to facilitate online payments.

### Payment Workflow

1. The customer proceeds to checkout.
2. The backend creates a payment order using the Razorpay API.
3. The frontend opens Razorpay Checkout.
4. The customer completes the payment.
5. The backend verifies the payment signature.
6. The application updates the order/payment status only after appropriate verification.

### Security Considerations

- Create payment orders on the backend.
- Verify Razorpay signatures on the server.
- Never trust payment success callbacks from the frontend alone.
- Keep the Razorpay key secret private.
- Use webhooks where appropriate to handle asynchronous payment events.
- Enable marketplace or split-payment features only when supported by your Razorpay account and integration.

---

## 🗄️ Database & Prisma ORM

HotDrop uses PostgreSQL as its relational database and Prisma ORM for database operations.

Prisma provides:

- Type-safe database queries.
- A schema-based data model.
- Database migration management.
- Generated TypeScript types.
- A maintainable data-access layer.

The database can store application entities such as users, vendors, products, orders, and payment-related records, according to the implemented Prisma schema.

Useful commands:

```bash
# Generate Prisma Client
pnpm exec prisma generate

# Open Prisma Studio
pnpm exec prisma studio

# Apply development migrations
pnpm exec prisma migrate dev
```

---

## ☁️ Deployment

### Frontend — Vercel

The Next.js frontend is deployed using Vercel.

Typical deployment steps:

1. Import the frontend repository or monorepo into Vercel.
2. Configure the correct root directory and build settings.
3. Add the required frontend environment variables.
4. Configure the production domain.
5. Deploy and verify the application.

### Backend — AWS EC2

The Express.js backend is hosted on Amazon EC2.

Typical deployment components include:

- EC2 for application hosting.
- Nginx as a reverse proxy, if configured.
- HTTPS and domain configuration.
- Environment variables and secure credential management.
- Security Groups to control network access.
- CloudWatch for logs and monitoring, if configured.

### Image Storage — Amazon S3

Amazon S3 is used for storing application images and supported uploaded assets. Configure bucket permissions, access policies, and upload handling according to your application's security requirements.

---

## 🔮 Future Improvements

Potential improvements for the platform include:

- Real-time order status updates.
- Email and push notifications.
- Advanced vendor analytics and sales dashboards.
- Order history and customer reviews.
- Inventory management and availability controls.
- Automated testing and CI/CD pipelines.
- Enhanced observability, caching, and performance optimization.
- Improved accessibility and mobile user experience.

---

## 🎯 What I Learned

Building HotDrop provided practical experience with:

- Developing a full-stack application using Next.js and Express.js.
- Designing REST APIs with TypeScript.
- Working with PostgreSQL and Prisma ORM.
- Integrating third-party authentication and payment services.
- Managing environment variables and application secrets.
- Using Amazon S3 for cloud-based asset storage.
- Deploying frontend and backend services to production.
- Organizing a multi-application repository using Turborepo.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a pull request describing your changes.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

## 📄 License

Specify the project's license here. If you intend to distribute HotDrop as an open-source project, add an appropriate `LICENSE` file to the repository.

---

## 👨‍💻 Author

**HotDrop — Smart Pre-Ordering & Pickup Platform**

- 🌐 Live Website: https://www.hotdrop.tech
- 💻 GitHub: [Your GitHub Profile](https://github.com/YOUR_GITHUB_USERNAME)
- 📧 Contact: [Your Email](mailto:YOUR_EMAIL@example.com)

---

<p align="center">
  If you find HotDrop interesting, consider giving the repository a ⭐ on GitHub!
</p>
