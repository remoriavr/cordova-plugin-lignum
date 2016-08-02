cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-insomnia.Insomnia",
        "file": "plugins/cordova-plugin-insomnia/www/Insomnia.js",
        "pluginId": "cordova-plugin-insomnia",
        "clobbers": [
            "window.plugins.insomnia"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-lignum.bluetoothSerial",
        "file": "plugins/cordova-plugin-lignum/www/bluetoothSerial.js",
        "pluginId": "cordova-plugin-lignum",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-insomnia": "4.2.0",
    "cordova-plugin-splashscreen": "3.1.0",
    "cordova-plugin-whitelist": "1.0.0",
    "cordova-plugin-lignum": "1.0.0"
};
// BOTTOM OF METADATA
});