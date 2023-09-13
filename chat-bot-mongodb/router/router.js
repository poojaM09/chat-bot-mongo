const express = require('express');
const controller = require('../controller/controller')
const Router = express.Router();

Router.post('/create',controller.CreateMessage)
Router.post('/get',controller.GetBotMessage)
Router.get('/',controller.WellMessage)




module.exports = Router