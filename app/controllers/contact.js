var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Contact = mongoose.model('Contact');

module.exports = function (app) {
  app.use('/contacts', router);
};

router.get('/create', function (req, res, next) {
	var contact = new Contact();
	res.render('create',{
	contact: contact,	
	title: 'Create'
	});
});

router.post('/create',function(req, res,next){
	var contact = Contact(req.body);
	contact.save(function(err,contact){
		if(err){
			next(err);
			return;
	}
	res.redirect('/contacts/list');
	});
	
});

router.get('/list',function(req,res,next){
	Contact.find({deleted:false},function(err,contacts){
	if(err){
		next(err);
		return;
	}
	res.render('list', {
		contacts : contacts
		});
});
});


router.get('/edit/:id',function(req,res,next)
{	
	Contact.findOne({_id:mongoose.Types.ObjectId(req.params.id)},function(err,contact)
  {

  	if(err)
			{
			next(err);
			return;
			}

	if(contact)
	{
		res.render('create',{
			contact : contact,
			title : 'Edit'
		});
			
			
	}
	else
	{
		next(new Error('No object Found'));
		return;

	}
  });
});

router.post('/edit/:id',function(req, res,next){
	Contact.findOne({_id:mongoose.Types.ObjectId(req.params.id)},function(err,oldContact)
	{
		oldContact.firstName = req.body.firstName;
		oldContact.lastName = req.body.lastName;
		oldContact.middleName = req.body.middleName;
		oldContact.email = req.body.email;
		oldContact.mobile = req.body.mobile;
		
		oldContact.save(function(err,contact){
			if (err) {
				next(err);
				return;
			}
				res.redirect('/contacts/list');

		});
	});
	
});

router.get('/delete-soft/:id',function(req,res,next)
{	
	Contact.findOne({_id:mongoose.Types.ObjectId(req.params.id)},function(err,delcontact)
  {  delcontact.deleted =true;
  	 delcontact.save(function(err, delcontact){



			if(err)
			{
			next(err);
			return;
			}
			res.redirect('/contacts/list');
		});
	});
});
/**/
router.get('/delete/:id',function(req,res,next)
{	
	Contact.findOne({_id:mongoose.Types.ObjectId(req.params.id)},function(err,contact)
  {
	if(contact)
	{
		contact.remove(function(err)
		{
			if(err)
			{
			next(err);
			return;
			}
			res.redirect('/contacts/list');
		});
	}
	else
	{
		res.redirect('/contacts/list');

	}
  });
});

router.post('/list/json', function (req, res) {
  var rows = req.body.length || 10;
  var start = req.body.start || 0;
  var sSearch = req.body.search.value || '.*';sSearch = sSearch + '.*';

  async.parallel([function (cb) {
      console.log(1);
      Contact
        .find({
          $or: [
            {firstName: {$regex: sSearch, $options: 'i'}},
            {lastName: {$regex: sSearch, $options: 'i'}},
            {mobile: {$regex: sSearch, $options: 'i'}},
            {email: {$regex: sSearch, $options: 'i'}}]
          ,
          deleted: false
        })
        .skip(start)
        .limit(rows)
        .lean()
        .exec(function (err, contacts) {
          req.contacts = contacts;
          cb(err);
        });
    }, function (cb) {
      console.log(2);
      Contact
        .count({
          $or: [
            {firstName: {$regex: sSearch, $options: 'i'}},
            {lastName: {$regex: sSearch, $options: 'i'}},
            {mobile: {$regex: sSearch, $options: 'i'}},
            {email: {$regex: sSearch, $options: 'i'}}]
          ,
          deleted: false
        })
        .exec(function (err, count) {
          req.totalRecords = count;
          cb(err);
        });
    }
    ],
    function (err) {
      if (err) {
        var result = {};
        result.data = [];
        result.recordsTotal = 0;
        result.recordsFiltered = 0;
        res.json(result);
      } else {
        // create the records
        var result = {};
        result.data = req.contacts;
        result.recordsTotal = req.totalRecords;
        result.recordsFiltered = req.totalRecords;
        res.json(result);
      }
    }
  );
});