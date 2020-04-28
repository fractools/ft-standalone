// Plugin Modules
import { socketSession } from './lib/session';
import { commit2Store } from './lib/replicator';
import { fillDefaultState } from './lib/defaultState/';

// Vue Prototypes
import * as pouchdb from './prototypes/pouchdb';
import * as upload from './prototypes/upload';
import * as usermanagement from './prototypes/usermanagement';
import * as socket from './prototypes/socket';

// Make this available for the App
export default async (context, inject) => {
  // Fill State with Default Data
  await fillDefaultState();
  // Connects to Socket
  socketSession(context);
  // Commit fetched Data into Vuex Store
  commit2Store(context);
}
