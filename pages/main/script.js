const modal = document.getElementById('modal');
const editModal = document.getElementById('editModal');

const form = document.forms['form'];
const editForm = document.forms['editForm'];

const currentYear = document.getElementById('currentYear');

let clientUlElement = document.getElementById('clientList');
let clientLiList;
let clientToEditId;

const totalClientHTML = document.getElementById('totalClients');
const totalBreadHTML = document.getElementById('totalBread');
const totalMoneyHTML = document.getElementById('totalMoney');

let date = new Date().getFullYear();

let clientList = [];
let sumList = {
  totalClient: 0,
  totalProfit: 0,
  totalBread: 0,
};

currentYear.innerHTML = date;

// (async () => {
//   try {
//     const res = await fetch('http://localhost:3000/user');
//     if (res.status >= 400) {
//       throw new Error('Bad response from server');
//     }

//     const dbUserList = await res.json();
//     console.log(dbUserList);
//   } catch (err) {
//     console.error(err);
//   }
// })();

async function getFromDb() {
  try {
    const res = await fetch('http://localhost:3000/user');
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    const dbUserList = await res.json();

    clientList = dbUserList.response;
    if (sessionStorage.clientUlElement) {
      clientUlElement.innerHTML = sessionStorage.clientUlElement;
    }
    clientLiList = document.querySelectorAll('.personCard');

    updateSums(clientList, sumList);
  } catch (err) {
    console.error(err);
  }
}

getFromDb();

// eslint-disable-next-line no-unused-vars
function saveToBrowser(clientListParam, HTMLClientList) {
  if (typeof Storage !== 'undefined') {
    if (clientListParam !== 0) {
      sessionStorage.clientList = JSON.stringify(clientListParam);
    }
    if (HTMLClientList !== 0) {
      sessionStorage.clientUlElement = HTMLClientList.innerHTML;
    }
  } else {
    console.error('Browser incompativel com armazenamento');
  }
}

// eslint-disable-next-line no-unused-vars
function openModal() {
  modal.style.display = 'flex';
}

// eslint-disable-next-line no-unused-vars
function openEditModal() {
  editModal.style.display = 'flex';
}

// eslint-disable-next-line no-unused-vars
function closeModal() {
  modal.style.display = 'none';
}

// eslint-disable-next-line no-unused-vars
function closeEditModal() {
  editModal.style.display = 'none';
}

// eslint-disable-next-line no-unused-vars
function getLiId(client) {
  openEditModal();
  clientToEditId = client.parentNode.parentNode.id;
}

function updateSums(clientListParam, sumListParam) {
  sumListParam.totalClient = clientListParam.length;
  sumListParam.totalBread = 0;
  sumListParam.totalProfit = 0;

  clientListParam.forEach((element) => {
    sumListParam.totalBread += element.bread;
    sumListParam.totalProfit += element.price;
  });
  saveToBrowser(0, sumListParam, 0);
  totalBreadHTML.innerHTML = sumListParam.totalBread;
  totalClientHTML.innerHTML = sumListParam.totalClient;
  totalMoneyHTML.innerHTML = sumListParam.totalProfit;
}
function updateId(clientLiListParam) {
  clientLiListParam.forEach((element, index) => {
    element.id = index;
  });
}

function createClient(newClient, clientName, breadAmt, sumListParam) {
  newClient.className = 'personCard';

  //cria um objeto para uma lista de cliente
  let client = {
    name: clientName,
    breadAmt: Number(breadAmt),
    price: Number(breadAmt) * 0.5,
  };

  clientList.push(client);

  //coloca o id do elemento html como o index do objeto do array
  newClient.id = clientList.indexOf(client);

  if (breadAmt > 0) {
    newClient.innerHTML = `<div class="personInfo">
      <p id="clientName">${client.name}</p>
      <div>
              <p>
              Total de pães: <span id="breadAmt">${client.breadAmt}</span>
              <span>pães</span>
              </p>
              <p>Total a pagar: R$ <span id="totalPrice">${client.price}</span></p>
              </div>
              </div>
              <div class="personCardImgs">
              <img src="../../assets/pencil-icon.svg" onclick='getLiId(this)' alt="Edit icon" />
              <img src="../../assets/trash-icon.svg" onclick='deleteClient(this)' alt="Delete icon" />
              </div>`;

    if (breadAmt == 1) {
      //edita paes para pao caso so haja um pao
      newClient.childNodes[0].childNodes[3].childNodes[1].childNodes[3].innerHTML =
        'pão';
    }
    updateSums(clientList, sumListParam);
    saveToBrowser(clientList, 0);

    return newClient;
  } else {
    return false;
  }
}

