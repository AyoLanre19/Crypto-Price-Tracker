//index.js
import express from "express";
import express from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { name } from "ejs";
import { error } from "console";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index");});

    app.post("/price", async(req,res)=>{
    const coin = req.body.crpto.toLowerCase();
     try{
   const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
        parms:{
            ids : coin,
            vs_currencies:"usd"
        }
    });
    

   
    

    const price=response.data[coin]?.usd;

    if(!price){
        return res.render("result",{error:"Invalid cryptocurrency name", data: null})
    }

    res.render("result",{
        data:{
            name:coin,
            price:price,
        },
        error: null
    });
}catch(err){
    console.error(err.message);
    res.render("result", {error:"Something went wrong. Try again.", data:null});
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));