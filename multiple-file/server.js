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
    await fs.ensureDir(UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

// 多文件上传
router.post(
  '/upload/multiple',
  async (ctx, next) => {
    await next();
    try {
      const urls = ctx.files.file.map((file) => `${RESOURCE_URL}/upload/${file.originalname}`);
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
