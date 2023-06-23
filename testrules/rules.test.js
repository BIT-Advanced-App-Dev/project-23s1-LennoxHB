import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing"
import { doc, addDoc, setDoc, deleteDoc, getDocs, getDoc, collection } from "firebase/firestore";

import { setLogLevel } from "firebase/firestore";
setLogLevel('silent');

const myAppId = 'pokergame-assessment'
const testUserOneCredentials = {
  name: "testUserOne",
  sub: "testUserOne",
  email: "testUserOne@example.com"
}
const testUserTwoCredentials = {
  name: "testUserTwo",
  sub: "testUserTwo",
  email: "testUserTwo@example.com"
}

describe('Security Rules', () => {
  let testUserOneConnection
  let testUserTwoConnection

  beforeEach(async () => {
    const testEnv = await initializeTestEnvironment({
      projectId: myAppId,
      firestore: {
        rules: readFileSync("./firestore.rules", "utf-8"),
      },
      hub: {
        host: "localhost",
        port: 4400,
      },
    });
    const testUserOne = testEnv.authenticatedContext("testUserOne", testUserOneCredentials);
    const testUserTwo = testEnv.authenticatedContext("testUserTwo", testUserTwoCredentials);
    testUserOneConnection = testUserOne.firestore()
    testUserTwoConnection = testUserTwo.firestore()
  })


  it('User can see someones public info.', async () => {
    await assertSucceeds(getDoc(doc(testUserOneConnection, 'users', 'publicTestUser')));
  })

  it('User can see lobbies.', async () => {
    await assertSucceeds(getDocs(collection(testUserOneConnection, 'lobbies')));
  })

  it('User can create a lobby.', async () => {
    await assertSucceeds(addDoc(collection(testUserOneConnection, 'lobbies'), {}));
  })

  it('User can join a lobby.', async () => {
    await assertSucceeds(setDoc(doc(testUserOneConnection, 'lobbies/lobby/players', testUserOneCredentials.name), {}));
  })

  it('User can leave a lobby.', async () => {
    await assertSucceeds(deleteDoc(doc(testUserOneConnection, 'lobbies/lobby/players', testUserOneCredentials.name), {}));
  })

  it('User can not remove another user from lobby.', async () => {
    await assertFails(setDoc(doc(testUserOneConnection, 'lobbies/lobby/players', testUserTwoCredentials.name), {}));
  })

  it('Host can update lobby state.', async () => {
    await setDoc(doc(testUserOneConnection, 'lobbies/lobby/players', testUserOneCredentials.name), { host: true })
    await assertSucceeds(setDoc(doc(testUserOneConnection, 'lobbies/lobby'), { update: 'data' }))
  })

  it('User can not update lobby state.', async () => {
    await setDoc(doc(testUserOneConnection, 'lobbies/lobby/players', testUserOneCredentials.name), {})
    await assertFails(setDoc(doc(testUserOneConnection, 'lobbies/lobby'), { update: 'data' }))
  })

  it('User can create game.', async () => {
    await assertSucceeds(addDoc(collection(testUserOneConnection, 'games'), {}))
  })

  it('Host can add users to game instance.', async () => {
    const game = await addDoc(collection(testUserOneConnection, 'games'), { host: testUserOneCredentials.name })
    await assertSucceeds(setDoc(doc(testUserOneConnection, `games/${game.id}/players/player`), {}))
  })

  it('User that is not host, can not add themselves to the game instance.', async () => {
    await assertFails(setDoc(doc(testUserOneConnection, 'games/game/players/player'), {}))
  })

  it('User can read their hand.', async () => {
    await assertSucceeds(getDocs(collection(testUserOneConnection, `games/game/players/${testUserOneCredentials.name}/hand`)))
  })

  it('User can not read other users hand.', async () => {
    await assertFails(getDocs(collection(testUserOneConnection, `games/game/players/${testUserTwoCredentials.name}/hand`)))
  })

  it('Host can draw cards for players.', async () => {
    const game = await addDoc(collection(testUserOneConnection, 'games'), { host: testUserOneCredentials.name })
    await assertSucceeds(addDoc(collection(testUserOneConnection, `games/${game.id}/players/player/hand`), {}))
  })
  it('User can not draw cards for players.', async () => {
    const game = await addDoc(collection(testUserOneConnection, 'games'), {})
    await assertFails(addDoc(collection(testUserOneConnection, `games/${game.id}/players/player/hand`), {}))
  })
  it('User can see the game state.', async () => {
    await assertSucceeds(getDoc(doc(testUserOneConnection, 'games/game')))
  })
})



