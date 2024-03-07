A simple backend course app like udemy
using node,express,and mongo Db as a DB.
and were using the postman as a debugger for our app.

#Admin
it lets the a admin signup using a email.later zod and JWT will be added to the code.
and the Admin can add the avaliable courses and mongoose is used to add data to data base.
while adding to a course as a admin the middleware validates the user and allows it to add the course in the data base.
and the admin can view the total courses created by the admin and middleware is included in the callbacks as well.

#user
an user can sign up it checks if it's a existing user or not. if not it allows user to sign up
after the user created .user can view all the courses which are added by the admin and the courses id can be viewed by the user.
the viewed id is copied and sent as a header and after the usermiddleware validation if the user accepts the course moves to the array which is created in the database.


V2.0
few valiadtions and libraries are added to the previous version
json web tokens and zod are used in this code for the validation of the user and authentication of the user this is more secure than the previous code.
few changes were made  to the database schema of the user and admin a new auth id is added and the middle ware requests the auth code in the headers when a valid auth code is given by the admin/user it validate and authenticates the valid thing done 
