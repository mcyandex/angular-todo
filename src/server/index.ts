import express from 'express';
import session from 'cookie-session';
// import { remultExpress } from 'remult/remult-express';
// import { createKnexDataProvider } from 'remult/remult-knex';

import helmet from 'helmet';
import compression from 'compression';
import sslRedirect from 'heroku-ssl-redirect';
import path from 'path';
import csrf from "csurf";
import cookieParser from "cookie-parser";


import { api } from './api';
import { auth } from './auth';

const app = express();

// const userName = 'Exceed\\Muhammad Hassan';
// {
//   dataProvider: createKnexDataProvider({
//     // Knex client configuration for MSSQL
//     client: 'mssql',
//     connection: {
//       server: 'EXCEED',
//       database: 'angular-express-remult',
//       user: userName,
//       password: '',
//       options: {
//         enableArithAbort: true,
//         encrypt: false,
//         instanceName: `sqlexpress`,
//       },
//     },
//   }, true),
// }
// console.log(userName)
// app.use(
//   remultExpress()
// );
app.use(
  session({
    secret: process.env['SESSION_SECRET'] || 'my secret',
  })
);

app.use(sslRedirect());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use("/api", cookieParser());
app.use(auth);
app.use('/api', csrf({ cookie: true }));
app.use("/api", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});
app.use(api);

app.use(express.static(path.join(__dirname, '../remult-angular-todo')));
app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, '../remult-angular-todo', 'index.html'));
});
app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));
