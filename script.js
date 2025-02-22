let allArticles = [];
let currentPage = 1;
const articlesPerPage = 5;

async function fetchArticles() {
    try {
        const res = await fetch('/news.json');
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const jsondata = await res.json();
        allArticles = jsondata.articles.reverse();
        if (window.location.pathname.includes('article.html')) {
            loadArticle();
        } else {
            displayArticles();
            displayAsideArticles();
            displayNavLabels();
            setupSearch();
            setupPagination();
        }
    } catch (error) {
        console.error(error);
    }
}

function displayArticles(filteredArticles = allArticles) {
    const articlesDiv = document.getElementById('articles');
    articlesDiv.innerHTML = "";

    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const articlesToShow = filteredArticles.slice(start, end);

    articlesToShow.forEach(article => {
        const articleElement = document.createElement("a");
        articleElement.href = `/article.html?id=${article.number}`;
        articleElement.classList.add("article");

        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div>
                <h2>${article.title}</h2>
                <p>${article.body.substring(0, 150)}...</p>
            </div>
        `;

        articlesDiv.appendChild(articleElement);
    });

    setupPagination(filteredArticles);
}

function displayAsideArticles() {
    const asideDiv = document.getElementById('aside-articles');
    asideDiv.innerHTML = "";

    const latestArticles = allArticles.slice(0, 5);
    latestArticles.forEach(article => {
        const asideLink = document.createElement("a");
        asideLink.href = `/article.html?id=${article.number}`;
        asideLink.innerText = article.title;
        asideDiv.appendChild(asideLink);
    });
}

function displayNavLabels() {
    const navList = document.getElementById('nav-ul');
    navList.innerHTML = ""; // Clear existing labels

    // Add "All" option
    const allItem = document.createElement("li");
    allItem.innerHTML = `<a href="#">All</a>`;
    allItem.addEventListener('click', () => {
        currentPage = 1;
        displayArticles(allArticles);
        setupPagination(allArticles);
    });
    navList.appendChild(allItem);

    const uniqueLabels = [...new Set(allArticles.map(article => article.label))];

    uniqueLabels.forEach(label => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="#">${label}</a>`;
        listItem.addEventListener('click', () => {
            const filteredArticles = allArticles.filter(article => article.label === label);
            currentPage = 1;
            displayArticles(filteredArticles);
            setupPagination(filteredArticles);
        });
        navList.appendChild(listItem);
    });

    // Add "Jobs" option at the end
    const jobsItem = document.createElement("li");
    jobsItem.innerHTML = `<a href="/jobs.html">Jobs</a>`;
    navList.appendChild(jobsItem);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredArticles = allArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.body.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayArticles(filteredArticles);
        setupPagination(filteredArticles);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredArticles = allArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.body.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayArticles(filteredArticles);
        setupPagination(filteredArticles);
    });
}

function setupPagination(filteredArticles = allArticles) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayArticles(filteredArticles);
        });
        if (i === currentPage) button.classList.add('active');
        paginationDiv.appendChild(button);
    }
}

function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const article = allArticles.find(article => article.number === parseInt(articleId));
    if (article) {
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-image').innerHTML = `<img src="${article.image}" alt="${article.title}">`;
        document.getElementById('article-body').textContent = article.body;
        displaySuggestedArticles(articleId);
    } else {
        document.getElementById('article-title').textContent = "Article Not Found";
    }
}

function displaySuggestedArticles(currentArticleId) {
    const suggestionsDiv = document.getElementById('suggested-articles');
    suggestionsDiv.innerHTML = "";

    const suggestedArticles = allArticles.filter(article => article.number !== parseInt(currentArticleId)).slice(0, 5);
    suggestedArticles.forEach(article => {
        const articleElement = document.createElement("a");
        articleElement.href = `/article.html?id=${article.number}`;

        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div>
                <h3>${article.title}</h3>
            </div>
        `;

        suggestionsDiv.appendChild(articleElement);
    });
}

function searchArticles() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredArticles = allArticles.filter(article => {
        return article.title.toLowerCase().includes(searchTerm) ||
            article.body.toLowerCase().includes(searchTerm) ||
            article.label.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    displayArticles(filteredArticles, currentPage);
    setupPagination(filteredArticles);
}

fetchArticles();