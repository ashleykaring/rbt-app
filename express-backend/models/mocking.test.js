// example partial testing suite with Jest mock lib and Mockingoose
import mongoose from "mongoose";
import mockingoose from "mockingoose";
import { jest } from '@jest/globals';
import * as UserServices from "./user-services.js";
import { userSchema } from "./user"; 
import { entrySchema } from "./user";

let userModel;

beforeAll(async () => {
  userModel = mongoose.model("User", userSchema);
  entryModel = mongoose.model("Entry", entrySchema)
});
  
afterAll(async () => {
  
});
  
beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});
  
afterEach(async () => {
    
});
  
test("Adding user -- successful path", async () => {
  const mockEntryId = new mongoose.Types.ObjectId();

  const addedUser = {
    username: "jackie_chan",
    password: "password",
    first_name: "Jackie",
    entries: mockEntryId,
    groups: [new mongoose.Types.ObjectId()]
  };

  const toBeAdded = {
    username: "Jackie Chan",
    first_name: "Jackie"
  };

  // mock addUserEntries w/in addUser
  const mockAddUserEntries = jest.fn().mockResolvedValue(mockEntryId);
  // replace original with mocked one to use for testing
  // global to access the function
  const originalAddUserEntries = global.addUserEntries;
  global.addUserEntries = mockAddUserEntries;

  // mock save method
  mockingoose(userModel).toReturn(addedUser, 'save');

  const result = await UserServices.addUser(toBeAdded);

  expect(result).toBeTruthy();
  expect(result.username).toBe(toBeAdded.username);
  expect(result.first_name).toBe(toBeAdded.first_name);
  expect(result).toHaveProperty("_id");

  // reset
  global.addUserEntries = originalAddUserEntries;
});

test("User with empty groups array", async () => {
  const mockEntryId = new mongoose.Types.ObjectId();

  const addedUser = {
    username: "solana_rowe",
    password: "password1",
    first_name: "Solana",
    entries: mockEntryId,
    groups: []
  };

  const toBeAdded = {
    username: "solana_rowe",
    first_name: "Solana"
  };

  const mockAddUserEntries = jest.fn().mockResolvedValue(mockEntryId);
  // replace function w/ mock again
  const originalAddUserEntries = global.addUserEntries;
  global.addUserEntries = mockAddUserEntries;

  // mock save method
  mockingoose(userModel).toReturn(addedUser, 'save');

  const result = await UserServices.addUser(toBeAdded);

  expect(result).toBeTruthy();
  expect(result.username).toBe(toBeAdded.username);
  expect(result.first_name).toBe(toBeAdded.first_name);
  expect(result.groups).toEqual([]);  // make sure groups array is empty
  expect(result).toHaveProperty('_id');  // ensure there's an _id

  // reset
  global.addUserEntries = originalAddUserEntries;
});

// TEST
test("User", async () => {

  const mockFunction = jest.fn();
  mockFunction('some argument');
  expect(mockFunction).toHaveBeenCalledTimes(1);  // checks if it was called once
  expect(mockFunction).toHaveBeenCalledWith('some argument');  // checks if it was called with the given argument

  expect(userModel.save.mock.calls.length).toBe(1);
  expect(userModel.save).toHaveBeenCalledWith(toBeAdded);
});

// test("Get entry by id", async () => {
//   const testUserId = new mongoose.Types.ObjectId();
//   const mockEntryId = new mongoose.Types.ObjectId();

//   const entry = {
//     _id: mockEntryId,
//     user_id: testUserId,
//     date: Date.now(),
//     is_public: true,
//     rose_text: "Test rose",
//     bud_text: "Test bud",
//     thorn_text: "Test thorn"
//   };

//   const findMock = jest.fn().mockResolvedValue([entry]);

//   const originalFind = mongoose.model("rbt_entries", entryModel).find;
//   mongoose.model("rbt_entries", entryModel).find = findMock;

//   const foundEntry = await UserServices.getEntryById(mockEntryId);

//   console.log(foundEntry);  

//   // Perform assertions
//   expect(foundEntry).toBeTruthy();  
//   expect(Array.isArray(foundEntry)).toBe(true); 
//   expect(foundEntry[0]._id.toString()).toBe(mockEntryId.toString());  
//   expect(findMock).toHaveBeenCalledTimes(1);
//   expect(findMock).toHaveBeenCalledWith({ _id: mockEntryId });

//   mongoose.model("rbt_entries", entryModel).find = originalFind;
// });


// test("Fetching by valid id and not finding", async () => {
//   const anyId = "6132b9d47cefd0cc1916b6a9";

//   userModel.find = jest.fn().mockResolvedValue([]);

//   const user = await UserServices.findUserById(anyId);

//   console.log(userModel.find.mock.calls);
//   expect(user).toEqual([]);

//   expect(userModel.find.mock.calls.length).toBe(1);
//   expect(userModel.find).toHaveBeenCalledWith({ _id: anyId });  
// });

// test("Find user by username", async () => {
//   const mockUser = {
//     username: "testUser",
//     password: "password123",
//     first_name: "Test",
//     entries: new mongoose.Types.ObjectId(),
//   };

//   const usernameToFind = "testUser";

//   userModel.find = jest.fn().mockResolvedValue([mockUser]);  

//   const result = await UserServices.findUserByUsername(usernameToFind);

//   expect(result).toBeTruthy();  
//   expect(result[0].username).toBe(usernameToFind);
//   expect(result[0].first_name).toBe(mockUser.first_name);  

//   expect(userModel.find.mock.calls.length).toBe(1);
//   expect(userModel.find).toHaveBeenCalledWith({ username: usernameToFind });
// });

// test("Fetching by valid id and finding", async () => {
//   const objectId = new mongoose.Types.ObjectId();

//   const dummyUser = {
//     _id: objectId,  
//     username: "solana_rowe",
//     password: "password1",
//     first_name: "Solana",
//   };

//   userModel.find = jest.fn().mockResolvedValue([dummyUser]);

//   const foundUser = await UserServices.findUserById(objectId.toString());  

//   expect(foundUser).toBeDefined();
//   expect(foundUser.length).toBe(1); 

//   expect(foundUser[0]._id.toString()).toBe(dummyUser._id.toString()); 

//   expect(foundUser[0].username).toBe(dummyUser.username);
//   expect(foundUser[0].first_name).toBe(dummyUser.first_name);

//   expect(userModel.find.mock.calls.length).toBe(1);
//   expect(userModel.find).toHaveBeenCalledWith({ _id: objectId.toString() }); 
// });
