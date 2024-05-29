# Real-Time Bidding Platform API Documentation

## Authentication Endpoints


[Download Postman Collection](https://drive.google.com/file/d/19npBFT38oYxxrg4SNpUiYYtqW5YCbV6j/view?usp=sharing)


### Register User

Registers a new user.

- **URL**: `/users/register`
- **Method**: `POST`
- **Request Body**:
  - `username` (String, required): Username of the user.
  - `password` (String, required): Password of the user.
  - `email` (String, required): Email of the user.


### Login User

Logs in a user and returns a JWT token.

- **URL**: `/users/login`
- **Method**: `POST`
- **Request Body**:
  - `username` (String, required): Username of the user.
  - `password` (String, required): Password of the user.



### Get User Profile

Retrieves the profile of the logged-in user.

- **URL**: `/users/profile`
- **Method**: `GET`
- **authorization**: pass the token in the headers as "authorization".


## Item Endpoints

### Create Item

Creates a new auction item.

- **URL**: `/items`
- **Method**: `POST`
- **authorization**: pass the token in the headers as "authorization".
- **Request Body**:
  - `name` (String, required): Name of the item.
  - `description` (String, required): Description of the item.
  - `starting_price` (Decimal, required): Starting price of the item.
  - `end_time` (Timestamp, required): Auction end time of the item.
  - `image` (file) image of item.


### Update Item

Updates an existing auction item.

- **URL**: `/items/:id`
- **Method**: `PUT`
- **authorization**: pass the token in the headers as "authorization".
- **Request Body**:
  - `name` (String): Name of the item.
  - `description` (String): Description of the item.
  - `starting_price` (Decimal): Starting price of the item.
  - `end_time` (Timestamp): Auction end time of the item.

#### Example:

### Delete Item

Deletes an existing auction item.

- **URL**: `/items/:id`
- **Method**: `DELETE`
- **authorization**: pass the token in the headers as "authorization".




## Bid Endpoints

### Place Bid

Places a bid on an auction item.

- **URL**: `/items/:itemId/bids`
- **Method**: `POST`
- **authorization**: pass the token in the headers as "authorization".
- **Request Body**:
  - `bid_amount` (Decimal, required): Bid amount.



### Get Bids

Retrieves all bids for a specific auction item.

- **URL**: `/items/:itemId/bids`
- **Method**: `GET`

#### Example:



## Notification Endpoints

### Get Notifications

Retrieves notifications for the logged-in user.

- **URL**: `/notifications`
- **Method**: `GET`
- **authorization**: pass the token in the headers as "authorization".


### Mark Notifications as Read

Marks notifications as read for the logged-in user.

- **URL**: `/notifications/mark-read`
- **Method**: `POST`
- **authorization**: pass the token in the headers as "authorization".
