const Message = require('../model/model');


exports.WellMessage = async (req, res) => {
    try {
        res.send({ MSG: "Wellcome to Chat" });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


exports.CreateMessage = async (req, res) => {
    // try {
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
    // } catch (error) {
    //     res.status(500).json({ error: 'An error occurred' });
    // }
}

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
