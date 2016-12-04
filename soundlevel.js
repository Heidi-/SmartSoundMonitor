function isOverDailyLimit(cumulative) {
    var dailyLimit = 4.5; // time_interval * log(decibel_reading) <= 4.5 is safe level
    if (cumulative > dailyLimit) {
        return true;
    }
    else {
        return false;
    }
}

function isOverDangerLimit(soundLevel){
    var limit = 140;
    if (soundLevel > limit) {
        return true;
    }
    else {
        return false;
    }
}

function updateCumulative(deltaT, soundLevel, currCumulative) {
    var deltaT_hr = deltaT/(1000 * 60 * 60);
   return currCumulative + deltaT_hr * Math.log(soundLevel);
}
