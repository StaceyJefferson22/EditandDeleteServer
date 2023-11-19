const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let athletes = [{
        _id: 1,
        name: "Michael Jordan",
        sport: "Basketball, Baseball",
        description: "",
        img: "",
        award: [

        ],
    },
    {
        _id: 2,
        name: "Serena Williams",
        sport: "Tennis",
        description: "",
        img: "",
        award: [

        ],
    },
    {
        _id: 3,
        name: "Deion Sanders",
        sport: "Football, Baseball",
        description: "",
        img: "",
        award: [

        ],
    },
    {
        _id: 4,
        name: "Jim Thrope",
        sport: "American Football, Baseball, Basketball, lacrosse, Boxing, Hockey, Track & Field, and More",
        description: "",
        img: "",
        award: [

        ],
    },
    {
        _id: 5,
        name: "Tom Brady",
        sport: "American Football",
        description: "",
        img: "",
        award: [

        ],
    },
    {
        _id: 6,
        name: "Usian Bolt",
        sport: "Track & Field",
        description: "",
        img: "",
        award: [

        ],
    },
];

app.get("/api/athletes", (req,res) => {
    res.send(athletes);
});

app.get("/api/athletes", upload.single("img"), (req, res) => {
    const result = validateAthlete(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const athlete = {
        _id: athletes.length + 1,
        name: req.body.name,
        description: req.body.description,
        awards: req.body.awards.split(",")
    }

    if(req.file) {
        athlete.img = "images/" + req.file.filename;
    }

    athletes.push(athlete);
    res.send(athletes);
});

app.put("/api/athletes/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const athlete = athlete.find((a) => a._id === id);;
    const result = validateAthlete(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log(req.body.awards);
    athlete.name = req.body.name;
    athlete.description = req.body.description;
    //athlete.awards = req.body.awards.split(",");

    if (req.file) {
        athlete.img = "images/" + req.file.filename;
    }

    res.send(athlete);
});

app.delete("/api/athletes/:id", upload.single("img"), (req,res) =>{
    const id = parseInt(req.params.id);
    const athlete = athletes.find((a) =>a._id === id);

    if(!athlete) {
        res.status(404).send("The athlete was not found");
        return;
    }

    const index = athletes.indexOf(athlete);
    athletes.splice(index, 1);
    res.send(athlete);
});

const validateAthlete = (athlete) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        awards: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required()
    });

    return schema.validate(athlete);
};

app.listen(3000, () => {
    console.log("I'm listening");
});