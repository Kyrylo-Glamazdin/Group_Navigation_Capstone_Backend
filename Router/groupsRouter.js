const express = require('express');
const router = express.Router();
const Group = require('../Database/Models/Groups');
const User = require('../Database/Models/Users');

//GET localhost:5000/api/groups
router.get('/', (req,res) =>{
	Group.findAll({ include: [User] }) //Eager Loading
	.then(groups => res.status(200).json(groups))
	.catch(err => console.log(err))
})

//GET localhost:5000/api/groups/1 
router.get('/:id', async(req,res) =>{
	await Group.findByPk(req.params.id)
	.then(group =>{
		if(group !== null)
		{
			res.status(200).send(group);
		}
		else
		{
			res.status(404).send();
		}
	})
})


//POST localhost:5000/api/groups
router.post('/', async (req,res)=>{
	let data = req.body;
	await Group.create({
		name: data.name,
		users: data.users,
		latitude: data.latitude,
		longitude: data.longitude
	});
	console.log('Group added');

	Group.findAll({ include: [User] }) //Eager Loading
	.then(groups => res.status(201).json(groups))
})

//PUT localhost:5000/api/groups/1
router.put('/:id', async (req,res)=>{
	await Group.findByPk(req.params.id)
	.then(async group =>{
		if(group != null)
		{
			let data = req.body;
			await Group.update(	//information to update it with
			{
			    name: data.name,
		        users: data.users,
		        latitude: data.latitude,
		        longitude: data.longitude
			},
			{where: { id: req.params.id}}		//location in the database to update
			)
		
			console.log("entry has been updated");
			await Group.findAll({ include: [User] })
			.then(groups => res.status(201).json(groups))
			.catch(err => console.log(err))
		}
		else{
			let data = req.body;
			await Group.create({
				name: data.name,
		        users: data.users,
		        latitude: data.latitude,
		        longitude: data.longitude
			});
			console.log('Group added');

			Group.findAll({ include: [User] }) //Eager Loading
			.then(groups => res.status(201).json(groups))
		}
	})
})

//DELETE localhost:5000/api/groups/1
router.delete('/:id', async(req,res)=>{
	await Group.findByPk(req.params.id)
	.then(async group => {
		if(group != null)
		{
			await Group.destroy({ where: {id : req.params.id}});
			console.log("entry DESTROYED");

			await Group.findAll({ include: [User] })
			.then(groups => res.status(201).json(groups))
			.catch(err => console.log(err))
		}
		else{
			res.status(404).send();
		}
	})
	
})

module.exports = router;