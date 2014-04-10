myApp = {};
myApp.db = "https://domo.firebaseio.com/";
myApp.Movies = [];
myApp.Movie = function (title, director, year) {
    this.title = title;
    this.director = director;
    this.year = year;
};//Constructor
myApp.URLMaker = function (array) {
    var _url = myApp.db;
    if (array.length) {
        for (var x in array) {
            _url += array[x] + "/";
        }
    }
    _url += ".json";
    return _url;
};//URL Maker
myApp.Ajax = function (method, urlArray, data, callback) {
    var call = new XMLHttpRequest();
    var url = myApp.URLMaker(urlArray);//We will come back
    call.open(method, url, true);
    call.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var returnData = JSON.parse(this.response);
            if (callback) {
                callback(returnData);
            }
        }
        else {console.log("Error: " + this.status);}
    };
    call.onerror = function () { console.log("Errrrr"); };
    if (data) { call.send(JSON.stringify(data)); }
    else { call.send(); }
};//Master Ajax
myApp.WriteGallery = function () {
    var holder ="<br/>";
    for (var x in myApp.Movies) {
        holder += myApp.Movies[x].title+" : ";
        holder += myApp.Movies[x].director+" : ";
        holder += myApp.Movies[x].year;
        holder += "<span class='btn btn-danger' onclick='myApp.deleteMovie(\""
            + myApp.Movies[x].key
            + "\")'>Delete</span>";
        holder += "<span class='btn btn-warning' onclick='myApp.editMovie(\""
        + myApp.Movies[x].key
        + "\")'>Delete</span><br/>";
            
            
    }
    document.getElementById("Gallery").innerHTML = holder;


};//Writes Movies to the Gallery Div
myApp.addMovie = function () {
    var title = document.getElementById("Title").value;
    var director = document.getElementById("Director").value;
    var year = document.getElementById("Year").value;
   var movie = new myApp.Movie(title, director, year);
   myApp.Ajax(
       "POST",
       ['Movies'],
       movie,
       function (data) {
           movie.key = data.name;
           myApp.Movies.push(movie);
           myApp.WriteGallery();
       });
   document.getElementById("Title").value = "";
   document.getElementById("Director").value = "";
   document.getElementById("Year").value = "";
};//C-Fires when we click Add Movie
myApp.deleteMovie = function (key) {
    myApp.Ajax("DELETE",
        ["Movies", key],
        null,
        function () {
            for (var x in myApp.Movies) {
                if(myApp.Movies[x].key == key){
                    myApp.Movies.splice(x, 1);
                }
            }
            myApp.WriteGallery();
        });
        
};//D-Fires when we click delete
myApp.editMovie = function () { };//U-Fires When we click edit
myApp.getMovies = function () {
    myApp.Ajax("GET",["Movies"], null, myApp.fillArray );
};//Gets movies from Firebase
myApp.fillArray = function (data) {
    myApp.Movies = [];
    for (var x in data) {
        data[x].key = x;
        myApp.Movies.push(data[x]);
    }
    myApp.WriteGallery();
};
myApp.getMovies();
