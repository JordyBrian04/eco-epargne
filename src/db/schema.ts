import {pgTable, text, serial, timestamp, real, integer, date, uuid} from 'drizzle-orm/pg-core'

export const utilisateur = pgTable('utilisateur', {
    id: serial('id').primaryKey(),
    num_compte: text('num_compte').notNull(),
    nomcomplet: text('nomcomplet').notNull(),
    numero: text('numero').notNull(),
    mdp: text('mdp').default(''),
    photo: text('photo').default(''),
    cree_le: timestamp('cree_le').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    solde: real('solde').default(0)
})

export const temp = pgTable('temp', {
    id: serial('id').primaryKey(),
    compte: text('num_compte').notNull(),
    code_verification: integer('code_verification').default(0).notNull(),
    date_expiration: timestamp('date_expiration').notNull()
})

export const epargne = pgTable('epargne', {
    id: serial('id').primaryKey(),
    num_epargne: text('num_epargne').notNull(),
    libelle: text('libelle').notNull(),
    type_epargne: text('type_epargne').notNull(),
    date_fin: date('date_fin').notNull(),
    updatedAt: timestamp('updatedAt').defaultNow()
})

export const transaction = pgTable('transaction', {
    id: text('id').primaryKey(),
    num_epargne: text('num_epargne').notNull(),
    type_transaction: text('type_transaction').notNull(),
    numero: text('numero').notNull(),
    montant: integer('montant').default(0),
    frais: integer('frais').default(0),
    montant_debite: integer('montant_debite').default(0),
    updatedAt: timestamp('updatedAt').defaultNow(),
    mode_transaction: text('mode_transaction').default(""),
    sta: integer('sta').default(0),
})

export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    num_compte: text('num_compte').notNull(),
    titre: text('titre').notNull(),
    description: text('description').notNull(),
    sta: integer('sta').default(0),
    updatedAt: timestamp('updatedAt').defaultNow(),
})

export const pub = pgTable('pub', {
    id: serial('id').primaryKey(),
    titre: text('titre').notNull(),
    description: text('description').notNull(),
    image: text('image').default(""),
    updatedAt: timestamp('updatedAt').defaultNow(),
})



//npx drizzle-kit push