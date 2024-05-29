# Real-Time Bidding Platform API


This is a comprehensive RESTful API for a real-time bidding platform built using Node.js, Express, Socket.io, and a SQL database (PostgreSQL or MySQL). The API supports advanced CRUD operations, user authentication, role-based access control, real-time bidding, and notifications.

[Download Postman Collection](https://drive.google.com/file/d/19npBFT38oYxxrg4SNpUiYYtqW5YCbV6j/view?usp=sharing)


## Table of Contents

- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Environment Setup

- Node.js and npm should be installed on your system.
- Clone this repository to your local machine.
- Install dependencies using `npm install`.
- Set up environment variables for database and other configuration settings as described in the `.env.example` file.



# PostgreSQL Database Setup

## Install PostgreSQL

If you don't have PostgreSQL installed, download and install it from [here](https://www.postgresql.org/download/).

## Create Database

1. Open your PostgreSQL command line tool (psql).
2. Run the following command to create a new database:

   ```sql
   CREATE DATABASE bidding_platform;

   

   

## Database Schema

### Users Table

- `id` (Primary Key)
- `username` (String, unique, not null)
- `password` (String, not null)
- `email` (String, unique, not null)
- `role` (String, default to 'user')
- `created_at` (Timestamp, default to current time)

### Items Table

- `id` (Primary Key)
- `name` (String, not null)
- `description` (Text, not null)
- `starting_price` (Decimal, not null)
- `current_price` (Decimal, default to starting_price)
- `image_url` (String, nullable)
- `end_time` (Timestamp, not null)
- `created_at` (Timestamp, default to current time)

### Bids Table

- `id` (Primary Key)
- `item_id` (Foreign Key referencing items.id)
- `user_id` (Foreign Key referencing users.id)
- `bid_amount` (Decimal, not null)
- `created_at` (Timestamp, default to current time)

### Notifications Table

- `id` (Primary Key)
- `user_id` (Foreign Key referencing users.id)
- `message` (String, not null)
- `is_read` (Boolean, default to false)
- `created_at` (Timestamp, default to current time)

## API Endpoints

Refer to the [API Documentation](API_DOCUMENTATION.md) for detailed information about the endpoints, their inputs, and outputs.

## Environment Variables

Ensure to set up the following environment variables:

- `DATABASE_URL`: URL of your PostgreSQL or MySQL database.
- `PORT`: Port number for the server.
- Other variables as required by the application.

## Running the Application

- Run the application using `npm start`.
- The server will start running at the specified port.

## Testing

- Unit and integration tests are available in the `tests` directory.
- Run tests using `npx  jest --detectOpenHandles`.

## Deployment

- Deploy the application to your preferred hosting platform.
- Ensure to set up environment variables on the hosting platform.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or new features.

## License

This project is licensed under the [MIT License](LICENSE).
