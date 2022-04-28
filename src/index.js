import express from 'express';

const port = 8000;
const app = express();

app.listen(port, ()=> {
    console.log(`Started at http://localhost:${port}`);
})

app.get('/hello', (req, res)=>{
    res.send('Hello!');
})
