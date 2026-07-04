# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Troubleshooting

### iOS Simulator Network Error (SSL Certificate Issue)
If you encounter an `AxiosError: Network Error` on the iOS Simulator during login or API requests, it is likely due to iOS App Transport Security (ATS) blocking the request. 

This happens if your Mac has trouble resolving `twoarrows.ru` and you attempt to use the raw IP address (`104.171.128.155`) instead. iOS strictly requires the domain name in the URL to match the SSL certificate (`twoarrows.ru`), so using the IP address will always fail on iOS.

**The Fix:**
1. Leave the `API_URL` as `https://twoarrows.ru` in the code.
2. Edit your Mac's local hosts file to map the domain to the server IP:
   ```bash
   sudo nano /etc/hosts
   ```
3. Add the following line at the end of the file:
   ```text
   104.171.128.155 twoarrows.ru api.twoarrows.ru
   ```
4. Save the file and restart the Expo server. The simulator will now route `twoarrows.ru` to the correct IP while satisfying iOS SSL requirements.
