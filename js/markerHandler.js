AFRAME.registerComponent("markerhandler",{
    init:async function(){

        var toys = await this.getToys()

        this.el.addEventListener("markerFound",()=>{

            var markerId = this.el.id
            console.log("Marker is found")
            this.handleMarkerFound(toys, markerId)
        })
        this.el.addEventListener("markerLost",()=>{
            console.log("Marker is lost")
            this.handleMarkerLost()
        })
    },
    handleMarkerFound:function(toys, markerId){

        var toy = toys.filter(toy => toy.id=== markerId)[0]

        if(toy.is_out_of_stock === true){
            swal({
                icon : "warning",
                title : toy.toy_name.toUpperSace(),
                text : "This toy is out of stock",
                time : 2500,
                buttons : false
            })
        }
        else{
            var model = document.querySelector(`model-${toy.id}`)
            model.setAttribute("position", toy.model_geometry.position)
            model.setAttribute("rotation", toy.model_geometry.rotation)
            model.setAttribute("scale", toy.model_geometry.scale)

            model.setAttribute("visible", true)

            var description = document.querySelector(`description-${toy.id}`)
            description.setAttribute("visible", true)

            var pricePlane = document.querySelector(`price-${toy.id}`)
            pricePlane.setAttribute("visible", true)

            var buttonDiv = document.getElementById("button-div")
            buttonDiv.style.display = "flex"

            var orderSummaryButton = document.getElementById("order-summary-button")
            var orderButton = document.getElementById("order-button")

            orderButton.addEventListener("click",()=>{
                var userid
                userid <= 9 ?(userid=`UO${userNumber}`) : `T${userNumber}`
                this.handleOrder(userNumber, toy)
                swal({
                    icon:"warning",
                    title : "Thanks for order!",
                    text : "  ",
                    buttons : false,
                    timer : 2000
                })
            })

            orderSummaryButton.addEventListener("click",()=>{

                swal({
                    icon : "warning",
                    title : "Order Summary",
                    text : "Work in Progress"
                })
            })
        }
    },

    handleOrder:function(userNumber, toy){
        firebase
        .firestore()
        .collection("users")
        .get(then(doc =>{
            var details = doc.data()

            if (details["current_orders"][toy.id]){
                details["current_orders"][toy.id]["quantity"] += 1

                var current_quantity = details["current_orders"][toy.id]["quantity"]

                var current_orders = details["current_orders"][toy.id]["subtotal"] = current_quantity*toy.price
            }
            else{
                details["current_orders"][toy.id] = {
                    item : toy.toy_name,
                    price : toy.price,
                    quantity : 1,
                    subtotal : dish.price * 1
                }
            }
            details.subtotal += toy.price

            firebase
                .firestore()
                .collection("toys")
                .doc(doc.id)
                .update(details)
        }))
    },

    handleMarkerLost: function(){
        var buttonDiv = document.getElementById("button-div")
        buttonDiv.style.display = "none"
    },
    getToys : async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get(then(snap =>{
            return snap.docs.map(doc => doc.data())
        }))
    },
    askUserId : function(){
        swal({
            title : "PLAY WITH TOYS!",
            content :{
                element : "input",
                attributes : {
                    placeHolder : "Type your user id :",
                    type : "number",
                    min : 1
                }
            },
            closeOnClickOutside : false,

        }).then(inputValue =>{
            userid = inputValue
        })
    }
})