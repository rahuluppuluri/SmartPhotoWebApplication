document.getElementById("displaytext").style.display = "none";

function searchPhoto() {

 


  var apigClient = apigClientFactory.newClient({
    // apiKey: 'gnavV2E0Pz5Kit0HSnfqL8loqijjhvHH7gZTVV9Z'
    // apiKey: 'cDedoqJmgX2bDPrjdJ07Q7d1K4xvVnKJmSnjtJs7'
  });

  // if (type == 'textinput')
  //   console.log('Using text input')
  //   var image_message = document.getElementById("note-textarea").value;
  //   console.log(image_message)
  // if (type == 'voicetext')
  //   console.log("voice text")
  //   var image_message = document.getElementById("transcript").value;
  //   var image_message = image_message.replace('.','').toLowerCase()
  //    console.log(image_message)

  var image_message = document.getElementById("note-textarea").value;
  if(image_message == "")
    var image_message = document.getElementById("transcript").value;
    var image_message = image_message.replace('.','').toLowerCase()

  console.log(image_message);

  var body = {};
  var params = {
    q: image_message,
    // 'x-api-key': 'gnavV2E0Pz5Kit0HSnfqL8loqijjhvHH7gZTVV9Z'
    // 'x-api-key': 'cDedoqJmgX2bDPrjdJ07Q7d1K4xvVnKJmSnjtJs7'
  };
  var additionalParams = {
    headers: {
      // 'Content-Type': "application/json"
      // 'Access-Control-Allow-Origin': '*'
    },
  };

  apigClient.searchGet(params, body, additionalParams)
    .then(function (result) {
      //This is where you would put a success callback
      response_data = result.data
      var img1 = result.data.results
      // var img1 = result.data.body;
      length_of_response = response_data.length;
      if (length_of_response == 0) {
        document.getElementById("displaytext").innerHTML = "No Images Found !!!"
        document.getElementById("displaytext").style.display = "block";
      }
      console.log(img1)
      console.log('before')
      // img1 = img1.replace(/\"/g, "").replace("[", "").replace("]", "");
      // img1 = img1.split(",");
      console.log('after')

      document.getElementById("img-container").innerHTML = "";
      var para = document.createElement("p");
      para.setAttribute("id", "displaytext")
      document.getElementById("img-container").appendChild(para);
      

      img1.forEach(function (obj) {
        var img = new Image();
        // img.src = "https://photosforsearch1.s3.amazonaws.com/"+obj;
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
  // var file = document.querySelector('#file_path > input[type="file"]').files[0];
  var encoded_image = getBase64(file).then(
    data => {
      console.log(data)
      var apigClient = apigClientFactory.newClient({
        // apiKey: "gnavV2E0Pz5Kit0HSnfqL8loqijjhvHH7gZTVV9Z",
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
        "bucket": "rk-photos-bucket",
        // 'x-api-key': 'gnavV2E0Pz5Kit0HSnfqL8loqijjhvHH7gZTVV9Z'
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
        'x-amz-meta-customLabels': custom_labels  // UNCOMMENT ME FOR CUSTOM LABELS
      }
   };
   // let config = {
   //     headers: { }
   // };
   //url = 'https://cors-anywhere.herokuapp.com/https://q6mpc0sjz1.execute-api.us-east-1.amazonaws.com/TestAuth/upload/photosforsearch1/' + file.name
   //url = 'https://sdwrpgy3xi.execute-api.us-west-2.amazonaws.com/dev/upload/rk-photos-bucket/' + file.name
   // url = 'https://b0zf26u9ga.execute-api.us-west-2.amazonaws.com/dev/upload/photostoragebucket1/' + file.name
  //  url = 'https://vdnm5njp4h.execute-api.us-west-2.amazonaws.com/dev/upload/photostoragebucket1/' + file.name
   url = "https://b0zf26u9ga.execute-api.us-west-2.amazonaws.com/dev/upload/photostoragebucket1/" + file.name
   axios.put(url, file, config).then(response => {
    //  console.log(" New "+response.data)
    //  alert("Image uploaded successfully!");
     console.log("Success");
     document.getElementById("uploadText").innerHTML = "IMAGE UPLOADED SUCCESSFULLY !!!"
     document.getElementById("uploadText").style.display = "block";
     document.getElementById("uploadText").style.color = "green";
     document.getElementById("uploadText").style.fontWeight = "bold";
   });

}
