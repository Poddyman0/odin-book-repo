# Odin-Book

## Overview

Odin-Book is a full-stack social media application that I developed as part of The Odin Project's Node.js curriculum. The goal of the project was to build a social networking platform inspired by applications such as Facebook, Threads, and X while focusing on backend architecture, database design, authentication, and user interactions.

This project challenged me to design and implement a complex relational database, manage user authentication and authorization, build a scalable Express application, and create a fully functional social platform where users can connect, share content, and engage with one another.

Unlike previous projects that focused on individual concepts, Odin-Book brought together everything I had learned throughout the Node.js course, including Express, Mongo DB, Passport.js, session management, file uploads, and deployment.

---

# Live Features

Users can:

* Create accounts and authenticate securely.
* Sign in and sign out.
* Browse a personalized feed.
* Create text and image posts.
* Like posts.
* Comment on posts.
* Send and manage follow requests.
* Follow other users.
* View user profiles.
* Update their profile pictures.
* Browse all registered users.
* Use a guest account without creating credentials.
* View a responsive and polished user interface.

---

# Technologies Used

## Backend

* Node.js
* Express.js
* Mongo DB
* Mongoose
* Passport.js
* JWT
* Express Session
* bcrypt

## Frontend

* HTML5
* CSS3
* JavaScript

## File Storage

* Cloudinary

## Deployment

* Railway / Render / VPS (depending on deployment choice)

## Development Tools

* Git
* GitHub

---

# Project Goals

The primary objectives of this project were to:

* Build a large-scale Express application.
* Design a Mongo DB database.
* Implement secure authentication.
* Create complex user relationships.
* Manage application state using sessions.
* Handle image uploads and storage.
* Build reusable backend architecture.
* Deploy a production-ready application.

---

# Database Architecture

One of the most challenging aspects of this project was designing the database structure.

The application contains several interconnected models that work together to create the social media experience.

## User Model

The User model stores:

* Username
* Email
* Password hash
* Profile image
* Account creation date

Each user can:

* Create many posts
* Create many comments
* Like many posts
* Follow other users
* Receive followers
* Send follow requests
* Receive follow requests

---

## Post Model

Each post contains:

* Author
* Text content
* Optional image
* Creation date

Posts can receive:

* Likes
* Comments

---

## Comment Model

Comments belong to:

* A single user
* A single post

Each comment stores:

* Comment content
* Author
* Timestamp

---

## Like Model

The Like model creates a many-to-many relationship between users and posts.

This allows users to like multiple posts while preventing duplicate likes.

---

## Follow Request Model

The Follow Request model manages:

* Pending requests
* Accepted requests
* User relationships

This creates a more realistic social networking experience by requiring approval before users become followers.

---

# Authentication System

To secure the platform, I implemented Passport.js authentication.

## Registration

Users can:

* Create an account
* Submit credentials
* Have passwords securely hashed using bcrypt

Passwords are never stored in plain text.

---

## Login

Users must authenticate before accessing any content.

Unauthenticated visitors are redirected to the login page.

Authenticated users gain access to:

* Feed
* Profiles
* Posts
* User interactions

---

## Session Management

Express Session is used to maintain user sessions after authentication.

This allows users to remain logged in between requests while protecting restricted routes.

---

# Guest Login (Extra Credit)

To improve accessibility for recruiters and visitors, I implemented a Guest Login feature.

This allows anyone to explore the application immediately without creating an account or entering credentials.

The guest account provides access to:

* User profiles
* Posts
* Likes
* Comments
* Follow functionality

This feature makes it significantly easier for potential employers to evaluate the project.

---

# User Profiles

Each user has a dedicated profile page containing:

* Profile picture
* Username
* Account information
* Personal posts
* Follower information

Profiles serve as a central hub for user activity within the platform.

---

# Profile Photo Updates (Extra Credit)

I implemented profile image management functionality that allows users to update their profile pictures.

Users can:

* Upload a new image
* Replace existing profile photos
* Instantly see updated profile images across the application

Uploaded images are stored using Cloudinary rather than directly inside the database.

This approach improves performance and scalability.

---

# User Discovery

The application includes a user directory page that displays all registered users.

Users can:

* Browse profiles
* Discover new users
* Send follow requests

The system intelligently prevents duplicate requests and displays the appropriate action based on relationship status.

