async function main() {
    let favicon = document.getElementsByTagName('head')[0];
    favicon.innerHTML += `<link rel="icon" type="image/x-icon" href="https://www.svgrepo.com/show/353388/amazon-chime.svg">`
    try {
        const res = await fetch('../news.json')
        if (!res.ok) {
            throw new Error(`Error ${res.status}`)
        }
        const jsondata = await res.json()
        const articles = jsondata.articles

        //labels
        articles.forEach(article => {

            // labels
            let navlist = document.getElementById('nav-ul')
            navlist.innerHTML += `<li class="navlist"><a class="navlista" href="#">${article.label}</a></li>`
        });

        let url = window.location.href
        // console.log(url);
        let artno = url.match(/articles\/(\d+)/);
        let artcle = articles[artno[1] - 1];
        // console.log(artcle);
        let title = document.getElementById('title')
        let body = document.getElementById('body')
        let heading = document.getElementById('heading')
        let image = document.getElementById('imagediv')

        let adcode = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2648616140569696"
        crossorigin="anonymous"></script>
        <!-- display square -->
        <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-2648616140569696"
        data-ad-slot="7002523082"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
        `

        let updatedContent = artcle.body.replace(/\n\n/g, `</p>${adcode}<p>`);


        heading.innerText = artcle.title
        body.innerHTML = updatedContent
        title.innerText = artcle.title
        image.innerHTML = `<img id="image" src="${artcle.image}" alt="${artcle.label}">`
        setTimeout(() => {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }, 500);


    } catch (error) {
        console.error(error);
    }

}
main()
