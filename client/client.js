
sourceSchema = new SimpleSchema({
	title:{
        type: String
    },
    description:{
        type: String,
        optional:true
    },
    url:{
        type: String
    },
    upvotes:{
    	type:Number,
    	optional:true
    },
    total:{
    	type:Number,
    	optional:true
    },
    downvotes:{
    	type:Number,    	
    	optional:true
    },
    downvotesDone:{
    	type:Number,    	
    	optional:true
    },
    upvotesDone:{
    	type:Number,    	
    	optional:true
    },
    timestamp:{
        type: String,        
    	optional:true
    },
    userId:{
        type: String,
        denyUpdate: true,     
    	optional:true,
        autoValue: function(){
            // this.userId always prints undefined, shouldn't it be null for usecase 1 and not null for usecase 2?
            console.log(this.userId);
    	}
    }
});

sources = new Mongo.Collection('sources');
sources.attachSchema(sourceSchema);
Meteor.subscribe('sources');

Template.sourceList.helpers({
  sources: function(){
  	return sources.find({},{sort: {total:-1}});
  }
});

Template.sourceList.events({
  "click .upvote": function (event, template) {
    var sourceId = event.target.getAttribute("sourceId");
    Meteor.call('upvoteSource', sourceId, function (error, result) {
	  if (error) {
	    console.log(error);
	  } else {
	    console.log(result);
	  }
	});

  },
  "click .downvote": function (event, template) {
    var sourceId = event.target.getAttribute("sourceId");
    Meteor.call('downvoteSource', sourceId, function (error, result) {
	  if (error) {
	    console.log(error);
	  } else {
	    console.log(result);
	  }
	});

  },
});