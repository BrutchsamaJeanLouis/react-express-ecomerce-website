# react-express-ecomerce-website

# requirements
MySQL 5.7 higher version will not work
NodeJS v14

# modules
environment manager: dotenv
server: expressJS
http sessions: express-sessions (MySQl store)
ORM: Sequelize
endpoint object validator: AJV
endpoint limit: express-rate-limiter
multi part form data parser: Multer
image manipulation: Sharp
bundler: Vite
framework: ReactJS
UI: Bootstrap5
form validation: Formik
browser routing: React router
notification: toastify
XHR & fetching: axios
app state manager: Redux
s3 bucket: serverless-s3-local
password hashing: Bcrypt


### Run instructions
run npm install in root folder to install both client & server packages
run command npm run create:db:dev to create sql database (Must have mysql v5 installed)
run server with command npm run server
run client with npm run client

### Migrations
run command npm run build:migration to generate an initial migration of models
run command npm run initmigration to create tables
