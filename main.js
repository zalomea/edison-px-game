var DIGIT_BUTTON = 3;

var digitalAccelerometer = require('jsupm_mma7660');
var lcd = require('jsupm_i2clcd');
var groveSensor = require('jsupm_grove');

var button = new groveSensor.GroveButton(DIGIT_BUTTON);
setInterval(function(){
    if(button.value() == 1){
        init();
    }
});

var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);

var score = 0;
var pos = 7;
var price = -1;
var price_ticks = 0;
var printed_board = '';
var valuex;

function printBoard(){
	printed_board = '';
	for(var i=0; i<16;i++){
		printed_board = printed_board+((i==pos)?'0':((i==price)?'|':' '));
	}
}
function init(){
    clearInterval(myInterval);
    
    score = 0
    pos = 7;

    display.setColor(100, 100, 100);

    printBoard();
    display.setCursor(0,0);
    display.write(printed_board);
    display.setCursor(1,0);
    display.write('Score: '+score+'                ');
    
    myInterval = setInterval(function(){
        myDigitalAccelerometer.getAcceleration(ax, ay, az);
        valuex = digitalAccelerometer.floatp_value(ax);


        if(valuex > .5){
            pos++;
            if(valuex > .85){
                pos++;
            }
        }else if(valuex < -.5){
            pos--;
            if(valuex < -.85){
                pos--;
            }
        }

        printBoard();
        display.setCursor(0,0);
        display.write(printed_board);
        display.setCursor(1,0);
        display.write('Score: '+score+'                ');
        
        if(pos == price){
            price = -1;
            score++;
        }

        if(price == -1 && Math.random() > .7){
        	price = Math.floor(Math.random()*16);
        	price_ticks = 12 + Math.floor(Math.random()*4);
        }
        if(price_ticks < 0){
        	price = -1;
        }
        price_ticks--;

        if(pos < 0 || pos > 15){
            clearInterval(myInterval);
            display.setColor(200, 0, 0);
	        display.setCursor(0,0);
            display.write('Game over!      ');
            display.setCursor(1,0);
        	display.write('F. score: '+score+'                ');
        }

    }, 500);
}

var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
					digitalAccelerometer.MMA7660_I2C_BUS, 
					digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);

myDigitalAccelerometer.setModeStandby();
myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);
myDigitalAccelerometer.setModeActive();

var ax, ay, az;
ax = digitalAccelerometer.new_floatp();
ay = digitalAccelerometer.new_floatp();
az = digitalAccelerometer.new_floatp();

init();

var myInterval;

