const uploadFileEle = document.querySelector('#uploadFile');

const request = axios.create({
  baseURL: 'http://localhost:3000/upload',
  timeout: 10000,
});

async function uploadFile(event) {
  if (!uploadFileEle.files.length) return;

  const files = Array.from(uploadFileEle.files);
  upload({
    url: '/multiple',
    files,
  });
}

function upload({ url, files, fieldName = 'file' }) {
  let formData = new FormData();
  files.forEach((file) => formData.append(fieldName, file));
  request.post(url, formData, {
    onUploadProgress: function (progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%';
      console.log(percentCompleted);
    },
  });
}
