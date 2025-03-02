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

    articlesToShow.forEach((article, index) => {
        const articleElement = document.createElement("a");
        articleElement.href = `/article.html?id=${article.number}`;
        articleElement.classList.add("article");

        const keywordsHTML = article.keywords.map(keyword => `<span>${keyword}</span>`).join('');

        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div>
                <h2>${article.title}</h2>
                <p>${article.body.substring(0, 150)}...</p>
            </div>
        `;

        articlesDiv.appendChild(articleElement);

        // Insert advertisement code between every article
        if (index < articlesToShow.length - 1) {
            const adContainer = document.createElement('div');
            adContainer.innerHTML = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2648616140569696"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-gd-2j+5l-fb+by"
     data-ad-client="ca-pub-2648616140569696"
     data-ad-slot="5834926392"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
            articlesDiv.appendChild(adContainer);
        }
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
    jobsItem.innerHTML = `<a href="/jobs/index.html">Jobs</a>`;
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
        document.getElementsByTagName('title')[0].textContent = article.title;
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-image').innerHTML = `<img src="${article.image}" alt="${article.title}">`;

        // Format the article body: remove long hyphens and convert *text* or **text** to italic
        let formattedBody = article.body.replace(/—/g, '');
        formattedBody = formattedBody.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        formattedBody = formattedBody.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
        document.getElementById('article-body').innerHTML = formattedBody;

        // Add meta keywords tag
        const metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        metaKeywords.content = article.keywords.join(', ');
        document.getElementsByTagName('head')[0].appendChild(metaKeywords);

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