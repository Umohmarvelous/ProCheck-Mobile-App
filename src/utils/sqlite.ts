/**
 * SQLite helper (expo-sqlite)
 * Provides promise-wrapped helpers for basic todo persistence.
 */
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'givo_todo.db';
// types for expo-sqlite in this environment expose openDatabaseSync
export const db = (SQLite as any).openDatabaseSync
  ? (SQLite as any).openDatabaseSync(DB_NAME)
  : (SQLite as any).openDatabase(DB_NAME);

function execSql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_: any, result: any) => {
          // convert rows to array
          const rows: any[] = [];
          for (let i = 0; i < result.rows.length; i++) rows.push(result.rows.item(i));
          resolve(rows as T[]);
        },
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS todos (id TEXT PRIMARY KEY NOT NULL, title TEXT, completed INTEGER, createdAt TEXT);`,
        [],
        () => resolve(),
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function getAllTodos(): Promise<{ id: string; title: string; completed: number; createdAt: string }[]> {
  return execSql(`SELECT id, title, completed, createdAt FROM todos ORDER BY createdAt DESC`);
}

export function insertTodo(id: string, title: string, completed = 0, createdAt = new Date().toISOString()): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO todos (id, title, completed, createdAt) VALUES (?, ?, ?, ?);`,
        [id, title, completed, createdAt],
        () => resolve(),
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function updateTodoCompletion(id: string, completed: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `UPDATE todos SET completed = ? WHERE id = ?;`,
        [completed, id],
        () => resolve(),
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function deleteTodo(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `DELETE FROM todos WHERE id = ?;`,
        [id],
        () => resolve(),
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}
