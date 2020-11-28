         
  var firebaseConfig = {
    apiKey: "AIzaSyDGD1OvJtu3Z0sWCvGz_MW8I8xbNRjxq84",
    authDomain: "weconnectmoto.firebaseapp.com",
    databaseURL: "https://weconnectmoto.firebaseio.com",
    projectId: "weconnectmoto",
    storageBucket: "weconnectmoto.appspot.com",
    messagingSenderId: "785399505200",
    appId: "1:785399505200:web:af31d23588f6ebeaaae8f5",
    measurementId: "G-RGXEL9WZ0P"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var programId = document.getElementById('programId').value;
  console.log(programId);
  
  if(sessionStorage.getItem("uid") == null){
     console.log("Login first!");
  }else{
    
    function loadData(){
    
      var i = 0;
      firebase.database().ref(programId).on('value', function (snapshot){
        
        snapshot.forEach(element => {
      
          var content = '';
          var _code = element.val().code;
          var _title = element.val().title;
          var _description = element.val().description;
          var _unit = element.val().unit;
          var refCode = element.val().id;
          var pdf = element.val().pdf;
          
          if( i%2 == 0)
            content += '<tr style="background-color: #f2f2f2; padding: 8px; text-align: left;"><td><button onclick="openPdf('+refCode+')" style="background: none; border: none; cursor: pointer; text-align: left; font-family: "Source Sans Pro", sans-serif; outline: none;">'+_code+'</button></td><td style="font-family: "Source Sans Pro", sans-serif;">'+_title+'</td><td style="font-family: "Source Sans Pro", sans-serif;">'+_description+'</td><td style="text-align: center; font-family: "Source Sans Pro", sans-serif;">'+_unit+'</td><td><button style="outine: none; border: none; cursor: pointer;background: none; font-family: "Source Sans Pro", sans-serif;" onclick="deleteData('+refCode+')"><img src="../css/icons/remove.png" height="19px"></button></td></tr>';
          else
            content += "<tr style='padding: 8px; background: none; padding: 8px;'><td><button onclick='openPdf("+refCode+")' style='background: none; border: none; cursor: pointer; text-align: left; outline: none; font-family: 'Source Sans Pro', sans-serif;'>"+_code+"</button></td><td>"+_title+"</td><td style=''>"+_description+"</td><td style='text-align: center; '>"+_unit+"</td><td style='width: 20px; text-align: center;'><button style='background: none; outline: none; border: none;cursor: pointer;' onclick='deleteData("+refCode+")'><img src='../css/icons/remove.png' height='19px'></button></td></tr>"; 
          document.getElementById('dataTable').innerHTML += content;
          i++;
        });
            
      });
      
    }
    
    var selectedFile;
    const file = document.getElementById('fileUploader');
            file.addEventListener('change', function(e){
              selectedFile = event.target.files[0];
              var storageRef = firebase.storage().ref('/files/');
              console.log(selectedFile);           
            });
    
    const uploadStatus = document.getElementById("uploadingStatus");
    const upload = document.getElementById("uploadPercentage");
    const submitBtn = document.getElementById('submit');        
            
            submitBtn.addEventListener('click', function(){
              uploadStatus.style.display = "block";
              //COURSE CONTENT
              var id = document.getElementById('numCode').value;        
              var Code = document.getElementById('courseCode').value;
              var Title = document.getElementById('courseTitle').value;
              var Description = document.getElementById('courseDescription').value;
              var NumberUnits = document.getElementById('numberUnits').value;    
    
              //FILE UPLOAD
              var filename = selectedFile.name;
              var storageRef = firebase.storage().ref(filename);
              var uploadTask = storageRef.put(selectedFile);
              
              uploadTask.on('state_changed', function(snapshot){
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                      console.log('Upload is paused');
                      break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                      console.log('Upload is running');
                      upload.innerHTML = Math.floor(progress)+" %";
                      break;
                  }
                  
                  if(progress == 100){
                    upload.innerHTML = "Upload Complete";
                    document.getElementById('courseModal').style.display = "none";
                  }
                
              }, function(error) {
              }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  console.log('File available at', downloadURL);
                  firebase.database().ref(programId+"/"+id).set({
                        id: id,
                        code: Code,
                        title: Title,
                        description: Description,
                        unit: NumberUnits,
                        pdf: downloadURL,
                        file: filename
                  });
                  location.reload();    
                });
              });        
            });
              
          
            function deleteData(idd){
              firebase.database().ref(programId+"/"+idd).on('value', function (snapshot){
                fileId = snapshot.val().file;
              });
              firebase.storage().ref(fileId).delete();
              firebase.database().ref(programId+"/"+idd).remove();    
              alert('Remove row');
              location.reload();    
            }
            
            function openPdf(id){
              firebase.database().ref(programId+"/"+id).on('value', function (snapshot){
                window.open(snapshot.val().pdf);
              }); 
            } 
  }
  
  function logout(){
    this.close();
    window.open("../index.html");
  }