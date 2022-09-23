"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");

let app = express();
app.use(bodyParser.json());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// enable CORS
// Since we're not serving pages from Node, you'll get the following error if CORS isn't "enabled"
// Error:  Failed to load http://localhost:3000/login/:
// No 'Access-Control-Allow-Origin' header is present on the requested resource.
// Origin 'null' is therefore not allowed access.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  // allow preflight
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

// ------ Debugging support ------------------

// pass the function an array and it will log the array (example: to console.log members in a group;)
function logArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

// ------ Get next ID helper ------------------

function getNextId(counterType) {
  // use 'group' or 'member' or 'user' as counterType
  // read the counter file
  let data = fs.readFileSync(__dirname + "/data/counters.json", "utf8");
  data = JSON.parse(data);

  // find the next id from the counters file and then increment the
  // counter in the file to indicate that id was used
  let id = -1;
  switch (counterType.toLowerCase()) {
    case "teacher":
      id = data.nextTeacher;
      data.nextTeacher++;
      break;
    case "student":
      id = data.nextStudent;
      data.nextStudent++;
      break;
    case "user":
      id = data.nextUser;
      data.nextUser++;
      break;
  }

  // save the updated counter
  fs.writeFileSync(__dirname + "/data/counters.json", JSON.stringify(data));

  return id;
}

// ------ Validation helpers ------------------

function isValidTeacher(teacher) {
  console.log(teacher);
  if (teacher.teacherName == undefined || teacher.teacherName.trim() == "") return 1;
  if (
    teacher.gradeName == undefined ||
    teacher.gradeName.trim() == ""
  )
    return 2;
  if (teacher.teacherPhone == undefined || teacher.teacherPhone.trim() == "")
    return 3;
  if (teacher.teacherEmail == undefined || teacher.teacherEmail.trim() == "")
    return 4;
  if (teacher.maxClassSize == undefined || isNaN(teacher.maxClassSize)) return 5;

  return -1;
}

function isValidStudent(student) {
  if (student.studentEmail == undefined || student.studentEmail.trim() == "")
    return 1;
  if (student.studentName == undefined || student.studentName.trim() == "")
    return 2;
  if (student.studentPhone == undefined || student.studentPhone.trim() == "")
    return 3;

  return -1;
}

// ------------------------------------------------------------------------------

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/" + "index.html");
});

app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/public/" + "index.html");
});

// ------------------------------------------------------------------------------
// THIS CODE ALLOWS REQUESTS FOR THE API THROUGH

/* ************************************************************************* */
// NOTE:  To make debugging easy, these methods echo their processing through
//        to the terminal window.  This means there may be some unnecessary
//        parsing and stringifying.  But it is worth it as you debug your code.
/* ************************************************************************* */

// GET GRADES
app.get("/api/grades", function (req, res) {
  console.log("Received a GET request for all grades");

  let data = fs.readFileSync(__dirname + "/data/grades.json", "utf8");
  data = JSON.parse(data);

  console.log("Returned data is: ");
  console.log(data);
  res.end(JSON.stringify(data));
});

// GET ALL TEACHERS
app.get("/api/teachers", function (req, res) {
  console.log("Received a GET request for all teachers");

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  console.log("Returned data is: ");
  console.log(data);
  res.end(JSON.stringify(data));
});

// GET ONE TEACHER BY ID
app.get("/api/teachers/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for group " + id);

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  let match = data.find((element) => element.teacherId == id);
  if (match == null) {
    res.status(404).send("Teacher Not Found");
    console.log("Teacher not found");
    return;
  }

  console.log("Returned data is: ");
  console.log(match);
  // logArray(match.Members);
  res.end(JSON.stringify(match));
});

// GET MANY TEACHERS BY GRADE
app.get("/api/teachers/bygrade/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for teachers in grade " + id);

  let orgData = fs.readFileSync(__dirname + "/data/grades.json", "utf8");
  orgData = JSON.parse(orgData);

  let organization = orgData.find(
    (element) => element.gradeId.toLowerCase() == id.toLowerCase()
  );
  if (organization == null) {
    res.status(404).send("Grade Not Found");
    console.log("Grade not found");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // find the matching groups for a specific organization
  let matches = data.filter(
    (element) => element.gradeName == organization.gradeName
  );

  console.log("Returned data is: ");
  console.log(matches);
  res.end(JSON.stringify(matches));
});

// GET A SPECIFIC STUDENT IN A SPECIFIC CLASS
app.get("/api/teachers/:teacherid/students/:studentId", function (req, res) {
  let teacherId = req.params.teacherid;
  let studentId = req.params.studentId;
  console.log(
    "Received a GET request for student " + studentId + " in class " + teacherId
  );

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // find the group
  let matchingGroup = data.find((element) => element.teacherId == teacherId);
  if (matchingGroup == null) {
    res.status(404).send("Teacher Not Found");
    console.log("Teacher not found");
    return;
  }

  // find the member
  let match = matchingGroup.students.find((s) => s.studentId == studentId);
  if (match == null) {
    res.status(404).send("Student Not Found");
    console.log("Student not found");
    return;
  }

  console.log("Returned data is: ");
  console.log(match);
  res.end(JSON.stringify(match));
});

