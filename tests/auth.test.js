const request = require('supertest');
const app = require('../app');
const sequelize = require('../utils/db');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// Clear the database before running tests
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Close the database connection after running tests
afterAll(async () => {
  await sequelize.close();
});

// Clear any timers
afterEach(() => {
  jest.clearAllTimers();
});

describe('User Registration', () => {
  test('It should register a new user', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    };
    const res = await request(app)
      .post('/users/register')
      .send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', userData.username);
    expect(res.body).toHaveProperty('email', userData.email);
  });

  test('It should return an error if registration fails', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com'
    };
    const res = await request(app)
      .post('/users/register')
      .send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'User registration failed');
  });
});

describe('User Login', () => {

  test('It should log in with correct credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    const res = await request(app)
      .post('/users/login')
      .send(loginData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('It should return an error for invalid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'wrongpassword'
    };
    const res = await request(app)
      .post('/users/login')
      .send(loginData);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});

describe('User Profile', () => {
  let token;

  // Log in before testing profile
  beforeAll(async () => {
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    const res = await request(app)
      .post('/users/login')
      .send(loginData);
    token = res.body.token;
  });

  test('It should fetch the profile of the logged-in user', async () => {
    const res = await request(app)
      .get('/users/profile')
      .set('authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).not.toHaveProperty('password');
  });

  // test('It should return an error if user is not found', async () => {
  //   // Generate a fake user ID that doesn't exist in the database
  //   const res = await request(app)
  //     .get(`/users/profile`)
  //     .set('authorization',token);
  //   expect(res.statusCode).toBe(404);
  //   expect(res.body).toHaveProperty('error', 'User not found');
  // });
});

describe('Item Controller', () => {
  // Test data
  const testData = {
    name: 'Test Item',
    description: 'Test description',
    starting_price: "10",
    end_time: new Date().toISOString(),
  };


  let itemId;
  let token;

  // Log in before testing item creation
  beforeAll(async () => {
    // Perform login and obtain token
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    const res = await request(app)
      .post('/users/login')
      .send(loginData);
    token = res.body.token;
  });

  test('It should create a new item', async () => {
    const response = await request(app)
      .post('/items')
      .set('authorization', token)
      .send(testData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(testData);

    itemId = response.body.id;
  });

  test('It should retrieve all items', async () => {
    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.rows)).toBe(true);
    expect(response.body.rows.length).toBeGreaterThan(0);
  });

  test('It should retrieve a specific item by ID', async () => {
    const response = await request(app).get(`/items/${itemId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(testData);
  });

  test('It should update an existing item', async () => {
    const updatedData = {
      name: 'Updated Item',
      description: 'Updated description',
      starting_price: 20,
      end_time: new Date().toISOString(),
    };

    const response = await request(app)
      .put(`/items/${itemId}`)
      .set('authorization', token)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);
  });

  test('It should delete an existing item', async () => {
    const response = await request(app).delete(`/items/${itemId}`).set('authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item successfully deleted');
  });
});

describe('Bid Controller', () => {
  let itemId;
  let token;

  // Log in before testing
  beforeAll(async () => {
    // Log in with a test user and obtain token
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    const res = await request(app)
      .post('/users/login')
      .send(loginData);
    token = res.body.token;
  });

  // Create an item before testing bid-related operations
  beforeAll(async () => {
    const testData = {
      name: 'Test Item',
      description: 'Test description',
      starting_price: 10,
      end_time: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/items')
      .set('authorization', token)
      .send(testData);

    itemId = response.body.id;
  });


  describe('Place Bid', () => {
    // test('It should place a new bid on an item', async () => {
    //   const bidData = {
    //     bid_amount: 15 // Higher than the initial price
    //   };

    //   const res = await request(app)
    //     .post(`/items/${itemId}/bids`)
    //     .set('authorization', token)
    //     .send(bidData);

    //   expect(res.status).toBe(201);
    //   expect(res.body).toHaveProperty('id');

    //   const item = await Item.findByPk(itemId);
    //   expect(parseFloat(item.current_price)).toBe(15); // Check if item's current price updated
    // });

    test('It should return an error if bid amount is not higher than current price', async () => {
      const bidData = {
        bid_amount: 5 // Lower than the initial price
      };

      const res = await request(app)
        .post(`/items/${itemId}/bids`)
        .set('authorization', token)
        .send(bidData);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('It should return an error if item is not found', async () => {
      const bidData = {
        bid_amount: 20
      };

      const res = await request(app)
        .get(`/items/99/bids`) // Non-existent item ID

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No bids found for this item');
    });
  });

  // describe('Get Bids', () => {
  //   test('It should retrieve bids for a specific item', async () => {
  //     const res = await request(app)
  //       .get(`/items/${itemId2}/bids`)

  //     expect(res.status).toBe(200);
  //     expect(res.body).toHaveProperty('bids');
  //     expect(res.body.bids).toHaveLength(0); // Assuming no bids initially
  //   });
  // });


});

describe('Notification Controller', () => {
  let token;

  // Log in before testing
  beforeAll(async () => {
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    const res = await request(app)
      .post('/users/login')
      .send(loginData);
    token = res.body.token;
  });

  let ids;

  test('It should retrieve notifications for the logged-in user', async () => {
    const expectedProperties = ['id', 'is_read', 'message', 'user_id'];
    const res = await request(app)
      .get('/notifications')
      .set('authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    ids = res.body.map(notification => notification.id);

    // Assert that each notification in the response body has the expected properties
    res.body.forEach(notification => {
      expect(Object.keys(notification)).toEqual(expect.arrayContaining(expectedProperties));
    });
  });
  test('It should mark notifications as read', async () => {
    const res = await request(app)
      .post('/notifications/mark-read')
      .set('authorization', token)
      .send({ ids });

    expect(res.statusCode).toBe(200);

    const updatedNotifications = res.body.notifications;

    updatedNotifications.forEach(notification => {
      expect(notification.is_read).toBe(true);
    });
  });
});
