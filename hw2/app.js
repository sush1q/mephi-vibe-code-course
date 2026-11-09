const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selection = new Map([
    ['guide', guideChecked],
    ['audio', audioChecked],
    ['catalog', catalogChecked],
  ]);

  const items = services
    .filter((service) => selection.get(service.id))
    .map((service) => {
      const { title, price } = service;
      return { title: title.trim(), price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);
  return { count: items.length, total, items };
}

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;
try {
  data = JSON.parse(sourceJson);

  const { title, date, place, description } = data.event;
  document.title = title;
  document.querySelector('#event-title').textContent = title;
  document.querySelector('#event-date').textContent = date;
  document.querySelector('#event-place').textContent = place;
  document.querySelector('#event-description').textContent = description;

  for (const { id, title } of data.services) {
    document.querySelector(`#${id}-title`).textContent = title.trim();
  }

  serviceForm.hidden = false;
  showProgramButton.addEventListener('click', showProgram);
  serviceForm.addEventListener('submit', submitServices);
} catch {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
}

function showProgram() {
  program.innerHTML = data.event.meeting;
  program.hidden = false;
  showProgramButton.setAttribute('aria-expanded', 'true');
}

function submitServices(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked,
  );

  if (report.count === 0) {
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  const json = JSON.stringify(report);
  JSON.parse(json);

  const resultLines = [
    `Выбрано услуг: ${report.count}`,
    `Итого: ${report.total} руб.`,
  ];
  for (const { title } of report.items) {
    resultLines.push(title);
  }

  choiceError.hidden = true;
  result.innerHTML = resultLines.join('<br>');
  reportJson.textContent = json;
  result.hidden = false;
  reportJson.hidden = false;
}