// ADD A Teacher
app.post("/api/teachers", urlencodedParser, function (req, res) {
  console.log("Received a POST request to add a teacher");
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble group information so we can validate it
  let teacher = {
    teacherId: getNextId("teacher"), // assign id to group
    teacherName: req.body.teacherName,
    gradeName: req.body.gradeName,
    teacherPhone: req.body.teacherPhone,
    teacherEmail: req.body.teacherEmail,
    maxClassSize: Number(req.body.maxClassSize),
    students: [],
  };

  console.log("Performing validation...");
  let errorCode = isValidTeacher(teacher);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // add the group
  data.push(teacher);

  fs.writeFileSync(__dirname + "/data/teachers.json", JSON.stringify(data));

  console.log("Teacher added: ");
  console.log(teacher);

  //res.status(201).send(JSON.stringify(group));
  res.end(JSON.stringify(teacher)); // return the new group w it's TeacherId
});

// EDIT A GROUP
app.put("/api/teachers", urlencodedParser, function (req, res) {
  console.log("Received a PUT request to update teacher");
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble teacher information so we can validate it
  let teacher = {
    teacherId: req.body.teacherId, //req.params.id if you use id in URL instead of req.body.teacherId
    teacherName: req.body.teacherName,
    GradeName: req.body.GradeName,
    teacherPhone: req.body.teacherPhone,
    teacherEmail: req.body.teacherEmail,
    maxClassSize: Number(req.body.maxClassSize),
  };

  console.log("Performing validation...");
  let errorCode = isValidTeacher(teacher);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // find the teacher
  let match = data.find((element) => element.teacherId == teacher.teacherId);
  if (match == null) {
    res.status(404).send("Teacher Not Found");
    console.log("Teacher not found");
    return;
  }

  // update the teacher
  match.teacherName = teacher.teacherName;
  match.GradeName = teacher.GradeName;
  match.SponsorName = teacher.SponsorName;
  match.teacherPhone = teacher.teacherPhone;
  match.teacherEmail = teacher.teacherEmail;

  // make sure new values for maxClassSize doesn't invalidate grooup
  if (Number(teacher.maxClassSize) < match.students.length) {
    res
      .status(409)
      .send("New class size too small based on current number of students");
    console.log("New class size too small based on current number of students");
    return;
  }
  match.maxClassSize = Number(teacher.maxClassSize);

  fs.writeFileSync(__dirname + "/data/teachers.json", JSON.stringify(data));

  console.log("Update successful!  New values: ");
  console.log(match);
  res.status(200).send();
});

// DELETE A GROUP
app.delete("/api/teachers/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a DELETE request for teacher " + id);

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // find the index number of the group in the array
  let foundAt = data.findIndex((element) => element.teacherId == id);

  // delete the group if found
  if (foundAt != -1) {
    data.splice(foundAt, 1);
  }

  fs.writeFileSync(__dirname + "/data/teachers.json", JSON.stringify(data));

  console.log("Delete request processed");
  // Note:  even if we didn't find the group, send a 200 because they are gone
  res.status(200).send();
});

// ADD A STUDENT TO A CLASS
app.post("/api/teachers/:id/students", urlencodedParser, function (req, res) {
  let id = req.params.id;
  console.log("Received a POST request to add a student to class " + id);
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble student information so we can validate it
  let student = {
    studentId: getNextId("student"), // assign new id
    studentEmail: req.body.studentEmail,
    studentName: req.body.studentName,
    studentPhone: req.body.studentPhone,
  };

  console.log("Performing student validation...");
  let errorCode = isValidStudent(student);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // find the group
  let match = data.find((element) => element.teacherId == id);
  if (match == null) {
    res.status(404).send("Teacher Not Found");
    console.log("Teacher not found");
    return;
  }

  if (match.students.length == match.maxClassSize) {
    res.status(409).send("Student not added - class at capacity");
    console.log("Student not added - class at capacity");
    return;
  }

  // add the member
  match.students.push(student);

  fs.writeFileSync(__dirname + "/data/teachers.json", JSON.stringify(data));

  console.log("New student added!");
  console.log(student);

  //res.status(201).send(JSON.stringify(member));
  res.end(JSON.stringify(student)); // return the new member with member id
});

