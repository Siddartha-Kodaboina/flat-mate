<!-- PROJECT LOGO -->
<p align="center">
  <img src="./images/home1.png" alt="Flatmate.pro Logo">
  <h1 align="center">Flatmate.pro</h1>
  <p align="center">
    Connecting People for Shared Housing Solutions
    <br />
    <a href="https://flatmate.pro">Website</a>
  </p>
</p>

## Table of Contents
- [About the Project](#about-the-project)
- [Technology Stack and Architecture](#technology-stack-and-architecture)
- [REST API](#rest-api)
- [Database Information](#database-information)
- [Screenshots](#screenshots)
- [License](#license)

## About the Project

flatmate.pro is a centralized platform designed to connect people looking for shared housing with those who have vacancies in their flats. It aims to simplify the process of finding suitable housing arrangements for both vacancy creators and seekers.

### The Problem

International students and others in shared housing often face challenges when roommates move out:
- Uncertainty about continuing leases
- Limited reach when searching for new roommates
- Disorganized communication across multiple platforms
- Lack of detailed information about available housing

### Solution

Flatmate.pro offers a robust platform that simplifies finding and communicating with potential roommates. Our dedicated platform expands your reach, streamlines communications, and provides detailed listings, transforming the experience of securing shared housing.

## Features

- Create and manage vacancy listings
- Search for available housing
- In-app messaging between vacancy creators and seekers
- Detailed property information including amenities and reviews
- User profiles for both vacancy creators and seekers

## Technology Stack and Architecture

This project leverages a variety of technologies to deliver a full-fledged solution for housing needs:
- **Frontend:** React.js for a dynamic and responsive UI.
- **Backend:** Node.js with Express for RESTful API services.
- **Database:**
  - **PostgreSQL Flex on Azure:** Used for storing data about communities, customers, rooms, and vacancies.
  - **MongoDB:** Manages all chat and messaging functionalities to ensure real-time communication.
- **CI/CD:** GitHub Actions for continuous integration and deployment, ensuring seamless updates and maintenance.
- **Containerization:** Docker for creating a consistent and efficient environment for development and deployment.

### Architecture

![Application Architecture](./images/application_architecture.png)
![CI/CD Architecture](./images/cicd_architecture.png)
![User Authentication Flowchart](./images/user_authentication_flowchart.png)
![Adding Vacancy Request in DB](./images/adding_vacancy_request_db.png)

## REST API

### Customer
- `GET /customers/`: List all customers.
- `POST /customers/`: Create a new customer.
- `GET /customers/:uid`: Fetch a customer by UID.
- `GET /customers/:id`: Fetch a customer by ID.
- `PUT /customers/:uid`: Update a customer by UID.
- `PUT /customers/:id`: Update a customer by ID.
- `DELETE /customers/:uid`: Delete a customer by UID.
- `DELETE /customers/:id`: Delete a customer.

### Room
- `GET /rooms/`: List all rooms.
- `POST /rooms/`: Create a new room.
- `GET /rooms/community/:community_id`: Get rooms by community ID.
- `GET /rooms/:id`: Get a room by ID.
- `PUT /rooms/community/:community_id`: Update rooms by community ID.
- `PUT /rooms/:id`: Update a room.
- `DELETE /rooms/community/:community_id`: Delete rooms by community ID.
- `DELETE /rooms/:id`: Delete a room.

### Vacancy
- `GET /vacancies/`: List all vacancies.
- `POST /vacancies/`: Create a new vacancy.
- `GET /vacancies/filters`: List vacancies by filters.
- `GET /vacancies/community/:community_id`: Get vacancies by community ID.
- `GET /vacancies/:id`: Get a vacancy by ID.
- `PUT /vacancies/community/:community_id`: Update vacancies by community ID.
- `PUT /vacancies/:id`: Update a vacancy.
- `DELETE /vacancies/community/:community_id`: Delete vacancies by community ID.
- `DELETE /vacancies/:id`: Delete a vacancy.
- `POST /vacancies/close/:id`: Close a vacancy.

### Openings
- `GET /openings/:userId/current`: Get current openings by user ID.
- `GET /openings/:userId/closed`: Get closed openings by user ID.
- `PUT /openings/place/:place_id/decrement`: Decrement openings by place ID.

## Database Information

### PostgreSQL Tables

#### Community Table

| Column Name   | Data Type |
|---------------|-----------|
| id            | integer   |
| title         | string    |
| address       | string    |
| city          | string    |
| state         | string    |
| zipcode       | string    |
| photo_urls    | array     |
| place_id      | string    |
| state_code    | string    |
| country       | string    |
| country_code  | string    |
| openings      | integer   |

#### Room Table

| Column Name     | Data Type |
|-----------------|-----------|
| id              | integer   |
| community_id    | integer   |
| bedrooms_count  | integer   |
| bathrooms_count | integer   |
| male_adults     | integer   |
| female_adults   | integer   |
| sharing_type    | string    |
| monthly_rent    | decimal   |
| utilities_cost  | decimal   |
| amenities       | array     |
| do              | string    |
| dont            | string    |
| description     | text      |
| photo_urls      | array     |

#### Customer Table

| Column Name    | Data Type |
|----------------|-----------|
| id             | integer   |
| first_name     | string    |
| last_name      | string    |
| display_name   | string    |
| mobile_number  | string    |
| email          | string    |
| uuid           | string    |
| dp_url         | string    |

#### Vacancy Table

| Column Name        | Data Type |
|--------------------|-----------|
| id                 | integer   |
| customer_id        | integer   |
| community_id       | integer   |
| room_id            | integer   |
| from_date          | date      |
| to_date            | date      |
| tenant_requirements| text      |
| createdAt          | timestamp |
| updatedAt          | timestamp |
| status             | string    |

### MongoDB Collections

#### Conversations Collection
An example document from the `Conversations` collection:

```
{
  "_id": "unique_conversation_id",
  "participants": ["user_id_1", "user_id_2"],
  "latestMessage": {
    "message": "Hello, are you still looking for a roommate?",
    "senderId": "user_id_1",
    "timestamp": "2024-07-10T14:48:00.000Z"
  }
}
```

This collection includes fields indexing participant IDs and the latest message timestamp for efficient retrieval of conversation data.

#### Messages Collection
An example document from the Messages collection:

```
{
  "_id": "unique_message_id",
  "conversationId": "unique_conversation_id",
  "message": "Yes, I'm still looking! Are you interested?",
  "senderId": "user_id_2",
  "timestamp": "2024-07-10T15:00:00.000Z"
}
```
Fields in this collection are indexed by conversation ID and timestamp to optimize the performance of message fetching operations.

#### Users Collection
An example document from the Users collection:

```
{
  "_id": "user_id_1",
  "displayName": "John Doe",
  "email": "john.doe@example.com",
  "photoURL": "http://example.com/path/to/photo.jpg"
}
```
This collection stores user information, including display names, email addresses, and profile photos.

## Database Indexing

### PostgreSQL Indices

Indexing in PostgreSQL is used to enhance database performance. Here are some key indices:

- **Customer Email Index**: An index on the `email` column of the `Customer` table to speed up look-up operations based on the email.
  - **Table**: Customer
  - **Column**: email
- **Customer ID Index**: An index on the `id` column of the `Customer` table to facilitate rapid retrieval operations using the customer ID.
  - **Table**: Customer
  - **Column**: id

### MongoDB Indices

MongoDB utilizes indexing to improve the performance of queries involving large amounts of data. Specific indices include:

- **Conversation ID Index**: Facilitates efficient querying and updates within the `Conversations` collection based on conversation IDs.
  - **Collection**: Conversations
  - **Field**: _id
- **Message Timestamp Index**: Optimizes queries within the `Messages` collection that sort or filter by the message timestamp.
  - **Collection**: Messages
  - **Field**: timestamp
- **User ID Index**: Enhances performance for user look-ups in the `Users` collection.
  - **Collection**: Users
  - **Field**: _id

Each of these indices is crucial for maintaining quick response times and efficient data retrieval across the database system used in flatmate.pro.

## Screenshots

### Login
![Login](./images/login.png)

### Home
![Home](./images/home1.png)

### Popular Destinations
![Popular Destinations](./images/popular_destinations.png)

### My Openings
![My Openings](./images/my_openings.png)

### Messaging
![Messaging](./images/messaging.png)

### Search
![Search](./images/search.png)

### Create Vacancy
![Create Vacancy](./images/create.png)

## License

Distributed under the MIT License. See `LICENSE` for more information.
