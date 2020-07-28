const employeesDiv = document.querySelector('#gallery');
const employeesUrl = "https://randomuser.me/api/?results=12&nat=us";
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
    // Hide loading div
    document.querySelector('div.loading').style.display = 'none';
    // If have been some attempts and display error message, hide it
    if (document.querySelector('#errorMessage') !== null) {
        document.querySelector('#errorMessage').style.display = 'none';
    }
    // for every employee object
    data.forEach(employee => {
        // Take this step to fill global employees array
        employeesArray.push(employee);
        // Create card for employee
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card show';
        cardContainer.id = employee.id.value;
        cardContainer.innerHTML += `
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>`;
        employeesDiv.appendChild(cardContainer);
    });
}

/**
 * Show modal with 'employee' selected
 * @param {Object} employee employee's object of card clicked
 */
function popModal(employee) {
    /**
     * Event Handler for Close modal, show prev or next employee's modal
     * @param {HTMLElement} button <button> element clicked
     * @param {Object} employee employee's object of card clicked
     */
    function modalEvents(button, employee) {
        /**
         * In function of condition '-1' / '1' retrieves previous/next 
         * employee card from showed cards
         * @param {Integer} condition to take index -1 or index +1
         * @param {Array} cards showed cards in page
         */
        function modalAction(condition, cards) {
            // Only in case that are more than one employee
            if (cards.length > 1) {
                const index = cards.indexOf(card);
                // Not if is the first employee card and want previous 
                // or last employee card and want next
                if ((index !== 0 && condition === -1) || (index !== cards.length - 1 && condition === 1)) {
                    const newCard = cards[index + condition];
                    // To retrieve information from employees array
                    const newEmployeeId = newCard.id;
                    const newEmployee = employeesArray.find(employee => employee.id.value === newEmployeeId);
                    // Remove current employee's modal
                    document.querySelector('div .modal-container').remove();
                    // Show new modal with prev employee
                    popModal(newEmployee);
                }
            }
        }

        // Cards array that have show class in order to adapt functionality for next/prev modal button
        //  in case that a search was realized
        const cards = [...document.querySelectorAll('.card.show')];
        const card = document.getElementById(employee.id.value);
        const action = button.id.split('-')[1];
        // Functions array waiting for actions from modal's buttons.
        const selectActions = {
            // Modal Close button
            close: () => {
                document.querySelector('div .modal-container').remove();
            },
            // Modal prev employee button
            prev: () => {
                modalAction(-1, cards);
            },
            // Modal next employee button
            next: () => {
                modalAction(1, cards);
            }
        };

        selectActions[action]();
    }
    // Create div container for modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    // Birthday date permutation inside with Array.split + String.replace
    modalContainer.innerHTML += `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${employee.cell.replace(/(\([0-9]+\))\-([0-9]+)\-([0-9]+)/,"$1 $2-$3")}</p>
            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}</p>
            <p class="modal-text">Birthday: ${employee.dob.date.split('T')[0].replace(/([0-9]+)\-([0-9]+)\-([0-9]+)/,"$3/$2/$1")}</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>`;
    // Append to global div
    employeesDiv.appendChild(modalContainer);
    console.log(employee.cell)
    // Event listener for buttons inside modal
    document.querySelector('div .modal-container').addEventListener('click', e => {
        const target = e.target.closest('button');
        if (target !== null) {
            modalEvents(target, employee);
        }
    });
}

/**
 * Search for employee's cards where employee's name includes the 'input', 
 * hidding those that doesnt apply
 * @param {String} input Value from search input 
 */
function search(input) {
    // Get all cards in an Array to better management
    const employeesCards = [...document.querySelectorAll('div .card')];

    employeesCards.forEach(card => {
        const name = card.querySelector('#name').textContent.toLowerCase();
        // Check if input it's included in name employee
        if (name.includes(input.toLowerCase())) {
            // Show card adding '.show' class
            card.classList.remove('hide');
            card.classList.add('show');
        } else {
            // Hide card adding '.hide' class
            card.classList.remove('show');
            card.classList.add('hide');
        }
    });
}

// Creating search form in '.search-container' div
const form = document.createElement('form');
form.setAttribute('action', '#');
form.setAttribute('method', 'get');

form.innerHTML = `
    <form action="#" method="get">
    <input type="search" id="search-input" name="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

document.querySelector('div .search-container').appendChild(form);

/**
 * Event listener for submit form 
 * preventing default action recharging page 
 * and calling search method with search input value
 */
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    search(e.target.elements['search-input'].value);
})

// Event listener for each card
document.querySelector('body').addEventListener('click', (e) => {
    const cardDiv = e.target.closest('div .card');
    // only if is pressed inside a card's div
    if (cardDiv !== null) {
        const employee = employeesArray.find(employee => employee.id.value === cardDiv.id);
        popModal(employee);
    }
}, true);


/**
 * Fetch employees function with a retry fetch module just in case 
 * there's an error 'Failed to fetch' Commonly appears with randomuser api
 * and only 10 times at max
 * @param {String} url api url to fetch from
 * @param {Integer} attempts times of tries to fetch
 * @param {Boolean} retry false by default and true if need to retry to fetch
 */
function retryFetch (url, attempts, retry = false){
    fetchEmployees(url)
        .then(generateCards.bind())
        .catch(e => {
            attempts++;
            let message = null;
            if (retry === false) {
                // Create <h3> error message element and append.
                message  = document.createElement('h3');
                message.id = 'errorMessage'; 
                message.textContent = "Something went wrong, please wait or recharge the page."
                document.querySelector('body').insertBefore(message, employeesDiv);
            } else {
                // Looking for <h3> error message
                message = document.querySelector('#errorMessage');
            }
            message.style.display = 'inherit';
            // Max 10 attempts in order to doesnt collapse browser
             if( e.message === 'Failed to fetch' && attempts < 10) {
                retryFetch(url,attempts, true);
            }
            console.log(e);
        });
}
// Call to fetch employees info
retryFetch(employeesUrl, 0);