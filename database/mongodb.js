
import mongoose from 'mongoose';
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL);

export default mongoose;