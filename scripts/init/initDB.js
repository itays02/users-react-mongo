const mongoose = require('mongoose');
const { hashPassword } = require("../../server/services/util");

mongoose.connect('mongodb://api_user:1234@localhost:27017/sample', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
const usersCollection = db.collection('users')

const insertUsersToDB = async () => {
	try {
		const usersRaw = require('./usersToInit.json');
		let dateTenDays = new Date()
		dateTenDays = dateTenDays.setDate(dateTenDays.getDate() - Math.ceil(100 * Math.random()))
		const usersPromises = usersRaw.map(async (user) => {
			user.password = await hashPassword(user.password)
			user.createdAt = dateTenDays
			return user
		})
		const users = await Promise.all(usersPromises)
		users.push({
			"firstName": "Itay",
			"lastName": "Eylon",
			"email": "itay@gmail.com",
			"password": "1234",
			"description": "First User",
			"createdAt": new Date()
		})
		await usersCollection.insertMany(users)
		console.log('succees')
		process.exit(0)
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}

insertUsersToDB()