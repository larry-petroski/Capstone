# School Registry
> JB Hunt Angular Course Capstone

To help reduce traffic on the first day of classes, Lincoln Elementary has provided a website parents can go to to find which 
teacher thier student will have for the year.

## Technologies
- Front End
  - Angular v12.2
  - PrimeNG v12.2.3
  - PrimeIcons v4.1
  - PrimeFlex v3.2.1
- Back End
  - Express
  
## Install / Run
1. Clone (or download zip file) entire project.
2. From a terminal, open 2 tabs
  1. Used for backend server
  2. Used for frontend ui
3. In the tab for backend server, navigate to the backed directory of the project
4. Install packages for project using **npm i**
5. To run after package install us **npm start**. You will see a message *App listening at port 8085*
6. In the second tab, navigate to frontend\school-registry directory
7. Repeat steps 4 and 5, once compiled head to http://localhost:4200

## API Endpoints
> All endpoints will have base path - http://localhost:8085/api

### Grades
`GET` [/grades](#get-grades)

### Teachers
`GET`    [/teachers](#get-teachers) <br/>
`POST`   [/teachers](#post-teachers) <br/>
`PUT`    [/teachers](#put-teachers) <br/>
`DELETE` [/teachers](#delete-teachers) <br/>

### Students
`GET`    [/teachers/:teacherId/students/:studentId](#get-teachersteacherIdstudentsstudentId) <br/>
`POST`   [/teachers/:teacherId/students](#post-teachersteacherIdstudents) <br/>
`PUT`    [/teachers/:teacherId/students](#put-teachersteacherIdstudents) <br/>
`DELETE` [/teachers/:teacherId/students/studentId](#delete-teachersteacherIdstudentsstudentId)
___
#### GET /grades
Method fetches list of grades from the server. <br/>

**Parameters** <br/>
None<br/>
**Response**
```
[
    {
        "gradeName": "Kindergarten",
        "gradeId": "K",
        "description": "Kindergarten"
    },
    {
        "gradeName": "First",
        "gradeId": "1",
        "description": "1st Grade"
    },
    ...
]
```
___
#### GET /teachers
Three endpoints, each fetching information pertaining to teachers. <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|-------------:|:--------:|:-------:| :---------------------------------|
 ``            |     -    |    -    | Returns full list of teachers.
 `/:gradeId`   | required | number  | Fetches list of teachers by grade.
 `/:teacherId` | required | number  | Fetches specific teacher.

**Response**
```
[
    {
        "teacherId": 1,
        "teacherName": "Ms. Rachelle",
        "gradeName": "Kindergarten",
        "teacherPhone": "555-000-0000",
        "teacherEmail": "nat214@gmail.com",
        "maxClassSize": 7,
        "students": [
            {
                "studentId": 2,
                "studentEmail": "theaterkid0625@gmail.com",
                "studentName": "Ezra Aiden",
                "studentPhone": "555-000-0002"
            },
            {
                "studentId": 4,
                "studentEmail": "aslan_the_great@gmail.com",
                "studentName": "Elisha Aslan",
                "studentPhone": "555-000-0003"
            },
            {
                "studentId": 6,
                "studentEmail": "susa2007@gmail.com",
                "studentName": "Siddalee Grace",
                "studentPhone": "555-000-0020"
            }
        ]
    },
]
```
___
#### POST /teachers
Create new teacher <br/>

**Body**
```
{
    "teacherId": 0,
    "teacherName": "Mr. Test Tester",
    "gradeName": "Fourth",
    "teacherPhone": "123-123-1234",
    "teacherEmail": "test@tester.com",
    "maxClassSize": 8,
    "students": []
}
```

**Response**
```
{
    "teacherId": 7,
    "teacherName": "Mr. Test Tester",
    "gradeName": "Fourth",
    "teacherPhone": "123-123-1234",
    "teacherEmail": "test@tester.com",
    "maxClassSize": 8,
    "students": []
}
```
___
#### PUT /teachers
Update existing teacher <br/>

**Body**
```
{
    "teacherId": 7,
    "teacherName": "Mr. Test Tester",
    "gradeName": "Fifth",
    "teacherPhone": "123-123-1234",
    "teacherEmail": "test@tester.com",
    "maxClassSize": 6,
    "students": []
}
```

**Response**
HTTPStatus 200 OK
___
#### DELETE /teachers
Delete an existing teacher <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|---:|:----:|:---:| :-----------|
`/:teacherId` | required | number | Id of teacher to delete

**Response**
HTTPStatus 200 OK
___
#### GET /teachers/:teacherId/students/:studentId
Fetch a single, known student by Id. <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|------:|:----:|:-----:| :----------------|
 `/:teacherId` | required | number  | Fetches specific teacher.
 `/:studentId` | required | number | Fetch specific student by teacher.

**Response**
```
{
    "studentId": 4,
    "studentEmail": "aslan_the_great@gmail.com",
    "studentName": "Elisha Aslan",
    "studentPhone": "555-000-0003"
}
```
___
#### POST /teachers/:teacherId/students
Create new student <br/>

**Body**
```
{
    "studentId": 0,
    "studentName": "Tim Taylor",
    "studentEmail": "tt@test.com",
    "studentPhone": "123-123-4343"
}
```

**Response**
```
{
    "studentId": 15,
    "studentEmail": "tt@test.com",
    "studentName": "Tim Taylor",
    "studentPhone": "123-123-4343"
}
```
___
#### PUT /teachers/:teacherId/students
Update an existing student <br/>

**Body**
```
{
    "studentId": 15,
    "studentEmail": "tt@test.com",
    "studentName": "Tim Taylor",
    "studentPhone": "123-123-9876"
}
```

**Response**
HTTPStatus 200 OK
___
#### DELETE /teachers/:teacherId/students/:studentId
Delete an existing student <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|---:|:----:|:---:| :-----------|
`/:teacherId` | required | number | Id of teacher of student to be deleted
`/:studentId` | required | number | Id of student to delete

**Response**
HTTPStatus 200 OK
___
## Screenshot
![ScreenShot](https://raw.githubusercontent.com/larry-petroski/capstone/main/screenshots/Home.png)
<br/>
![ScreenShot](https://raw.githubusercontent.com/larry-petroski/capstone/main/screenshots/Teachers-List.png)

## Authentication
In order to delete a student and/or teacher you'll have to be logged in as an admin. This is basic username/password logic 
required when clicking the lock icon in the top right of the header. The users.json file in the backend directory provides
a list of several credentials or you could use:
Username  | Password
--------- | --------
gamer04   | gamer04!
