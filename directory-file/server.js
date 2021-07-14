const path = require('path');
const fs = require('fs-extra');
const Koa = require('koa');
const Router = require('@koa/router');
const static = require('koa-static');
const cors = require('@koa/cors');
const multer = require('@koa/multer');

const app = new Koa();
const router = new Router();
const PORT = 3000;
const RESOURCE_URL = `http://localhost:${PORT}/upload`;
const UPLOAD_DIR = path.join(__dirname, '/public/upload');

// form-data 处理
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // images@image-1.jpeg => images/image-1.jpeg
    let relativePath = file.originalname.replace(/@/g, path.sep);
    let index = relativePath.lastIndexOf(path.sep);
    let fileDir = path.join(UPLOAD_DIR, relativePath.substr(0, index));
    // 确保文件目录存在，若不存在的话，会自动创建
    await fs.ensureDir(fileDir); 
    cb(null, fileDir);
  },
  filename: function (req, file, cb) {
    let parts = file.originalname.split("@");
    cb(null, `${parts[parts.length - 1]}`); 
  },
});
const upload = multer({ storage });

// 目录文件上传
router.post(
  '/upload/directory',
  async (ctx, next) => {
    await next();
    try {
      const urls = ctx.files.file.map(
        (file) => `${RESOURCE_URL}/${file.originalname.replace(/@/g, path.sep)}`
      );
      ctx.body = {
        code: 1,
        msg: '文件上传成功',
        urls,
      };
    } catch (err) {
      ctx.body = {
        code: 0,
        msg: '文件上传失败',
      };
    }
  },
  upload.fields([
    {
      name: 'file',
    },
  ])
);

// 中间件
app.use(cors());
app.use(static(path.join(__dirname, '/public')));
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`app is started in here: http://localhost:${PORT}`);
});
