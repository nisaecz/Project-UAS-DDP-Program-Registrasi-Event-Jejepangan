const readlineSync = require("readline-sync");
const { format, addDays, parseISO } = require("date-fns");
const fs = require("fs");

const dataFile = "data.json";

function displayMenu() {
  console.log(`
Program Registrasi Event Jejepangan
===================================
1. Tambah Event
2. Cari Event
3. Hapus Event
4. Tambah Cosplayer
5. Cari Cosplayer
6. Hapus Cosplayer
7. Tambah Cosplayer ke Event
8. Cari Cosplayer dalam Event
9. Hapus Cosplayer dalam Event
10. Event yang akan diadakan dalam 7 hari mendatang
11. Keluar
`);
}

function main() {
  let choice;
  do {
    displayMenu();
    choice = readlineSync.question("Pilih Menu [1-11]: ");

    switch (choice) {
      case "1":
        addEvent();
        break;
      case "2":
        findEvent();
        break;
      case "3":
        removeEvent();
        break;
      case "4":
        addCosplayer();
        break;
      case "5":
        findCosplayer();
        break;
      case "6":
        removeCosplayer();
        break;
      case "7":
        addCosplayerToEvent();
        break;
      case "8":
        findCosplayersInEvent();
        break;
      case "9":
        removeCosplayerInEvent();
        break;
      case "10":
        upcomingEvents();
        break;
      case "11":
        console.log("Terima kasih!");
        break;
      default:
        console.log("Pilihan tidak valid. Silakan pilih lagi.");
    }
  } while (choice !== "11");
}

