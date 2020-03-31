// Generic ID Generator
export function genid (database, user) {
  let id = new Date().toJSON() + '-' + user + '-' + database + '-' + Math.random().toString(36).substr(2, 9);
  return id;
}
