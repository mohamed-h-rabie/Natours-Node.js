# Natrous API 🌍

Natrous is a comprehensive RESTful API for a tour booking application, built using the **MEN stack** (MongoDB, Express, Node.js). It provides robust features for tour management, user authentication, reviews, and secure payments with Stripe.

## 🚀 Key Features

### 🏔️ Tours Management
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality for tours.
- **Advanced Filtering**: Filter tours by price, difficulty, duration, and more.
- **Sorting & Pagination**: Easy navigation through tour lists.
- **Geospatial Queries**: Search for tours within a specific distance from a location.
- **Top 5 Alias**: Quick access to the top 5 cheapest tours.
- **Aggregation Stats**: Monthly plan calculations and price/rating statistics per difficulty.

### 👤 User Authentication & Management
- **Secure Auth**: JWT-based authentication with cookie support.
- **Password Security**: Bcrypt hashing and password reset functionality via email.
- **Roles & Permissions**: Fine-grained access control (User, Guide, Lead-Guide, Admin).
- **Profile Management**: Users can update their data, password, and upload a profile picture.

### ⭐️ Reviews & Ratings
- **Review System**: Users can leave reviews and ratings for tours they've experienced.
- **Automatic Calculations**: Average ratings and number of ratings are updated in real-time.

### 💳 Bookings & Payments
- **Stripe Integration**: Secure payment processing for tour bookings.
- **Checkout Sessions**: Seamless booking experience.

### 🛠️ Technical Excellence
- **Security**: 
  - Rate limiting to prevent brute-force attacks.
  - Data sanitization against NoSQL injection and XSS.
  - HTTP Parameter Pollution protection (HPP).
  - Secure HTTP headers with Helmet.
- **Image Processing**: Multer for file uploads and Sharp for image resizing/optimization.
- **Global Error Handling**: Centralized error management for operational and programming errors.

---

## ⚡ Performance & Optimization

- **Database Indexing**: Implemented indices on high-traffic fields like `price` and `startLocation` (2dsphere) for lightning-fast geospatial and sorting queries.
- **Virtual Properties**: Used Mongoose virtuals for derived data like `durationWeeks`, keeping the database lean.
- **Efficient Population**: Smart use of Mongoose populate to link Tours, Users (Guides), and Reviews without data duplication.
- **Request Throttling**: Integrated rate limiting to ensure API stability and protect against abuse.

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **Payments**: [Stripe](https://stripe.com/)
- **File Handling**: [Multer](https://github.com/expressjs/multer) & [Sharp](https://sharp.pixelplumbing.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Validation**: [Validator.js](https://github.com/validatorjs/validator.js) & [Zod](https://zod.dev/)

---

## 🚦 Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB Atlas account or local MongoDB installation.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd natrous
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `config.env` file in the root directory and add the following:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE=<your-mongodb-connection-string>
   DATABASE_PASSWORD=<your-db-password>
   JWT_SECRET=<your-secret-key>
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   # Email settings (e.g., Mailtrap or Gmail)
   EMAIL_USERNAME=<username>
   EMAIL_PASSWORD=<password>
   EMAIL_HOST=<host>
   EMAIL_PORT=<port>
   ```

4. **Import Development Data (Optional):**
   ```bash
   node dev-data/data/import-dev-data.js --import
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run start:prod
   ```

---

## 📌 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/tours` | Get all tours |
| **GET** | `/api/v1/tours/:id` | Get a specific tour |
| **POST** | `/api/v1/users/signup` | Register a new user |
| **POST** | `/api/v1/users/login` | User login |
| **GET** | `/api/v1/reviews` | Get all reviews |
| **GET** | `/api/v1/booking/checkout-session/:tourId` | Create a Stripe checkout session |

*For full API documentation, please refer to the Postman collection (if available) or explore the `routes/` folder.*

---

## 👨‍💻 Author
Developed with ❤️ by Mohamed Rabie.
