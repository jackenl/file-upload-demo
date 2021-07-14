const uploadFileEle = document.querySelector('#uploadFile');

const request = axios.create({
  baseURL: 'http://localhost:3000/upload',
  timeout: 10000,
});

async function uploadFile(event) {
  if (!uploadFileEle.files.length) return;

  const file = uploadFileEle.files[0];
  upload({
    url: '/single',
    file,
  });
}

function upload({ url, file, fieldName = 'file' }) {
  let formData = new FormData();
  formData.set(fieldName, file);
  request.post(url, formData, {
    onUploadProgress: function (progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%';
      console.log(percentCompleted);
    },
  });
}
