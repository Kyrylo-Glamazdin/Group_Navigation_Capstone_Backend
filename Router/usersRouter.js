const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router2 = express.Router();
const { users, validate } = require("../Database/Models/Users");
const auth = require("../Middlewares/authMid");
const Group = require('../Database/Models/Groups');
const User = require('../Database/Models/Users');

router2.post("/", async (req, res) => {
  //auth,
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await users.findOne({ where: { email: req.body.email } });
  if (user) return res.status(400).send("User already registered.");

  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  console.log(req.body);

  try {
    let new_user = await users.create(req.body);
    const token = jwt.sign(
      {
        id: new_user.id,
        email: new_user.email
      },
      "myJwtKey"
      // config.get("jwtKey")
    );
    res
      .header("x-auth-token", token)
      .send(_.pick(new_user, ["id", "name", "email"]));
  } catch (error) {
    res.send(error);
  }
});

//GET localhost:5000/api/users
router2.get('/', (req,res) =>{
	User.findAll({ include: [Group] }) //Eager Loading
	.then(users => res.status(200).json(users))
	.catch(err => console.log(err))
})

//GET localhost:5000/api/users/1
router2.get('/:id', async (req,res) =>{
	await User.findByPk(req.params.id)
	.then(user=> {
		if(user != null)
		{
			res.status(200).send(user);
		}
		else
		{
			res.status(404).send();
		}
	})
})

//PUT localhost:5000/api/users/1
router2.put('/:id', async(req,res)=>{
	await User.findByPk(req.params.id)
	.then(async user=> {
		if(user != null)
		{
			let data = req.body;
			let grp;
			if(data.group != null){
				grp = await Group.findByPk(data.group.id);
			}
			else
			{
				grp = {};
			}
			await User.update(	//information to update it with
				{
					name: data.name,
					curLat: data.curLat,
					curLon: data.curLon,
					image: data.iage,
					group: grp
				},
				{where: { id: req.params.id}}	 	//location in the database to update
			)
				
			console.log("entry has been upddated");
			await User.findAll({ include: [Group] })
			.then(users => res.status(201).json(users))
			.catch(err => console.log(err))
		}
    else {
      res.status(404).send();
    }
	})
})

//DELETE localhost:5000/api/users/1
router2.delete('/:id', async (req,res)=>{
	await User.findByPk(req.params.id)
	.then(async user=> {
		if(user != null)
		{
			await User.destroy({ where: {id : req.params.id}});
			console.log("entry DESTROYED");

			await User.findAll({ include: [Group] })
			.then(users => res.status(201).json(users))
			.catch(err => console.log(err))
		}
		else
		{
			res.status(404).send();
		}
	})
})

module.exports = router2;
