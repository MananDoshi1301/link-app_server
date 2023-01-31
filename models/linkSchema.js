const mongoose = require('mongoose');


// const linkArrSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   url: {
//     type: String,
//     required: true
//   }

// }, { timestamps: true });

const linkSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  links: [
    // { linkArrSchema }
    {
      type: new mongoose.Schema(
        {
          title: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          isValidUrl: {
            type: Boolean,
            required: true,
          }
        }, { timestamps: true }
      )
    }
  ]
}, { timestamps: true })

const Links = mongoose.model('LINK_DETS', linkSchema);
module.exports = Links;