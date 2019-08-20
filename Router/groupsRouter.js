const express = require("express");
const router = express.Router();
const {Groups} = require("../Database");
const {Users} = require("../Database");

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

router.get("/", (req, res, next) => { // get all groups
  Groups.findAll({ include: [{all: true}] })
    .then(res.send.bind(res))
    .catch(next)
});

router.get('/:id', (req, res, next) => { //get database by NAME
  Groups.findByPk(req.params.id)
    .then(group => {
      if (!isEmpty(group)) {
        res.status(200).send(group.name);
      }
      else {
        res.status(404).send();
      }
    })
    .catch(next)
});

router.post('/', (req, res, next) => { //Add new group to database //SET ASSOCIATIONS OR USERS
  console.log(req.body.newGroup.name);
  Groups.findAll({
    where: {name : req.body.newGroup.name.trim()}
  })
    .then(async group => {
      console.log(isEmpty(group));
      if(isEmpty(group)){
        //console.log(req.body.newGroup);
        let {longitude, paths,name, latitude} = req.body.newGroup;
        let builtGroup = await Groups.create({longitude,latitude,paths,name});
        //console.log(builtGroup);
        for(let i =0; i < req.body.newGroup.users.length; i++)
        {
          let user = null;
          await Users.findByPk(req.body.newGroup.users[i].id)
          .then(res => {
            //console.log(res);
            user = res
          })
          .catch(err => console.log(err))  
          // console.group(user);
           builtGroup.addUsers(user);
        }
        res.status(200).send(group);
      }
      else
      {
        res.status(400).send();
        console.log('Group Already Exists');
      }  
    })
    .catch(next)
});

router.put('/add', (req,res,next) =>{   //associate users to a group
  let group = null;
  Groups.findByPk(req.body.groupId)
  .then(res => group = res)
  .catch(err => console.log(err))

  Users.findByPk(req.body.id)
  .then(user =>{
      user.addGroups(group);//
  })
  .catch(err => console.log(err))
})

router.put('/remove', (req,res,next) =>{   //req is reciving login info 
  let user = null;
  Users.findByPk(req.body.id)
  .then(res => {
    user = res;
  })
  .catch(err => console.log(err))

  Groups.findByPk(req.body.groupId)
  .then(group =>{
      group.removeUsers(user);
      res.status(200).send(group);
  })
  .catch(err => console.log(err))
})

router.delete('/:name', async (req, res, next) => {   //delete a group
  await Groups.findAll({ where: { name: req.params.name } })
    .then(async group => {
      if (!isEmpty(group)) {
        await Groups.destroy({ where: { name: req.params.name } })
        console.log('Group Destroyed');

        await Groups.findAll({ include: { model: Users } })
          .then(groups => {
            res.status(200).send(groups);
          })
          .catch(err => console.log(err))
      }
      else {
        res.status(404).send();
      }
    })
})

module.exports = router;
