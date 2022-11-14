var url='https://api.coingecko.com/api/v3/coins/markets?vs_currency=Eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1m'
var cryptoList=[];
(function startWebsite(){
    $.ajax({
    url,
    method:'GET',
    dataType:"json",
    success:function(data){
        cryptoList=data
        print_tracking();
    }})
})()

function print_tracking()
{
        let arrayToPrintInWidget=[];
        let todoItems = [];
        let c=1;
        cryptoList.forEach((item) => {
              if(!(item.symbol.toUpperCase()).includes('USD')){
                let s="BINANCE:"+item.symbol.toUpperCase()+"EUR"
                arrayToPrintInWidget.push({
                  "s": s,
                  "d": item.name
                })
              }
            let todoItem = document.createElement("div");    
            todoItem.setAttribute('class','containerCrypto');
            todoItem.setAttribute('id',item.symbol);
            let appColor=item.price_change_percentage_24h<0?'red':'green';
            let decimals=item.current_price.toString().length;
            let priceToPrint=0;
            let priceChange=0;
            let ath=0;
            //se decimale e minore di uno stampa decimali 
            if(item.ath<0.1){
                ath=item.ath.toLocaleString('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits: (decimals-4)});

            }
            else{
                ath=item.ath.toLocaleString('it-IT',{style:'currency',currency:'EUR'})

            }
            if(item.current_price<0.1){
              priceToPrint=item.current_price.toLocaleString('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits: (decimals-4)})
              priceChange=item.price_change_24h.toLocaleString('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits: (decimals-4)});
            }
            else{
              priceToPrint=item.current_price.toLocaleString('it-IT',{style:'currency',currency:'EUR'})
              priceChange=item.price_change_24h.toLocaleString('it-IT',{style:'currency',currency:'EUR'})

            }
            todoItem.innerHTML=`
                <div>
                    <nId>${c}</nId>
                    </div>
                    <div class="cryptoElement">
                    <div>
                    <img src="${item.image}">
                    </div>
                    <div><b>${(item.symbol).toUpperCase()}</b></div>
                    <div>${priceToPrint}</div>
                    <div class="ath">${ath}</div>
                    <div class="perEur" style="color:${appColor}">${priceChange}</div>
                    <div style="color:${appColor}"><b><span>${parseFloat(item.price_change_percentage_24h).toFixed(2)}</span>%</b></div>
                </div>`;
                todoItem.addEventListener("click", function(){
                  $("#totalValue").html(`
                  <a href="/tracker.html"><i class='bx bx-arrow-back' style="font-size:25px"></i></a><br>
                  <span class="spanSpecial">${item.name} </span>
                      <div class="cryptoElementNew">
                      <div>
                      <img src="${item.image}">
                      </div>
                      <div><b>${(item.symbol).toUpperCase()}</b></div>
                      <div>${priceToPrint}</div>
                      <div class="perEur" style="color:${appColor}">${priceChange}</div>
                      <div style="color:${appColor}"><b><span>${parseFloat(item.price_change_percentage_24h).toFixed(2)}</span>%</b></div>
                  </div>
                  <div class="spanSpecialChild"><span>Daily Low: ${item.low_24h}€</span><span>Daily High: ${item.high_24h}€ </span></div>
                  <iframe src="https://bit2me.com/widget/chart/v1?currency=${item.symbol}&fiat=EUR" style="display:block;width:100%;height:400px;margin:0 auto;" frameborder="0"></iframe>`)
              })
                todoItems.push(todoItem)
                c++;
          })
        document.querySelector("#totalValue").replaceChildren(...todoItems);
}