# BikeFinity 
#### A Full Stack Mobile Application

## About

Our project is a customized bike platform for sports bikes but is not limited to sports bikes but different bikes as well. We all know how enthusiast bikers in Pakistan are but there is no platform for them. With the ease of our application, our bike riders can host biking events that include racing and night track rides as well. Also, a versatile option of reviews would be available to view or you could post one as well. Additionally, a separate section would be available for users where they could advertise their bikes or get one in their desired budget. Our resourceful platform is a one-stop shop for your biking endurance, whether you need to join a bike community, get yourself a perfect bike or check for bike reviews.

## Project Structure

Our repo contains two sub-folders i.e client and server.

1. Client folder contains all the required assets and source code for front-end.
2. Server folder contains all the source code for back-end.


## Installing the app

### Prerequisite

You should have Node installed. Also React Native environment should be configured. All environmental variable must be initialized properly. You should have either ios or android device or emulator to run this application.

First you have to take pull of this repo by using
```sh
https://github.com/AlishanNadeem/BikeFinity.git
```

#### For Server Side

1. First you have to go to server directory by
```sh
cd server
```

2. Then, you have to install the required dependencies by using 
```sh
npm install
```

3. Now you have to start the server by using this command
```sh
npm start
```

#### For Client Side

1. First you have to go to client directory by
```sh
cd client
```

2. Then, you have to install the required dependencies by using 
```sh
npm install
```

3. Now you have to start client by using this command
```sh
npx react-native start
```

4. If you want to run the application on android use this command:
```sh
npx react-native run-android
```

OR

If you want to run the application on iOS use this command:
```sh
npx react-native run-ios
```

## Generate APK of Mobile Application

1. First, open up your project or application on android studio that you want to import into an APK file.
2. Open the Build menu from the toolbar and select Generate Signed Bundle/APK.
3. This opens up a screen where you have to select between creating an Android App Bundle and creating an APK file. 
   Check the APK radio button and proceed to the next window.
4. You’ll be asked about your Key store path, Key store password, Key alias, and the Key password.
5. Key Store Path: Project Android Folder.
6. Key Store Password: android
7. Key Alias: key0
8. Key Password: android
9. Select OK. You will then be directed back to the Generate Signed Bundle or APK screen.
10. Select Release and click on Finish.
11. You'll find the apk here (.../YourProject/app/build/outputs/apk/app-debug.apk)

## Authors

Alishan Nadeem - 1812102
 BSCS Graduate from SZABIST

Asim Ebrahim - 1812104
 BSCS Graduate from SZABIST
