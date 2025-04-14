const events = []; // Mảng chứa các đối tượng sự kiện
const eventName = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const eventOrganizer = document.getElementById("eventOrganizer");
const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");
const searchEventName = document.getElementById("searchEventName");

function addEventRow(eventName, eventDate, eventLocation, eventOrganizer) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${eventName}</td>
        <td>${eventDate}</td>
        <td>${eventLocation}</td>
        <td>${eventOrganizer}</td>
        <td>
            <button class="edit">Sửa</button>
            <button class="delete">Xóa</button>
        </td>
    `;
    eventList.appendChild(newRow);

    attachEventListenersToRow(newRow);
}

addEventBtn.addEventListener("click", () => {
    const validName = validateInput(eventName, "Không được để trống");
    const validDate = validateInput(eventDate, "Vui lòng chọn ngày");
    const validLocation = validateInput(eventLocation, "Không được để trống");
    const validOrganizer = validateInput(eventOrganizer, "Không được để trống");

    if (!validName || !validDate || !validLocation || !validOrganizer) return;

    const newEvent = {
        name: eventName.value,
        date: eventDate.value,
        location: eventLocation.value,
        organizer: eventOrganizer.value,
    };

    events.push(newEvent);

    addEventRow(eventName.value, eventDate.value, eventLocation.value, eventOrganizer.value);

    [eventName, eventDate, eventLocation, eventOrganizer].forEach(input => input.value = "");
    addEventBtn.textContent = "Thêm sự kiện"; 
});

function attachEventListenersToRow(row) {
    row.querySelector(".delete").addEventListener("click", () => {
        showConfirmModal("Bạn có chắc chắn muốn xóa sự kiện này không?").then((confirm) => {
            if (confirm) {
                const eventNameToDelete = row.children[0].textContent;
                const eventIndex = events.findIndex(event => event.name === eventNameToDelete);

                if (eventIndex !== -1) {
                    events.splice(eventIndex, 1);
                }

                eventList.removeChild(row);
            }
        });
    });

    row.querySelector(".edit").addEventListener("click", () => {
        showConfirmModal("Bạn có chắc chắn muốn sửa sự kiện này không?").then((confirm) => {
            if (confirm) {
                const replaces = Array.from(row.children).slice(0, 4);
                addEventBtn.textContent = "Sửa sự kiện";

                const oldEventName = replaces[0].textContent;
                const eventIndex = events.findIndex(event => event.name === oldEventName);

                [eventName.value, eventDate.value, eventLocation.value, eventOrganizer.value] =
                    replaces.map(replace => replace.textContent);

                if (eventIndex !== -1) {
                    events.splice(eventIndex, 1);
                }

                eventList.removeChild(row);
            }
        });
    });
}

searchEventName.addEventListener("input", () => {
    const searchValue = searchEventName.value.trim().toLowerCase();
    eventList.querySelectorAll("tr").forEach(row => {
        const name = row.children[0]?.textContent.toLowerCase();
        row.style.display = name.includes(searchValue) ? "" : "none";
    });
});

function showConfirmModal(message) {
    return new Promise((resolve) => {
        const modalEl = document.getElementById("confirmModal");
        const modal = new bootstrap.Modal(modalEl);
        modalEl.querySelector(".confirm-message").textContent = message;

        const yesBtn = modalEl.querySelector(".confirm-yes");
        const noBtn = modalEl.querySelector(".confirm-no");

        const choiceYes = () => {
            resolve(true);
            modal.hide();
            yesBtn.removeEventListener("click", choiceYes);
            noBtn.removeEventListener("click", choiceNo);
        };

        const choiceNo = () => {
            resolve(false);
            modal.hide();
            yesBtn.removeEventListener("click", choiceYes);
            noBtn.removeEventListener("click", choiceNo);
        };

        yesBtn.addEventListener("click", choiceYes);
        noBtn.addEventListener("click", choiceNo);

        modal.show();
    });
}

function validateInput(input, message) {
    input.classList.remove("input-error");
    input.parentNode.querySelector(".error-message")?.remove();

    if (!input.value.trim()) {
        input.classList.add("input-error");
        const error = document.createElement("div");
        error.className = "error-message";
        error.textContent = message;
        input.parentNode.appendChild(error);
        return false;
    }
    return true;
}
console.log(events);