---

# Following System

A major feature of the platform is the follow request system.

## Sending Requests

Users can send follow requests to other users.

---

## Accepting Requests

Recipients can approve incoming requests.

Once accepted:

* Both users' relationship data updates
* Content appears in feeds
* Follower counts update

---

## Relationship Management

The application tracks:

* Followers
* Following
* Pending requests

This creates a realistic social networking experience similar to major social platforms.

---

# Post Creation

Users can create posts directly from the application.

## Text Posts

The initial implementation supports text-based posts containing user-generated content.

Each post stores:

* Content
* Author
* Timestamp

---

## Image Posts (Extra Credit)

I extended the functionality to support image uploads.

Users can:

* Upload photos alongside text
* Create image-only posts
* Create mixed content posts

Images are uploaded to Cloudinary and the resulting URL is stored in Mongo DB.

This prevents large image files from being stored directly in the database while allowing fast image delivery.

---

# Feed System

The home feed acts as the central timeline of the application.

The feed displays:

* Posts created by the current user
* Posts created by followed users

Each feed item contains:

* Author information
* Post content
* Images (if applicable)
* Like count
* Comments

This creates a personalized social media experience similar to modern networking platforms.

---

# Likes System

Users can interact with posts through likes.

The application:

* Tracks individual likes
* Prevents duplicate likes
* Updates engagement counts dynamically

Likes are stored through relational database associations between users and posts.

---

# Comment System

Users can engage with posts by creating comments.

Each comment displays:

* Comment content
* Author information
* Timestamp

Comments are linked directly to posts and rendered beneath the associated content.

This encourages interaction and discussion throughout the platform.

---

# Data Seeding

To simplify testing and development, I created a database seeding script using Faker.js.

The seed script automatically generates:

* Users
* Posts
* Comments
* Follow relationships

This allowed me to test application features with realistic datasets without manually creating content.

---

# User Interface Design (Extra Credit)

While the primary focus of the project was backend development, I also invested significant effort into the user experience.

I designed a clean and modern interface featuring:

* Responsive layouts
* Consistent styling
* Intuitive navigation
* Mobile-friendly design
* Interactive user feedback
* Profile and feed organization

The goal was to create an application that not only functioned well but also looked and felt like a real social networking platform.

---

# Security Considerations

Several security practices were implemented throughout development.

These include:

* Password hashing with bcrypt
* Session-based authentication
* Route protection middleware
* Input validation
* Authentication checks before protected actions
* Secure file handling for uploads

These measures help protect user data and prevent unauthorized access.

---

# Deployment

After development was complete, I deployed the application to a live hosting platform.

Deployment involved:

* Configuring environment variables
* Setting up a production Mongo DB database
* Configuring Cloudinary credentials
* Managing production session settings
* Testing authentication and uploads in a live environment

The final result is a fully functional web application accessible online.

---

# Challenges

This project was the most complex application I had built up to that point.

One of the biggest challenges was designing the database relationships. Managing users, posts, comments, likes, follows, and requests required careful planning to ensure the schema remained scalable and maintainable.

Authentication also presented challenges. Integrating Passport.js, session management, route protection, and user authorization required a strong understanding of backend architecture.

Image uploads introduced additional complexity because files needed to be stored externally while maintaining references within the database.

Finally, coordinating multiple models and ensuring data consistency across user interactions significantly improved my understanding of full-stack application development.

---

# Key Skills Demonstrated

* Full-Stack Web Development
* Node.js
* Express.js
* Mongo DB
* Authentication & Authorization
* Passport.js
* Session Management
* Database Design
* RESTful Routing
* File Upload Management
* Cloudinary Integration
* User Relationship Modeling
* CRUD Operations
* MVC Architecture
* Deployment
* Git & GitHub

---

# Outcome

Odin-Book represents the culmination of everything I learned throughout The Odin Project's Node.js curriculum. By building a complete social networking platform from the ground up, I gained hands-on experience designing relational databases, implementing authentication systems, managing complex user interactions, handling media uploads, and deploying production-ready applications.

The final application includes all core social networking functionality as well as additional features such as image posts, profile photo updates, guest access, and a polished user interface. This project significantly strengthened my backend development skills and provided valuable experience building large-scale full-stack applications.
