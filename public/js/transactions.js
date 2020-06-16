
var app6 = new Vue({
    el: '#app6',
    data: {
        transactions: []
    },
     
    methods: {
      filterBy() {
        var choice = document.getElementById("transactionsFilter");
        var filterText = document.getElementById("transactionsFilterText").value;
        var result = choice.options[choice.selectedIndex].value; 
        const ref = firebase.firestore().collection('products').orderBy(result, 'asc');
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          if(doc.data().amount>0){
            if(result=="category" && doc.data().category==filterText)
              products.push({...doc.data(), id: doc.id});
            else if(result=="name" && doc.data().name ==filterText)
                  products.push({...doc.data(), id: doc.id});
                  else if(result=="manufacturer" && filterText==doc.data().manufacturer)
                        products.push({...doc.data(), id: doc.id});
                      else if(result == "price" && Number(filterText) > Number(doc.data().price))
                            products.push({...doc.data(), id: doc.id});
                      }});  
        this.products = products;
        var displayError= document.querySelector('.errorDisplay');
        if(products.length==0)
          displayError.textContent="No matches.";
          else
            displayError.textContent="";
      });}
},
    mounted() {
      const ref = firebase.firestore().collection('transactions');
      ref.onSnapshot(snapshot => {
        let transactions = [];
        snapshot.forEach(doc => {
            transactions.push({...doc.data(), id: doc.id});
        });
        this.transactions = transactions;
      });

    }
  });