
function userLogOut(){
    localStorage.clear();
    window.location.reload();
}
let cryptoList=[]
let url='https://api.coingecko.com/api/v3/coins/markets?vs_currency=Eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1m'
    $.ajax({
    url,
    method:'GET',
    dataType:"json",
    success:function(data){
        let options = []
        data.forEach((item) => {
            cryptoList.push(item)
            let option = document.createElement("option");
            option.setAttribute("value",JSON.stringify([item.name,item.image]));
            option.innerHTML=item.name
            options.push(option)
        })
    document.getElementById("name").replaceChildren(...options);
    document.getElementById("cimg").setAttribute("src",JSON.parse(options[0].getAttribute("value"))[1])
    $('select').selectize({
    sortField: 'text'
    });    
}})
$("#name").on("change",()=>{
    try{
        document.getElementById("cimg").setAttribute("src",JSON.parse($("#name").val())[1])
    }catch{}
})
if(localStorage.getItem("uid")){
    getItems()
}
else{
    location.replace("index.html")
}
function getItems(){
    db.collection(localStorage.getItem("uid")).onSnapshot((snapshot) => {
        $('#nElementi').html(`${snapshot.docs.length} CRYPTO`)
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id, 
                ...doc.data()
            })
        })
        document.getElementById("removeList").innerHTML="";
        items.forEach((item)=>{
            let div=document.createElement("div");
            div.classList.add("crypto__to__remove")
            div.innerHTML=`<div class="name__remove"><i class="fa-solid fa-trash" onclick="deleteCrypto('${item.id}')" style="cursor:pointer"></i> ${item.name} </div><div class="info"><span><h5>Qt: </h5> ${item.quantity} </span><span><h5>Data: </h5> ${(new Date(item.date.seconds*1000)).toLocaleDateString("en-GB")}</span></div>`;
            document.getElementById("removeList").append(div);
        })
    })
}
function addCrypto(c){
    event.preventDefault();
    try{
        let check=JSON.parse($("#name").val())[1];//se esiste la crypto
        let data=new Date()
        let name = document.getElementById("name");
        let quantity = document.getElementById("quantity");
        let purchase_price = document.getElementById("purchase_price");
        let proceed = confirm("Sicuro ?");
        if (proceed) {
            let newItem = db.collection(localStorage.getItem("uid")).add({
                name: JSON.parse(name.value)[0],
                quantity: quantity.value,
                purchase_price: purchase_price.value,
                date:data
            })
        }
    }catch{
        alert("crypto non esistente, sceglierne una dalla lista")
    }
}
function deleteCrypto(c){
    let proceed = confirm("Sicuro ?");
    if (proceed) {
        deleteWith()
    }
    function deleteWith(){
        db.collection(localStorage.getItem("uid")).doc(c).delete()
    }
}