import { ExecuteResultSync } from 'drizzle-orm/sqlite-core';
import * as SQLite from 'expo-sqlite';
import { getNumCompte, storeNumCompte, storeUserDatas } from './AsyncStorage';

const database = SQLite.openDatabaseAsync('local.db');


export const user_insert = async (user:any) => {
    try {
        // check if user already exists
        const existingUser = await (await database).getAllAsync("SELECT * FROM user_local WHERE num_compte = ?", [user.num_compte])
        if (existingUser.length > 0) {
            return 'User already exists';
        }
        const verif:any = await (await database).getFirstAsync("SELECT COUNT(*) as row FROM user_local");

        if(verif?.row < 3) {
            const insert = await (await database).prepareAsync("INSERT INTO user_local (num_compte, nom_complet, numero, mdp, solde, sta) VALUES (?, ?, ?, ?, ?, ?)");
            await (await insert).executeAsync([user.num_compte, user.nomcomplet, user.numero, user.mdp, 0, 1])
            return true
        } else {
            return verif
        }
    } catch (error) {
        return error
    }
}

export const get_user_local = async () => {
    try {
        const num_compte = await getNumCompte();
        // console.log(num_compte)
        const users = await (await database).getFirstAsync("SELECT * FROM user_local WHERE num_compte = ?", [num_compte]);
        // console.log(users)
        return users
        
    } catch (error) {
        return error
    }
}

export const update_user = async (datas:any) => {
    try {
        //
        const update = (await database).runAsync('UPDATE user_local SET nom_complet = ?, numero = ?, mdp = ?, solde = ? WHERE num_compte = ?', [datas.nomcomplet, datas.numero, datas.mdp, datas.solde, datas.num_compte]);
        await storeUserDatas(await get_user_local())
        // console.log('update');
        return true
        //storeUserDatas(update)
    } catch (error) {
        return false
    }
}

export const getAllAccounts = async () => {
    try {
        const users = (await database).getAllAsync("SELECT * FROM user_local", []);
        return users
    } catch (error) {
        return error
    }
}

export const changeAccount = async (num_compte: any): Promise<boolean> => {
    console.log(num_compte)

    console.log('Changement de compte pour:', num_compte);

    // Validation des paramètres
    if (!num_compte || typeof num_compte !== 'string') {
        console.error('Numéro de compte invalide:', num_compte);
        return false;
    }

    try {
        const db = await database; // Instance de la base de données

        // Démarre une transaction
        await db.runAsync('BEGIN TRANSACTION');

        // Désactive tous les comptes (sta = 0)
        const updateAll = await db.runAsync('UPDATE user_local SET sta = 0');
        console.log('Mise à jour des comptes inactifs:', updateAll);
        
        

        // Si des comptes ont été désactivés et un numéro valide est fourni
        if (updateAll.changes > 0 && num_compte) {
            // Active le compte sélectionné
            const update = await db.runAsync(
                'UPDATE user_local SET sta = 1 WHERE num_compte = ?',
                [num_compte]
            );
            console.log('Activation du compte:', update);

            // console.log(await (await db).getAllAsync('SELECT * FROM user_local WHERE sta =0'))
            // if (update.changes > 0) {
                // Stocke le numéro du compte actif
                await storeNumCompte(num_compte);
                storeUserDatas(await get_user_local())
                await db.runAsync('COMMIT'); // Valide la transaction
                return true;
            // }
        }

        // Si aucune mise à jour n'a été faite
        await storeUserDatas([]);
        await storeNumCompte('');
        await db.runAsync('ROLLBACK'); // Annule la transaction
        return false;
    } catch (error) {
        console.error('Erreur dans changeAccount:', error);
        return false;
    }
};

export const logout = async () => {
    try {
        const num_compte = await getNumCompte();
        const update = await (await database).runAsync('UPDATE user_local SET sta = 0 WHERE num_compte = ?', [num_compte]);

        if (update)
        {
            return 200
        }
        else
        {
            return 500
        }
    } catch (error) {
        console.error(error)
        return 500
    }
}

export const updateLocalNom = async (nom:any) => {
    try {
        const num_compte = await getNumCompte();
        const update = await (await database).runAsync('UPDATE user_local SET nom_complet = ? WHERE num_compte = ?', [nom.trim(), num_compte]);

        if (update)
        {
            return 200
        }
        else
        {
            return 500
        }
    } catch (error) {
        console.error(error)
        return 500
    }
}
