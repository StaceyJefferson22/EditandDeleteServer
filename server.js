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
        description: "A hard worker and a trash talker who will challenge anyone on and off the court",
        img: "images/MichaelJordan.jpg",
        awards: [
            "6x NBA Champion",
            "6x NBA Finals MVP",
            "5x NBA League MVP",
            "9x NBA All-Defense Team",
            "10x NBA Scoring Champion",
        ],
    },
    {
        _id: 2,
        name: "Serena Williams",
        sport: "Tennis",
        description: "A true inspiration for young women athletes who swung her way to victory.",
        img: "images/SerenaWilliams.jpg",
        awards: [
            "No.1 in singles in the Women's Tennis Association(WTA) for 319 weeks",
            "Won 23 Grand Slam women's singles titles",
            "Won four gold medals in the Olympics",
            
        ],
    },
    {
        _id: 3,
        name: "Deion Sanders",
        sport: "Football, Baseball",
        description: "The only athlete to appear in the SuperBowl and the World Series",
        img: "images/DeionSanders.jpg",
        awards: [
            "2x SuperBowl Champion",
            "8x ProBowler",
            "NFL Defensive Player of the Year",
            "2x NFL 1990s All-Decade Team",
            "The Only Athlete to play ing the SuperBowl and WorldSeries",
        ],
    },
    {
        _id: 4,
        name: "Jim Thrope",
        sport: "American Football, Baseball, Basketball, lacrosse, Boxing, Hockey, Track & Field, and More",
        description: "A very versatile athlete who dominate every sport he touches.",
        img: "images/JimThorpe.jpg",
        awards: [
            "Won Gold Medals as Decathlon and Pentathlon",
            "Football Pro Hall of Famer",
            "First inductee of the National Native American Hall of Fame",
            "NFL 50th Anniversary All-Time Team",
            "7 Home runs as a baseball player"
        ],
    },
    {
        _id: 5,
        name: "Tom Brady",
        sport: "American Football",
        description: "A diamond in the rough who proven himself as a leader and winner",
        img: "images/TomBrady.jpg",
        awards: [
            "7x Super Bowl Champion",
            "5x Super Bowl MVP",
            "3x NFL MVP",
            "2x NFL Offensive Player of the Year",
            "15x Pro Bowler"
        ],
    },
    {
        _id: 6,
        name: "Usian Bolt",
        sport: "Track & Field",
        description: "As his last name suggest, he is a bolt of lightning",
        img: "images/UsianBolt.jpg",
        awards: [
            "Holds the World Recorld for the 100m with 9.63 seconds",
            "Won eight Olympic Gold Medals in the 100m, 200m, and 4x100m relay",
            "Won eleven World Championships",
            "Fatest run 100 metres(male)",
            "Most consecutive wins in 100m and 200m"
        ],
    },
];

app.get("/api/athletes", (req, res) => {
    res.send(athletes);
});

app.post("/api/athletes", upload.single("img"), (req, res) => {
    const result = validateAthlete(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const athlete = {
        _id: athletes.length + 1,
        name: req.body.name,
        sport: req.body.sport,
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
    const athlete = athletes.find((r) => r._id === id);;
    const result = validateAthlete(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log(req.body.awards);
    
    athlete.name = req.body.name;
    athlete.sport = req.body.sport;
    athlete.description = req.body.description;
    athlete.awards = req.body.awards.split(",");

    if (req.file) {
        athlete.img = "images/" + req.file.filename;
    }

    res.send(athlete);
});

app.delete("/api/athletes/:id", upload.single("img"), (req,res) =>{
    const id = parseInt(req.params.id);
    const athlete = athletes.find((r) =>r._id === id);

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
        sport: Joi.allow(""),
        awards: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required()
    });

    return schema.validate(athlete);
};

app.listen(5000, () => {
    console.log("I'm listening");
});