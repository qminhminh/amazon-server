const express = require('express');
const Chart = require('../models/chart');
const auth = require('../middlewares/auth');
const chartRouter = express.Router();

chartRouter.post('/api/chart/create',auth, async(req,res)=>{
   try{
     const {id, money,date} = req.body;
     let chartid= await Chart.findOne({id: id});
     console.log("ID:"+id);
     console.log("Money:"+money);
     console.log("Date:"+date);
      if(chartid){
           const monney = {
             money: money,
             date: date,
           };
           chartid.moneys.push(monney);
           await chartid.save();
       
      }else{
        console.log('Khong tim thay chart id');
        const chart = new Chart({
            id: id,
            moneys:[{
                money:money,
                date: date,
            },],
            date:date
         });
         
         await chart.save();
         
      }
   }catch(e){
    res.status(500).json({error : e.message});
   }
});

chartRouter.get('/api/chart/get/:id',async(req,res)=>{
    try{
       const {id} = req.params;
       const chart = await Chart.findOne({id:id});
       res.json(chart);
    }catch(e){
        res.status(500).json({error : e.message});
    }
});

module.exports = chartRouter;