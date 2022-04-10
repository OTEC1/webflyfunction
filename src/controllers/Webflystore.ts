import axios from "axios";
import {Response, Request} from 'express'
import * as nodemailer  from 'nodemailer'
var Pushy = require('pushy');

type  User = {
    Store:string,
    data:string,
    line1:string,
    line2:string,
    mail:string,
    order_id:string,
    postalcode:string,
    country:string,
    state:string,
    name:string,
    surname:string
}






type Payload ={
    User:{
        to:string
    }

    payload:{
        id: string,
        email:string,
        item:string,
        doc_id:string,
        pic:string,
    },
     options: {
        notification: {
            badge: number,
            sound: string,
            id: string,
            email:string,
            item:string,
            pic:string,
            body:string,
        },
    };
}




export const  CreateOrder =  async (req:Request, res: Response) => {
    const e: User  = req.body;
    InitalizePaymentFlow(req,res,e.Store,e.data,e.line1,e.line2,e.mail,e.order_id,e.postalcode,e.country,e.state,e.name,e.surname);
}



export const  Capture = async (req:Request, res:Response) => {
    const  tk = req.query.token;
    //const pid = req.query.PayerID;
    axios({
        method: 'post',
        url: `${process.env.PAY_PAL_API_PROD_BASE}/v2/checkout/orders/${tk}/capture`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        auth:{
            username: process.env.PAYPAL_PROD_KEY!,
            password: process.env.PAYPAL_PROD_SECRET!
        },
    }).then(respones => {
       if(respones.data.status == process.env.REACT_APP_PAYMENT_STATUS)
           res.redirect(`https://webflystore.web.app/capture?N=${respones.data.status}`);
    
    }).catch(err => {
        return  res.status(500).json(err as Error)
    })

    
}

export const  Cancel = async (req:Request, res:Response) => {
        const   tk = req.query.token;
        console.log(tk);
        res.redirect(process.env.REACT_APP_CANCEL!)
}



async function InitalizePaymentFlow(req:Request, res:Response,store:string,amount:any,line1:string,line2:string,mail:string,order_id:string,postalcode:string,country:string,state:string,name:string,surname:string) {
    axios({
        method: 'post',
        url: `${process.env.PAY_PAL_API_PROD_BASE}/v1/oauth2/token`,
        data: 'grant_type=client_credentials', 
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type':'application/x-www-form-urlencoded',
        }, 
        auth:{
            username: process.env.PAYPAL_PROD_KEY!,
            password: process.env.PAYPAL_PROD_SECRET!
        }
    }).then(rest =>{
        CreatingOrder(rest.data.access_token,req,res,store,amount,line1,line2,mail,order_id,postalcode,country,state,name,surname);
    }
    ).catch(err => {
        return  err as Error
    })
} 



function CreatingOrder(data:any,req:Request, res:Response, strore:string,amount:any,line1:string,line2:string,mail:string,order_id:string,postalcode:string,country:string,state:string,name:string,surname:string){
    const placeOrder = {
        intent: "CAPTURE",
        purchase_units: [
            { amount: {
                    currency_code: "USD",
                    value: amount
                },
                description: `Order ID :${order_id} Payment for purchase @ webflystore`,
            },
        ],
        shipping: {
            name: {
              given_name: name,
              surname: surname
            },
            email_address: mail,
            address: {
              address_line_1: line1,
              address_line_2: line2,
              admin_area_2: state,
              postal_code: postalcode,
              country_code: country
            }
          },
            application_context: {
                brand_name: strore,
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: process.env.REACT_APP_REDIRECT_URL,
                cancel_url: process.env.REACT_APP_CANCEL
        }
    };

    axios.post(`${process.env.PAY_PAL_API_PROD_BASE}/v2/checkout/orders`, placeOrder ,{
        headers:{
            Authorization :`Bearer ${data}`
        },
        }).then(respones => {
            
            let errand = '';
            if(respones.data.status ==  process.env.REACT_APP_PAYMENT_STATUS2){
                    var smtpConfig = {
                              host: process.env.HOST,
                              port: 465,
                              secure: true, 
                              auth: {
                                  user: process.env.USER,
                                  pass: process.env.PASSWORD 
                              }
                          };
            
                      const transport = nodemailer.createTransport(smtpConfig);
            
                      var mailOptions = {
                          from: process.env.USER,
                          to: mail,
                          subject:"Webflystore Order ID",
                          text: `Order id :${order_id} for tracking purchase.`,
                      };
            
                      transport.sendMail(mailOptions,function(error, info){
                           if (error) 
                              errand = error.toString();
                           else 
                              errand = 'Email sent: ' + info.response;
                        
                          console.log(errand);
                          });

                          return res.status(200).json(respones.data.links[1].href);
                    }
       
        }).catch(err => {
            return  res.status(200).json(err as Error)
        })
}  



var PUSHYAPI = new Pushy(process.env.PUSHY_KOKOCRAFT_KEY);
export const Notificationpush = async (request:Request, response:Response) => {
     let e:Payload = request.body   
     PUSHYAPI.sendPushNotification(e.payload, e.User.to, e.options,function (err: any, id:any){
     if(err){
        return response.json({
            message: "Error Occurred "+err
        })
     }
     return response.json({
        message: "Sent  Succesfully  to "+id
        })
      })
      
}

