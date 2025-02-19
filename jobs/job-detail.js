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
            document.getElementById("job-title").textContent = job.title;
            document.getElementById("job-description").textContent = job.description;
            document.getElementById("job-type").textContent = job.type;
            document.getElementById("job-qualification").textContent = job.qualification;
            document.getElementById("job-date").textContent = job.date;
            document.getElementById("job-details-content").textContent = job.details;
            document.getElementById("apply-link").href = job.link;
        } else {
            document.getElementById("job-details").innerHTML = "<p>Job not found.</p>";
        }
    })
    .catch(error => console.error('Error loading jobs:', error));