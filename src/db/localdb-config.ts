import * as SQLite from 'expo-sqlite';

let db: SQLite.WebSQLDatabase | undefined;

export const initDatabase = async (): SQLite.WebSQLDatabase => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('local.db');
    //db = SQLite.openDatabase('test.db');
  }
  return db;
};
//const db = SQLite.openDatabase('mon_gestionnaire.db');
// 