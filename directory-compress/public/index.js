const uploadFileEle = document.querySelector('#uploadFile');

const request = axios.create({
  baseURL: 'http://localhost:3000/upload',
  timeout: 10000,
});

async function uploadFile(event) {
  if (!uploadFileEle.files.length) return;

  const fileList = uploadFileEle.files;
  const webkitRelativePath = fileList[0].webkitRelativePath;
  const zipFileName = webkitRelativePath.split('/')[0] + '.zip';
  const zipFile = await generateZipFile(zipFileName, fileList);
  upload({
    url: '/compress',
    file: zipFile,
  });
}

function upload({ url, file, fieldName = 'file' }) {
  if (!url || !file) return;
  const formData = new FormData();
  formData.set(fieldName, file);
  request.post(url, formData, {
    // 监听上传进度
    onUploadProgress: function (progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(percentCompleted);
    },
  });
}

function generateZipFile(
  zipName,
  files,
  options = {
    type: 'blob',
    compression: 'DEFLATE',
  }
) {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    for (let i = 0; i < files.length; i++) {
      zip.file(files[i].webkitRelativePath, files[i]);
    }
    zip.generateAsync(options).then((blob) => {
      zipName = zipName || Date.now() + '.zip';
      const zipFile = new File([blob], zipName, { type: 'application/zip' });
      resolve(zipFile);
    });
  });
}
