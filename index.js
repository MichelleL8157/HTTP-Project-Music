const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req,res)=>{
    res.send('Hello there');
});
const genres = [
    {id: 1, genre: 'pop'},
    {id: 2, genre: 'hip_hop'},
    {id: 3, genre: 'rap'},
    {id: 4, genre: 'classical'},
    {id: 5, genre: 'rock'},
    {id: 6, genre: 'jazz'},
    {id: 7, genre: 'blues'},
    {id: 8, genre: 'electronic'},
];
const songs = [
    {genre: 'pop', month: "3", year: "2007", id: 1, name: 'Umbrella'},
    {genre: 'pop', month: "6", year: "2009", id:2, name: 'Bulletproof'},
    {genre: 'rap', month: "12", year: "2022", id:3, name: 'Superhero'},
    {genre: 'classical', month: "2", year: "2012", id:4, name: "River Flows In You"},
    {genre: 'electronic', month: "5", year: "2021", id:5, name:'Royalty'},
];
//=========== ROUTES FOR HTTP GET REQUESTS ==========
//home
app.get('/api/home', (req,res) => {
    res.send("Welcome, this is the Music App Homepage");
});
//genre list
app.get("/api/home/genres", (req,res) => {
    res.send(genres);
});
//genre by id
app.get("/api/home/genres/:id", (req,res) => {
    const exist = genres.find(g => g.id === parseInt(req.params.id));
    if (!exist) res.send(req.params.id + " does not exist");
    else res.send(exist);
});
//song list
app.get("/api/home/songs",(req,res) =>{
    res.send(songs);
})
//song by id
app.get("/api/home/songs/:id", (req,res) => {
    const exist = songs.find(s => s.id === parseInt(req.params.id));
    if (!exist) res.send(req.params.id + " does not exist");
    else res.send(exist);
});
//song list by year and month
app.get("/api/home/songs/:month/:year", (req, res) => {
    const exist1 = songs.find(s => s.month === req.params.month);
    const exist2 = songs.find(s => s.year === req.params.year);
    if(!exist1 || !exist2) res.send(req.params.month + " month or " + req.params.year + " year does not exist");
    if (exist1 && exist2) res.send(exist1);
});
//=========== ROUTES FOR HTTP POST REQUESTS ==========
//add genre
app.post("/api/home/genres",(req,res) =>{
    const exist = genres.find(g => g.genre === req.body.newGenre);
    if(!exist){
        if (req.body.newGenre.length < 3) res.send("The name has to be at least three characteres long.");
        else {
            const genreAdd = {
                id: genres.length + 1,
                genre: req.body.newGenre,
            };
            genres.push(genreAdd);
            res.send(genreAdd);
        } 
    } else res.send(req.body.newGenre + " already exists.");
});
//add song
app.post("/api/home/genres/:genre", (req,res) => {
    const exist = genres.find(g => g.genre === req.params.genre);
    if(!exist) res.send(req.params.genre + " does not exist");
    else {
        const exist2 = songs.find(s => s.name === req.body.newName && exist.genre === s.genre);
        if(exist2) res.send(req.body.newName + " song already exists in " + req.params.genre);
        else if (req.body.newName.length < 3) res.send("The name has to be at least three characteres long.");
        else {
            const song ={
                genre: exist.genre,
                id: songs.length + 1,
                name: req.body.newName,
                month: req.body.newMonth,
                year: req.body.newYear,
            }
            songs.push(song);
            res.send(song);
        }
    }
});
//=========== ROUTES FOR HTTP PUT REQUESTS ==========
//replace genre
app.put("/api/home/genres/:id",(req,res) => {
    const exist1 = genres.find(g => g.id === parseInt(req.params.id));
    const exist2 = genres.find(g => g.genre === req.body.newGenre);
    if(!exist1) res.send("The genre ID: " + req.params.id + " does not exist.");
    else if (exist2) res.send(req.body.newGenre + " already exists");
    else if (req.body.newGenre.length < 3) res.status(400).send("The name has to be at least three characteres long.");
    else {
        genres[req.params.id - 1].genre = req.body.newGenre;
        res.status(200).send(genres);
    }
});
//replace song
app.put("/api/home/songs/:id",(req,res) => {
    const exist1 = songs.find(s => s.id === parseInt(req.params.id));
    const exist2 = songs.find(s => s.name === req.body.newName);
    if(!exist1) res.send("The song ID: " + req.params.id + " does not exist.");
    else if (exist2) res.send(req.body.newName + " already exists");
    else if (req.body.newName.length < 3) res.status(400).send("The name has to be at least three characteres long.");
    else {
        songs[req.params.id - 1].name = req.body.newName;
        res.status(200).send(songs);
    }
});
//=========== ROUTES FOR HTTP DELETE REQUESTS ==========
//delete genre
app.delete("/api/home/genres",(req,res) =>{
    const exist = genres.find(g => g.id === parseInt(req.body.genreID));
    if(!exist) res.status(400).send(req.body.genreID + " does not exist");
    else{
        for (let i = 0; i < genres.length; i++) {
            if (genres[i].id == req.body.genreID) genres.splice(i, 1);
        }
        res.status(200).send(genres);
    }
})
//delete song
app.delete("/api/home/songs",(req,res) => {
    const exist = songs.find(s => s.id === parseInt(req.body.songID));
    if(!exist) res.status(400).send(req.body.songID + " does not exist");
    else{
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].id == req.body.songID) songs.splice(i, 1);
        }
        res.status(200).send(songs);
    }
})
//listen
app.listen(3000, () => {
    console.log('Listening on port 3000...')
});