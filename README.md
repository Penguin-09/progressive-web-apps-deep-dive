# 💬 Yapchat

Yapchat is a mobile app with which users can converse with eachother in one large chatroom without needing to log in or fill in their phone number.

## 📖 Description

Yapchat was developed during a one-week 'Deep Dive' project at Bit Academy, where students had four days to collaboratively build an application. The focus of this Deep Dive was on creating Progressive Web Applications.

### Features

YapChat features a large chatroom where everyone that is currently using the app can communicate with eachother. You fill in a display name before you start, so there is no need for creating an account, or filling in a phone number.

It can be difficult to communicate with someone when there are a lot of people using the chatroom. This is why you can reply to a specific message by simply tapping it and writing a response.

## 🔧 Installation

### Prerequisites

To run this project locally, make sure these things are installed:

-   NPM
-   Node

### Database configuration

This project uses MongoDB to host a no-sql database. To connect your own MongoDB database, follow these steps:

1. **Create a MongoDB account** - Make sure you have a MongoDB account. If you do not have one, sign up [here](https://www.mongodb.com/cloud/atlas/register).

2. **Create a MongoDB database** - Once logged in, click "Create cluster" and follow the steps on screen. This will be the database that the server will connect to.

3. **Create the environment** - Create the .env file in the server folder if it does not already exist. Put this line in the .env file, and replace "\<username>", "\<password>" and "\<cluster-url>" with the login info of your cluster. `MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/yapChat`

4. **Create a collection** - Click on "Browse collections" and create a new collection. Click "Create Database", name the database "yapChat", and name the collection "messages". Click "Create", and the database will be ready.

### Installing dependencies

Navigate to the server folder with a CLI and run `npm install`. This will install the packages that the project depends on.

### Hosting

After running `npm install`, the project is now ready to be hosted. run `npm start` in the server folder to host the application on port 6789, and go to http://localhost:6789 to run the application.

## ⚙️ Dependencies

This project requires these few packages in order to function:

-   TailwindCSS
-   mongoDB
-   Cors
-   express
-   web-push

## 🧩 Tools

A few services were used to help with the development of this project. Theser services are listed below:

-   This project was documented and planned using [Linear](https://linear.app).
-   The repository of this project was managed with GitHub. It can be found [here](https://github.com/Penguin-09/progressive-web-apps-deep-dive).

## 🧑‍💻 Authors

### Son Bram van der Burg

Son is a full-stack web developer and was the SCRUM master during this project. He was also in charge of making sure the project was properly documented, and writing the back-end.

[Website](https://vdburg.site/) | [GitHub](https://github.com/Penguin-09) | [LinkedIn](https://www.linkedin.com/in/son-bram/)

### Sven Hoeksema

Sven is a back-end developer who wrote a part of the back-end code.

[Website](https://snevver.nl/) | [GitHub](https://github.com/Snevver) | [LinkedIn](https://www.linkedin.com/in/sven-hoeksema/)

### Jair Wey

Jair is a front-end web developer who wrote the front-end of the project.

[GitHub](https://github.com/zinho01) | [LinkedIn](https://www.linkedin.com/in/jairzinho-wey-3490161a2/)

### Julius Pecoraio

Julius is a front-end developer who briefly helped Jair with designing the front-end part of the application.

[GitHub](https://github.com/Julius-Pecoraio)
