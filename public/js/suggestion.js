
var app7 = new Vue({
    el: '#app7',
    data: {
      suggestions: [],
      potentialSuggestions: {}
    },
    methods: {
        sortNumber(a,b) {
        return b - a;
        },
        getKeyByValue(object, value) {
          return Object.keys(object).find(key => object[key] === value);
        },
        SearchSimilarity(prodName,email){
            var ref = firebase.firestore().collection('transactions');
            ref.onSnapshot(snapshot => {
                let cart =[];
                snapshot.forEach(doc => {
                  var flag=false;
                    cart=doc.data().mycart;
                    if(doc.data().email!=email){
                    for(var key in cart){
                      for(var key3 in prodName){
                        if(key==key3&&flag==false){
                          flag=true;
                            for(var key2 in cart){
                                if(key2 in this.potentialSuggestions)
                                    this.potentialSuggestions[key2]= Number(this.potentialSuggestions[key2])+ Number(cart[key2]);
                                else
                                    this.potentialSuggestions[key2]= Number(cart[key2]);
                            }
                          }
                        }
                    }
                }
            }
                                
                );

            })
        },
        BibiZevel(mycart,status,email){
          var ref = firebase.firestore().collection('transactions');
          ref.onSnapshot(snapshot => {
              let cart =[];
              snapshot.forEach(doc => {
                  cart=doc.data().mycart;
                  if(doc.data().email!=email){
                          for(var key2 in cart){
                              if(key2 in this.potentialSuggestions)
                                  this.potentialSuggestions[key2]= Number(this.potentialSuggestions[key2])+ Number(cart[key2]);
                              else
                                  this.potentialSuggestions[key2]= Number(cart[key2]);
                          }
              }
          }              
              );
        })
         for(var key in mycart){
          for(var key2 in this.potentialSuggestions){
              if(key==key2){
               delete this.potentialSuggestions[key];
              }
          } 
       }
         this.updateKeys(mycart,status,email);
        },
        finalizeSuggestions(mycart,status,email){
            var ref = firebase.firestore().collection('products');
            ref.onSnapshot(snapshot => {
            for(var key in this.potentialSuggestions){
                snapshot.forEach(doc => {
                    if(doc.data().name==key&&doc.data().amount<=0){
                        delete this.potentialSuggestions[key];
                    }
                })
            }
            this.deleteSameProduct(mycart,status,email);
    })
    },
        deleteSameProduct(mycart,status,email){
            for(var key in mycart){
               for(var key2 in this.potentialSuggestions){
                   if(key==key2){
                    delete this.potentialSuggestions[key];
                   }
               } 
            }
            console.log(this.potentialSuggestions,"after deleting");
            this.updateKeys(mycart,status,email);
        },
        updateKeys(mycart,status,email){
            var dict=this.potentialSuggestions;
            var keys = Object.keys(dict).map(function(key) {return [key, dict[key]];});
            keys.sort(function(first, second) {return second[1] - first[1];});
            const refs = firebase.firestore().collection('products').orderBy('name', 'asc');
            refs.onSnapshot(snapshot => {
              let suggestions = [];
              var count=0;
              var i=0;
              if(keys.length<3){
                if(count==0){
                this.BibiZevel(mycart,status,email);
                count++;  
              }}
              else{
              snapshot.forEach(doc => {
                for(i=0;i<3;i++){
                if(doc.data().amount>0 && doc.data().name==keys[i][0]){
                suggestions[i]={...doc.data(),id:doc.id};
                if(status==true)
                    suggestions[i].price=suggestions[i].price*0.9;}}});}
          this.suggestions = suggestions;});
        },
        init(){
          setTimeout(() => { this.potentialSuggestions={};
          firebase.auth().onAuthStateChanged(user => {
              var status;
              var mycart=[];
              if(user){
             const ref2 = firebase.firestore().collection('users');
              ref2.onSnapshot(snapshot => {
              let myuser = [];
              snapshot.forEach(doc => {
                if(doc.id==user.uid)
                myuser.push({...doc.data(), id: doc.id});
              });
              if(myuser.length!=0){
              status = myuser[0].isStudent;
              const doc = firebase.firestore().collection('carts');
              doc.onSnapshot(snapshot => {
                  snapshot.forEach(doc => {
                    if(doc.id==user.uid)
                    mycart.push({...doc.data(), id: doc.id});
                  });
                  if(typeof mycart[0] !="undefined"){
                  console.log(mycart[0].mycart,"mycart");
                  this.SearchSimilarity(mycart[0].mycart,user.email)
                  console.log(this.potentialSuggestions,"122");
                  this.finalizeSuggestions(mycart[0].mycart,status,user.email);
    
                  console.log(this.potentialSuggestions,"in mounted");
                  /*
                  const ref = firebase.firestore().collection('products').orderBy('name', 'asc');
                  var i=0;
                  ref.onSnapshot(snapshot => {
                    let suggestions = [];
                    snapshot.forEach(doc => {
                      if(doc.data().amount>0&&i<3)
                      suggestions.push({...doc.data(), id: doc.id});
                      i++;
                    });
                    this.suggestions = suggestions;
                  });
    
                  */
                 console.log(this.potentialSuggestions,"205");
                 /*
                 if(Object.keys(this.potentialSuggestions).length<3){
                  console.log(mycart[0]);
                this.BibiZevel(user.email);
                console.log(this.potentialSuggestions,"after BibiZevel");
    
                var ref = firebase.firestore().collection('products');
                ref.onSnapshot(snapshot => {
                for(var key in this.potentialSuggestions){
                    snapshot.forEach(doc => {
                        if(doc.data().name==key&&doc.data().amount<=0){
                            delete this.potentialSuggestions[key];
                        }
                    })
                }
                console.log(this.potentialSuggestions,"check potential bibizevel not last");
                this.updateKeys(status);
              })}
              */
              }
    
              else{
              console.log(mycart[0]);
                this.BibiZevel(mycart,status,user.email);
                console.log(JSON.stringify(this.potentialSuggestions),"after BibiZevel");
    
                var ref = firebase.firestore().collection('products');
                ref.onSnapshot(snapshot => {
                for(var key in this.potentialSuggestions){
                    snapshot.forEach(doc => {
                        if(doc.data().name==key)
                          if(doc.data().amount<=0)
                            delete this.potentialSuggestions[key];
                    })
                }
                console.log(this.potentialSuggestions,"check potential bibizevel");
                this.updateKeys(mycart,status,user.email);
        })
      
            }
              })
          
          }
      })}})  }, 2000);
          
          
        }
    },
    mounted() {
      this.init();
  
  }
    
    

    });