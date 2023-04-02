const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const imageDownloader = require("image-downloader")
const multer = require("multer")
const fs = require("fs")

//cookie makes sure user sees they see they're logged in information

const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = "ljkljfsjhlfsjhvljskfdv"

app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads"))
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));

mongoose.connect(process.env.MONGO_URL); //connects to database

app.get("/test", (req,res) => {
    res.json("test ok");
});

app.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const userDoc = await User.create({ //creates model user (models folder) with hashed password
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userDoc); //sends back variable to frontend
    } catch (e) {
        res.status(422).json(e)
    }
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body
    const userDoc = await User.findOne({email}) //returns boolean
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password) //checks password: boolean
        if (passOk) {
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie("token", token).json(userDoc)
            })
        } else {
            res.status(422).json("pass not ok")
        }
    } else {
        res.json("not found")
    }
})

app.get("/profile", (req, res) => { //after login is successful
    const {token} = req.cookies //Cookie to see if user is logged in
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => { //userData = cookieData
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id)
            res.json({name, email, _id})
        })
    } else {
        res.json(null)
    }
})

app.post("/logout", (req, res) => { //removes log in cookie
    res.cookie("token", "").json(true)
})

app.post("/upload-by-link", async (req, res) => {
    const {link} = req.body
    const newName = "/photo" + Date.now() + ".jpeg"
    await imageDownloader.image({
        url: link,
        dest: __dirname + "/uploads/" + newName
    })
    res.json(newName)
})

const photosMiddleware = multer({dest: "uploads"}) //??
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
    const uploadedFiles = [] 
    for (let i=0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i]
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1]
        const newPath = path + "." + ext
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace("uploads/", ""))
    }
    res.json(uploadedFiles)
})

app.post("/places", (req, res) => {
    //checks which user's account is logged in through cookie(token)
    const {token} = req.cookies
    const { //from models folder
        title,address,addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests,
        price
    } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => { //userData = cookieData
        if (err) throw err;
        //imported "Place" from models folder
        const placeDoc = await Place.create({ //returns Place Document for database
            owner: userData.id,
            title,address,photos: addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests,
            price
        })
        res.json(placeDoc)       
    }) 
})

async function savePlace(ev) {
    ev.preventDefault()
    const placeData = {
        title,address,addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests
    }
    if (id) {
        //update
        axios.put("/places", {
            id, ...placeData
        })
        setRedirect(true)
    } else {
        //new place
        axios.post("/places",
            placeData //NOTE Brackets
        )
        setRedirect(true)
    }
}

app.get("/user-places", (req,res) => {
    const {token} = req.cookies
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData
        res.json(await Place.find({owner:id}))
    })
})

app.get("/places/:id", async (req,res) => {
    const {id} = req.params
    res.json(await Place.findById(id)) //looks in database for matching id
})

app.put("/places", async (req,res) => {
    const {token} = req.cookies
    const {
        title,address,addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, 
        price
    } = req.body
     //place and user token
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err
        const placeDoc = await Place.findById(id)
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({ //dont need to set id (that's why it's not included)
                title,address,photos: addedPhotos,
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests, 
                price
            })
            await placeDoc.save()
            res.json("ok")
        }
    })
})

app.get("/places", async (req,res) => {
    res.json(await Place.find())
})

//TEST BACKEND ON LOCAL HOST 4000
app.listen(4000);