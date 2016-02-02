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
            // return this.userId;
    	}
    }
});

sources = new Mongo.Collection('sources');
sources.attachSchema(sourceSchema);

Meteor.publish("sources", function(){
	return sources.find();
});

// sources.remove({});
// Meteor.users.remove({});

Meteor.methods({
  addSource: function (source) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var userAlreadyAddedSource = sources.find({userId:Meteor.userId()}).count();

    if(userAlreadyAddedSource >= 1){
    	throw new Meteor.Error("already-added-one-source");
    }

    sources.insert({
      title: source.title,
      timestamp: new Date(),
      userId: Meteor.userId(),
      url: source.url
    });

  },
  upvoteSource: function (sourceId){
  	// Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var source = sources.findOne({userId:Meteor.userId()});

    if(source.upvotesDone){
    	var upvotesDone = source.upvotesDone;
    }else{
    	var upvotesDone = 0;
    }

    if(upvotesDone > 5){
  		throw new Meteor.Error("no-more-votes-left");
  	}else{
  		sources.update({_id:sourceId},{ $inc: { upvotes: 1 , total: 1 }});
  		sources.update({userId: Meteor.userId()}, { $inc: { upvotesDone: 1}});
  	}    


  },
  downvoteSource: function (sourceId){
  	// Make if(sources.findOne({userId:Meteor.userId()}).upvotesDone > 5){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var source = sources.findOne({userId:Meteor.userId()});

    if(source.downvotesDone){
    	var downvotesDone = source.downvotesDone;
    }else{
    	var downvotesDone = 0;
    }

    if(downvotesDone > 5){
  		throw new Meteor.Error("no-more-votes-left");
  	}else{
  		sources.update({_id:sourceId},{ $inc: { downvotes: 1 , total: -1 }});
  		sources.update({userId: Meteor.userId()}, { $inc: { downvotesDone: 1 }});
  	}    
  }
});
