# React + Vite

## Inicialization

To run this client open a terminal inside this folder and use these commands/actions:
  - `npm install`
  - create an .env file inside the root of this folder with this template ```VITE_SERVER_HOST = "<server ip/hostname>" ```
  - `npm run dev`

## Project struture

All relevant project code source file are within folder `src`. This folder is further structured into serveral subfolders:

  - `assets` - contains all non source code media
  - `components` - contains non page react/typescript compoents like layouts, navigation and so on
  - `config` - contains colour and size configs for the website
  - `pages` - contains pages (strutured into more subfolders by their logical grouping) that hold the frontend codes neccesery for those pages
  - `redux` - contains setup for cross page variable handling
  - `routes` - contains list of all pages, their names, elements, route names and so on and also the folder contains a script for wabpage route generation
  - `styles` - contains styles used throughout the webpage

`src` folder also contains root elements of [App.tsx](./src/App.tsx) and [main.tsx](./src/main.tsx) that hold the root elements of the website and all relevant providers.

## Sources and plugins

Sources:
  - An [amazing turtorial](https://www.youtube.com/watch?v=XwnZLgIfIvg ) by Tuat Tran Anh
  - [MUI Material-UI](https://mui.com/material-ui/getting-started/) documentation
  - [React](https://react.dev/learn ) documentation
  - [Vite](https://vitejs.dev/guide/ ) documentation

Used plugins in this project:

  - [MUI Material](https://mui.com/material-ui/ )        5.14.14
  - [MUI Icons](https://mui.com/material-ui/icons/)           6.18.4
  - [Reduxsjs](https://redux.js.org/)            1.9.7
  - [Types](https://www.npmjs.com/package/@types/node)               20.10.0
  - [Axios](https://axios-http.com/docs/intro)               1.6.2
  - [Dayjs](https://day.js.org/)               1.11.10
  - [Dotenv](https://www.npmjs.com/package/dotenv)              16.3.1
  - [Materia-ui-confirm](https://www.npmjs.com/package/material-ui-confirm)  3.0.9
  - [React-auth-kit](https://authkit.arkadip.dev/integration/)      18.2.0
  - [React-redux](https://react-redux.js.org/)         8.1.3
  - [React-router-dom](https://www.npmjs.com/package/react-router-dom)    6.17.0
  - [React-toastify](https://fkhadra.github.io/react-toastify/introduction/)      9.1.3

Two official Vite plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
