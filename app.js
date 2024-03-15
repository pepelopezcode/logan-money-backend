const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb+srv://peeps741:Peeps123@loganmoney.tin2amj.mongodb.net/?retryWrites=true&w=majority&appName=loganMoney', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.use(express.json());

app.use(cors());

const daySchema = new mongoose.Schema({
  cash: Number,
  zelle: Number,
  color: Number
});

const monthSchema = new mongoose.Schema({
  days: {
      type: Map,
      of: daySchema
  }
});

const yearSchema = new mongoose.Schema({
  months: {
      type: Map,
      of: monthSchema
  }
});

const totalInfoSchema = new mongoose.Schema({
  years: {
      type: Map,
      of: yearSchema
  }
});

const TotalInfo = mongoose.model('TotalInfo', totalInfoSchema);


app.get('/totalinfo', async (req, res) => {
  try {
      const totalInfos = await TotalInfo.find();
      res.json(totalInfos);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/totalinfo', async (req, res) => {
  try {
    const totalInfoData = req.body
      const totalInfo = new TotalInfo(totalInfoData);
      const savedTotalInfo = await totalInfo.save();
      res.status(201).json(savedTotalInfo);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/totalinfo/:id', async (req, res) => {
  try {
    const totalInfoId = req.params.id;
    const newTotalInfoData = req.body;
    if (!mongoose.Types.ObjectId.isValid(totalInfoId)) {
      return res.status(400).json({ message: 'Invalid TotalInfo ID' });
    }
    const updatedTotalInfo = await TotalInfo.findByIdAndUpdate(totalInfoId, newTotalInfoData, {new: true});
    if (!updatedTotalInfo) {
      return res.status(404).json({ message: 'TotalInfo not found' });
    }
    res.status(200).json(updatedTotalInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
})


app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function clearTotalInfoCollection() {
  try {
 
    await TotalInfo.deleteMany();
    console.log("TotalInfo collection cleared successfully");
  } catch (err) {
    console.error("Error clearing TotalInfo collection:", err);
  }
}

clearTotalInfoCollection();

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});