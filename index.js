const jobsContainer = document.getElementById("jobs-container")
const inputSkills = document.getElementById("input-skills")
const clearBtn = document.getElementById("clear-btn")
let selectedRolesArray = [] 
let selectedLevelsArray = []
let selectedSkillsArray = []
let selectedToolsArray = []
let selectedSkills = [] //the array holding all e.target.ids clicked
let targetedSkill = "" //is the e.target.id 
let jobData = []

//FUNCTION - retrieves data from .json file 
function fetchJSONData() {
    fetch("./data.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`)}
            return res.json()})
        .then((data) =>
            displayData(data))
                .catch((error) => console.error("Unable to fetch data:", error))}

//FUNCTION - displays the jobs containing the skills in from following arrays (level, role, skill, tools)
function displayData(data){
 
    if (selectedSkills.length === 0) {
        jobData = data
        
    } else if (selectedSkills.length >= 1) {
        jobData = data.filter(job => 
            (selectedLevelsArray.length === 0 || selectedLevelsArray.includes(job.level)) &&
            (selectedRolesArray.length === 0 || selectedRolesArray.includes(job.role)) &&
            (selectedSkillsArray.length === 0 || selectedSkillsArray.every(skill => job.languages.includes(skill))) &&
            (selectedToolsArray.length === 0 || selectedToolsArray.every(tool => job.tools.includes(tool)))
        )}
    
        const mappedData = jobData.map(function(job){
            
            return `
            <div class = "job-div">
                <div class = "section-one">
                    <div>
                        <img src="${job.logo}"/>
                    </div>
                    <div class = "job-info">
                        <div class = "job-highlights">
                            <p class = "job-company"><strong>${job.company}</strong></p>
                            ${job.new? `<p class = "job-new">NEW</p>`: ""}
                            ${job.featured? `<p class="job-featured">FEATURED</p>`:""}
                        </div>
                        <p><strong>${job.position}</strong></p>
                        
                        <div class = "job-details">
                            <p>${job.postedAt}</p>
                            <p>${job.contract}</p>
                            <p>${job.location}</p>
                        </div>
                    </div>  
                </div>
        
                    <div class = "job-skills-div">
                        <button id = ${job.role} class = "button-skills">${job.role}</button>
                        <button id = ${job.level} class = "button-skills">${job.level}</button>
                        ${job.languages.map(function(skill){
                            return `<button id = ${skill} class = "button-skills">${skill}</button>`
                        }).join("")}
                        ${job.tools.map(function(tool){
                            return `<button id = ${tool} class = "button-skills">${tool}</button>`
                        }).join("")}
                    </div> 
    
                </div>`
        }).join("")
        jobsContainer.innerHTML = mappedData}

//FUNCTION - Deletes all selected skills upon click of Clear Button
clearBtn.addEventListener("click", function(){
        
        selectedRolesArray = [] 
        selectedLevelsArray = []
        selectedSkillsArray = []
        selectedToolsArray = []
        selectedSkills = []
        
        updateSkillsDOM()
        fetchJSONData()       
})

//FUNCTION - Isolates selected skills the user clicks
document.addEventListener("click", function(e){
  
    if (!selectedSkills.includes(e.target.id) && e.target.classList.contains("button-skills") && e.target.id !== ""){
            if (!selectedRolesArray.includes(e.target.id) && (e.target.id === "Frontend" || e.target.id === "Backend" || e.target.id === "Fullstack")){
              selectedRolesArray.push(e.target.id)

            }
            else if (!selectedLevelsArray.includes(e.target.id) && (e.target.id === "Senior" || e.target.id === "Midweight" || e.target.id === "Junior")){
              selectedLevelsArray.push(e.target.id)

            }
            else if (!selectedSkillsArray.includes(e.target.id) && (e.target.id === "Python" || e.target.id === "HTML"|| e.target.id === "CSS"|| e.target.id === "JavaScript"|| e.target.id === "Ruby")){
              selectedSkillsArray.push(e.target.id)
         
            }
            else if (!selectedToolsArray.includes(e.target.id)){
               selectedToolsArray.push(e.target.id) 
            }
            
         selectedSkills = selectedRolesArray.concat(selectedLevelsArray, selectedSkillsArray, selectedToolsArray)
         fetchJSONData()
         updateSkillsDOM()
  }})

//FUNCTION - Updates the selected skill section of the DOM
function updateSkillsDOM() {
    const selectedSkillsMapped = selectedSkills.map((skill) => {
        return `
        <div class="selected-skill">
            <p class="selected-skill-p">${skill}</p>
            <p class="selected-skill-x" id=${skill}>X</p>
        </div>`;
    }).join(" ");
    inputSkills.innerHTML = selectedSkillsMapped}

//FUNCTION - Removes the skill that was "x"d by the user
document.addEventListener("click", function (e) {
    
    if (e.target.classList.contains("selected-skill-x")) {
            // Find the index of the clicked skill in the selectedSkills array
        const skillId = e.target.id;
        const skillIndex = selectedSkills.indexOf(skillId);
       
            // If the skill exists in the array, remove it
        if (skillIndex !== -1) {
            selectedSkills = selectedSkills.filter(skill => skill !== skillId);
            selectedRolesArray = selectedRolesArray.filter(role => role !== skillId);
            selectedLevelsArray = selectedLevelsArray.filter(level => level !== skillId);
            selectedSkillsArray = selectedSkillsArray.filter(skill => skill !== skillId);
            selectedToolsArray = selectedToolsArray.filter(tool => tool !== skillId)}
            updateSkillsDOM()  
            fetchJSONData()
        }})

//does the initial retrieval of data 
fetchJSONData()
//does the initial display of jobs
displayData()