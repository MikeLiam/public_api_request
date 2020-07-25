const employeesDiv = document.querySelector('#gallery');
const employeesUrl = "https://randomuser.me/api/?results=12";

async function fetchEmployees(url) {
    function checkStatus(response) {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }
    try {
        return await fetch(url)
                        .then(checkStatus)
                        .then(data => data.json())
                        .then(json => json.results);
    } catch {
        throw error;
    }
}

// async function getEmployees(url) {
//     const employeesJSON = await fetchEmployees(url);
//     const cards = employeesJSON.results.map( employee => {
//         return { ...}
//     })
// }

function generateCards(data) {
    data.map( employee => {
        console.log(employee);
    })
}

fetchEmployees(employeesUrl)
    .then(generateCards)
    .catch( e => {
        employeesDiv.innerHTML = '<h3>Something went wrong!</h3>';
        console.log(e);
    });