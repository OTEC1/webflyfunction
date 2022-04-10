/* eslint-disable */
import 'dotenv/config'
import {Response,Request} from "express";
import {db, auth} from "../config/firebase";
import * as nodemailer from "nodemailer";




type EntryType = {
  category: string,
  imgurl: string,
};


type Requests = {
  body: EntryType,
  params: {entryId: string};
};


type User = {
  youtubeLink:string,
}

const getAllResquest = async (req: Requests, res: Response) => {
  try {
    const lists: EntryType[] = [];
    const querysnapsnot = await db.collection("Category Uploads").get();
    querysnapsnot.forEach((doc: any) => lists.push(doc.data()));
    return res.status(200).json(lists);
  } catch (error) {
    return res.status(500).json(error);
  }
};


const BankEntry = [
    {id: "0", name: "Select Bank", code: "000"},
    {id: "1", name: "Access Bank", code: "044"},
    {id: "2", name: "Citibank", code: "023"},
    {id: "4", name: "Dynamic Standard Bank", code: ""},
    {id: "5", name: "Ecobank Nigeria", code: "050"},
    {id: "6", name: "Fidelity Bank Nigeria", code: "070"},
    {id: "7", name: "First Bank of Nigeria", code: "011"},
    {id: "8", name: "First City Monument Bank", code: "214"},
    {id: "9", name: "Guaranty Trust Bank", code: "058"},
    {id: "10", name: "Heritage Bank Plc", code: "030"},
    {id: "11", name: "Jaiz Bank", code: "301"},
    {id: "12", name: "Keystone Bank Limited", code: "082"},
    {id: "13", name: "Providus Bank Plc", code: "101"},
    {id: "14", name: "Polaris Bank", code: "076"},
    {id: "15", name: "Stanbic IBTC Bank Nigeria Limited", code: "221"},
    {id: "16", name: "Standard Chartered Bank", code: "068"},
    {id: "17", name: "Sterling Bank", code: "232"},
    {id: "18", name: "Suntrust Bank Nigeria Limited", code: "100"},
    {id: "19", name: "Union Bank of Nigeria", code: "032"},
    {id: "20", name: "United Bank for Africa", code: "033"},
    {id: "21", name: "Unity Bank Plc", code: "215"},
    {id: "22", name: "Wema Bank", code: "035"},
    {id: "23", name: "Zenith Bank", code: "057"},
];


const banklistapi = async (req: Requests, res: Response) => {
    return res.status(200).json(BankEntry);
};


const foodcategoryapilist = [
    // beans and dodo
    {id: "1", name: "dodo", code: "01"},
    {id: "1a", name: "beans", code: "01"},
    {id: "1b", name: "meat", code: "01"},
    {id: "1c", name: "fish", code: "01"},
    // rice
    {id: "2", name: "white_rice", code: "02"},
    {id: "4", name: "meat", code: "02"},
    {id: "5", name: "fish", code: "02"},
    {id: "6", name: "pomo", code: "02"},
    {id: "7", name: "salad", code: "02"},
    {id: "8", name: "veg_sauce", code: "02"},
    {id: "9", name: "spaghetti", code: "02"},
    {id: "10", name: "dodo", code: "02"},
    {id: "10", name: "beans", code: "02"},
    // rice
    {id: "2", name: "jollof_rice", code: "03"},
    {id: "4", name: "meat", code: "03"},
    {id: "5", name: "fish", code: "03"},
    {id: "6", name: "pomo", code: "03"},
    {id: "7", name: "salad", code: "03"},
    {id: "8", name: "veg_sauce", code: "03"},
    {id: "9", name: "spaghetti", code: "03"},
    {id: "10", name: "dodo", code: "03"},
    {id: "10", name: "beans", code: "03"},
    // swallow
    {id: "18", name: "swallow", code: "04"},
    {id: "19", name: "meat", code: "04"},
    {id: "20", name: "fish", code: "04"},
    {id: "21", name: "pomo", code: "04"},
    // noodles
    {id: "11", name: "noodle", code: "05"},
    {id: "12", name: "egg", code: "05"},
    {id: "13", name: "tea", code: "05"},
    {id: "13a", name: "bread", code: "05"},
    {id: "13b", name: "dodo", code: "05"},
    {id: "13c", name: "sadine", code: "05"},
    // tea
    {id: "14", name: "tea", code: "06"},
    {id: "14", name: "bread", code: "06"},
    {id: "16", name: "egg", code: "06"},
    {id: "17", name: "beans", code: "06"},
    {id: "17a", name: "sadine", code: "06"},
    // pap
    {id: "15", name: "akara", code: "07"},
    {id: "16", name: "pap", code: "07"},
    {id: "17", name: "fish", code: "07"},
    {id: "18", name: "dodo", code: "07"},
    {id: "19", name: "beans", code: "07"},
];

const foodcategory = async (req: Requests, res: Response) => {
    return res.status(200).json(foodcategoryapilist);
};



const SendPasswordRestLink = async (req: Request,res: Response) => {

  let errand: string;
  try{
      let e:User = req.body;
      auth.generatePasswordResetLink(e.youtubeLink)
                  .then(response => {
      
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
                          to:e.youtubeLink,
                          subject:"Chaü Password Reset Link",
                          text: response.toString(),
                      };

                      transport.sendMail(mailOptions,function(error, info){
                          if (error) {
                              errand = error.toString();
                          } else {
                              errand = 'Email sent: ' + info.response;
                          }

                          return res.status(200).json(errand);

                          });

                    }).catch(err => {
                     return res.status(500).json(err);
                  })      
          }catch(err) {
              return res.status(500).json(err);
          }   
}




const GetTimeStamp = async (req: Request,res: Response) => {

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({timestamp: Date.now()}));

};




export {getAllResquest, banklistapi, foodcategory,SendPasswordRestLink,GetTimeStamp};

