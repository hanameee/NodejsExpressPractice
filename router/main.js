module.exports = function(app, fs) {
    app.get("/", function(req, res) {
        res.render("index.html", {
            title: "MY HOMEPAGE",
            length: 5
        });
    });
    
    app.get("/list", function(req, res) {
        //__dirname 은 현재 모듈의 위치를 나타냄 - router 모듈은 router 폴더에 들어있으니, data 폴더에 접근하려면 /../ 를 앞부분에 붙여서 먼저 상위폴더로 접근해야함
        fs.readFile(__dirname + "/../data/" + "user.json", "utf8", function(
            err,
            data
        ) {
            console.log(data);
            res.end(data);
        });
    });
};
