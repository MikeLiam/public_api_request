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
 * Create and append a new 'tag' element with the given attributes to a parent element passed.
 * @param {HTMLElement} parent element where appends the new element
 * @param {String} tag tag name for new element
 * @param {Array} attributes array of attributes with pair key/value for each one
 */
function generateElement(parent, tag, attributes) {
    const element = document.createElement(tag);
    if (attributes !== null) {
        attributes.forEach(attribute => {
            element[attribute.key] = attribute.value;
        });
    }
    parent.appendChild(element);
    return element;
}

/**
 * Create a card with image, name, email and location of each employee and append them to 
 * #gallery div
 * @param {Array} data Array with 12 'employee' objects
 */
function generateCards(data) {
    data.map(employee => {
        employeesArray.push(employee);
        // General card div for each employee
        const card = generateElement(employeesDiv, 'div', [{
                key: "id",
                value: `${employee.id.value}`
            },
            {
                key: "className",
                value: "card"
            }
        ]);
        // Image div container
        const cardImage = generateElement(card, 'div', [{
            key: "className",
            value: "card-img-container"
        }]);
        // Image element
        generateElement(cardImage, 'img', [{
                key: "className",
                value: "card-img"
            },
            {
                key: "src",
                value: `${employee.picture.thumbnail}`
            },
            {
                key: "alt",
                value: "profile picture"
            },
        ]);
        // Info div container
        const cardInfo = generateElement(card, 'div', [{
            key: "className",
            value: "card-info-container"
        }]);
        // Name element
        generateElement(cardInfo, 'h3', [{
                key: "id",
                value: "name"
            },
            {
                key: "className",
                value: "card-name cap"
            },
            {
                key: "textContent",
                value: `${employee.name.first} ${employee.name.last}`
            }
        ]);
        // Email element
        generateElement(cardInfo, 'p', [{
                key: "className",
                value: "card-text"
            },
            {
                key: "textContent",
                value: `${employee.email}`
            }
        ]);
        // Location element
        generateElement(cardInfo, 'p', [{
                key: "className",
                value: "card-text cap"
            },
            {
                key: "textContent",
                value: `${employee.location.city}, ${employee.location.state}`
            }
        ]);
    })
}


function popModal(employee) {
    const modalContainer = generateElement(employeesDiv.parentNode, 'div', [{
        key: "className",
        value: "modal-container"
    }]);
    const modal = generateElement(modalContainer, 'div', [{
        key: "className",
        value: "modal"
    }]);
    generateElement(modal, 'button', [{
            key: "type",
            value: "button"
        },
        {
            key: "className",
            value: "modal-close-btn"
        },
        {
            key: "id",
            value: "modal-close-btn"
        },
        {
            key: "innerHtml",
            value: '<strong>X</strong>'
        },

    ]);
    const infoContainer = generateElement(modal, 'div', [{
        key: "className",
        value: "modal-info-container"
    }]);
    // Image element
    generateElement(infoContainer, 'img', [{
            key: "className",
            value: "modal-img"
        },
        {
            key: "src",
            value: `${employee.picture.thumbnail}`
        },
        {
            key: "alt",
            value: "profile picture"
        },
    ]);
    // Name element
    generateElement(infoContainer, 'h3', [{
            key: "id",
            value: "name"
        },
        {
            key: "className",
            value: "modal-name cap"
        },
        {
            key: "textContent",
            value: `${employee.name.first} ${employee.name.last}`
        }
    ]);
    // Email element
    generateElement(infoContainer, 'p', [{
            key: "className",
            value: "modal-text"
        },
        {
            key: "textContent",
            value: `${employee.email}`
        }
    ]);
    // Location element
    generateElement(infoContainer, 'p', [{
            key: "className",
            value: "modal-text cap"
        },
        {
            key: "textContent",
            value: `${employee.location.city}`
        }
    ]);
    generateElement(infoContainer, 'hr', null);

    generateElement(infoContainer, 'p', [{
        key: "className",
        value: "modal-text"
    },
    {
        key: "textContent",
        value: `${employee.cell}`
    }
]);
generateElement(infoContainer, 'p', [{
    key: "className",
    value: "modal-text"
},
{
    key: "textContent",
    value: `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state}, ${employee.location.postcode}`
}
]);
generateElement(infoContainer, 'p', [{
    key: "className",
    value: "modal-text"
},
{
    key: "textContent",
    value: `${employee.dob.date.split('T')[0].replace(/([0-9]+)\-([0-9]+)\-([0-9]+)/,"$3-$2-$1")}`
}
]);
    const modalBtn = generateElement(modalContainer, 'div', [{
        key: "className",
        value: "modal-bt-container"
    }]);
    generateElement(modalBtn, 'button', [{
        key: "type",
        value: "button"
    },
    {
        key: "className",
        value: "modal-prev"
    },
    {
        key: "id",
        value: "modal-prev"
    },
    {
        key: "textContent",
        value: 'Prev'
    },

]);
generateElement(modalBtn, 'button', [{
    key: "type",
    value: "button"
},
{
    key: "className",
    value: "modal-next"
},
{
    key: "id",
    value: "modal-next"
},
{
    key: "textContent",
    value: 'Next'
},

]);
}
/* 
<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
            <h3 id="name" class="modal-name cap">name</h3>
            <p class="modal-text">email</p>
            <p class="modal-text cap">city</p>
            <hr>
            <p class="modal-text">(555) 555-5555</p>
            <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
            <p class="modal-text">Birthday: 10/21/2015</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
</div> */


// Event listener for each card
document.querySelector('body').addEventListener('click', (e) => {

    const cardDiv = e.target.closest('div .card');
    if (cardDiv !== null) {
        console.log(cardDiv.id)
        const employee = employeesArray.find(employee => employee.id.value === cardDiv.id);
        console.log(employee);
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