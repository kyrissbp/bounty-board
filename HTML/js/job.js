﻿document.addEventListener('DOMContentLoaded', getJobs);

var jobBoard = document.getElementById("jobBoard");
var filterCity = document.getElementById("inputCity");
var searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () { filterJobs(); });

function toggleMenu() {
  var menuBox = document.getElementById('searchBar');    
  if(menuBox.style.display == "inline-block") { // if is menuBox displayed, hide it
    menuBox.style.display = "none";
  }
  else { // if is menuBox hidden, display it
    menuBox.style.display = "inline-block";
  }
}

function populateJobBoard(jobs) {

    // Clears job board
    while (jobBoard.firstChild) {
        jobBoard.removeChild(jobBoard.firstChild);
    }

    if (jobs == null)
        return;

    var length = jobs.length;

    // Iterate through jobs
    for (var i = 0; i < length; i++) {

        // Assign header color
        var bgColor = "#86CE5A";    // Green
        if (i % 3 == 1)
            bgColor = "#DE934F";    // Orange
        if (i % 3 == 2)
            bgColor = "#D67677";    // Red
        // Purple: #450198

        // Create job display object

        jobBoard.appendChild(createNewRow());

        var jobPosting = jobBoard.lastChild;
        var jobObject = jobs[i];

        var postingHeader = document.createElement("div");
        postingHeader.className = "postingHeader";

        var postingTitle = document.createElement("div");
        postingTitle.className = "postingTitle";
        postingTitle.innerHTML = jobObject.jobTitle;
        postingTitle.style.backgroundColor = bgColor;

        var postingLocation = document.createElement("div");
        postingLocation.className = "postingLocation";
        postingLocation.innerHTML = "Location: " + jobObject.city + ", " + jobObject.state;
        postingLocation.style.backgroundColor = bgColor;

        var postingDate = document.createElement("div");
        postingDate.className = "postingDate";
        postingDate.innerHTML = "Date: " + jobObject.datePosted;
        postingDate.style.backgroundColor = bgColor;

        postingHeader.appendChild(postingTitle);
        postingHeader.appendChild(postingLocation);
        postingHeader.appendChild(postingDate);

        var postingBody = document.createElement("div");
        postingBody.className = "postingBody";

        var posterName = document.createElement("div");
        posterName.className = "posterName";
        posterName.innerHTML = "Posted By: " + jobObject.posterName;

        var postingReputation = document.createElement("div");
        postingReputation.className = "postingReputation";
        postingReputation.innerHTML = "Poster Reputation: " + jobObject.reputationScore;

        var postingAddress = document.createElement("div");
        postingAddress.className = "postingAddress";
        postingAddress.innerHTML = "Address: " + jobObject.streetAddress;

        var postingPay = document.createElement("div");
        postingPay.className = "postingPay";
        var payPeriod = jobObject.isHourly ? "hr" : "day";
        postingPay.innerHTML = "Pay: $" + jobObject.payRate + " / " + payPeriod;

        var postingEstimate = document.createElement("div");
        postingEstimate.className = "postingEstimate";
        postingEstimate.innerHTML = "Estimated Time: " + jobObject.timeEstimate;

        var postingDescription = document.createElement("div");
        postingDescription.className = "postingDescription";
        postingDescription.innerHTML = "Description: " + jobObject.jobDescription;

        postingBody.appendChild(posterName);
        postingBody.appendChild(postingReputation);
        postingBody.appendChild(postingAddress);
        postingBody.appendChild(postingPay);
        postingBody.appendChild(postingEstimate);
        postingBody.appendChild(document.createElement("br"));
        postingBody.appendChild(postingDescription);

        var postingButtons = document.createElement("div");
        postingButtons.className = "postingButtons";

        var applyButton = document.createElement("button");
        applyButton.className = "btn btn-default";
        applyButton.textContent = "Apply for Job";

        postingButtons.appendChild(applyButton);

        jobPosting.appendChild(postingHeader);
        jobPosting.appendChild(document.createElement("br"));
        jobPosting.appendChild(postingBody);
        jobPosting.appendChild(document.createElement("br"));
        jobPosting.appendChild(postingButtons);
    }
}

// Get all jobs in database
function getJobs() {

    var req = new XMLHttpRequest();
    var url = "https://postskynetbountyboard.appspot.com/job";

    req.open("GET", url, true);
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            var length = response.length;
            console.log(response);

            populateJobBoard(response);

        } else {
            console.log("Error from request: " + req.statusText);
        }
    });
    req.send(null);
}

// Returns a new element to hold a job posting
function createNewRow() {
    var newRow = document.createElement("div");
    newRow.className = "jobPosting";

    return newRow;
}

// Filters jobs based on criteria
// ** CURRENTLY ONLY FILTERS BASED ON CITY
function filterJobs() {

    console.log("In filter jobs");

    try {
        // Declare API request address
        var req = new XMLHttpRequest();
        var url = "https://postskynetbountyboard.appspot.com/job/city";

        // Create data object to send with POST
        var data = {
            city: null
        };

        // Assign form information to data object
        if (filterCity.value == "" || filterCity.value == null)
            getJobs();

        else
            data.city = inputCity.value;

        req.open("POST", url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                console.log(response);

                populateJobBoard(response);
            } else {
                console.log("Error from request: " + req.statusText);
                populateJobBoard(null);
            }
        });
        req.send(JSON.stringify(data));
    } catch (e) {
        alert(e);
    }
}