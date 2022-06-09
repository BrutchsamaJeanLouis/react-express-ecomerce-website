const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()
const db = require('../../models')
const { ensureAuthenticationAny } = require('../decorator-helpers')
const path = require('path')
const fs = require('fs')

// Upload to Disk
const diskStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const itemEntry = await db.Item.create({
      name: req.body.name,
      desription: req.body.description,
      location: req.body.location,
      category: req.body.category,
      userId: req.session.user.id
    })
    const userId = req.session.user.id
    // save item To DB to get item ID
    const dir = `./local-uploads/${userId}/${itemEntry.id}` // here we specify the destination . in this case i specified the current directory
    fs.mkdirSync(dir, { recursive: true })
    return cb(null, dir)
    // TODO dynamically get user id and item id from req.body
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, `${new Date().getTime()}_${file.originalname}`) // here we specify the file saving name . in this case i specified the original file name
  }
})
const uploadDisk = multer({ storage: diskStorage })
const AWS = require('aws-sdk')
const S3 = require('aws-sdk/clients/s3')
const s3Bucket = new S3({
  s3ForcePathStyle: true,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  endpoint: process.env.NODE_ENV === 'dev' ? new AWS.Endpoint('http://localhost:4569') : process.env.S3_URL
})

// Currently Set to Disk storage in local project folder
// Change to function below in production
router.post('/local-bare-file', ensureAuthenticationAny, uploadDisk.single('image'), async (req, res) => {
  console.log(req.file.destination)
  const destinationSplit = req.file.destination.split('/')
  const filenameSplit = req.file.originalname.split('.')
  const itemId = destinationSplit[destinationSplit.length - 1]
  const userId = destinationSplit[destinationSplit.length - 2]
  // item entry is saved in multer function up there
  const mediaEntry = await db.Media.create({
    type: 'image',
    format: filenameSplit[filenameSplit.length - 1], // TODO split string to find this
    url: 'local',
    size: req.file.size,
    key: `${userId}/${itemId}/${req.file.filename}`,
    itemId: parseInt(itemId) // TODO get itemid from destination string
  })
  return res.json({ message: 'Images uploaded', file: req.file })
})

// after .single(this is the name/fieldId)
router.post('/', ensureAuthenticationAny, multer().any('images'), async (req, res) => {
  // TODO FIX-ME description is not coming through from HTML form
  const { name, description, location, category } = req.body

  if (!req.files) return res.status(400).json({ error: 'Please Include a File to Upload' })
  const itemEntry = await db.Item.create({
    name: name,
    description: description,
    location: location,
    category: category,
    userId: req.session.user.id
  })

  const successUploadResult = []
  // Uploading array of files
  req.files.map((currentFile) => {
    const time = new Date().getTime()
    Promise.all([
      // sharp npm package(resize and compress image to make smaller)
      sharp(currentFile.buffer)
        .resize(1080, 720, { fit: 'contain' }).toFormat('jpg').toBuffer()
        .then(resized => s3Bucket.upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${req.session.user.id}/${itemEntry.id}/${time}_small_${currentFile.originalname}`, // THis is the file name saved
          Body: resized,
          ACL: ''
        })
          .on('httpUploadProgress', function (evt) {
            // console.log(evt)
            // Emit Here your events (send this to a socket io id then client can listen in to the socket for upload progress)
            // then destroy the socket when upload is complete
          })
          .promise())

      // original file
      // S3.upload({
      //   Bucket: process.env.S3_BUCKET_NAME,
      //   Key: `${req.session.user.id}/${itemEntry.id}/${time}_small_${currentFile.originalname}`,
      //   Body: currentFile.buffer
      // }).promise()),
    ])
      .then(async (s3Res) => {
        successUploadResult.push(s3Res)
        const mediaUrl = s3Res[0].Location
        const key = s3Res[0].Key
        const filenameSplit = currentFile.originalname.split('.')
        const mediaEntry = await db.Media.create({
          type: 'image',
          format: filenameSplit[filenameSplit.length - 1],
          url: mediaUrl,
          size: currentFile.size,
          key: key,
          itemId: itemEntry.id
        })
      })
      .catch(e => {
        console.warn(e) // debug this error
        res.status(500).json({ error: 'Unable to upload images' })
      })
  })

  res.json({ message: 'Images uploaded', successUploadResult })
})

// TODO convert this to fetch with date limit (dayjs)
router.get('/recent', async (req, res) => {
  const item = await db.Item.findAll({ include: [db.Media] })
  return res.status(200).json(item)
})

// This ROute must be last, because the first /:path is a wild card param
router.get('/:itemId', async (req, res) => {
  const { itemId } = req.params

  if (!itemId) return res.status(400).json({ error: 'no item id' })

  const item = await db.Item.findByPk(itemId, { include: [db.Media, db.User] })

  return res.status(200).json(item)
})

module.exports = router
