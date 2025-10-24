import { connectToDatabase } from "@/database/mongoose";


export const getAllUsersForNewsemail = async() =>{
    try {
        const mongoose = await connectToDatabase();
        const db= mongoose.connection.db;
        if(!db) throw new Error('Database connection not established');
        console.log("✅ Connected to DB:", db.databaseName);

        const users = await db.collection('user').find(
            {email: {$exists:true, $ne:null}},
            {projection: {_id:1, id:1, email:1, name:1, country:1}}
        ).toArray();
        console.log(`Fetched ${users} users`);
        return users.filter((user)=>user.email && user.name).map((user)=>({
            id:user.id || user._id.toString()||' ',
            email: user.email,
            name: user.name
        }))
        ;
    } catch (e) {
        console.error('Error fetching users for news email:', e);
    }
}