const serachForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

//Event Listener on Form Button
serachForm.addEventListener('submit', e => { 
    e.preventDefault();
    //Get Search Term
    const searchTerm = searchInput.value;
    //Get Sort 
    const sortBy = document.querySelector('input[name="sortBy"]:checked').value;
    //Get Limit
    const searchLimit = document.getElementById('limit').value;
    //If textbox is empty run showMessage function
    if(searchTerm === "") {
        //Passes in a message and a classname to showMessage
        showMessage ("Please add a search term", "empty-alert")
    };
    //Clear input
    searchInput.value = "";
    //Run getSearch which passes in the searchTerm, searchLimit and sortBy from the form
    getSearch(searchTerm, searchLimit, sortBy)
});

//showMessage takes in a message and className from the form
function showMessage(message, className){
    const div = document.createElement('div');
    div.className = `${className}`;
    div.appendChild(document.createTextNode(message));
    //We are going to add a warning if the textbox is empty
    const searchForm = document.getElementById('search-form');
    const search = document.getElementById('search-input');
    searchForm.insertBefore(div, search);
    //Warning disappears after 3 seconds
    setTimeout(()=> document.querySelector(".empty-alert").remove(),3000);
}

/* -- This is the fun stuff.  getSearch is a function that makes the call to reddit and displays info on the screen -- */

//Takes in 3 parameters for the fomr
function getSearch(searchTerm, searchLimit, sortBy) {
    //using fetch to call reddit
    return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
    .then(res => res.json())//takes in results and converting to .json
    .then((data)=>{
        const results = ((data.data.children.map(data =>data.data)));//had to do some digging thru the data and mapped to form a new array
        
        let outputSorry = '<div class = "sorry-card">';//creating div for output
        let output = '<div class = "cards">';//creating div for output
        
        //if no data is returned Taylor Swift says sorry
        if (results.length===0) {
            outputSorry += `
                <div class="sorry-container" "wrapper">
                    <img class="card-img-top" src="https://media.giphy.com/media/rvDtLCABDMaqY/giphy.gif" alt="Taylor Swift gif saying sorry>
                    <div class="card-body"></div>
            `;
            outputSorry += '</div>';
        }
        //If there are results we loop thru each one and display out a card
        results.forEach(result =>{
            //no image use an image of the reddit logo via turnery
            let image = result.preview
            ? result.preview.images[0].source.url
            : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';
            output +=`
                <div class="card-container">
                    <img class="card-img-top" src="${image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${result.title}</h5>
                        <p class="card-text">${truncateString(result.selftext, 100)}</p>
                        <a href="${result.url}" target="_blank" class="btn btn-primary">Read More</a>
                        <hr>
                        <div class="badges clearfix"> 
                            <span class="badge badge-secondary">Subreddit: ${result.subreddit}</span> 
                            <span class="badge badge-dark">Score: ${result.score}</span>
                        </div>
                    </div>
                </div>
            `;
        }); 
        output += '</div>';
        document.getElementById('results').innerHTML = output;
        document.getElementById('no-results').innerHTML = outputSorry;
    })
}
// Truncate String Function 
function truncateString(myString, limit) {
    const shortened = myString.indexOf(' ', limit);
    if (shortened == -1) return myString;
    return myString.substring(0, shortened);
}
