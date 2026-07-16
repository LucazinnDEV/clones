const card = document.querySelector(".student-card");
const pdfButton = document.querySelector(".pdf-button");
const editButton = document.querySelector(".edit-button");
const editorPanel = document.querySelector(".editor-panel");
const editorForm = document.querySelector(".editor-form");
const closeEditorButton = document.querySelector(".close-editor");
const clearPhotoButton = document.querySelector(".secondary-button");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
const photoInput = editorForm.elements.photo;
const storageKey = "carteirinha-faculdade-dados";

const defaultData = {
  name: "Lucas Samuel Pereira Alves",
  cpf: "10851318401",
  birth: "12/09/2004",
  course: "Ciência Da Computação",
  institution: "Cesar School",
  code: "4P3QGP69D",
  year: "2026",
  validUntil: "31/03/2027",
  logo: "UFB",
  photo: "",
};

let currentData = loadData();

card.addEventListener("click", () => {
  card.classList.toggle("flipped");
});

pdfButton.addEventListener("click", () => {
  window.print();
});

editButton.addEventListener("click", () => {
  fillForm(currentData);
  editorPanel.hidden = false;
  editorForm.elements.name.focus();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showTab(button.dataset.tab);
  });
});

closeEditorButton.addEventListener("click", closeEditor);

editorPanel.addEventListener("click", (event) => {
  if (event.target === editorPanel) {
    closeEditor();
  }
});

editorForm.addEventListener("input", (event) => {
  if (event.target === photoInput) {
    return;
  }

  currentData = {
    ...currentData,
    ...readForm(),
  };
  renderCard(currentData);
});

photoInput.addEventListener("change", () => {
  const [file] = photoInput.files;

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentData.photo = reader.result;
    renderCard(currentData);
  });
  reader.readAsDataURL(file);
});

clearPhotoButton.addEventListener("click", () => {
  photoInput.value = "";
  currentData.photo = "";
  renderCard(currentData);
});

editorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentData = {
    ...currentData,
    ...readForm(),
  };
  renderCard(currentData);
  saveData(currentData);
  closeEditor();
});

renderCard(currentData);
fillForm(currentData);

function renderCard(data) {
  setText("name", data.name);
  setText("validationName", data.name);
  setText("profileName", data.name);
  setText("cpf", data.cpf);
  setText("validationCpf", data.cpf);
  setText("birth", data.birth);
  setText("validationBirth", data.birth);
  setText("course", data.course);
  setText("validationCourse", data.course);
  setText("institution", data.institution);
  setText("validationInstitution", data.institution);
  setText("profileInstitution", data.institution);
  setText("code", data.code);
  setText("backCode", data.code);
  setText("validationCode", data.code);
  setText("year", data.year);
  setText("validUntil", data.validUntil);
  setText("validationValidUntil", data.validUntil);
  setText("logo", data.logo);
  setText("backName", data.name);
  setText("initials", getInitials(data.name));
  setText("validationInitials", getInitials(data.name));
  setText("profileInitials", getInitials(data.name));

  const firstName = data.name.trim().split(/\s+/)[0] || "Aluno";
  document.querySelector(".greeting").textContent = `Olá, ${firstName}!`;

  const photoTargets = [
    {
      frame: document.querySelector(".student-photo"),
      image: document.querySelector("[data-field='photo']"),
    },
    {
      frame: document.querySelector(".validation-photo"),
      image: document.querySelector("[data-validation-photo]"),
    },
    {
      frame: document.querySelector(".profile-photo"),
      image: document.querySelector("[data-profile-photo]"),
    },
  ];

  photoTargets.forEach(({ frame, image }) => {
    if (!frame || !image) {
      return;
    }

    if (data.photo) {
      image.src = data.photo;
      frame.classList.add("has-photo");
    } else {
      image.removeAttribute("src");
      frame.classList.remove("has-photo");
    }
  });
}

function setText(field, value) {
  document.querySelectorAll(`[data-field='${field}']`).forEach((element) => {
    element.textContent = value;
  });
}

function readForm() {
  return {
    name: editorForm.elements.name.value.trim(),
    cpf: editorForm.elements.cpf.value.trim(),
    birth: editorForm.elements.birth.value.trim(),
    course: editorForm.elements.course.value.trim(),
    institution: editorForm.elements.institution.value.trim(),
    code: editorForm.elements.code.value.trim().toUpperCase(),
    year: editorForm.elements.year.value.trim(),
    validUntil: editorForm.elements.validUntil.value.trim(),
    logo: editorForm.elements.logo.value.trim().toUpperCase(),
  };
}

function fillForm(data) {
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "photo" && editorForm.elements[key]) {
      editorForm.elements[key].value = value;
    }
  });
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "A";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function closeEditor() {
  editorPanel.hidden = true;
}

function showTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === tabName;
    panel.hidden = !isActive;
    panel.classList.toggle("active-panel", isActive);
  });
}

function loadData() {
  try {
    const savedData = JSON.parse(localStorage.getItem(storageKey));
    return {
      ...defaultData,
      ...savedData,
    };
  } catch {
    return { ...defaultData };
  }
}

function saveData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}
