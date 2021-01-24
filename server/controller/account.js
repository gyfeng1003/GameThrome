
import mongoose from 'mongoose'

const Code = mongoose.model('Code')
export async function getErcode() {
 const code = encodeErcode()
 await Code.create({code})
 setTimeout(() => {
  Code.deleteMany({code})
 }, 30000);
 return code
}
