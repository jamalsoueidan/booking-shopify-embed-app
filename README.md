<h1 align="center">Shopify Booking Appointment Application</h1>

<p align="center">
  <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/staff-view-schedule.png?raw=true" width="600"/>
</p>

## What is this and who is it for 🤷‍♀️

Frontend consulting is what I do! Angular and React, and this is a showcase product I made in my spare time. It is an excellent example of a modern, real-world React codebase and it integrate with the Shopify Admin, uses Shopify Polaris UI Framework, and extensions that are built into the Shopify theme.

There are numerous showcase/example React projects available, but the majority of them are far too simple. I like to think that this codebase is complex enough to provide valuable insights to React developers of all skill levels while remaining _relatively_ simple to understand.

## Features

- A proven, scalable, and simple project structure
- Only functional components with hooks, written in modern React.
- A variety of custom light-weight UI components, such as a calendar, modal, and various form elements, among others.
- Simple local React state management without the use of redux, mobx, or anything else.

## Getting started

The project includes Shopify Extension and the Shopify Application.

You must run the ./shopify-extension-app application when testing the extension, it will build the react application and move the files automatically to the ./extension/book-appointment-ext, for the extension to work, you also must run the root project.

Run shopify-extension-app

```shell
npm start
```

and then you must run the root project

```shell
npm run dev
```

For the extension to be able to request the apis in your shopify storefront, you must update the api url in the:
./extensions/book-appointment-ext/product.liquid

```liquid
{%- assign api = 'https://5fba75380ffd.eu.ngrok.io' -%}
```

This is because the ngrok create new url everytime it boots up the shopify application.

If you want to test the extension in the shopify-extension-app you must update the api url in the:
./shopify-extension-app/public/index.html

```javascript
Shopify.api = "https://5284fdeca23c.eu.ngrok.io";
```

The structur of this project is follows:

Shopify Application
./shopify-embed-app

Shopify Extension (react)
./shopify-extension-app

## Application screens

<table>
  <tr>
    <td>
      <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/bookings.png?raw=true" width="300" />
    </td>
    <td>
      <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/product-view.png?raw=true" width="300" />
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <img  src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/settings.png?raw=true"  width="300" />
    </td>
    <td>
      <img  src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/staff-list.png?raw=true"  width="300" />
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <img  src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/staff-view.png?raw=true"  width="300" />
    </td>
  </tr>
</table>

## Widget screen

<table>
  <tr>
    <td>
      <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/extension1.png?raw=true" width="300"/>
    </td>
    <td>
      <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/extension2.png?raw=true" width="300"/>
    </td>
  </tr>
</table>

## Tech Stack

The following Shopify tools complement these third-party tools to ease app development:

### Shopify Extension (react)

./shopify-extension-app

- [easepick](https://easepick.com) Date picker - tiny size, no dependencies.
- [emotion](https://emotion.sh/docs/introduction) Emotion is a library designed for writing css styles with JavaScript.
- [shopify/react-form](https://www.npmjs.com/package/@shopify/react-form) Manage React forms tersely and safely-typed with no magic using React hooks.
- [react-to-webcomponent](https://www.npmjs.com/package/react-to-webcomponent) Converts React components to custom elements!

### Shopify Application (express + react)

./shopify-embed-app

Backend

- [Jest](https://jestjs.io/) Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [MongoDB](https://www.mongodb.com/) MongoDB is a source-available cross-platform document-oriented database program.)
- [Shopify API library](https://github.com/Shopify/shopify-node-api) adds OAuth to the Express backend. This lets users install the app and grant scope permissions.
- [Express](https://expressjs.com/) builds the backend.
- [express-validator](https://www.npmjs.com/package/express-validator) Validates express requests query, body etc.

Frontend

- [Vite](https://vitejs.dev/) builds the [React](https://reactjs.org/) frontend.
- [React Router](https://reactrouter.com/) is used for routing. We wrap this with file-based routing.
- [Date-fns](https://date-fns.org/) Date manipulation.
- [ReactQuery](https://react-query-v3.tanstack.com/overview) React Hooks for Data Fetching
- [TypeScript](https://www.typescriptlang.org) TypeScript is JavaScript with syntax for types.
- [Fullcalendar-react](https://github.com/fullcalendar/fullcalendar-react) Fullcalendar for appointments
- [App Bridge React](https://shopify.dev/apps/tools/app-bridge/getting-started/using-react) adds authentication to API requests in the frontend and renders components outside of the App’s iFrame.
- [Polaris React](https://polaris.shopify.com/) is a powerful design system and component library that helps developers build high quality, consistent experiences for Shopify merchants.
- [Custom hooks](https://github.com/Shopify/shopify-frontend-template-react/tree/main/hooks) make authenticated requests to the Admin API.
- [File-based routing](https://github.com/Shopify/shopify-frontend-template-react/blob/main/Routes.jsx) makes creating new pages easier.

### Requirements

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
1. You must [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
1. You must [create a development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) if you don’t have one.

### Installing the template

This template can be installed using your preferred package manager:

```shell
npm init @shopify/app@latest
```

This will clone the template and install the required dependencies.

#### Local Development

[The Shopify CLI](https://shopify.dev/apps/tools/cli) connects to an app in your Partners dashboard. It provides environment variables, runs commands in parallel, and updates application URLs for easier development.

You can develop locally using your preferred package manager. Run one of the following commands from the root of your app.

```shell
npm run dev
```

Open the URL generated in your console. Once you grant permission to the app, you can start development.

## Deployment

### Build

The frontend is a single page app. It requires the `SHOPIFY_API_KEY`, which you can find on the page for your app in your partners dashboard. Paste your app’s key in the command for the package manager of your choice:

```shell
cd shopify-embed-app/frontend/ && SHOPIFY_API_KEY=REPLACE_ME npm run build
```

You do not need to build the backend.

## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/apps/getting-started)
- [App authentication](https://shopify.dev/apps/auth)
- [Shopify CLI](https://shopify.dev/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-node/tree/main/docs)

## Contributing

I will not be accepting PR's on this repository. Feel free to fork and maintain your own version.

## License

[MIT](https://opensource.org/licenses/MIT)