// EDIT A MEMBER IN A GROUP
app.put("/api/teachers/:id/students", urlencodedParser, function (req, res) {
  let id = req.params.id;
  console.log("Received a PUT request to edit a student in class " + id);
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble member information so we can validate it
  let student = {
    studentId: req.body.studentId,
    studentEmail: req.body.studentEmail,
    studentName: req.body.studentName,
    studentPhone: req.body.studentPhone,
  };

  console.log("Performing member validation...");
  let errorCode = isValidStudent(student);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  // find the teacher
  let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
  data = JSON.parse(data);

  // find the group
  let matchingGroup = data.find((element) => element.teacherId == id);
  if (matchingGroup == null) {
    res.status(404).send("Teacher Not Found");
    return;
  }

  // find the member
  let match = matchingGroup.students.find(
    (m) => m.studentId == req.body.studentId
  );
  if (match == null) {
    res.status(404).send("Student Not Found");
    return;
  }

  // update the member
  match.studentEmail = req.body.studentEmail;
  match.studentName = req.body.studentName;
  match.studentPhone = req.body.studentPhone;

  fs.writeFileSync(__dirname + "/data/teachers.json", JSON.stringify(data));

  console.log("Student updated!");
  res.status(200).send();
});

// DELETE A MEMBER IN A GROUP
app.delete(
  "/api/groups/:teacherid/members/:studentId",
  urlencodedParser,
  function (req, res) {
    let teacherId = req.params.teacherid;
    let studentId = req.params.studentId;
    console.log(
      "Received a DELETE request for member " +
        studentId +
        " in group " +
        teacherId
    );

    // find the teacher
    let data = fs.readFileSync(__dirname + "/data/teachers.json", "utf8");
    data = JSON.parse(data);

    let matchingGroup = data.find((element) => element.teacherId == teacherId);
    if (matchingGroup == null) {
      res.status(404).send("Teacher Not Found");
      console.log("Teacher not found");
      return;
    }

    // find the student
    let foundAt = matchingGroup.students.findIndex(
      (m) => m.studentId == studentId
    );

    // delete the student if found
    if (foundAt != -1) {
      matchingGroup.students.splice(foundAt, 1);
    }

    fs.writeFileSync(__dirname + "/data/teachers.json", JSON.stringify(data));

    console.log("Delete request processed");
    // Note:  even if we didn't find them, send a 200 back because they are gone
    res.status(200).send();
  }
);

// ----------------------------------------------------------------------------
// USER MANAGEMENT

// GET request to check if user name is available
app.get("/api/username_available/:username", function (req, res) {
  let username = req.params.username;
  console.log("Checking to see if this username " + username + " is available");

  let data = fs.readFileSync(__dirname + "/data/users.json", "utf8");
  data = JSON.parse(data);

  let matchingUser = data.find(
    (user) => user.username.toLowerCase() == username.toLowerCase()
  );

  let message;
  if (matchingUser == null) {
    message = "YES";
  } else {
    message = "NO";
  }

  console.log("Is user name available? " + message);
  res.end(message);
});

// POST request to add a user
app.post("/api/users", urlencodedParser, function (req, res) {
  console.log("Got a POST request to add a user");
  console.log("BODY -------->" + JSON.stringify(req.body));

  let data = fs.readFileSync(__dirname + "/data/users.json", "utf8");
  data = JSON.parse(data);

  // check for duplicate username
  let matchingUser = data.find(
    (user) => user.username.toLowerCase() == req.body.username.toLowerCase()
  );
  if (matchingUser != null) {
    // username already exists
    console.log("ERROR: username already exists!");
    res.status(403).send(); // forbidden - 403 has no message; programmers should
    // have used GET /api/username_available/:username to see if
    // if user registration would have worked

    return;
  }

  let user = {
    id: getNextId("user"), // assign new id
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  };

  data.push(user);

  fs.writeFileSync(__dirname + "/data/users.json", JSON.stringify(data));

  console.log("New user added!");
  console.log(user);
  res.status(200).send();
});

// POST request to login -- sent username and password in request body
app.post("/api/login", urlencodedParser, function (req, res) {
  console.log("Got a POST request for a user to login");
  console.log("BODY -------->" + JSON.stringify(req.body));

  let data = fs.readFileSync(__dirname + "/data/users.json", "utf8");
  data = JSON.parse(data);

  // check to see if credentials match a user
  let match = data.find(
    (user) =>
      user.username.toLowerCase() == req.body.username.toLowerCase() &&
      user.password == req.body.password
  );

  if (match == null) {
    // credentials don't match any user
    console.log("Error:  credentials don't match known user");
    res.status(403).send(); // forbidden
    return;
  }

  let user = {
    id: match.id,
    name: match.name,
    username: match.username,
  };

  // login successful - return user w/o password
  console.log("Login successful for: ");
  console.log(user);
  res.end(JSON.stringify(user));
});

// ------------------------------------------------------------------------------
// SITE SET-UP

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8085, function () {
  let port = server.address().port;

  console.log("App listening at port %s", port);
});
