// DOM Elements
const jobList = document.getElementById("job-list");
const searchInput = document.getElementById("search");

// Fetch job data from JSON file
fetch('jobs.json')
    .then(response => response.json())
    .then(jobs => {
        // Display all jobs by default
        displayJobs(jobs);

        // Event listeners for nav links
        document.querySelectorAll("nav a").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const type = e.target.getAttribute("data-type");
                filterJobs(jobs, type);
            });
        });

        // Event listener for search input
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(searchTerm));
            displayJobs(filteredJobs);
        });
    })
    .catch(error => console.error('Error loading jobs:', error));

// Function to filter jobs by type
function filterJobs(jobs, type) {
    const filteredJobs = type === "all" ? jobs : jobs.filter(job => job.type === type);
    displayJobs(filteredJobs);
}

// Function to display jobs
function displayJobs(jobs) {
    jobList.innerHTML = "";
    jobs.forEach(job => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");
        jobItem.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.description}</p>
      <p><strong>Type:</strong> ${job.type}</p>
      <p><strong>Date Posted:</strong> ${job.date}</p>
    `;
        jobItem.addEventListener("click", () => {
            window.location.href = `job-detail.html?id=${job.id}`;
        });
        jobList.appendChild(jobItem);
    });
}