const router = require('express').Router();
const User = require('../models/usersModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const requiredAuth = require('../middlewares/auth');

router.post('/register', async (req, res) => {
    try {
        //validate 
        let { email, password, passwordCheck, displayName } = req.body;
        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: "Not all fields are filled.." })

        if (password.length < 5)
            return res.status(400).json({ msg: "The password should be atleast 5 character long !!" })
        if (password != passwordCheck)
            return res.status(400).json({ mgs: "You need to enter the same password again !!" })

        //checking for the existing user in the database
        const userExist = await User.findOne({ email: email })

        if (userExist)
            return res.status(400).json({ msg: 'You are already registered ' })

        if (!displayName) displayName = email; // if there is no display name we would be using the emaili as his display name 


        //hashing the passsword
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashPassword,
            displayName
        });

        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (error) {
        res.status(500).json(error)
    }
});

//LOGIN ROUTE 

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //validate
        if (!email || !password)
            return res.status(400).json({ msg: "All the fields are required !!" })

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "user dose not exist in the database !!" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ msg: "password is worng please try again later!!" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        //passing the information to the frontend so that the user can be saved in the localstorage and there is no need to verify him later
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({ err: error.message });
    }

});

//DELETE USER :- and passing the middlewares for using it in the frontend
router.delete('/detele', requiredAuth, async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user);
        res.json({ msg: `User ${deleteUser.displayName} successfull deleted form the database!!` })

    } catch (error) {
        res.status(500).json({ err: "User already deleted !!" })
    }
});

//function for checking if the user is deleted form the database and its token is still saved in the localstorage 
router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-header');
        if (!token)
            return res.json(false)
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.json(false);
        const user = await User.findById(verified.id);
        if (!user)
            return res.json(false)
        return res.json(true)

    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
});


router.get('/', requiredAuth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id
    });
})

module.exports = router;
// https://youtu.be/sWfD20ortB4?list=PLJM1tXwlGdaf57oUx0rIqSW668Rpo_7oU&t=1334