const router = require('express').Router();
const poll = require('../models/pollModel');
const requiredAuth = require('../middlewares/auth');

router.post('/vote', async (req, res) => {
    try {
        // basic validation 
        const { name, choice, casted_at } = req.body;
        if (!name || !casted_at) {
            return res.status(402).json({ msg: 'Name and date of casted person is important entity' });
        }
        const isNameExist = await poll.findOne({ name: name }).exec();
        if (isNameExist) {
            return res.status(400).json({ msg: 'The person has already casted the vote!' });
        }
        const newPoll = new poll({
            name,
            choice,
            casted_at
        });
        const pollRes = await newPoll.save();
        res.status(200).json({ pollRes });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }

});
// for getting all the data and displaying in the main screen 
router.get('/data', async (req, res) => {
    try {
        const getAllPolls = await poll.find();
        res.status(200).json({ data: getAllPolls });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// getting the number of voted for having (casted_at and count of the voted)
//http://localhost/counts?voting_choice=true/f
router.get('/countT', async (req, res) => {
    try {
        const choice = req.query.voting_choice;

        const data = await poll.aggregate([
            // {$group: {_id: '$casted_at', counts: {$sum: 1}}},
            { $group: { _id: '$casted_at', counts: { $sum: { $cond: ['$choice', 1, 0] } } } },
            // {$group: {_id: '$casted_at', counts:{$sum: {$cond:[ {$eq:[Boolean('$choice'),Boolean(choice)]} ,1, 0] } } }},
            // {$group: {_id: '$casted_at', counts:{$sum: {$cond:{if:{$eq:['$choice',true]},then:1,else:0 } } } }},
            // {$group: {_id: '$casted_at', counts:{$sum: {$cond:[ {$eq:[Boolean('$choice').toString(),Boolean(choice).toString()]} ,1, 0] } } }},
            { $project: { date: '$_id', counts: 1, _id: 0 } }
        ])
        console.log(data);
        res.json({ data: data });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});



router.get('/countF', async (req, res) => {
    try {
        const choice = req.query.voting_choice;;
        const data = await poll.aggregate([
            { $group: { _id: '$casted_at', counts: { $sum: { $cond: ['$choice', 0, 1] } } } },
            { $project: { date: '$_id', counts: 1, _id: 0 } }
        ]);
        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
})

//for showing the final result for the bar graph 
// {
//  data:[
//             { count: 3, voting_choice: true },
//              { count: 6, voting_choice: false }  
//       ]
// }
// http://localhost/result
router.get('/result', async (req, res) => {
    try {
        const true_score = await poll.find({ choice: true });
        const false_score = await poll.find({ choice: false });
        const resultantArray = [true_score, false_score];
        const data = [];
        resultantArray.forEach((item, index) => {
            const result = {
                count: item.length,
                voting_choice: item[0].choice
            }
            data.push(result)
        });
        res.status(200).json({ data: data });

    } catch (error) {
        res.status(500).json({ err: error.message });
    }
})

module.exports = router