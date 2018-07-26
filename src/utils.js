


function renderRemainingTime(t){
    t=parseInt(t,10);
    if(t<=0){
        return '00:00:00';
    }
    let h=parseInt((t-(t%3600))/3600,10);
    t%=3600;
    let m=parseInt((t-(t%60))/60,10);
    t%=60;
    if(h<10){h='0'+h;}
    if(m<10){m='0'+m;}
    if(t<10){t='0'+t;}
    return h+':'+m+':'+t;
}

export default {
    renderRemainingTime:renderRemainingTime
}