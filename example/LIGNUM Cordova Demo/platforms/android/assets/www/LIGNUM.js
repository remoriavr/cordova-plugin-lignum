// packets per second counter
var pps = 0;
// denoise variable
var denoise = true;
// x,y,z buffer arrays
var x_buffer = [];
var y_buffer = [];
var z_buffer = [];
// x,y,z smoothed coordinates
var x_denoised = 0.0;
var y_denoised = 0.0;
var z_denoised = 0.0;
// LIGNUM object which contains the entire controller status
var LIGNUM_CONTROLLER_DATA = {
  x : '0.0',
  y : '0.0',
  z : '0.0',
  joystick : '0',
  buttons : '0',
  battery : '0',
  gesture : ''
}
// LIGNUM BLE packets per seconds
setInterval(function()
{
  document.getElementById('pps').innerText = 'pps: ' + pps;
  pps = 0;
},1000);
var LIGNUM = (function()
{
  var Constructor = function(name)
  {
    if (!(this instanceof Constructor))
      return new Constructor(name);
    this.name = name || 'LIGNUM';
    document.addEventListener('deviceready', this.ready.bind(this), false);
  };
  var proto = Constructor.prototype;
  proto.name = 'LIGNUM';
  proto.connected = false;
  proto.ready = function()
  {
    this.status('initialized');
    this.reset();
  }
  proto.status = function(text)
  {
    document.getElementById('status').innerText = 'status: ' + text;
  };
  proto.reset = function(no_reconnect)
  {
    this.connected = false;
    if(no_reconnect)
      return;
    window.plugins.insomnia.keepAwake();
    bluetoothSerial.isEnabled(this.scan.bind(this), function(){ this.status('Bluetooth OFF'); });
  };
  proto.scan = function()
  {
    this.status('scanning');
    bluetoothSerial.list(this.connect.bind(this),this.status);
    this.search = setInterval(function()
    {
      bluetoothSerial.list(this.connect.bind(this),this.status);
    }.bind(this), 10000);
  };
  proto.connect = function(results)
  {
    this.status('connecting');
    if(! Array.isArray(results) || ! results.length)
      return;
    results.forEach(function(r)
    {
      if(this.connected || r.name != this.name)
        return;
      this.connected = true;
      bluetoothSerial.connect(r.uuid,this.subscribe.bind(this),this.onDisconnect.bind(this));
    }.bind(this));
  };
  proto.disconnect = function()
  {
    this.status('disconnecting');
    bluetoothSerial.disconnect(this.onDisconnect.bind(this),this.status);
  };
  proto.subscribe = function()
  {
    this.status('subscribing');
    clearInterval(this.search);
    bluetoothSerial.subscribe('|', this.processData.bind(this));
    this.status('connected');
  };
  proto.onDisconnect = function()
  {
    this.status('disconnected');
    this.reset(false);
  };
  proto.processData = function(data)
  {
    pps++;
    if (data.indexOf(':') > 0)
    {
      LIGNUM_CONTROLLER_DATA.gesture = data.split(':')[1].replace('|','');
    }
    else
    {
      data = data.replace('|','').split(',');
      if(data.length == 6)
      {
          LIGNUM_CONTROLLER_DATA.x = data[0];
          LIGNUM_CONTROLLER_DATA.y = data[1];
          LIGNUM_CONTROLLER_DATA.z = data[2];
          LIGNUM_CONTROLLER_DATA.joystick = data[3];
          LIGNUM_CONTROLLER_DATA.buttons = data[4];
          LIGNUM_CONTROLLER_DATA.battery = data[5];

          if(denoise)
          {
            this.populate(x_buffer,parseInt(data[0]));
            this.populate(y_buffer,parseInt(data[1]));
            this.populate(z_buffer,parseInt(data[2]));
            x_denoised = this.denoise(x_buffer);
            y_denoised = this.denoise(y_buffer);
            z_denoised = this.denoise(z_buffer);
          }
      }
    }
  };
  proto.populate = function(vector,number)
  {
    if(vector.length > 9)
      vector.shift();
    vector.push(number);
  };
  proto.denoise = function(vector)
  {
    var denoised_sum = vector.reduce(function(a, b) { return a + b; });
    return  parseInt(denoised_sum / vector.length);
  };
  return Constructor;
})();
