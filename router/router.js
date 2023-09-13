const express = require('express');
const controller = require('../controller/controller')
const Router = express.Router();

Router.post('/create',controller.CreateMessage)
Router.post('/get',controller.GetBotMessage)
Router.patch('/update/:id',controller.UpdateMessage)
Router.patch('/update/option/:id',controller.UpdateOption)
Router.delete('/delete/:id',controller.DeleteMessage)
Router.delete('/delete/option/:id',controller.DeleteOption)
Router.get('/',controller.WellMessage)




module.exports = Router