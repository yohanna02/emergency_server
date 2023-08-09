function run(cb) {
    setTimeout(() => {
        console.log("running");
        cb();
    }, 5000);
}

run(function(){
    console.log("Done running");
});