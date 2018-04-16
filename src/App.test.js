const puppetter = require('puppeteer');
const faker = require('faker');

const user = {
  email: faker.internet.email(),
  password: 'test',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName()
};

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    slowMo: 250,
    devtools: true
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {}
};

let server
let page

const logs = [];
const errors = [];

beforeAll( async () => {
  browser = await puppetter.launch(isDebugging());
  page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', interceptedRequest => {
    if(interceptedRequest.url().includes('swapi')) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });
  page.on('console', (e) => logs.push(e));
  page.on('pageerror', (e) => errors.push(e));

  await page.goto('http://localhost:3000/');
  page.setViewport({ width: 500, height: 2400 })
})

describe('on page load', () => {
  test('h1 loads correctly', async () => {
    const html = await page.$eval('.App-title', (e) =>
      e.innerHTML
    );
    expect(html).toBe('Welcome to React');
  }, 16000);

  test('list load correctly', async () => {
    const navbar = await page.$eval('.navbar', (e) => e ? true : false);
    const listItems = await page.$$('.nav-li');

    expect(navbar).toBe(true)
    expect(listItems.length).toBe(3)
  });

  test('login form', async () => {
    await page.click('[data-form="firstName"]')
    await page.type('[data-form="firstName"]', user.firstName)

    await page.click('[data-form="lastName"]')
    await page.type('[data-form="lastName"]', user.lastName)

    await page.click('[data-form="email"]')
    await page.type('[data-form="email"]', user.email)

    await page.click('[data-form="password"]')
    await page.type('[data-form="password"]', user.password)

    await page.click('[data-form="submit"]')

    await page.waitForSelector('[data-type="success"]')
  }, 60000);

  test('sets firstName cookie', async () => {
    const cookies = await page.cookies();
    const firstNameCookie = cookies.find(c => c.name === 'firstName' && c.value === user.firstName);

    expect(firstNameCookie).not.toBeUndefined();
  });

  test.skip('have a console.log', () => {
    expect(logs.length).toBe(1);
  })

  test.skip('have an exceptions', () => {
    expect(errors.length).toBe(2)
  });

  test('request intercept', async () => {
    const message = await page.$eval('[data-type="starWars"]', (e) => e.innerHTML);
    expect(message).toBe('Something went wrong');
  })
})

afterAll(() => {
  if(isDebugging()) {
    browser.close();
  }
})
