Template.page_gerer.helpers({
  'nombreTournois': function(){
    let currentUser = Meteor.userId();
    let count = Tournois.find({admin: currentUser}, {sort: {date: -1}}).count();
    if(count >= 1){ //A changer s'il y a un seul tournoi > arriver dessus
      return true;
    } else {
      return false;
    }
  },
  'tournoisCrees': function(){
    let currentUser = Meteor.userId();
    return Tournois.find({admin: currentUser}, {sort: {date: -1}});
  },
  // 'nombreMatchsRestants': function(idT) {
  //   console.log();
  //   if (Matchs.find({idTournoi: idT, termine: false}).count() == 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },
  'matchRestants': function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: false
    })
  }
});

Template.page_gerer.events ({
  // To delete tournoi and all related matches
  'click .suppr-tournoi': function(event){
      event.preventDefault();
      let idTournoi = this._id;
      let confirmation = window.confirm("Supprimer définitivement ce tournoi et les matchs associés?");
      if(confirmation){
        Tournois.remove({ _id: idTournoi });
        let match = Matchs.find({ idTournoi: idTournoi});
        match.forEach(function(match){
          Matchs.remove({_id: match._id});
        });
      }
  },
  'click .goTournoi': function(event){
    event.preventDefault();
    let idTournoi = this._id;
    Router.go(`/gerer/${idTournoi}`);
  },
  // Updating match score
  'keydown [name=scoreInputJ1]': function(event){
    if (event.which == 13 || event.which == 27 || event.which == 9) {
      let idMatch = this._id;
      let score = parseInt($(event.target).val());
      Matchs.update({ _id : idMatch}, {$set: {"j1.score" : score}})
    }
  },
  'keydown [name=scoreInputJ2]': function(event){
    if (event.which == 13 || event.which == 27 || event.which == 9) {
      let idMatch = this._id;
      let score = parseInt($(event.target).val());
      Matchs.update({ _id : idMatch}, {$set: {"j2.score" : score}})
    }
  },
  'click .glyphicon-ok': function(event){
    let idMatch = this._id;
    Matchs.update({ _id: idMatch}, {$set: {termine: true}})
  }
});
