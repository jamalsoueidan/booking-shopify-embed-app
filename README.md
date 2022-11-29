<h1 align="center">Shopify Booking Appointment Application</h1>

<p align="center">
  <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/staff-view-schedule.png?raw=true" width="600"/>
</p>

## What is this and who is it for 🤷‍♀️

I offer Frontend consulting, and this is a showcase product that I created in my spare time. It is a good example of a modern, real-world React codebase.

There are numerous showcase/example React projects available, but the majority of them are far too simple. I like to think that this codebase is complex enough to provide valuable insights to React developers of all skill levels while remaining _relatively_ simple to understand.

## Features

- A proven, scalable, and simple project structure
- Only functional components with hooks, written in modern React.
- A variety of custom light-weight UI components, such as a calendar, modal, and various form elements, among others.
- Simple local React state management without the use of redux, mobx, or anything else.

## Getting started

The structur of this project is follows:

- web/ include the express application and the frontend
- web/frontend the shopify react appllication
- web/libs all the api routes is in the libs folder.
- web/database mongoose related stuff (mongodb)
- extensions the widget that is rendered in the shopify liquid store

## Application screens

<table>
 <tr>
    <td>
      <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/product-view.png?raw=true" width="600" style="float: left; margin-right: 10px;" />
    </td>
  <td style="border:0px">
     <img  src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/staff-list.png?raw=true"  width="300"  style="float: left; margin-right: 10px;"  />
    </td>
  <td style="border:0px">
    <img  src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/staff-view.png?raw=true"  width="300"  style="float: left; margin-right: 10px;"  />
  </td>
 </tr>
</table>

## Widget screen

<p align="center">
  <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/extension1.png?raw=true" width="600"/>
  <img src="https://github.com/jamalsoueidan/book-appointment-app/blob/main/screens/extension2.png?raw=true" width="600"/>
</p>

## Tech Stack

This extensions combines a number of third party open-source tools:

- [easepick](https://easepick.com/) Date picker - tiny size, no dependencies

This template combines a number of third party open-source tools:

- [Jest](https://jestjs.io/) Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [MongoDB](https://www.mongodb.com/) MongoDB is a source-available cross-platform document-oriented database program.)
- [Express](https://expressjs.com/) builds the backend.
- [Vite](https://vitejs.dev/) builds the [React](https://reactjs.org/) frontend.
- [React Router](https://reactrouter.com/) is used for routing. We wrap this with file-based routing.
- [Date-fns](https://date-fns.org/) Date manipulation.
- [useSWR](https://swr.vercel.app/) React Hooks for Data Fetching
- [TypeScript](https://www.typescriptlang.org) TypeScript is JavaScript with syntax for types.
- [Fullcalendar-react](https://github.com/fullcalendar/fullcalendar-react) Fullcalendar for appointments

The following Shopify tools complement these third-party tools to ease app development:

- [Shopify API library](https://github.com/Shopify/shopify-node-api) adds OAuth to the Express backend. This lets users install the app and grant scope permissions.
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

Using yarn:

```shell
yarn create @shopify/app
```

Using npx:

```shell
npm init @shopify/app@latest
```

Using pnpm:

```shell
pnpm create @shopify/app@latest
```

This will clone the template and install the required dependencies.

#### Local Development

[The Shopify CLI](https://shopify.dev/apps/tools/cli) connects to an app in your Partners dashboard. It provides environment variables, runs commands in parallel, and updates application URLs for easier development.

You can develop locally using your preferred package manager. Run one of the following commands from the root of your app.

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

Using pnpm:

```shell
pnpm run dev
```

Open the URL generated in your console. Once you grant permission to the app, you can start development.

## Deployment

### Build

The frontend is a single page app. It requires the `SHOPIFY_API_KEY`, which you can find on the page for your app in your partners dashboard. Paste your app’s key in the command for the package manager of your choice:

Using yarn:

```shell
cd web/frontend/ && SHOPIFY_API_KEY=REPLACE_ME yarn build
```

Using npm:

```shell
cd web/frontend/ && SHOPIFY_API_KEY=REPLACE_ME npm run build
```

Using pnpm:

```shell
cd web/frontend/ && SHOPIFY_API_KEY=REPLACE_ME pnpm run build
```

You do not need to build the backend.

## Hosting

When you're ready to set up your app in production, you can follow [our deployment documentation](https://shopify.dev/apps/deployment/web) to host your app on a cloud provider like [Heroku](https://www.heroku.com/) or [Fly.io](https://fly.io/).

When you reach the step for [setting up environment variables](https://shopify.dev/apps/deployment/web#set-env-vars), you also need to set the variable `NODE_ENV=production`.

## Some things to watch out for

### Using `express.json` middleware

If you use the `express.json()` middleware in your app **and** if you use `Shopify.Webhooks.Registry.process()` to process webhooks API calls from Shopify (which we recommend), the webhook processing must occur **_before_** calling `app.use(express.json())`. See the [API documentation](https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers) for more details.

## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/apps/getting-started)
- [App authentication](https://shopify.dev/apps/auth)
- [Shopify CLI](https://shopify.dev/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-node/tree/main/docs)

## Contributing

I will not be accepting PR's on this repository. Feel free to fork and maintain your own version.

## License

[MIT](https://opensource.org/licenses/MIT)