function updateClient(
  clientId,
  newName,
  newBreadAmt,
  sumListParam,
  clientListParam
) {
  if (newName !== 'undefined' && newBreadAmt > -1) {
    clientListParam[clientId].name = newName;
    clientListParam[clientId].breadAmt = Number(newBreadAmt);
    clientListParam[clientId].price = Number(newBreadAmt) * 0.5;

    const currentClient = document.getElementById(clientId);

    currentClient.innerHTML = `<div class="personInfo">
    <p id="clientName">${clientListParam[clientId].name}</p>
    <div>
            <p>
            Total de pães: <span id="breadAmt">${clientListParam[clientId].breadAmt}</span>
            <span>pães</span>
            </p>
            <p>Total a pagar: R$ <span id="totalPrice">${clientListParam[clientId].price}</span></p>
            </div>
            </div>
            <div class="personCardImgs">
            <img src="../../assets/pencil-icon.svg" onclick='getLiId(this)' alt="Edit icon" />
            <img src="../../assets/trash-icon.svg" onclick='deleteClient(this)' alt="Delete icon" />
            </div>`;

    if (newBreadAmt == 1) {
      //edita paes para pao caso so haja um pao
      currentClient.childNodes[0].childNodes[3].childNodes[1].childNodes[3].innerHTML =
        'pão';
    }

    updateSums(clientListParam, sumListParam);
  } else {
    return false;
  }
}

// eslint-disable-next-line no-unused-vars
function deleteClient(HTMLclientParam) {
  clientList.splice(HTMLclientParam.parentNode.parentNode.id, 1);
  HTMLclientParam.parentNode.parentNode.remove();
  clientLiList = document.querySelectorAll('.personCard');
  updateSums(clientList, sumList);
  updateId(clientLiList);
  saveToBrowser(clientList, clientUlElement);
}

function deleteFirstClient(clientListParam, sumListParam) {
  const firstClient = document.getElementById('0');

  clientListParam.shift();

  updateSums(clientListParam, sumListParam);
  firstClient.remove();

  clientLiList = document.querySelectorAll('.personCard');
  updateId(clientLiList);
  saveToBrowser(clientList, clientUlElement);
}

setInterval(() => {
  if (clientList.length > 0) {
    deleteFirstClient(clientList, clientList);
    saveToBrowser(clientList, clientUlElement);
  }
}, 20000);

form.onsubmit = (e) => {
  e.preventDefault();

  let newClientElement = document.createElement('li');

  let newClient = createClient(
    newClientElement,
    document.form.nameInput.value,
    document.form.totBreadInput.value,
    sumList
  );

  if (newClient) {
    newClientElement.innerHTML = newClient.innerHTML;
    clientUlElement.appendChild(newClientElement);
    clientLiList = document.querySelectorAll('.personCard');
    saveToBrowser(0, clientUlElement);
    closeModal();
  } else {
    alert('Por favor insira um valor válido de pães!');
  }
};

editForm.onsubmit = (e) => {
  e.preventDefault();
  if (
    updateClient(
      clientToEditId,
      document.editForm.editNameInput.value,
      document.editForm.editTotBreadInput.value,
      sumList,
      clientList
    ) === false
  ) {
    alert('Por favor coloque valores válidos para editar');
  } else {
    closeEditModal();
    saveToBrowser(clientList, clientUlElement);
  }
};

saveToBrowser(0, clientUlElement);
