import * as functions from "firebase-functions";
import * as express from "express";
import {getAllResquest,banklistapi,foodcategory,SendPasswordRestLink, GetTimeStamp} from "./controllers/model_data";
import {LeanAddPost,LeanGetAllPost,LeanUpdatePost,LeanGetPostByCategory} from "./controllers/learn_data"
import {HomeList,LeanGetPostByTab,Learnvisitcount,LearnGetvisitcount} from "./controllers/learn_data"
import { CreateOrder, Capture, Notificationpush, Cancel} from "./controllers/Webflystore";
import * as corsmodule from "cors";
const cors = corsmodule(({origin: true}));

//Start Chau
const appCat = express();
appCat.use(cors);
appCat.get("/Snap_cat", getAllResquest);
appCat.get("/Banklist", banklistapi);
appCat.get("/food_category", foodcategory);
appCat.post("/SendPasswordRestLink",SendPasswordRestLink);
appCat.get("/getTimeStamp",GetTimeStamp);
exports.appCat = functions.https.onRequest(appCat);










//Start of Learn
const Zlearner = express();
Zlearner.use(cors)
Zlearner.post("/LeanAddPost",LeanAddPost);
Zlearner.get("/LeanGetAllPost",LeanGetAllPost)
Zlearner.post("/LeanGetPostByCategory",LeanGetPostByCategory);
Zlearner.post("/LeanUpdatePost",LeanUpdatePost);
Zlearner.post("/HomeList",HomeList);
Zlearner.post("/LeanGetPostByTab",LeanGetPostByTab);
Zlearner.post("/Learnvisitcount",Learnvisitcount)
Zlearner.get("/LearnGetvisitcount",LearnGetvisitcount)
exports.Zlearner = functions.https.onRequest(Zlearner);







//Start of Webflystore
const webfly = express();
webfly.use(cors)
webfly.post("/authpayment", CreateOrder);
webfly.post("/paymentstatus", Notificationpush);
webfly.get("/capturehpayment", Capture);
webfly.get("/cancel", Cancel)
exports.webfly = functions.https.onRequest(webfly);












//Start of dimeTrade