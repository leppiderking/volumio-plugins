'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var bluetooth=require('bluetoothctl');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;


module.exports = bluetoothA2dp;
function bluetoothA2dp(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;
}



bluetoothA2dp.prototype.onVolumioStart = function()
{
	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);

	blue.Bluetooth();
	var hasBluetooth = blue.checkBluetoothController();

	if(!hasBluetooth){
		self.logger.error("Device has no Bluetooth Device");
	}else{
		 blue.on(blue.bluetoothEvents.Controller, function(controllers){
 			self.config.set('controllers',controllers);
 			self.logger.info('bluetooth_a2dp::Controllers:' + JSON.stringify(controllers,null,2));
 			});
		  blue.on(blue.bluetoothEvents.Device, function (devices) {
     		self.logger.info('devices:' + JSON.stringify(devices,null,2));
     		self.config.set('devices',devices);
 			});
	}
    return libQ.resolve();
}

bluetoothA2dp.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();
	//Start the bluetooth device and search for Devices
	exec("echo -e 'power on \nquit' | /usr/bin/bluetoothctl",function(error, stdout, stderr){
		if(error){
			self.logger.info("BluetoothA2DP::Cannot start Bluetooth service");
		}
	});
	// Once the Plugin has successfull started resolve the promise
	defer.resolve();

    return defer.promise;
};

bluetoothA2dp.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();

	exec("echo -e 'power off \nquit' | /usr/bin/bluetoothctl",function(error, stdout, stderr){
		if(error){
			self.logger.info("BluetoothA2DP::Cannot start Bluetooth service");
		}
	});
    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};

bluetoothA2dp.prototype.onRestart = function() {
    var self = this;
    // Optional, use if you need it
};

bluetoothA2dp.prototype.Scan = function(){
	if(blue.checkBluetoothController()){
		self.logger.info("bluetooth_a2dp::Starting scan.");
		blue.scan(true);
	 setTimeout(function(){
         self.logger.info('bluetooth_a2dp::Scan finished');
         self.commandRouter.pushToastMessage('info', 'Scan finished', 'The List of Devices can be found in the settings.')
         blue.scan(false);
     },20000)
	}
};

// Configuration Methods -----------------------------------------------------------------------------

bluetoothA2dp.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {


            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};


bluetoothA2dp.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

bluetoothA2dp.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

bluetoothA2dp.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};