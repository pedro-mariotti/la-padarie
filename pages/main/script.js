const modal = document.getElementById('modal');
const editModal = document.getElementById('editModal');

const form = document.forms['form'];
const editForm = document.forms['editForm'];

const currentYear = document.getElementById('currentYear');

let clientUlElement = document.getElementById('clientList');
// eslint-disable-next-line no-unused-vars
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

async function getFromDb(flag) {
  try {
    const res = await fetch('http://localhost:3000/user');
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    const dbUserList = await res.json();

    clientList = dbUserList.response;
    if (flag) {
      updateHTML(clientList, clientUlElement);
    }

    updateSums(clientList, sumList);
  } catch (err) {
    console.error(err);
  }
}
function updateHTML(clientListParam, clientUlElementParam) {
  if (clientListParam.length > 0) {
    clientListParam.forEach((element) => {
      let newClientElement = document.createElement('li');
      newClientElement.className = 'personCard';
      newClientElement.id = element.id;
      newClientElement.innerHTML = `<div class="personInfo">
              <p id="clientName">${element.name}</p>
              <div>
              <p>
              Total de pães: <span id="breadAmt">${element.bread}</span>
              <span>pães</span>
              </p>
              <p>Total a pagar: R$ <span id="totalPrice">${
                element.bread * 0.5
              }</span></p>
              </div>
              </div>
              <div class="personCardImgs">
              <img src="../../assets/pencil-icon.svg" onclick='getLiId(this)' alt="Edit icon" />
              <img src="../../assets/trash-icon.svg" onclick='deleteClient(this)' alt="Delete icon" />
              </div>`;
      clientUlElementParam.appendChild(newClientElement);
    });
  } else {
    return;
  }
}
getFromDb(true);

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
  // console.log(clientListParam);

  clientListParam.forEach((element) => {
    sumListParam.totalBread += element.bread;
    sumListParam.totalProfit += element.bread * 0.5;
  });
  // saveToBrowser(0, sumListParam, 0);
  totalBreadHTML.innerHTML = sumListParam.totalBread;
  totalClientHTML.innerHTML = sumListParam.totalClient;
  totalMoneyHTML.innerHTML = sumListParam.totalProfit;
}
// function updateId(clientLiListParam) {
//   clientLiListParam.forEach((element, index) => {
//     element.id = index;
//   });
// }

async function createClient(
  newClient,
  clientName,
  breadAmt,
  sumListParam,
  clientListParam
) {
  newClient.className = 'personCard';
  newClient.id = clientListParam[clientListParam.length - 1].id + 1;

  //cria um objeto para uma lista de cliente
  if (breadAmt > 0) {
    // console.log(breadAmt);
    let client = {
      name: clientName,
      bread: Number(breadAmt),
    };
    clientListParam.push(client);
    try {
      await fetch('http://localhost:3000/user', {
        method: 'POST',
        body: JSON.stringify(client),
        headers: {
          'Content-type': 'application/json',
        },
      }).then((response) => {
        if (response.status < 400) {
          newClient.innerHTML = `<div class="personInfo">
          <p id="clientName">${client.name}</p>
          <div>
                  <p>
                  Total de pães: <span id="breadAmt">${client.bread}</span>
                  <span>pães</span>
                  </p>
                  <p>Total a pagar: R$ <span id="totalPrice">${
                    client.bread * 0.5
                  }</span></p>
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
          // saveToBrowser(clientList, 0);

          return newClient;
        } else {
          return false;
        }
      });
    } catch (err) {
      console.error(err);
      return false;
    }
  } else {
    return false;
  }
}

async function updateClient(
  clientId,
  newName,
  newBreadAmt,
  sumListParam,
  clientListParam
) {
  if (newName !== 'undefined' && newBreadAmt > -1) {
    const updatedClient = {
      name: newName,
      bread: newBreadAmt,
      id: clientId,
    };
    // console.log(updatedClient.id);
    try {
      await fetch('http://localhost:3000/user', {
        method: 'PUT',
        body: JSON.stringify(updatedClient),
        headers: {
          'Content-type': 'application/json',
        },
      }).then((response) => {
        if (response.status < 400) {
          const clientObjectIndex = clientListParam.findIndex(
            (item) => item.id == clientId
          );
          // console.log(clientListParam);
          clientListParam[clientObjectIndex].name = newName;
          clientListParam[clientObjectIndex].bread = Number(newBreadAmt);
          const currentClient = document.getElementById(clientId);

          currentClient.innerHTML = `<div class="personInfo">
            <p id="clientName">${clientListParam[clientObjectIndex].name}</p>
            <div>
            <p>
            Total de pães: <span id="breadAmt">${
              clientListParam[clientObjectIndex].bread
            }</span>
            <span>pães</span>
            </p>
            <p>Total a pagar: R$ <span id="totalPrice">${
              clientListParam[clientObjectIndex].bread * 0.5
            }</span></p>
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
          return;
        }
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    return false;
  }
}

// eslint-disable-next-line no-unused-vars
async function deleteClient(HTMLclientParam) {
  const idToDelete = {
    id: HTMLclientParam.parentNode.parentNode.id,
  };
  try {
    // console.log(idToDelete);
    await fetch('http://localhost:3000/user', {
      method: 'DELETE',
      body: JSON.stringify(idToDelete),
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => {
      if (response.status < 400) {
        const clientListIndex = clientList.findIndex(
          (item) => item.id === HTMLclientParam.parentNode.parentNode.id
        );
        clientList.splice(clientListIndex, 1);
        HTMLclientParam.parentNode.parentNode.remove();
        clientLiList = document.querySelectorAll('.personCard');
        updateSums(clientList, sumList);
        // updateId(clientLiList);
      } else {
        return;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// function deleteFirstClient(clientListParam, sumListParam) {
//   const firstClient = document.getElementById('0');

//   clientListParam.shift();

//   updateSums(clientListParam, sumListParam);
//   firstClient.remove();

//   clientLiList = document.querySelectorAll('.personCard');
//   updateId(clientLiList);
//   saveToBrowser(clientList, clientUlElement);
// }

// setInterval(() => {
//   if (clientList.length > 0) {
//     deleteFirstClient(clientList, clientList);
//     saveToBrowser(clientList, clientUlElement);
//   }
// }, 20000);

form.onsubmit = (e) => {
  e.preventDefault();

  if (
    document.form.totBreadInput.value > 0 &&
    document.form.nameInput.value != 'undefined'
  ) {
    let newClientElement = document.createElement('li');

    let newClient = createClient(
      newClientElement,
      document.form.nameInput.value,
      document.form.totBreadInput.value,
      sumList,
      clientList
    );
    newClientElement.innerHTML = newClient.innerHTML;
    clientUlElement.appendChild(newClientElement);
    clientLiList = document.querySelectorAll('.personCard');
    // saveToBrowser(0, clientUlElement);
    closeModal();
  } else {
    alert('Por favor insira um valor válido de pães!');
  }
};

editForm.onsubmit = (e) => {
  e.preventDefault();
  // if (
  //   document.editForm.editNameInput.value > 0 &&
  //   document.editForm.editTotBreadInput.value != 'undefined'
  // ) {
  console.log(
    document.editForm.editNameInput.value,
    document.editForm.editTotBreadInput.value
  );
  updateClient(
    clientToEditId,
    document.editForm.editNameInput.value,
    document.editForm.editTotBreadInput.value,
    sumList,
    clientList
  );
  closeEditModal();
  // } else {
  //   alert('Por favor coloque valores válidos para editar');
  // }
};