function loadData() {
  try {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { events: [], cosplayers: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
}

function addEvent() {
  console.log("Tambah Event");
  const eventName = readlineSync.question("Nama Event: ");
  const eventDate = readlineSync.question("Tanggal Event (YYYY-MM-DD): ");
  const eventLocation = readlineSync.question("Lokasi Event: ");

  const event = { name: eventName, date: eventDate, location: eventLocation };

  const data = loadData();
  data.events.push(event);
  saveData(data);

  console.log("Event berhasil ditambahkan!");
}

function findEvent() {
  console.log("Cari Event");
  const eventName = readlineSync.question("Masukan nama event: ");

  const data = loadData();
  const foundEvent = data.events.find((event) => event.name === eventName);

  if (foundEvent) {
    console.log("Event ditemukan!");
    console.log(`Nama Event: ${foundEvent.name}`);
    console.log(`Tanggal Event: ${foundEvent.date}`);
    console.log(`Lokasi Event: ${foundEvent.location}`);
  } else {
    console.log("Event tidak ditemukan.");
  }
}

function removeEvent() {
  console.log("Hapus Event");
  const data = loadData();
  if (data.events.length === 0) {
    console.log("Tidak ada event yang dapat dihapus.");
    return;
  }

  console.log("Daftar Event:");
  data.events.forEach((event, index) => {
    console.log(`${index + 1}. ${event.name}`);
  });

  const selectedEventIndex = readlineSync.questionInt(
    `Pilih Event yang akan dihapus [1-${data.events.length}]: `,
    {
      limit: (input) => input >= 1 && input <= data.events.length,
    }
  );

  const removedEvent = data.events.splice(selectedEventIndex - 1, 1)[0];
  saveData(data);

  console.log(`Event "${removedEvent.name}" berhasil dihapus!`);
}

function addCosplayer() {
  console.log("Tambah Cosplayer");
  const cosplayerName = readlineSync.question("Nama Cosplayer: ");
  const characterName = readlineSync.question("Nama Karakter: ");
  const animeName = readlineSync.question("Nama Anime: ");

  const cosplayer = {
    name: cosplayerName,
    character: characterName,
    anime: animeName,
  };

  const data = loadData();
  data.cosplayers.push(cosplayer);
  saveData(data);

  console.log("Cosplayer berhasil ditambahkan!");
}

function findCosplayer() {
  console.log("Cari Cosplayer");
  const cosplayerName = readlineSync.question("Masukan nama cosplayer: ");

  const data = loadData();
  const foundCosplayer = data.cosplayers.find(
    (cosplayer) => cosplayer.name === cosplayerName
  );

  if (foundCosplayer) {
    console.log("Cosplayer ditemukan!");
    console.log(`Nama Cosplayer: ${foundCosplayer.name}`);
    console.log(`Nama Karakter: ${foundCosplayer.character}`);
    console.log(`Nama Anime: ${foundCosplayer.anime}`);
  } else {
    console.log("Cosplayer tidak ditemukan.");
  }
}

function removeCosplayer() {
  console.log("Hapus Cosplayer");
  const data = loadData();
  if (data.cosplayers.length === 0) {
    console.log("Tidak ada cosplayer yang dapat dihapus.");
    return;
  }

  console.log("Daftar Cosplayer:");
  data.cosplayers.forEach((cosplayer, index) => {
    console.log(`${index + 1}. ${cosplayer.name}`);
  });

  const selectedCosplayerIndex = readlineSync.questionInt(
    `Pilih Cosplayer yang akan dihapus [1-${data.cosplayers.length}]: `,
    {
      limit: (input) => input >= 1 && input <= data.cosplayers.length,
    }
  );

  const removedCosplayer = data.cosplayers.splice(
    selectedCosplayerIndex - 1,
    1
  )[0];
  saveData(data);

  console.log(`Cosplayer "${removedCosplayer.name}" berhasil dihapus!`);
}

function addCosplayerToEvent() {
  console.log("Tambah Cosplayer ke Event");
  const data = loadData();
  if (data.cosplayers.length === 0 || data.events.length === 0) {
    console.log("Tidak ada cosplayer atau event yang tersedia.");
    return;
  }

  console.log("Daftar Cosplayer:");
  data.cosplayers.forEach((cosplayer, index) => {
    console.log(`${index + 1}. ${cosplayer.name}`);
  });

  const selectedCosplayerIndex = readlineSync.questionInt(
    `Pilih Cosplayer yang akan ditambahkan ke event [1-${data.cosplayers.length}]: `,
    {
      limit: (input) => input >= 1 && input <= data.cosplayers.length,
    }
  );

  console.log("Daftar Event:");
  data.events.forEach((event, index) => {
    console.log(`${index + 1}. ${event.name}`);
  });

  const selectedEventIndex = readlineSync.questionInt(
    `Pilih Event yang akan ditambahkan cosplayer [1-${data.events.length}]: `,
    {
      limit: (input) => input >= 1 && input <= data.events.length,
    }
  );

  const cosplayerName = data.cosplayers[selectedCosplayerIndex - 1].name;
  const eventName = data.events[selectedEventIndex - 1].name;

  addCosplayerToEventByName(cosplayerName, eventName);

  console.log(
    `Cosplayer "${cosplayerName}" berhasil ditambahkan ke event "${eventName}"!`
  );
}

function addCosplayerToEventByName(cosplayerName, eventName) {
  const data = loadData();
  const event = data.events.find((event) => event.name === eventName);
  const cosplayer = data.cosplayers.find(
    (cosplayer) => cosplayer.name === cosplayerName
  );

  if (event && cosplayer) {
    if (!event.cosplayers) event.cosplayers = [];
    event.cosplayers.push(cosplayer);
    saveData(data);
  }
}

function findCosplayersInEvent() {
  console.log("Cari Cosplayer dalam Event");
  const data = loadData();
  if (data.events.length === 0) {
    console.log("Tidak ada event yang tersedia.");
    return;
  }

  console.log("Daftar Event:");
  data.events.forEach((event, index) => {
    console.log(`${index + 1}. ${event.name}`);
  });

  const selectedEventIndex = readlineSync.questionInt(
    `Pilih Event untuk mencari cosplayer [1-${data.events.length}]: `,
    {
      limit: (input) => input >= 1 && input <= data.events.length,
    }
  );

  const eventName = data.events[selectedEventIndex - 1].name;
  const cosplayersInEvent = findCosplayersInEventByName(eventName);

  console.log(`Cosplayers dalam event "${eventName}":`);
  cosplayersInEvent.forEach((cosplayer) => {
    console.log(
      `${cosplayer.name} - ${cosplayer.character} (${cosplayer.anime})`
    );
  });
}

function findCosplayersInEventByName(eventName) {
  const data = loadData();
  const event = data.events.find((event) => event.name === eventName);
  return event ? event.cosplayers : [];
}

function removeCosplayerInEvent() {
  console.log("Hapus Cosplayer dalam Event");
  const data = loadData();
  if (data.events.length === 0) {
    console.log("Tidak ada event yang tersedia.");
    return;
  }

  console.log("Daftar Event:");
  data.events.forEach((event, index) => {
    console.log(`${index + 1}. ${event.name}`);
  });

  const selectedEventIndex = readlineSync.questionInt(
    `Pilih Event untuk menghapus cosplayer [1-${data.events.length}]: `,
    {
      limit: (input) => input >= 1 && input <= data.events.length,
    }
  );

  const eventName = data.events[selectedEventIndex - 1].name;
  const cosplayersInEvent = findCosplayersInEventByName(eventName);

  if (cosplayersInEvent.length === 0) {
    console.log(`Tidak ada cosplayer dalam event "${eventName}".`);
    return;
  }

  console.log(`Daftar Cosplayer dalam event "${eventName}":`);
  cosplayersInEvent.forEach((cosplayer, index) => {
    console.log(`${index + 1}. ${cosplayer.name}`);
  });

  const selectedCosplayerIndex = readlineSync.questionInt(
    `Pilih Cosplayer yang akan dihapus dalam event [1-${cosplayersInEvent.length}]: `,
    {
      limit: (input) => input >= 1 && input <= cosplayersInEvent.length,
    }
  );

  const cosplayerName = cosplayersInEvent[selectedCosplayerIndex - 1].name;

  removeCosplayerInEventByName(cosplayerName, eventName);

  console.log(
    `Cosplayer "${cosplayerName}" berhasil dihapus dalam event "${eventName}"!`
  );
}

function removeCosplayerInEventByName(cosplayerName, eventName) {
  const data = loadData();
  const event = data.events.find((event) => event.name === eventName);

  if (event && event.cosplayers) {
    event.cosplayers = event.cosplayers.filter(
      (cosplayer) => cosplayer.name !== cosplayerName
    );
    saveData(data);
  }
}

function upcomingEvents() {
  console.log("Event yang akan diadakan dalam 7 hari mendatang adalah:");
  const upcomingEvents = getUpcomingEvents();
  upcomingEvents.forEach((event, index) => {
    console.log(`${index + 1}. ${event.name} - ${event.date}`);
  });
}

function getUpcomingEvents() {
  const data = loadData();
  const today = new Date();
  const sevenDaysLater = addDays(today, 7);

  return data.events.filter((event) => parseISO(event.date) <= sevenDaysLater);
}

main();
