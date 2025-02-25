// Get job ID from URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("id");

// Fetch job data from JSON file
fetch('jobs.json')
    .then(response => response.json())
    .then(jobs => {
        // Find the selected job
        const job = jobs.find(job => job.id === parseInt(jobId));

        // Display job details
        if (job) {
            console.log("Job details loaded:", job);

            document.getElementById("job-title").textContent = job.title;
            document.getElementById("job-description").textContent = job.description;
            document.getElementById("job-type").textContent = job.type;
            document.getElementById("job-qualification").textContent = job.qualification;
            document.getElementById("job-date").textContent = job.date;
            document.getElementById("job-details-content").textContent = job.details;
            const applyLink = document.getElementById("apply-link");
            applyLink.href = job.link;

            // Share button functionality
            const shareButton = document.getElementById("share-button");
            shareButton.addEventListener("click", () => {
                if (navigator.share) {
                    navigator.share({
                        title: job.title,
                        text: job.description,
                        url: window.location.href
                    })
                        .then(() => console.log("Successful share"))
                        .catch((error) => console.log("Error sharing", error));
                } else {
                    alert("Web Share API not supported.");
                }
            });

            // Fetch and display similar jobs after displaying the job details
            fetch('jobs.json')
                .then(response => response.json())
                .then(jobs => {
                    console.log("All jobs loaded for similar jobs:", jobs);

                    const similarJobs = jobs.filter(j =>
                        j.title && job.title && hasCommonWord(j.title, job.title) && j.id !== job.id
                    ).slice(0, 3);
                    console.log("Similar jobs found:", similarJobs);

                    displaySimilarJobs(similarJobs);
                })
                .catch(error => console.error('Error loading similar jobs:', error));

        } else {
            document.getElementById("job-details").innerHTML = "<p>Job not found.</p>";
        }
    })
    .catch(error => console.error('Error loading jobs:', error));

function hasCommonWord(title1, title2) {
    const words1 = title1.toLowerCase().split(/\s+/);
    const words2 = title2.toLowerCase().split(/\s+/);

    for (const word of words1) {
        if (words2.includes(word)) {
            return true;
        }
    }
    return false;
}

function displaySimilarJobs(jobs) {
    const similarJobsList = document.getElementById("similar-jobs-list");
    similarJobsList.innerHTML = "";
    console.log("Displaying similar jobs:", jobs);
    jobs.forEach(job => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");
        jobItem.innerHTML = `
            <h3>${job.title}</h3>
            <p class="description-line">${job.description}</p>
        `;
        jobItem.addEventListener("click", () => {
            window.location.href = `job-detail.html?id=${job.id}`;
        });
        similarJobsList.appendChild(jobItem);
    });
}