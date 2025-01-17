// example partial testing suite using Mockingoose
import mongoose from "mongoose";
import mockingoose from "mockingoose";
import * as UserServices from "./user-services.js";

// schemas
import { userSchema } from "./user"; 
import { entrySchema } from "./user";

let userModel;
let entryModel;

// initialize user and entry schemas
beforeAll(async () => {
  userModel = mongoose.model("User", userSchema);
  entryModel = mongoose.model("Entry", entrySchema)
});
  
beforeEach(async () => {
  mockingoose.resetAll();
});
  
test("Adding user -- successful path", async () => {
  const mockEntryId = new mongoose.Types.ObjectId();

  // example user to add
  const addedUser = {
    username: "jackie_chan",
    password: "password",
    first_name: "Jackie",
    entries: mockEntryId,
    groups: [new mongoose.Types.ObjectId()]
  };

  // for comparison
  const toBeAdded = {
    username: "Jackie Chan",
    first_name: "Jackie"
  };

  mockingoose(userModel).toReturn(mockEntryId, 'addUserEntries');

  // mock save method
  mockingoose(userModel).toReturn(addedUser, 'save');

  const result = await UserServices.addUser(toBeAdded);

  expect(result).toBeTruthy();
  expect(result.username).toBe(toBeAdded.username);
  expect(result.first_name).toBe(toBeAdded.first_name);
  expect(result).toHaveProperty("_id");
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

  mockingoose(userModel).toReturn(mockEntryId, 'addUserEntries');

  // mock save method
  mockingoose(userModel).toReturn(addedUser, 'save');

  const result = await UserServices.addUser(toBeAdded);

  expect(result).toBeTruthy();
  expect(result.username).toBe(toBeAdded.username);
  expect(result.first_name).toBe(toBeAdded.first_name);
  expect(result.groups).toEqual([]);  // make sure groups array is empty
  expect(result).toHaveProperty('_id');  // ensure there's an _id
});

test("Fetching by valid id and not finding", async () => {
  // example id
  const anyId = "6132b9d47cefd0cc1916b6a9";

  mockingoose(userModel).toReturn([], 'find');

  const user = await UserServices.findUserById(anyId);

  // should be empty
  expect(user).toEqual([]);
});

test("Add new entry", async () => {
  const testUserId = new mongoose.Types.ObjectId();
  const mockEntryId = new mongoose.Types.ObjectId();

  const entry = {
    _id: mockEntryId,
    user_id: testUserId,
    date: Date.now(),
    is_public: true,
    rose_text: "Test rose",
    bud_text: "Test bud",
    thorn_text: "Test thorn"
  };

  // mock save method
  mockingoose(userModel).toReturn(entry, 'save');

  const result = await UserServices.addEntry(entry);

  expect(result).toBeTruthy();
  expect(result.user_id).toBe(entry.user_id);
  expect(result.rose_text).toBe(entry.rose_text);
  expect(result).toHaveProperty('_id');  // ensure there's an _id
});
