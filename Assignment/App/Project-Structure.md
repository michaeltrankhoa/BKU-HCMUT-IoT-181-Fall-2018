# Project Structure

```
App
|------------App.js
|------------Components
|            |------------ExampleComponent
|            |		      |---------------ExampleComponent.js
|            |		      |---------------ExampleComponentStyles.js
|------------Config
|            |------------ProductionConfig.js
|            |------------DevConfig.js
|            |------------index.js
|------------Screen
|            |------------HomeScreen
|            		      |---------------HomeScreen.js
|            		      |---------------HomeScreenStyle.js 
|------------Navigation
|            |------------AppNavigation.js
|            |------------AppNavigationStyle.js
|------------Services  
|            |------------Config.js
|------------Theme
|            |------------ApplicationStyle.js
|------------Utilities
Assets
|------------Images
|            |------------Icons
|            |------------Logo.png
|            |------------BG.png
```


# Description
`App.js` - main application goes here...

### Components
+ React native components go here...
+ One `Component` can contain one or more other `Component`
+ To add a `Component`: Create a directory `<ComponentName>` includes: `<ComponentName>.js` and `<ComponentNameStyle>.js` 

### Screen
+ To add a screen: Create a directory `<ScreenName>` includes: `<ScreenName>.js` and `<ScreenNameStyle>.js`

### Navigation
This App use [react-navigation](https://reactnavigation.org/) to handle the navigation
+ `AppNavigation.js` - loads initial screen and navigation configuration
+ `AppNavigationStyle.js` - styling for the navigation

### Services
+ `Config.js`- configure for Api

### Themes:
Styling themes used throughout app styles.
+ `ApplicationStyles.js` - app-wide styles

### Utilities
+ Function for some utility purposes

### Assets
+ Store necessary assets (images, videos, sounds...) 