var initialMovies = [];

const renderButtons = () => {
    $('#buttons').empty();
    initialMovies.forEach(function(element){
        let $button = $('<button>');
        $button
        .addClass('btn btn-primary')
        .attr({'type':'button','data-title': element.title, 'data-id':element.id})
        .text(element.title);
        $('#buttons').append($button);
    })
} 

const pullData = (movieTitle, movieId) => {
    var giphyURL = `https://api.giphy.com/v1/gifs/search?q=${movieTitle}&api_key=dc6zaTOxFJmzC&limit=10`;
    var omdbURL = `https://www.omdbapi.com/?apikey=trilogy&i=${movieId}`;

    $.ajax({
        url: giphyURL,
        method: "GET"
    })
    .then(function(response) {
        setGiphys(response);
    })

    $.ajax({
        url: omdbURL,
        method: "GET"
    })
    .then(function(response) {
        setMovieInfo(response);
    })
}

const setGiphys = (data) => {
    var dom = $('#allgifs');
    dom.empty();
    data.data.forEach(function(element){
        var $gifDiv = $('<div>');
        var $rating = $('<p>');
        var $gifImg = $('<img>');
        $gifImg.attr({'src':element.images.fixed_height_still.url,'data-still':element.images.fixed_height_still.url,'data-animate':element.images.fixed_height.url, 'data-state': 'still'}).addClass('gif');
        $rating.html(element.rating);
        $gifDiv.append($gifImg).append($rating);
        dom.prepend($gifDiv);
    })
}

const setMovieInfo = (data) => {
    var movieDom = $('#movieinfo');
    movieDom.empty();
    var $infoDiv = $('<div>');
    var $poster = $('<img>');
    $poster.attr('src',data.Poster);
    var $title = $('<h3>');
    $title.html(data.Title);


    $infoDiv.append($poster).append($title);
    movieDom.prepend($infoDiv);
}

var $document = $(document);

$document.on("click", "button" ,function() {
    let title = $(this).attr('data-title');
    let id = $(this).attr('data-id');
    $('#suggestions').empty();
    pullData(title, id);
})


$document.on("click", ".gif" ,function() {
    var state = $(this).attr('data-state');
    if (state == 'still') {
        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');
    } else {
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
    }
})

$document.on("click", ".searchPosters" ,function() {
    var newMovie = {
        title: $(this).attr('data-title'),
        id: $(this).attr('data-id'),    }
    if(newMovie){
        initialMovies.push(newMovie);
        renderButtons();
        $('#movieTitle').val('');
    } else {
        alert("Add a value please");
    }
})

$('#movieTitle').on('keyup',function(event){
    var searchPhrase = $('#movieTitle').val();
    if(searchPhrase == "") {
        $('#helpText').html('');
        $('#suggestions').html('');
    } else {
    $.ajax({
        url:'https://www.omdbapi.com/',
        type: 'GET',
        data: {
            s: searchPhrase,
            apikey: 'trilogy'
        }
        }).then(function(response){
            console.log(response);
            if (response.Response == 'True') {
                $('#suggestions').empty();
                    if(response.Search){
                        response.Search.forEach(function(element){
                            var $movieContainer = $('<div>');
                            var $newImage = $('<img>');
                            $newImage.attr({'src':element.Poster,'data-id':element.imdbID,'data-title':element.Title, 'class':'searchPosters'});
                            $movieContainer.append($newImage);
                            $('#suggestions').append($movieContainer);
                            $('#helpText').html('<h3>Select one or many of the movies below!</h3>')
                        })
                    }
                } else {
                    $('#suggestions').empty();
                    var $noMovies = $('<div>');
                    var $noMovieText = $('<h3> Error: '+ response.Error+'</h3>');
                    $noMovies.append($noMovieText);
                    $('#helpText').html($noMovies);
                }
            })
        }
})
