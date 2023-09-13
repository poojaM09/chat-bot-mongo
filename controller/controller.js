const Message = require('../model/model');


exports.WellMessage = async (req, res) => {
    try {
        res.send({ MSG: "Wellcome to Chat" });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


exports.CreateMessage = async (req, res) => {
    try {
        const data = {
            answer: req.body.answer,
            question: req.body.question,
            option: req.body.option, // No need to stringify for MongoDB
        };

        const message = new Message(data);
        const result = await message.save();

        if (result._id) {
            res.send({ MSG: "Create Message Successfully", Data: result._id });
        } else {
            res.send({ MSG: "Not Create Message Successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

exports.UpdateMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const updatedData = {
            answer: req.body.answer,
            question: req.body.question,
            option: req.body.option,
        };

        const updatedMessage = await Message.findByIdAndUpdate(messageId, updatedData, {
            new: true,
        });
        if (updatedMessage) {
            res.send({ MSG: "Update Message Successfully", Data: updatedMessage });
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.UpdateOption = async (req, res) => {
    try {
        const messageId = req.params.id;
        const optionIdToUpdate = req.body.option_id;
        const updatedOption = req.body.updated_option;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        const optionIndex = message.option.findIndex((opt) => opt._id.toString() === optionIdToUpdate.toString());
        if (optionIndex === -1) {
            return res.status(404).json({ error: 'Option not found' });
        }
        message.option[optionIndex] = updatedOption;
        const updatedMessage = await message.save();
        res.send({ MSG: "Option Updated Successfully", Data: updatedMessage });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};



exports.DeleteOption = async (req, res) => {
    try {
        const messageId = req.params.id;
        const optionIdToDelete = req.body.option_id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        const updatedOptions = message.option.filter((opt) => opt._id.toString() !== optionIdToDelete.toString());
        message.option = updatedOptions;

        const updatedMessage = await message.save();

        res.send({ MSG: "Option Deleted Successfully", Data: updatedMessage });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.DeleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;

        const deletedMessage = await Message.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.send({ MSG: "Message Deleted Successfully", Data: deletedMessage });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.GetBotMessage = async (req, res) => {
    try {
        const userMessage = req.body.question;
        const option = req.body.option;

        const botResponse = await generateBotResponse(userMessage, option);
        res.json({
            Botresponse: botResponse.answer,
            UserResponce: userMessage,
            Options: botResponse.options,
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

async function generateBotResponse(userMessage, option) {
    try {
        const message = await Message.findOne({ question: userMessage }).exec();

        if (message) {
            const matchingOption = findMatchingOption(message.option, option);
            if (matchingOption) {
                return {
                    answer: matchingOption,
                    options: message.option,
                };
            } else {
                return {
                    answer: message.answer,
                    options: message.option,
                };
            }
        }
    } catch (err) {
        console.error(err);
    }

    return {
        answer: `I'm sorry, I didn't understand that.`,
        options: [],
    };
}

function findMatchingOption(options, targetOption) {
    return options.find((opt) => opt === targetOption);
}
