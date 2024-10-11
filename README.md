# Book Hub

## About the Application:

Book Hub is a Full Stack Cross Platform application that allows user to keep a track of their favourite books. It has following functionalities-
1. User able to create and delete their own books.
2. Read any book by simply searching. Using API to fetch books.
3. Create, view and update profile page.
4. Upload their profile picture.
5. Secure login and logout.
6. Password reset using email.
7. Users and rate and review each book.
8. User can edit or delete their reviews.
9. User can like and dislike reviews.
10. User can filter books based on genre and author etc.
11. App Icon and app name.
   
Tech Stack Used- 
Frontend - React Native
Backend- Node Express Mongo

## Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```


If everything is set up _correctly_, you should see your new app running in your _Android Emulator_  shortly provided you have set up your emulator/simulator correctly.


## Backend SetUp

There are two package.json files. Run the following command to install all dependencies.

```bash
# server side 
cd api
npm install

# client side
cd..
npm install
```
If everything goes correct you should be able to see node module files in root directory as well as api directory.




