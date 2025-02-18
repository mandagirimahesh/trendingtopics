
let currentPage = 1;
const articlesPerPage = 5; // Show 5 articles per page
let allArticles = [];

async function fetchArticles() {
    try {
        const res = await fetch('./news.json');
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const jsondata = await res.json();
        let allArticlesorg = jsondata.articles;
        allArticles = allArticlesorg.reverse()
        displayArticles();
        displayPagination();
        displayAsideArticles();
    } catch (error) {
        console.error(error);
    }
}

function displayArticles() {
    let articlesdiv = document.getElementById('articles');
    articlesdiv.innerHTML = ""; // Clear previous articles

    let start = (currentPage - 1) * articlesPerPage;
    let end = start + articlesPerPage;
    let articlesToShow = allArticles.slice(start, end);

    articlesToShow.forEach(article => {
        // labels
        let navlist = document.getElementById('nav-ul')
        navlist.innerHTML += `<li class="navlist"><a class="navlista" href="#">${article.label}</a></li>`

        let articleElement = document.createElement("a");
        articleElement.href = `./articles/${article.number}.html`;
        articleElement.classList.add("article");

        articleElement.innerHTML = `
                <img src="${article.image}" alt="">
                <div>
                    <h2 class="topic-title">${article.title}</h2>
                    <p>${article.body}</p>
                </div>
            `;

        articlesdiv.appendChild(articleElement);
    });

    attachClickListeners(); // Attach event listeners
}

function displayPagination() {
    let totalPages = Math.ceil(allArticles.length / articlesPerPage);
    let paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement("button");
        button.innerText = i;
        button.onclick = () => {
            currentPage = i;
            displayArticles();
        };
        paginationContainer.appendChild(button);
    }
}

function displayAsideArticles() {
    let aadiv = document.getElementById('aadiv');
    aadiv.innerHTML = ""; // Clear previous aside articles

    allArticles.forEach(article => {
        let asideLink = document.createElement("a");
        asideLink.href = `./articles/${article.number}.html`;
        asideLink.innerText = article.title;
        aadiv.appendChild(asideLink);
    });
}

function attachClickListeners() {
    document.querySelectorAll('.article').forEach(article => {
        article.addEventListener("click", function () {
            let title = this.querySelector(".topic-title").textContent;
            console.log(title);
        });
    });
}

fetchArticles(); // Load articles on page load











// async function articles() {

//     try {
//         const res = await fetch('./news.json')
//         if (!res.ok) {
//             throw new Error(`Error ${res.status}`)
//         }
//         const jsondata = await res.json()
//         const articles = jsondata.articles

//         articles.forEach(article => {

//             // labels
//             let navlist = document.getElementById('nav-ul')
//             navlist.innerHTML += `<li class="navlist"><a class="navlista" href="#">${article.label}</a></li>`

//             //Main articles
//             let articlesdiv = document.getElementById('articles')
//             articlesdiv.innerHTML += `
//             <a href="./articles/${article.number}.html" id="article" class="article">
//                 <img src="${article.image}" alt="">
//                 <div>
//                     <h2 class="topic-title">${article.title}</h2>
//                     <p>${article.body}</p>
//                 </div>
//             </a>`

//             //Aside article titles
//             let aadiv = document.getElementById('aadiv')
//             aadiv.innerHTML += `<a href=>${article.title}</a>`

//             //Separate Page article
//             const artlist = document.querySelectorAll('.article')
//             artlist.forEach(name => {
//                 name.addEventListener("click", function () {
//                     let title = this.querySelector(".topic-title").textContent;
//                     // console.log(title);


//                 });
//             });


//         });
//     } catch (error) {
//         console.error(error);
//     }

// }
// articles()