import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'
import initAdmin from './admin'
let socket = io()


let addToCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter")

function updateCart(pizza){
    axios.post('/update-cart', pizza)
        .then(response => {
            console.log(response.data.msg)
            new Noty({
                type: 'success',
                layout: 'topRight',
                text: 'Item was added',
                timeout: 50,
                progressBar: true
            }).show()
            cartCounter.innerText = response.data.msg.totalQty
        }).catch(error => {
            new Noty({
                type: 'error',
                layout: 'topRight',
                text: 'Some thing went wrong',
                timeout: 1000,
                progressBar: true
            }).show()
        })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', e =>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
        
    })
})

const alertMsg = document.querySelector('#success-alert')

if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    }, 1500)
}

//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)



function updateStatus(order){
    let stepCompleted = true
    let time = document.createElement('small')
    let small = document.querySelector("small")
    
    statuses.forEach(status => {
        
        status.classList.remove('step-completed')
        status.classList.remove('current')
        if(small){
            small.remove()
        }
        
    })
    
    statuses.forEach(status => {

        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false
                time.innerText = moment(order.updatedAt).format('hh:mm A')
                status.appendChild(time)
                if(status.nextElementSibling){
                    status.nextElementSibling.classList.add('current')
                }
        }
    })
}

updateStatus(order)



if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminArea  = window.location.pathname
if(adminArea.includes('admin')){
    initAdmin(axios, moment, socket,Noty)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data)=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(data)
    new Noty({
        type: 'success',
        layout: 'topRight',
        text: 'order updated',
        timeout: 500,
        progressBar: true
    }).show()
})