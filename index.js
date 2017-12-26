var fs = require('fs');
var express = require('express');
var exec = require('child_process').exec;
var path = require("path");
var app = express();


app.use(express.static('./images'));
app.use(express.static('./video'));
app.use(express.static('.'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/body.html'));
})

app.get('/newpicture', function (req, res, next) {
    exec ('date +%Y_%m_%d_%H_%M_%S', function(error, stdout, stderr){
        process.env.DATE = stdout
        console.log('date')
        next()
    })

    }, function(req,res){
    exec ('raspistill -o /home/images/'+process.env.DATE.trim()+'.jpg', function(error, stdout, stderr){
        console.log(process.env.DATE)
        res.send(error);
    })
})


app.get('/newvideo', function (req, res) {
   var child = exec ('raspivid', function(error, stdout, stderr){
        res.send(error);
   });

})

app.get('/gallery', function (req, res) {
    fs.readdir(path.join(__dirname + '/images'), function(err, items) {
        res.render('gallery', { images: items })
    
    });
})
app.get('/videos', function (req, res) {
    fs.readdir(path.join(__dirname + '/video'), function(err, items) {
        res.render('videos', { vids: items })
    
    });
})

app.get('/download/:filename', function (req, res) {
    res.download(path.join(__dirname + '/images/' + req.params.filename));
})

app.get('/download_vid/:filename', function (req, res) {
    res.download(path.join(__dirname + '/video/' + req.params.filename));
})

app.get('/open/:filename', function (req, res) {
    res.sendFile(path.join(__dirname + '/images/' + req.params.filename));
})



var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Server listening at http://%s:%s", host, port);

})

