// DOM Elements
const jobList = document.getElementById("job-list");
const searchInput = document.getElementById("search");
const nav = document.querySelector("nav ul");

// Fetch job data from JSON file
fetch('jobs.json')
    .then(response => response.json())
    .then(jobs => {
        // Get unique job types
        const jobTypes = [...new Set(jobs.map(job => job.type))];

        // Generate navigation links
        generateNavLinks(jobTypes);

        // Display all jobs by default
        displayJobs(jobs);

        // Event listener for search input
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(searchTerm));
            displayJobs(filteredJobs);
        });

        // Function to generate navigation links
        function generateNavLinks(jobTypes) {
            nav.innerHTML = ""; // Clear existing links
            const allLink = document.createElement("li");
            allLink.innerHTML = '<a href="#" data-type="all">All Jobs</a>';
            nav.appendChild(allLink);

            allLink.addEventListener("click", (e) => {
                e.preventDefault();
                filterJobs(jobs, "all");
            });

            jobTypes.forEach(type => {
                const link = document.createElement("li");
                link.innerHTML = `<a href="#" data-type="${type}">${type}</a>`;
                nav.appendChild(link);

                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    filterJobs(jobs, type);
                });
            });
        }

        // Function to filter jobs by type
        function filterJobs(jobs, type) {
            const filteredJobs = type === "all" ? jobs : jobs.filter(job => job.type.toLowerCase() === type.toLowerCase());
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
    })
    .catch(error => console.error('Error loading jobs:', error));