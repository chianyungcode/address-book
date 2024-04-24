const getId = () => {
  const params = new URLSearchParams(document.location.search);
  const dataId = params.get("id");

  return parseInt(dataId, 10);
};

const getContact = () => {
  const contactsData = JSON.parse(localStorage.getItem("contacts") || []);
  const id = getId();

  const contactIndex = contactsData.findIndex((data) => data.id === id);
  if (contactIndex !== -1) {
    console.log(contactsData[contactIndex]);
  } else {
    console.log("Kontak tidak ditemukan");
  }

  return contactsData[contactIndex];
};

const showDataDOM = () => {
  const contact = getContact();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      addDataToDOM(contact);
    });
  } else {
    addDataToDOM(contact);
  }
};

function addDataToDOM(data) {
  const inputs = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    address: document.getElementById("address"),
    phone: document.getElementById("phone"),
    age: document.getElementById("age"),
  };

  Object.keys(inputs).forEach((key) => {
    inputs[key].value = data[key];
  });

  const saveButton = document.querySelector(".button-save");
  saveButton.removeEventListener("click", handleSaveClick);
  saveButton.addEventListener("click", handleSaveClick);

  function handleSaveClick(e) {
    e.preventDefault();

    const dataToUpdate = {
      id: data.id,
      name: inputs.name.value,
      email: inputs.email.value,
      address: inputs.address.value,
      phone: inputs.phone.value,
      age: inputs.age.value,
    };

    updateLocalStorage(dataToUpdate);
    window.location.href = "/";
  }
}

function updateLocalStorage(updatedData) {
  const contactsData = JSON.parse(localStorage.getItem("contacts") || "[]");
  const contactIndex = contactsData.findIndex(
    (contact) => contact.id === updatedData.id
  );

  if (contactIndex !== -1) {
    contactsData[contactIndex] = updatedData;
    localStorage.setItem("contacts", JSON.stringify(contactsData));
    console.log("Data berhasil diperbarui");
  } else {
    console.log("Kontak tidak ditemukan");
  }
}

document.addEventListener("DOMContentLoaded", showDataDOM);
