const searchButton=document.getElementById("searchButton");
const searcher= document.getElementById("searcher");
const explore=document.getElementById("explore");
const exploreImage= document.getElementById("explore-image");
const startExploring=document.getElementById("startexploring");
let movieData;
let selectedIDs=[];
let posts= document.getElementById("posts");
const APIkey=`2a3bd44d`;
async function getMovieTitleData(){
    explore.style.display="flex";
    exploreImage.style.display="none";
    startExploring.textContent="Loading results......";
    
    const fetchQueryBasic= `https://www.omdbapi.com/?s=${searcher.value.replaceAll(' ',"+")}&plot=full&apikey=${APIkey}`;
    searcher.value='';
    
    let page=1;
    let returnValue=[];
    let fetchQuery=fetchQueryBasic+`&page=${page}`;
    const firstFetchResponse= await fetch(fetchQuery);
    const firstFetchJson= await firstFetchResponse.json();
    
    if(firstFetchJson.Response==="False"){
        return returnValue;
    }
    
    let itemsLeft=firstFetchJson.totalResults-10;
    returnValue.push(firstFetchJson.Search);
    page++;
    while(itemsLeft>0){
        fetchQuery=fetchQueryBasic+`&page=${page}`;
        const fetchResponse= await fetch(fetchQuery);
        const fetchJson= await fetchResponse.json();
        itemsLeft-=10;
        returnValue.push(fetchJson.Search);
        page++;
    }
    return returnValue;
}

async function searchForData() {
    movieData= await getMovieTitleData();
    if(movieData.length===0){
        posts.innerHTML="";
        explore.style.display="flex";
        exploreImage.style.display="none";
        startExploring.textContent="Unable to find what you are looking for. Please try another search.";
        return;
    }
    explore.style.display="none";
    exploreImage.style.display="inline";
    startExploring.textContent="Start Exploring";
    posts.innerHTML='';
    for(let i=0;i<movieData.length;i++){
        for(let j=0;j<movieData[i].length;j++){
            const fetchQuery= `https://www.omdbapi.com/?i=${movieData[i][j].imdbID}&plot=full&apikey=${APIkey}`;
            const fetchResponse= await fetch(fetchQuery);
            const fetchJson= await fetchResponse.json();
            
            let theRating;
            if(fetchJson.Ratings.length===0){
                theRating="N/A"
            }
            else{
                theRating=fetchJson.Ratings[0].Value.slice(0,3);
            }
            

            posts.innerHTML+=`<div class="movieBoxDiv" style="margin-bottom:50px;">
            <img class="movie-picture" src="${fetchJson.Poster}" alt="Movie Picture" />
            <div class="movieInfoDiv">
                <div class="titleAndReviewsDiv">
                    <p class="title"> ${fetchJson.Title}</p>
                    <img class="starPic" src="images/star.jpg" />
                    <p class="review">${theRating}</p>
                </div>
                <div class="details">
                    <p class="minutes">${fetchJson.Runtime}</p>
                    <p class="genre">${fetchJson.Genre}</p>
                    <div class="watchlistDiv">
                        <button onclick="addToLS('${fetchJson.Poster.replaceAll("'","\\'").replaceAll("\"","\\'")}', '${fetchJson.Title.replaceAll("'","\\'").replaceAll("\"","\\'")}', '${theRating.replaceAll("'","\\'").replaceAll("\"","\\'")}', '${fetchJson.Runtime.replaceAll("'","\\'").replaceAll("\"","\\'")}', '${fetchJson.Genre.replaceAll("'","\\'").replaceAll("\"","\\'")}', '${fetchJson.Plot.replaceAll("'","\\'").replaceAll("\"","\\'")}')" class="watchlistButton"></button>
                        <p class="watchlist">Add</p>
                    </div>
                </div>
                <p class="description" >${fetchJson.Plot}</p>
            </div>
        </div> `
        }
    }

}


searchButton.addEventListener('click', searchForData)

searcher.addEventListener("keypress", function(event){
    if(event.key==="Enter"){
        
        event.preventDefault();
        searchForData();
    }
})


function addToLS(poster, title, rating, time, genre, story){
    let thePostHtml= `<div class="movieBoxDiv" style="margin-bottom:50px;">
    <img class="movie-picture" src="${poster}" alt="Movie Picture" />
    <div class="movieInfoDiv">
        <div class="titleAndReviewsDiv">
            <p class="title"> ${title}</p>
            <img class="starPic" src="images/star.jpg" />
            <p class="review">${rating}</p>
        </div>
        <div class="details">
            <p class="minutes">${time}</p>
            <p class="genre">${genre}</p>
            <div class="watchlistDiv">
                <button style="background-image:url('images/remove.jpg')" onclick="remove('${poster.replaceAll("'","\\'")}','${title.replaceAll("'","\\'")}','${rating.replaceAll("'","\\'")}','${time.replaceAll("'","\\'")}','${genre.replaceAll("'","\\'")}','${story.replaceAll("'","\\'")}')"  class="watchlistButton"></button>
                <p class="watchlist">Remove</p>
            </div>
        </div>
        <p class="description" >${story}</p>
    </div>
    </div> `

    if(window.localStorage.getItem("savedPosts")===null){
        window.localStorage.setItem("savedPosts", thePostHtml);
    }
    else {
        let currentHtml= window.localStorage.getItem("savedPosts");
        currentHtml+=thePostHtml;
        window.localStorage.setItem("savedPosts", currentHtml);
    }
}
function remove(poster, title, rating, time, genre, story){

    

    let removeThis=`<div class="movieBoxDiv" style="margin-bottom:50px;">
    <img class="movie-picture" src="${poster}" alt="Movie Picture" />
    <div class="movieInfoDiv">
        <div class="titleAndReviewsDiv">
            <p class="title"> ${title}</p>
            <img class="starPic" src="images/star.jpg" />
            <p class="review">${rating}</p>
        </div>
        <div class="details">
            <p class="minutes">${time}</p>
            <p class="genre">${genre}</p>
            <div class="watchlistDiv">
                <button style="background-image:url('images/remove.jpg')" onclick="remove('${poster.replaceAll("'","\\'")}','${title.replaceAll("'","\\'")}','${rating.replaceAll("'","\\'")}','${time.replaceAll("'","\\'")}','${genre.replaceAll("'","\\'")}','${story.replaceAll("'","\\'")}')"  class="watchlistButton"></button>
                <p class="watchlist">Remove</p>
            </div>
        </div>
        <p class="description" >${story}</p>
    </div>
    </div> `;


    let newVersion= localStorage.getItem("savedPosts").replaceAll(removeThis,'');
    localStorage.setItem("savedPosts", newVersion);
    document.getElementById("posts1").innerHTML=localStorage.getItem("savedPosts");
    if(newVersion===''){
        localStorage.clear();
        document.getElementById("explore1").style.display="flex";
    }
    
}
