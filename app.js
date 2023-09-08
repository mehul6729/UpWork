const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




mongoose.connect('mongodb+srv://admin-Mehul:123456Rockon@cluster0.ztaybvh.mongodb.net/mcaProjectDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

const registerSchema = {
    name: String,
    email: String,
    languages: String,
    hourlyPay: Number,
    location: String,
    art: Number,
    experience: Number,
    password: String,
}

const Register = mongoose.model("register", registerSchema);



app.get("/", function (req, res) {
    Register.find({})
        .then(function (user) {
            res.render("home", { userInfo: user, url: "https://upwork-zbhw.onrender.com/" });
        })
        .catch(function (err) {
            console.log(err)
            res.render("home", { userInfo: null, url: "https://upwork-zbhw.onrender.com/" })
        });
});

app.get("/login", function (req, res) {
    res.render("login", { url: "https://upwork-zbhw.onrender.com/" });
});

app.get("/register", function (req, res) {
    res.render("register", { url: "https://upwork-zbhw.onrender.com/" });

});

app.get("/signup", function (req, res) {
    res.render("signup", { url: "https://upwork-zbhw.onrender.com/" });


});

app.get("/profile", function (req, res) {
    res.render("profile", { userInfo: result, url: "https://upwork-zbhw.onrender.com/" });
});



app.post("/register", function (req, res) {
    const name = req.body.fname;
    const email = req.body.email;
    const languages = req.body.lang;
    const hourlyPay = req.body.hrPay;
    const location = req.body.location;
    const art = req.body.avgResponse;
    const experience = req.body.experience;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const newRegister = new Register({
        name: name,
        email: email,
        languages: languages,
        hourlyPay: hourlyPay,
        location: location,
        art: art,
        experience: experience,
        password: password
    });

    // const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.render("register", { error: "password not matched" });
    } else {
        Register.findOne({ email: req.body.email })
            .then(function (userEmail) {
                if (userEmail) {
                    res.render("register", { error: "email already registered " });
                } else {
                    newRegister.save()
                        .then(function (user) {
                            console.log("saved", user);
                            res.render("profile", { userInfo: user, url: "https://upwork-zbhw.onrender.com/" });
                        })
                        .catch(function (err) {
                            console.log(err)
                        });
                }



            })
    }




});


app.post("/signup", function (req, res) {

    Register.findOne({ name: req.body.fname, password: req.body.password })
        .then(function (user) {
            if (user) {
                res.render("profile", { userInfo: user, url: "https://upwork-zbhw.onrender.com/" });
            } else {
                res.render("signup", { error: "Invalid cerdentials" });
            }
        })
        .catch(function (err) {
            console.log(err)
            res.send('error')
        });


});




app.post("/profile", function (req, res) {
    const name = req.body.fname;
    const email = req.body.email;
    const lang = req.body.lang;
    const hrPay = req.body.hrPay;
    const location = req.body.location;
    const art = req.body.avgResponse;
    const experience = req.body.experience;

    const update = {
        name: name,
        email: email,
        languages: lang,
        hourlyPay: hrPay,
        location: location,
        art: art,
        experience: experience
    };
    Register.findOne({ name: name, email: email })
        .then(function (user) {
            Register.updateOne(update)
                .then((user) => {
                    res.redirect("/");
                })
                .catch((error) => {
                    console.error('Error updating profile:', error);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch(function (err) {
            console.log(err)
            res.render("home", { userInfo: null, url: "https://upwork-zbhw.onrender.com/" })
        });
});

app.post("/del", function (req, res) {

    const userId = req.body.userId;

    console.log(userId);

  

    Register.findOne({ email: userId })
        .then(function (user) {
            Register.deleteOne(user)
                .then((user) => {
                    res.redirect("/");
                })
                .catch((error) => {
                    console.error('Error updating profile:', error);
                    res.status(500).send('Internal Server Error');
                })
        })
        .catch(function (err) {
            console.log(err)

        });



});





app.listen(3000, function () {
    console.log("sever is Running on port 3000")
});


