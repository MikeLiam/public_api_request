const employeesDiv = document.querySelector('#gallery');
const employeesUrl = "https://randomuser.me/api/?results=12&nat=us,es,fr,gb";
let employeesArray = [];

/**
 * Make request to an url given checking correct status of response and errors 
 * and returning an Array of objects 'json.results' from response formated to JSON.
 * @param {String} url 
 */
async function fetchEmployees(url) {
    /**
     * Check if response's property 'ok' is true to resolve with response object 
     * or reject with error contained in response's property 'statusText'
     * @param {object} response 
     */
    function checkStatus(response) {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }
    // Try/catch module for manage errors
    try {
        return await fetch(url)
            .then(checkStatus)
            .then(data => data.json())
            .then(json => json.results);
    } catch (error) {
        throw error;
    }
}

/**
 * Create a card with image, name, email and location of each employee and append them to 
 * #gallery div
 * @param {Array} data Array with 12 'employee' objects
 */
function generateCards(data) {
    data.map(employee => {
        employeesArray.push(employee);
        employeesDiv.innerHTML += `
            <div class="card show" id="${employee.id.value}">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.thumbnail}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>`;
    });
}


function popModal(employee) {
    function modalEvents(button, employee) {
        const cards = [...document.querySelectorAll('.card.show')];
        const card = document.getElementById(employee.id.value);
        const action = button.id.split('-')[1];

        const selectActions = {
            close: () => {
                document.querySelector('div .modal-container').remove();
            },
            prev: () => {

                if (cards.length > 1) {
                    const index = cards.indexOf(card);
                    if (index > 0) {
                        const prevCard = cards[index - 1];
                            const prevEmployeeId = prevCard.id;
                            const prevEmployee = employeesArray.find(employee => employee.id.value === prevEmployeeId);
                            document.querySelector('div .modal-container').remove();
                            popModal(prevEmployee);
                        
                    }
                }
            },
            next: () => {
                if (cards.length > 1) {
                    const index = cards.indexOf(card);
                    if (index < cards.length - 1){
                        const nextCard = cards[index + 1]
                        const nextEmployeeId = nextCard.id;
                        const nextEmployee = employeesArray.find(employee => employee.id.value === nextEmployeeId);
                        document.querySelector('div .modal-container').remove();
                        popModal(nextEmployee);
                    }
                }
            }
        };

        selectActions[action]();
    }

    employeesDiv.innerHTML += `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.thumbnail}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.cell}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state}, ${employee.location.postcode}</p>
                <p class="modal-text">${employee.dob.date.split('T')[0].replace(/([0-9]+)\-([0-9]+)\-([0-9]+)/,"$3-$2-$1")}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div> `;

    document.querySelector('div .modal-container').addEventListener('click', e => {
        const target = e.target.closest('button');
        if (target !== null) {
            modalEvents(target, employee);
        }
    });
}

function search(input) {
    const employeesCards = [...document.querySelectorAll('div .card')];

    employeesCards.forEach( card => {
        const name = card.querySelector('#name').textContent.toLowerCase();
        if (name.includes(input.toLowerCase())) {
            card.classList.remove('hide');
            card.classList.add('show');
        } else {
            card.classList.remove('show');
            card.classList.add('hide');
        }
    });
}

document.querySelector('div .search-container').innerHTML = `
    <form action="#" method="get">
    <input type="search" id="search-input" name="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    search(e.target.elements['search-input'].value);
})

// Event listener for each card
document.querySelector('body').addEventListener('click', (e) => {
    const cardDiv = e.target.closest('div .card');
    if (cardDiv !== null) {
        const employee = employeesArray.find(employee => employee.id.value === cardDiv.id);
        popModal(employee);
    }
}, true);

// Calling for retrieve employees data
fetchEmployees(employeesUrl)
    .then(generateCards)
    .catch(e => {
        employeesDiv.innerHTML = '<h3>Please give it a new try in a few seconds...</h3>';
        console.log(e);
    });