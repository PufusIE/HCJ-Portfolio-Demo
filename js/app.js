(function (app) {
  'use strict';
  const pageElements = {};
  app.portfolioItems = [];
  app.selectedItem = {};
  app.portfolioPageElements = {};

  app.homeStartup = function () {
    setCopyright();
    pageElements.contactForm = document.getElementById('email-form');
    pageElements.formLink = document.getElementById('show-form');

    pageElements.formLink.addEventListener('click', showForm);
    pageElements.contactForm.addEventListener('submit', sendEmail);
  };

  function showForm(e) {
    e.preventDefault();
    pageElements.contactForm.classList.toggle('vis-form');
  }

  function sendEmail(e) {
    e.preventDefault();

    const form = pageElements.contactForm;
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    console.log(message);

    const mailTo = `mailto:Ally@alison.com?subject=Email from ${name.value}, ${email.value}&body=${message.value}`;

    window.open(mailTo);

    // window.location.href =
    //   `mailto:Ally@alison.com?subject=&body=${document.getElementById('email').innerText}`;
  }

  app.portfolioStartup = async function () {
    setCopyright();
    await loadCache();
    addHeaders();
    populatePortfolio();
  };

  function populatePortfolio() {
    let inverted = 0;
    app.portfolioItems.forEach((e) => {
      createSection(e, inverted);
      inverted++;
    });
  }

  function addHeaders() {
    let itemNumber = app.portfolioItems.length;
    app.portfolioPageElements.nav = document.querySelector('ul');

    for (let i = 0; i < itemNumber; i++) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `workitem.html?item=${i + 1}`;
      a.innerText = app.portfolioItems[i].itemNumber;
      li.appendChild(a);

      app.portfolioPageElements.nav.appendChild(li);
    }
  }

  function createSection(e, inverted) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('highlight');
    if (inverted % 2 !== 0) {
      mainDiv.classList.add('inverted');
    }

    const infoDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    const header = e.title.split(' ');
    h2.innerHTML += `0${inverted + 1}. ${header[0]}<br />${
      header[1] === undefined ? '' : header[1]
    }<br />${header[2] === undefined ? '' : header[2]}`;

    infoDiv.appendChild(h2);

    const a = document.createElement('a');
    a.href = `workitem.html?item=${inverted + 1}`;
    a.innerText = 'see more';
    infoDiv.appendChild(a);
    mainDiv.appendChild(infoDiv);

    const img = document.createElement('img');
    img.src = e.smallImage;
    img.alt = e.smallImageAlt;
    mainDiv.appendChild(img);
    document.querySelector('main').appendChild(mainDiv);
  }

  app.workitemStartup = async function () {
    setCopyright();
    await loadCache();

    loadSpecificItem();
    populatePage();
    addHeaders();
    renderPage();
  };

  async function loadCache() {
    const cacheData = sessionStorage.getItem('site-data');

    if (cacheData !== null) {
      app.portfolioItems = JSON.parse(cacheData);
    } else {
      const rawData = await fetch('../sitedata.json');
      console.log(rawData);
      const data = await rawData.json();
      console.log(data);
      app.portfolioItems = data;
      console.log(app.portfolioItems);
      sessionStorage.setItem('site-data', JSON.stringify(data));
    }
  }

  function loadSpecificItem() {
    const params = new URL(document.location).searchParams;
    let item = Number.parseInt(params.get('item'));

    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    }
    app.selectedItem = app.portfolioItems[item - 1];
    pageElements.id = item;
  }

  async function populatePage() {
    const hero = document.getElementById('work-item');
    const info = document.getElementById('project-infi');
    const challenges = document.getElementById('project-challenges');
    pageElements.heroHead = hero.querySelector('h1');
    pageElements.heroImage = hero.querySelector('img');
    pageElements.project = info.querySelector('p');
    pageElements.techSection = document.querySelector(
      '#project-technologies div'
    );
    pageElements.chal = challenges.querySelector('p');
  }

  async function renderPage() {
    pageElements.heroHead.innerText = app.selectedItem.title;
    pageElements.heroImage.src = app.selectedItem.largeImage;
    pageElements.project.innerText = app.selectedItem.projectText;
    const list = document.querySelector('#tech-list');

    const ul = document.createElement('ul');
    app.selectedItem.technologiesList.forEach((e) => {
      const li = document.createElement('li');
      li.innerText = e;
      ul.appendChild(li);
    });
    list.remove();
    pageElements.techSection.appendChild(ul);
    pageElements.chal.innerText = app.selectedItem.challengestText;
  }

  function setCopyright() {
    pageElements.copyrightDate = document.getElementById('cr-date');
    pageElements.copyrightDate.innerText = new Date().getFullYear();
  }
})((window.app = window.app || {}));
