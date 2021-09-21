import { Router } from 'express';
import { restart } from 'nodemon';
import User from '../../models/User';
const router = Router();
import jwt from 'jsonwebtoken';
import { secret, auth } from '../../config/passport';

router.get('/', auth, (req, res) =>{
    User.find({}, function(err, users){
        if(err){
            return res.status(500).send({err});
        }
        return res.send(users);
    })
});

router.post('/token', (req, res) =>{
    const {username, password } = req.body;
    if(!username || !password){
        return res.send({ err: `Required Fields not found: ${!username ? 'username' : ''}${!password ? 'password':''}`
        });
    }
    User.findOne({username: username}, function(err, userModel){
        if(err)
            return res.status(400).send(err);

        if(!userModel)
            return res.status(400).send({err: 'Cannot find user'});

        return userModel.comparePassword(password, function(err, isMatch){
            if(err)
                return res.status(400).send(err);

            if(!isMatch){
                return res.status(400).send({err: 'invalid password'});
            }

            const payload = { id: userModel._id };
            const token = jwt.sign(payload, secret);
            return res.send(token);
        })
    });
});

router.post('/', (req, res) => {
    const {username, password } = req.body;
    if(!username || !password){
        return res.send({ err: `Required Fields not found: ${!username ? 'username' : ''}${!password ? 'password':''}`
        });
    }
    const newUser = new User({
        username: username,
        password: password
    });
    newUser.save(function(err, model){
        if(err){
            return res.status(400).send({err});
        }
        return res.status(201).send(model);
    });
});

router.get('/current', auth, (req, res) => {
    return res.send(req.user);
});

router.get('/:id', auth, (req,res) => {
    const {id} = req.params;
    User.findById(id, function(err, userModel) {
        if(err)
            return res.status(400).send({err})
        return res.send(userModel);
    });
});

export default router;