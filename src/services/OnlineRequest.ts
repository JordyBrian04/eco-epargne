
import  {db} from '../db'
import { utilisateur, temp, epargne, transaction, pub } from '../db/schema';
import { eq, sql, and, count, like, sum, desc } from 'drizzle-orm';
import { getNumCompte } from './AsyncStorage';
import { updateLocalNom } from './Requests';

export const updateMdp = async (data:any) => {
    try {
        console.log('data',data);
        const num_compte = await getNumCompte();
        const update = await db.update(utilisateur).set({mdp: data.mdp}).where(eq(utilisateur.num_compte, num_compte))

        return update
    } catch (error) {
        return null
    }
}

export const updateNom = async (nom:any) => {
    try {
        // console.log('data',data);
        const num_compte = await getNumCompte();
        const update = await db.update(utilisateur).set({nomcomplet: nom}).where(eq(utilisateur.num_compte, num_compte))

        if(update)
        {
            const res = await updateLocalNom(nom)
            return res
        }
        else
        {
            return 400
        }
    } catch (error) {
        console.error(error)
        return 400
    }
}

export const getUserOnline = async () => {
    try {
        const num_compte = await getNumCompte();
        const data = await db.select().from(utilisateur).where(eq(utilisateur.num_compte, num_compte))
        // console.log(data)
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}

export const insertEpargne = async (data:any) => {
    try {
        let num = 1
        const num_compte = await getNumCompte();

        const epar = await db.select({ value: count(epargne.id) }).from(epargne).where(like(epargne.num_epargne, `${num_compte}%`));

        if(epar.length > 0)
        {
            num = epar[0].value + 1;
        }

        const num_epargne = `${num_compte}_${num.toString().padStart(3, '0')}`;

        const insert = await db.insert(epargne).values({
            num_epargne: num_epargne,
            libelle: data.libelle,
            type_epargne: data.type_epargne,
            date_fin: data.date_fin
        })

        return insert
    } catch (error) {
        console.error(error)
        return error
    }
}

export const getEpargne = async () => {
    try {
        const num_compte = await getNumCompte();

        // const epar = await db.select({ value: count(epargne.id) }).from(epargne).where(like(epargne.num_epargne, {num_compte}+'%'));
        const epargnes = await db.select({ 
            id: epargne.id,
            num_epargne: epargne.num_epargne,
            type_epargne: epargne.type_epargne,
            libelle: epargne.libelle,
            date_fin: epargne.date_fin,
            solde: sql`COALESCE(SUM(${transaction.montant}), 0)`.as('solde')
        })
        .from(epargne)
        .leftJoin(transaction, eq(epargne.num_epargne, transaction.num_epargne))
        .where(like(epargne.num_epargne, `${num_compte}%`))
        .groupBy(epargne.num_epargne, epargne.type_epargne, epargne.libelle, epargne.date_fin,epargne.id) 
        .orderBy(desc(epargne.id))

        return epargnes
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getTransaction = async (num_epargne: string) => {
    try {
        
        const transactions = await db.select().from(transaction).where(eq(transaction.num_epargne, num_epargne)).orderBy(desc(transaction.updatedAt))
        return transactions
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAllTransaction = async () => {
    try {
        const num_compte = await getNumCompte();
        const transactions = await db.select().from(transaction).where(like(transaction.num_epargne, `${num_compte}%`)).orderBy(desc(transaction.updatedAt))
        return transactions
    } catch (error) {
        console.error(error)
        return null
    }
}

export const insertTransaction = async (data:any) => {
    try {
        
        const num_compte = await getNumCompte();

        const date = new Date();

        // Partie de la date
        const year = date.getFullYear(); // Année (AAAA)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois (MM)
        const day = String(date.getDate()).padStart(2, '0'); // Jour (JJ)
        const heure = date.getHours().toString().padStart(2, '0'); //
        const minute = date.getMinutes().toString().padStart(2, '0'); // Minute sur deux chiffres
        const seconde = date.getSeconds().toString().padStart(2, '0'); // Seconde sur deux chiffres

        // Partie unique : identifiant aléatoire à 6 chiffres
        const uniqueId = Math.floor(100000 + Math.random() * 900000);
        const montantSaisie = data.type_transaction === 'Depot' ? data.montantSaisie : -data.montantSaisie;

        const insert = await db.insert(transaction).values({
            id : `TX-${year}-${month}${day}-${seconde}${minute}${heure}`,
            num_epargne: num_compte,
            type_transaction: data.type_transaction,
            numero: data.numero,
            montant: parseInt(montantSaisie),
            frais: data.frais,
            montant_debite: parseInt(montantSaisie)+parseInt(data.frais),
            mode_transaction: data.mode_transaction,
            sta: 1
        }).returning({ id: transaction.id })
        
        // console.log(montant)
        if (insert) 
        {
            const update = await db
            .update(utilisateur)
            .set({ solde: sql`solde + ${montantSaisie}` })
            .where(eq(utilisateur.num_compte, num_compte));

            return insert
        }
        return false
    } catch (error) {
        
    }
}

export const insertTransfert = async (data:any) => {
    try {
        
        console.log(data)
        const num_compte = await getNumCompte();

        const date = new Date();

        // Partie de la date
        const year = date.getFullYear(); // Année (AAAA)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois (MM)
        const day = String(date.getDate()).padStart(2, '0'); // Jour (JJ)
        const heure = date.getHours().toString().padStart(2, '0'); //
        const minute = date.getMinutes().toString().padStart(2, '0'); // Minute sur deux chiffres
        const seconde = date.getSeconds().toString().padStart(2, '0'); // Seconde sur deux chiffres

        // Partie unique : identifiant aléatoire à 6 chiffres
        const montant = data.type_transaction === 'Depot' ? -data.montant : data.montant;

        const insert = await db.insert(transaction).values({
            id : `TX-${year}-${month}${day}-${seconde}${minute}${heure}`,
            num_epargne: data.num_epargne,
            type_transaction: data.type_transaction,
            numero: num_compte,
            montant: -parseInt(montant),
            frais: data.frais,
            montant_debite: -parseInt(montant)+parseInt(data.frais),
            mode_transaction: data.mode_transaction,
            sta: 1
        }).returning({ id: transaction.id })
        
        // // console.log(montant)
        if (insert) 
        {
            const update = await db
            .update(utilisateur)
            .set({ solde: sql`solde + ${montant}` })
            .where(eq(utilisateur.num_compte, num_compte));

            return insert
        }
        return false
    } catch (error) {
        
    }
}

export const getResultatTransaction = async (id: string) => {
    try {
        const transactions = await db.select().from(transaction).where(eq(transaction.id, id))
        return transactions
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAllPub = async () => {
    try {
        const datas = await db.select().from(pub).orderBy(desc(pub.updatedAt));
        return datas
    } catch (error) {
        
    }
}