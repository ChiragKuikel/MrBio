/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const gateway = require('express-gateway');
const dotenv = require('dotenv');

dotenv.config();
gateway().load(path.join(__dirname, 'config')).run();
