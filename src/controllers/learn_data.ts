/* eslint-disable */
import 'dotenv/config'
import {Response,Request} from "express";
import { firestore } from "firebase-admin";
import {db} from "../config/firebase";


type Programming={
    title:string,
    writeUp:string,
    doc_id:string,
    img_url:string,
    views:number,
    video_url:string
    timestamp:any,
    date_time:string,
    youtubeLink: string,
    category:string,
    tab:string,
}




export const LeanAddPost = async (req: Request,res: Response) => {

    try{
        let i: Programming = req.body;
        const e = db.collection("zLeanAddPost").doc();
        i.doc_id = e.id;
        i.timestamp = firestore.Timestamp.now();
        e.set(i);    
        return res.status(200).json(e.id);
      
    }catch(err) {
        return res.status(500).json(err);
    }   
}




export const LeanGetAllPost = async (req: Request,res: Response) => {

    try{
        const service: Programming[] = [];
        const querysnapsnot = await db.collection("zLeanAddPost").orderBy('timestamp', 'desc').get();
        querysnapsnot.forEach((doc: any) => service.push(doc.data()));
    
          return res.status(200).json(service);
      
        }catch(err) {
            return res.status(500).json(err);
        }   
}






export const LeanUpdatePost = async (req: Request,res: Response) => {
    try{
        var indicator  = 0;
        const e: Programming =  req.body;
        const querysnapsnot =  db.collection("zLeanAddPost").doc(e.doc_id);
            if((await querysnapsnot.get()).exists)
                 querysnapsnot.update("views",firestore.FieldValue.increment(1))
                        if((await querysnapsnot.get()).updateTime)
                                indicator = 1;

          return res.status(200).json(indicator);
      
        }catch(err) {
            return res.status(500).json(err);
        }   
}




export const LeanGetPostByCategory = async (req: Request,res: Response) => {
    try{
        const e: Programming =  req.body;
        const service: Programming  [] = [];
        const querysnapsnot =   db.collection("zLeanAddPost");
        const allCapitalsRes = await querysnapsnot.where('category', '==', e.category).get();
        allCapitalsRes.forEach((doc:any) => service.push(doc.data()))
            
          return res.status(200).json(service);
      
        }catch(err) {
            return res.status(500).json(err);
        }   
}


export const  HomeList = async (req:Request, res:Response) => {
    try{

        let e : Programming = req.body;
        let list:string [] = [];
        if(e.views === 1){
            list = ["Select an Option", "AWS Cloud Services", "Explore Blockchain Technology","Bitcoin rate", "NFT trends", "Gift card","Ethereum","DeFi trends","Coinbase"];
        }else
            if(e.views === 2)
                list = ["Select an Option", "Java", "Python", "React JS", "Android studio", "Git bash","C","Ruby","C#","HTML","CSS"]
        else
            if(e.views === 3)
                list = ["Select an Option", "Cisco", "aws", "Microsoft"]
        else
            if(e.views === 4)
                list = ["Select an Option", "How to Share a printer", "How to enable developer mode"]

        return res.status(200).json(list);

    }catch(err) {
        return res.status(500).json(err);
    }
}




export const LeanGetPostByTab = async (req: Request,res: Response) => {
    try{
        const e: Programming =  req.body;
        const service: Programming  [] = [];
        const querysnapsnot =   db.collection("zLeanAddPost");
        const allCapitalsRes = await querysnapsnot.where('tab', '==', e.tab).get();
        allCapitalsRes.forEach((doc:any) => service.push(doc.data()))
            
          return res.status(200).json(service);
      
        }catch(err) {
            return res.status(500).json(err);
        }   
}



export const LeanGetPostByMostViewed = async (req: Request,res: Response) => {
    try{
        const e: Programming =  req.body;
        const service: Programming  [] = [];
        const querysnapsnot =   db.collection("zLeanAddPost");
        const allCapitalsRes = await querysnapsnot.where('tab', '==', e.tab).get();
        allCapitalsRes.forEach((doc:any) => service.push(doc.data()))
            
        return res.status(200).json(service);
      
        }catch(err) {
            return res.status(500).json(err);
        }   
}



type VisitCount = {
    count:number,
    date:any,
    doc_id:string,
    stamp:any,
}




function stamp(){
    var dt = new Date(firestore.Timestamp.now().toDate().toUTCString()).toString()
    var sub = dt.substring(0,dt.indexOf(":")-2).trimEnd();
    return sub;

}



export const Learnvisitcount = async (req: Request,res: Response) => {
         try{
             let e: VisitCount = req.body;
             let time = db.collection("zLearnVisitorTrack").listDocuments();
             const day =  db.collection("zLearnVisitorTrack").doc();
             e.date = stamp();
             e.stamp = firestore.Timestamp.now();
             if((await time).length <= 0){
                  e.doc_id = day.id;
                  day.set(e);
             }else{
                  let current = await  db.collection("zLearnVisitorTrack").orderBy("stamp","desc").limit(1).get();  
                  current.forEach((doc: any) => e = (doc.data()))  
                    if(stamp() === e.date)
                           db.collection("zLearnVisitorTrack").doc(e.doc_id).update("count",firestore.FieldValue.increment(1))
                    else{
                        let e: VisitCount = req.body;
                        e.date = stamp();
                        e.stamp = firestore.Timestamp.now();
                        e.doc_id = day.id;
                        day.set(e);
                    }
                }

               return res.json({
                   message:   "OK"
               })

             }
        catch (err) { 
            return res.json({
                message: err as Error
            })
        }
    }




export const LearnGetvisitcount  = async (req: Request,res: Response) => {
    try{
        let e: VisitCount  [] = [];
        let current = await  db.collection("zLearnVisitorTrack").orderBy("stamp","desc").limit(500).get();  
        current.forEach((doc: any) => e.push(doc.data()))  
        return  res.json({
            message: e
          })
       }catch(err){

       return  res.json({
            message: err as Error
        })
    }
};

