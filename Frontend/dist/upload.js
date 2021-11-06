document.getElementById("displaytext").style.display = "none";

function searchPhoto() {


  var apigClient = apigClientFactory.newClient({

  });

  var image_message = document.getElementById("note-textarea").value;
  if (image_message == "")
    var image_message = document.getElementById("transcript").value;
  var image_message = image_message.replace('.', '').toLowerCase()

  console.log(image_message);

  var body = {};
  var params = {
    q: image_message
  };
  var additionalParams = {
    headers: {
    },
  };

  apigClient.searchGet(params, body, additionalParams)
    .then(function (result) {

      response_data = result.data
      var img1 = result.data.results

      length_of_response = response_data.length;
      if (length_of_response == 0) {
        document.getElementById("displaytext").innerHTML = "No Images Found !!!"
        document.getElementById("displaytext").style.display = "block";
      }
      console.log(img1)
      document.getElementById("img-container").innerHTML = "";
      var para = document.createElement("p");
      para.setAttribute("id", "displaytext")
      document.getElementById("img-container").appendChild(para);

      img1.forEach(function (obj) {
        var img = new Image();
        img.src = obj;
        img.setAttribute("class", "banner-img");
        img.setAttribute("alt", "effy");
        img.setAttribute("width", "150");
        img.setAttribute("height", "100");
        document.getElementById("displaytext").innerHTML = "Images returned are : "
        document.getElementById("img-container").appendChild(img);
        document.getElementById("displaytext").style.display = "block";

      });
    }).catch(function (result) {
      //This is where you would put an error callback
    });

}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}

function uploadPhoto() {
  // var file_data = $("#file_path").prop("files")[0];
  // Get custom labels

  custom_labels = document.getElementById('custom-labels').value
  console.log("Custom Labels ")
  console.log(custom_labels)

  var file = document.getElementById('file_path').files[0];
  const reader = new FileReader();

  var file_data;
  var encoded_image = getBase64(file).then(
    data => {
      console.log(data)
      var apigClient = apigClientFactory.newClient({
        defaultContentType: "image/jpeg",
        defaultAcceptType: "image/jpeg"
      });

      // var data = document.getElementById('file_path').value;
      // var x = data.split("\\")
      // var filename = x[x.length-1]
      //  var file_type = file.type + ";base64"

      // var body = data;
      var body = file;
      var params = {
        "key": file.name,
        "bucket": "photostoragebucket1",

      };

      var additionalParams = {
        headers: {
          'Content-Type': "image/jpeg",
        },
      };

      // apigClient.uploadBucketKeyPut(params, body, additionalParams).then(function (res) {
      //   if (res.status == 200) {
      //     // alert("Upload Successfull")
      //     console.log("Success");
      //     document.getElementById("uploadText").innerHTML = "IMAGE UPLOADED SUCCESSFULLY !!!"
      //     document.getElementById("uploadText").style.display = "block";
      //     document.getElementById("uploadText").style.color = "green";
      //     document.getElementById("uploadText").style.fontWeight = "bold";
      //   }
      // })
    });


  let config = {
    headers: {
      'Content-Type': file.type,
      'x-amz-meta-customLabels': custom_labels
    }
  };

  url = "https://b0zf26u9ga.execute-api.us-west-2.amazonaws.com/dev/upload/photostoragebucket1/" + file.name
  axios.put(url, file, config).then(response => {
    console.log("Success");
    document.getElementById("uploadText").innerHTML = "IMAGE UPLOADED SUCCESSFULLY !!!"
    document.getElementById("uploadText").style.display = "block";
    document.getElementById("uploadText").style.color = "green";
    document.getElementById("uploadText").style.fontWeight = "bold";
  });

}